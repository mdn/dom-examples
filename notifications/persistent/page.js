navigator.serviceWorker.register("sw.js");

const notifyMe = document.querySelector("#notify-me");
notifyMe.addEventListener("click", async () => {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    setTimeout(async () => {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification("Hello!", {
        actions: [
          { action: "donut", title: "Eat a donut" },
          { action: "tea", title: "Drink a cup of tea" },
        ],
      });
    }, 1000);
  } else {
    console.log("Permission to show notifications was not granted");
  }
});
