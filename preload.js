const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('screenshot', {
  captureScreenShot: () => ipcRenderer.send('capture-screenshot'),
  screenShotCaptured: (callback) => {
    ipcRenderer.on('screenshot-captured', (event, screenshotURL) => callback(event, screenshotURL));
  },
})