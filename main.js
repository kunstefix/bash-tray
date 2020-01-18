// Modules to control application life and create native browser window
const { app, Tray, Menu } = require('electron')
const { exec } = require("child_process");
const path = require('path')
const fs = require('fs');
const { homedir } = require('os')
const icon = 'code-terminal-white.png'
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

async function createApp() {

  await createConfigFile()

  const configJson = readConfigFile()
  console.log("configJson", configJson)

  const menuTemplate = getMenuTemplate(configJson)
  console.log("menuTemplate", menuTemplate)

  const contextMenu = Menu.buildFromTemplate(menuTemplate)
  console.log("contextMenu", contextMenu)

  const tray = new Tray(path.join(__dirname, icon))
  tray.setContextMenu(contextMenu)
}



async function createConfigFile() {
  console.log('homedir', homedirPath)
  const path = `${homedirPath}/config.json`
  fs.exists(path, exists => {
    if (exists) {
      console.log("Config file already exists");
    } else {

      fs.writeFile(path, configString, function (err) {
        if (err) throw err;
        console.log('Config file is created successfully.');
      });
    }
  })
}

function readConfigFile() {
  const configFile = path.join(homedirPath, 'config.json')
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
      "label": "Test SH",
      "path": "/Users/klemenkunstek/desktop/test.sh"
  }
]
`

/* function showConfigFileMessage(message) {
  dialog.showMessageBox(undefined, { type: "info", message })
} */