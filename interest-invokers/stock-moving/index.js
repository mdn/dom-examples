// Feature detection

const supported =
  HTMLButtonElement.prototype.hasOwnProperty("interestForElement");
if (!supported) {
  document.querySelector("html").classList.add("no-interest-invokers");
}

// Variable and handler definition

const interestBtns = document.querySelectorAll("button");
const btnTooltip = document.getElementById("button-tooltip");
const keepList = document.querySelector(".keep");
const sellList = document.querySelector(".sell");

let interval;
let stockToMove = 0;

btnTooltip.addEventListener("interest", incrementStock);
btnTooltip.addEventListener("loseinterest", resetStock);
interestBtns.forEach((btn) => btn.addEventListener("click", moveStock));

// Increment the amount of stock to move when interest is shown
function incrementStock(e) {
  const sourceElem = e.source;
  stockToMove = 0;

  function updateStockCount() {
    // Only increment stockToMove if it is smaler than the entire available stock
    let stock = Number(sourceElem.getAttribute("data-stock"));
    if (stockToMove < stock) {
      stockToMove++;
      btnTooltip.textContent = `Stock to move: ${stockToMove}`;
    }
  }

  // Immediately increment stock to move, and then do it repeated every 250ms
  updateStockCount();
  interval = setInterval(updateStockCount, 250);
}

// Reset the amount of stock to move when interest is lost
function resetStock(e) {
  // Clear the interval and the tooltip's text content, ready for next time
  clearInterval(interval);
  btnTooltip.textContent = "";
}

// Move the stock when the button is actually clicked
function moveStock(e) {
  // Determine which list we are moving the stock item to
  let targetList;
  if (e.target.parentNode === keepList) {
    targetList = sellList;
  } else {
    targetList = keepList;
  }

  // number of items and product to move
  const newStock = stockToMove;
  const newProduct = e.target.getAttribute("data-product");

  // Determine whether a stack of that item already
  // exists at the place to move the item to
  const targetProductsList = Array.from(targetList.children);
  const existingNewProduct = targetProductsList.find(
    (element) => element.getAttribute("data-product") === newProduct
  );

  // If so, just add the items to the existing stack
  if (existingNewProduct) {
    const totalStock =
      Number(existingNewProduct.getAttribute("data-stock")) + newStock;
    existingNewProduct.setAttribute("data-stock", totalStock);
    existingNewProduct.textContent = `${newProduct} (${totalStock})`;
  } else {
    // If not, create a new stack and append it to the list
    const newBtn = document.createElement("button");
    newBtn.setAttribute("interestFor", "button-tooltip");
    newBtn.setAttribute("data-stock", newStock);
    newBtn.setAttribute("data-product", newProduct);
    newBtn.textContent = `${newProduct} (${newStock})`;
    newBtn.addEventListener("click", moveStock);
    targetList.appendChild(newBtn);
  }

  // Update the stack the stock was moved FROM to show the remaining items
  const oldStock = Number(e.target.getAttribute("data-stock")) - stockToMove;
  e.target.setAttribute("data-stock", oldStock);
  e.target.textContent = `${newProduct} (${oldStock})`;

  // Unfocus the button interest was being shown in. If you don't do this, you get weird behavior
  // when it was focused via the keyboard — the interestfor target element starts incrementing again
  // immediately, and if the stack goes to 0 and disappears (see next block), the focus shifts to the
  // body and you get the interestfor target appearing at the top of the viewport!
  e.target.blur();

  // If the stack the stock was moved from has no remaining items, remove it from the DOM
  if (e.target.getAttribute("data-stock") === "0") {
    e.target.remove();
  }
}
