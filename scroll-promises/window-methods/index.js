const scrollBtn = document.querySelector(".scroll");
const scrollToBtn = document.querySelector(".scrollto");
const scrollByBtn = document.querySelector(".scrollby");

const toolbar = document.querySelector("div");

scrollBtn.addEventListener("click", async () => {
  toolbar.className = "fade-out";
  const result = await window.scroll(0, 1000);
  console.log(
    `Scroll finished;${result.interrupted ? " " : " not "}interrupted`,
  );
  toolbar.className = "fade-in";
});

scrollToBtn.addEventListener("click", async () => {
  toolbar.className = "fade-out";
  const result = await window.scrollTo(0, 0);
  console.log(
    `Scroll finished;${result.interrupted ? " " : " not "}interrupted`,
  );
  toolbar.className = "fade-in";
});

scrollByBtn.addEventListener("click", async () => {
  toolbar.className = "fade-out";
  const result = await window.scrollBy(0, 200);
  console.log(
    `Scroll finished;${result.interrupted ? " " : " not "}interrupted`,
  );
  toolbar.className = "fade-in";
});
