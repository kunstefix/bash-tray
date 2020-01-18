const { app, Tray, Menu, nativeTheme: { shouldUseDarkColors } } = require('electron')
const { exec } = require("child_process");
const path = require('path')
const fs = require('fs');
const { homedir } = require('os')
const icon = shouldUseDarkColors ? 'code-terminal-white.png' : 'code-terminal-dark.png'
const homedirPath = homedir()


app.dock.hide()
app.on('ready', createApp)
app.setLoginItemSettings({
  openAtLogin: true
})


function shellCallback(error, stdout, stderr) {
  console.log(error, stdout)
  console.log("DONE")
}

function createApp() {

  createConfigFile()

  const configJson = readConfigFile()
  console.log("configJson", configJson)

  const menuTemplate = getMenuTemplate(configJson)
  console.log("menuTemplate", menuTemplate)

  const contextMenu = Menu.buildFromTemplate(menuTemplate)
  console.log("contextMenu", contextMenu)

  const tray = new Tray(path.join(__dirname, icon))
  tray.setContextMenu(contextMenu)
}



function createConfigFile() {
  console.log('homedir', homedirPath)
  const path = `${homedirPath}/bt-config.json`

  if (fs.existsSync(path)) {
    console.log("Config file already exists");
  } else {
    fs.writeFileSync(path, configString, function (err) {
      if (err) throw err;
      console.log('Config file is created successfully.');
    });
  }
}

function readConfigFile() {
  console.log("Reading config.")
  const configFile = path.join(homedirPath, 'bt-config.json')
  let rawdata = fs.readFileSync(configFile);
  let configJson = JSON.parse(rawdata);
  return configJson
}

function getMenuTemplate(configJson) {
  const template = configJson.map(obj => ({ label: obj.label, click: executeBash(obj.path) }))
  return template
}

const executeBash = (scriptPath) => () => {
  exec(scriptPath, shellCallback);
}


const configString = `
[
  {
      "label": "Script label",
      "path": "/path/to/script.sh"
  }
]
`
