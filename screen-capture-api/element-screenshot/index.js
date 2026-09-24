const screenshotElem = document.getElementById("screenshot");
const downloadElem = document.getElementById("download");
const demoElem = document.getElementById("demo");
let screenshotURL;

screenshotElem.addEventListener("click", async () => {
  screenshotElem.disabled = true;
  let stream;
  let bitmap;

  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
      preferCurrentTab: true,
    });
    const [track] = stream.getVideoTracks();
    const restrictionTarget = await RestrictionTarget.fromElement(demoElem);
    await track.restrictTo(restrictionTarget);
    bitmap = await new ImageCapture(track).grabFrame();

    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas.getContext("2d").drawImage(bitmap, 0, 0);
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });
    if (!blob) {
      throw new Error("Could not create the screenshot.");
    }

    if (screenshotURL) {
      URL.revokeObjectURL(screenshotURL);
    }
    screenshotURL = URL.createObjectURL(blob);
    downloadElem.href = screenshotURL;
    downloadElem.hidden = false;
    downloadElem.click();
  } catch (err) {
    console.error(err);
  } finally {
    stream?.getTracks().forEach((track) => track.stop());
    bitmap?.close();
    screenshotElem.disabled = false;
  }
});
