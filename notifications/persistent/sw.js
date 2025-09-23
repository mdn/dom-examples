self.addEventListener("notificationclick", (event) => {
  switch (event.action) {
    case "donut":
      clients.openWindow("actions/donut.html");
      break;
    case "tea":
      clients.openWindow("actions/tea.html");
      break;
  }
});
