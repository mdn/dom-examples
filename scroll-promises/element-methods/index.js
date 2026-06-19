const scrollBtn = document.querySelector(".scroll");
const scrollToBtn = document.querySelector(".scrollto");
const scrollByBtn = document.querySelector(".scrollby");
const scrollIntoViewBtn = document.querySelector(".scrollintoview");

const toolbar = document.querySelector("div");
const section = document.querySelector("section");
const end = document.querySelector("#end");

scrollBtn.addEventListener("click", async () => {
  toolbar.className = "fade-out";
  await section.scroll(0, 1000);
  console.log("Scroll finished");
  toolbar.className = "fade-in";
});

scrollToBtn.addEventListener("click", async () => {
  toolbar.className = "fade-out";
  await section.scrollTo(0, 0);
  console.log("Scroll finished");
  toolbar.className = "fade-in";
});

scrollByBtn.addEventListener("click", async () => {
  toolbar.className = "fade-out";
  await section.scrollBy(0, 200);
  console.log("Scroll finished");
  toolbar.className = "fade-in";
});

scrollIntoViewBtn.addEventListener("click", async () => {
  toolbar.className = "fade-out";
  await end.scrollIntoView();
  console.log("Scroll finished");
  toolbar.className = "fade-in";
});
