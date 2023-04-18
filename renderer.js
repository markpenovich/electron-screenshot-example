async function takeScreenshot() {
  await window.screenshot.captureScreenShot()
  window.screenshot.screenShotCaptured((event, dataURL) => {
    document.getElementById('screenshot-image').src = dataURL;
  });
}

document.getElementById('screenshot-button').addEventListener('click', takeScreenshot);