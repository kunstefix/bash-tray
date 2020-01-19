const { app, Tray, Menu, nativeTheme: { shouldUseDarkColors }, BrowserWindow } = require('electron')
const { exec } = require("child_process");
const path = require('path')
const fs = require('fs');
const { homedir } = require('os')
const icon = shouldUseDarkColors ? 'code-terminal-white.png' : 'code-terminal-dark.png'
const homedirPath = homedir()
let tray = null

app.dock.hide()
app.on('ready', createApp)
app.setLoginItemSettings({
  openAtLogin: true
})


function shellCallback(error, stdout, stderr) {
  console.log(error, stdout, stderr)
  console.log("DONE")

}

function createApp() {
  createConfigFile()
  const configJson = readConfigFile()
  const menuTemplate = getMenuTemplate(configJson)
  const contextMenu = Menu.buildFromTemplate(menuTemplate)
  tray = new Tray(path.join(__dirname, icon))
  tray.setContextMenu(contextMenu)
}



function createConfigFile() {
  const path = `${homedirPath}/bt-config.json`
  if (fs.existsSync(path)) {
  } else {
    fs.writeFileSync(path, configString, function (err) {
      if (err) throw err;
    });
  }
}

function readConfigFile() {
  const configFile = path.join(homedirPath, 'bt-config.json')
  let rawdata = fs.readFileSync(configFile);
  let configJson = JSON.parse(rawdata);
  return configJson
}

function getMenuTemplate(configJson) {
  const template = configJson.map(obj => ({ label: obj.label, click: executeBash(obj.path) }))
  template.push({
    label: "Quit",
    click: () => app.quit()
  })

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