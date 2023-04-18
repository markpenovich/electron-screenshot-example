const { app, BrowserWindow, desktopCapturer, screen, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('capture-screenshot', async (event) => {
  const screenShotInfo = await captureScreen();
  const dataURL = screenShotInfo.toDataURL();
  event.sender.send('screenshot-captured', dataURL);
});


async function captureScreen() {
  // Get the primary display
  const primaryDisplay = screen.getPrimaryDisplay();

  // Get its size
  const { width, height } = primaryDisplay.size;

  // Set up the options for the desktopCapturer
  const options = {
    types: ['screen'],
    thumbnailSize: { width, height },
  };

  // Get the sources
  const sources = await desktopCapturer.getSources(options);

  // Find the primary display's source
  const primarySource = sources.find(({display_id}) => display_id == primaryDisplay.id)
  
  // Get the image
  const image = primarySource.thumbnail;

  // Return image data
  return image
}
