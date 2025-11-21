const interestLink = document.querySelector("[interestfor='user-info']");
const interestButton = document.querySelector("[interestfor='button-tooltip']");
const userInfo = document.getElementById("user-info");
const buttonTooltip = document.getElementById("button-tooltip");

// Feature detection

const supported =
  HTMLButtonElement.prototype.hasOwnProperty("interestForElement");
if (!supported) {
  document.querySelector("html").classList.add("no-interest-invokers");
}

// interestForElement example

console.log(interestLink.interestForElement);
console.log(interestButton.interestForElement);

// Event examples

userInfo.addEventListener("interest", reportInterest);
buttonTooltip.addEventListener("interest", reportInterest);
userInfo.addEventListener("loseinterest", reportInterest);
buttonTooltip.addEventListener("loseinterest", reportInterest);

function reportInterest(e) {
  let action;
  if (e.type === "interest") {
    action = "Interest gained";
  } else {
    action = "Interest lost";
  }

  console.log(`${action} on ${e.source.tagName}`);
}
