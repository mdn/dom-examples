const butReq = document.getElementById("butRequest");
butReq.addEventListener("click", getContacts);

const cbMultiple = document.getElementById("multiple");
const cbName = document.getElementById("name");
const cbEmail = document.getElementById("email");
const cbTel = document.getElementById("tel");
const cbAddress = document.getElementById("address");
const cbIcon = document.getElementById("icon");
const ulResults = document.getElementById("results");
const preResults = document.getElementById("rawResults");

const supported = "contacts" in navigator && "ContactsManager" in window;

if (supported) {
  const divNotSupported = document.getElementById("notSupported");
  divNotSupported.classList.toggle("hidden", true);
  butReq.removeAttribute("disabled");
  checkProperties();
}

async function checkProperties() {
  const supportedProperties = await navigator.contacts.getProperties();
  if (supportedProperties.includes("name")) {
    enableProp(cbName);
  }
  if (supportedProperties.includes("email")) {
    enableProp(cbEmail);
  }
  if (supportedProperties.includes("tel")) {
    enableProp(cbTel);
  }
  if (supportedProperties.includes("address")) {
    enableProp(cbAddress);
  }
  if (supportedProperties.includes("icon")) {
    enableProp(cbIcon);
  }
}

async function getContacts() {
  const props = [];
  if (cbName.checked) props.push("name");
  if (cbEmail.checked) props.push("email");
  if (cbTel.checked) props.push("tel");
  if (cbAddress.checked) props.push("address");
  if (cbIcon.checked) props.push("icon");

  const opts = { multiple: cbMultiple.checked };

  try {
    const contacts = await navigator.contacts.select(props, opts);
    handleResults(contacts);
  } catch (ex) {
    ulResults.classList.toggle("error", true);
    ulResults.classList.toggle("success", false);
    ulResults.innerText = ex.toString();
  }
}

function handleResults(contacts) {
  ulResults.classList.toggle("success", true);
  ulResults.classList.toggle("error", false);
  ulResults.replaceChildren();
  renderResults(contacts);
}

function enableProp(cbox) {
  cbox.removeAttribute("disabled");
  cbox.setAttribute("checked", "checked");
}

function renderResults(contacts) {
  contacts.forEach((contact) => {
    const li = document.createElement("li");
    function newLine(key,value){
      li.appendChild(document.createElement('b')).textContent = key + ": ";
      if(value instanceof Node) li.appendChild(value);
      else if(value != null && value !== "") li.appendChild(document.createTextNode(value));
      li.appendChild(document.createElement('br'));
    }
    if (contact.name) newLine("Name",contact.name.join(", "));
    if (contact.email) newLine("E-Mail",contact.email.join(", "));
    if (contact.tel) newLine("Telephone",contact.tel.join(", "));
    if (contact.address) {
      contact.address.forEach((address) => {
        newLine("Address",JSON.stringify(address));
      });
    }
    if (contact.icon) {
      contact.icon.forEach((icon) => {
        const imgURL = URL.createObjectURL(icon);
        const img = document.createElement("img");
        img.src=imgURL;
        newLine("Icon", img);
      });
    }
    const code = document.createElement('code');
    code.textContent = JSON.stringify(contact);
    newLine("Raw",code);
    ulResults.appendChild(li);
  });
  const strContacts = JSON.stringify(contacts, null, 2);
  console.log(strContacts);
}
