const notifyMe = document.querySelector("#notify-me");
notifyMe.addEventListener("click", async () => {
	const permission = await Notification.requestPermission();

	if (permission === "granted") {
		setTimeout(() => {
			const notification = new Notification("Hello!");

			notification.addEventListener("show", () => {
				console.log("showing!");
			});

			notification.addEventListener("click", () => {
				console.log("clicked!");
			});

			notification.addEventListener("close", () => {
				console.log("closed!");
			});
		}, 1000);
	} else {
		console.log("Permission to show notifications was not granted");
	}
});
