window.addEventListener("load", (e) => {
  fillTableWithParameters();
});

function fillTableWithParameters() {
  const table = document.querySelector(".param-table");
  const outputBox = document.getElementById("url-output");

  const url = new URL(document.location.href);
  url.searchParams.sort();
  const keys = url.searchParams.keys();

  for (let key of keys) {
    let val = url.searchParams.get(key);
    let row = document.createElement("tr");
    let cell = document.createElement("td");
    cell.innerText = key;
    row.appendChild(cell);
    cell = document.createElement("td");
    cell.innerText = val;
    row.appendChild(cell);
    table.appendChild(row);
  }
  outputBox.innerText = `Current URL: ${url}`;
}
