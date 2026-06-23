const scrollBtn = document.querySelector(".scroll");
const scrollToBtn = document.querySelector(".scrollto");
const scrollByBtn = document.querySelector(".scrollby");
const scrollIntoViewBtn = document.querySelector(".scrollintoview");

const toolbar = document.querySelector("div");
const section = document.querySelector("section");
const end = document.querySelector("#end");

function supportsScrollPromises() {
  const test = section.scroll(0, 0);
  return test instanceof Promise;
}

const supports = supportsScrollPromises();

if (supports) {
  scrollBtn.addEventListener("click", async () => {
    toolbar.className = "fade-out";
    const result = await section.scroll(0, 1000);
    console.log(
      `Scroll finished;${result.interrupted ? " " : " not "}interrupted`,
    );
    toolbar.className = "fade-in";
  });

  scrollToBtn.addEventListener("click", async () => {
    toolbar.className = "fade-out";
    const result = await section.scrollTo(0, 0);
    console.log(
      `Scroll finished;${result.interrupted ? " " : " not "}interrupted`,
    );
    toolbar.className = "fade-in";
  });

  scrollByBtn.addEventListener("click", async () => {
    toolbar.className = "fade-out";
    const result = await section.scrollBy(0, 200);
    console.log(
      `Scroll finished;${result.interrupted ? " " : " not "}interrupted`,
    );
    toolbar.className = "fade-in";
  });

  scrollIntoViewBtn.addEventListener("click", async () => {
    toolbar.className = "fade-out";
    const result = await end.scrollIntoView();
    console.log(
      `Scroll finished;${result.interrupted ? " " : " not "}interrupted`,
    );
    toolbar.className = "fade-in";
  });
} else {
  scrollBtn.addEventListener("click", () => {
    section.scroll(0, 1000);
  });

  scrollToBtn.addEventListener("click", () => {
    section.scrollTo(0, 0);
  });

  scrollByBtn.addEventListener("click", () => {
    section.scrollBy(0, 200);
  });

  scrollIntoViewBtn.addEventListener("click", () => {
    end.scrollIntoView();
  });
}
