const scrollBtn = document.querySelector(".scroll");
const scrollToBtn = document.querySelector(".scrollto");
const scrollByBtn = document.querySelector(".scrollby");

const toolbar = document.querySelector("div");

function supportsScrollPromises() {
  const test = window.scroll(0, 0);
  return test instanceof Promise;
}

function isInterrupted(interrupted) {
  console.log(`Scroll finished;${interrupted ? " " : " not "}interrupted`);
  if (interrupted) {
    alert("Scroll interrupted!");
  }
}

const supports = supportsScrollPromises();

if (supports) {
  scrollBtn.addEventListener("click", async () => {
    toolbar.className = "fade-out";
    const result = await window.scroll(0, 1000);
    isInterrupted(result.interrupted);
    toolbar.className = "fade-in";
  });

  scrollToBtn.addEventListener("click", async () => {
    toolbar.className = "fade-out";
    const result = await window.scrollTo(0, 0);
    isInterrupted(result.interrupted);
    toolbar.className = "fade-in";
  });

  scrollByBtn.addEventListener("click", async () => {
    toolbar.className = "fade-out";
    const result = await window.scrollBy(0, 200);
    isInterrupted(result.interrupted);
    toolbar.className = "fade-in";
  });
} else {
  scrollBtn.addEventListener("click", () => {
    window.scroll(0, 1000);
  });

  scrollToBtn.addEventListener("click", () => {
    window.scrollTo(0, 0);
  });

  scrollByBtn.addEventListener("click", () => {
    window.scrollBy(0, 200);
  });
}
