import { app, BrowserWindow,ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 480,
    useContentSize: true,
    width: 800,
    fullscreen: true,
    frame: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (process.env.NODE_ENV == 'development') {
    // setInterval(function(){
    //   mainWindow.webContents.send('sendlakban',{counter:1})
    // },2000)
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

var Gpio = require('onoff').Gpio
const sensor_pin=25
// Export GPIO #18 as an interrupt, generating input. Debounce timeout is 10 ms.
const interrupt_pin = new Gpio(sensor_pin, 'in', 'rising', {debounceTimeout: 10}); 
 
console.log('Ready...');
// var val=0
 
// The callback passed to watch will be called when the interrupt_pin on GPIO #25 is triggered by goods. 
interrupt_pin.watch(function (err, value) {
    if (err) throw err;
    // val=val+1;
    // console.log('Data ' + value);
    // val=val+value;
    try{
      mainWindow.webContents.send('sendlakban',{counter:1});
      console.log('Data is received.');
    }catch(err){
      console.log("Error in receiving data!")
    }
    // console.log('count '+ val);
    // To stop watch to the sensor pin
    // interrupt_pin.unexport(); // Unexport GPIO and free resources
});