
const videoPlayer = document.getElementById("player");
const playerContainer = document.getElementById("container");

const inPIPMessage = document.querySelector(".in-pip-message");
inPIPMessage.style.display = "none";

if ("documentPictureInPicture" in window) {

	document.querySelector(".no-picture-in-picture").remove();

	const togglePipButton = document.createElement("button");
	togglePipButton.textContent = "Toggle Picture-in-Picture";
	togglePipButton.addEventListener("click", togglePictureInPicture, false);

	document.getElementById("controlbar").appendChild(togglePipButton);
}

async function togglePictureInPicture() {
	if (!window.documentPictureInPicture.window) {

		// Open a Picture-in-Picture window.
		const pipWindow = await window.documentPictureInPicture.requestWindow({
			width: videoPlayer.clientWidth,
			height: videoPlayer.clientHeight,
		});

		// Add pagehide listener to handle the case of the pip window being closed using the browser X button
		pipWindow.addEventListener("pagehide", (event) => {
			inPIPMessage.style.display = "none";
			playerContainer.append(videoPlayer);
		});

		// Copy style sheets over from the initial document
		// so that the player looks the same.
		[...document.styleSheets].forEach((styleSheet) => {
			try {
				const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
				const style = document.createElement('style');

				style.textContent = cssRules;
				pipWindow.document.head.appendChild(style);
			} catch (e) {
				const link = document.createElement('link');

				link.rel = 'stylesheet';
				link.type = styleSheet.type;
				link.media = styleSheet.media;
				link.href = styleSheet.href;
				pipWindow.document.head.appendChild(link);
			}
		})

		// Move the player to the Picture-in-Picture window.
		pipWindow.document.body.append(videoPlayer);

		// Display a message to say it has been moved
		inPIPMessage.style.display = "block";
	} else {
		inPIPMessage.style.display = "none";
		playerContainer.append(videoPlayer);
		window.documentPictureInPicture.window.close();
	}
}

documentPictureInPicture.addEventListener("enter", (event) => {
	const pipWindow = event.window;
	console.log("Video player has entered the pip window");

	const pipMuteButton = pipWindow.document.createElement("button");
	pipMuteButton.textContent = "Mute";
	pipMuteButton.addEventListener("click", () => {
		const pipVideo = pipWindow.document.querySelector("#video");
		if (!pipVideo.muted) {
			pipVideo.muted = true;
			pipMuteButton.textContent = "Unmute";
		} else {
			pipVideo.muted = false;
			pipMuteButton.textContent = "Mute";
		}
	});

	pipWindow.document.body.append(pipMuteButton);
});
