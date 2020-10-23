
window.addEventListener("load", startup, false);
let video;
let logs;

function startup() {
	video = document.getElementById("video");
	logs = document.getElementById("logs");

	if (document.pictureInPictureEnabled) {

		document
			.querySelector(".no-picture-in-picture")
			.remove();

		const togglePipButton = document.createElement("button");
		togglePipButton.textContent = "Toggle Picture-in-Picture";
		togglePipButton.addEventListener("click", togglePictureInPicture, false);

		document
			.getElementById("controlbar")
			.appendChild(togglePipButton);
	}
}

function togglePictureInPicture() {
	if (document.pictureInPictureElement) {
		document.exitPictureInPicture();
	} else {
		if (document.pictureInPictureEnabled) {
			video.requestPictureInPicture()
				.then(pictureInPictureWindow => {
					pictureInPictureWindow.addEventListener("resize", onPictureInPictureResize, false);
				});
		}
	}
}

function onPictureInPictureResize() {
	const listItem = document.createElement("li");
	listItem.textContent = `resize - ${Date.now()}`;

	logs.appendChild(listItem);
	setTimeout(() => logs.removeChild(listItem), 2000);
};
