// create an instance of a db object for us to store the IDB data in
let db;
let activeIndex;

const contacts = [
  {
    id: 1,
    fName: "Brian",
    lName: "Damage",
    jTitle: "Master of Synergies",
    company: "Acme",
    eMail: "brian@acme.com",
    phone: "+441210000000",
    age: 37,
  },
  {
    id: 2,
    fName: "Ted",
    lName: "Maul",
    jTitle: "Chief Reporter",
    company: "Brass eye",
    eMail: "ted@itsthenews.co.uk",
    phone: "+442081111111",
    age: 46,
  },
  {
    id: 3,
    fName: "Mr",
    lName: "Bungle",
    jTitle: "Bad Clown",
    company: "Stub a Dub",
    eMail: "bungle@maiof.com",
    phone: "+1508888888",
    age: 50,
  },
  {
    id: 4,
    fName: "Richard",
    lName: "James",
    jTitle: "Sound Engineer",
    company: "Aphex Twin",
    eMail: "richard@drukqs.com",
    phone: "+1517777777",
    age: 43,
  },
  {
    id: 5,
    fName: "Brian",
    lName: "Umlaut",
    jTitle: "Shredmeister",
    company: "Minions of metal",
    eMail: "brian@raiseyourhorns.com",
    phone: "+14086666666",
    age: 40,
  },
  {
    id: 6,
    fName: "Jonathan",
    lName: "Crane",
    jTitle: "Freelance Psychologist",
    company: "Arkham",
    eMail: "jon@arkham.com",
    phone: "n/a",
    age: 38,
  },
  {
    id: 7,
    fName: "Julian",
    lName: "Day",
    jTitle: "Schedule Keeper",
    company: "Arkham",
    eMail: "julian@arkham.com",
    phone: "n/a",
    age: 43,
  },
  {
    id: 8,
    fName: "Bolivar",
    lName: "Trask",
    jTitle: "Head of R&D",
    company: "Trask",
    eMail: "bolivar@trask.com",
    phone: "+14095555555",
    age: 55,
  },
  {
    id: 9,
    fName: "Cloud",
    lName: "Strife",
    jTitle: "Weapons Instructor",
    company: "Avalanche",
    eMail: "cloud@avalanche.com",
    phone: "+17083333333",
    age: 24,
  },
  {
    id: 10,
    fName: "Bilbo",
    lName: "Bagshot",
    jTitle: "Comic Shop Owner",
    company: "Fantasy Bazaar",
    eMail: "bilbo@fantasybazaar.co.uk",
    phone: "+12084444444",
    age: 43,
  },
];

// all the variables we need for the app

const tableEntry = document.querySelector("tbody");

window.onload = function () {
  // In the following line, you should include the prefixes of implementations you want to test.
  window.indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;
  // DON'T use "const indexedDB = ..." if you're not in a function.
  // Moreover, you may need references to some window.IDB* objects:
  window.IDBTransaction =
    window.IDBTransaction ||
    window.webkitIDBTransaction ||
    window.msIDBTransaction;
  window.IDBKeyRange =
    window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
  // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

  const DBOpenRequest = window.indexedDB.open("contactsList", 1);

  DBOpenRequest.onsuccess = function (event) {
    db = DBOpenRequest.result;
    populateData();
  };

  DBOpenRequest.onupgradeneeded = function (event) {
    const db = event.target.result;

    db.onerror = function (event) {
      console.log("Error loading database.");
    };

    const objectStore = db.createObjectStore("contactsList", { keyPath: "id" });
    objectStore.createIndex("lName", "lName", { unique: false });
    objectStore.createIndex("fName", "fName", { unique: false });
    objectStore.createIndex("jTitle", "jTitle", { unique: false });
    objectStore.createIndex("company", "company", { unique: false });
    objectStore.createIndex("eMail", "eMail", { unique: true });
    objectStore.createIndex("phone", "phone", { unique: false });
    objectStore.createIndex("age", "age", { unique: false });
  };

  function populateData() {
    const transaction = db.transaction(["contactsList"], "readwrite");
    const objectStore = transaction.objectStore("contactsList");
    for (i = 0; i < contacts.length; i++) {
      objectStore.put(contacts[i]);
    }

    transaction.oncomplete = function () {
      displayDataByKey();
    };
  }

  const thControls = document.querySelectorAll("th");
  for (i = 0; i < thControls.length; i++) {
    const activeThead = thControls[i];
    activeThead.onclick = function (e) {
      activeIndex = e.target.innerHTML;
      if (activeIndex == "ID") {
        displayDataByKey();
      } else {
        if (activeIndex == "Last name") {
          displayDataByIndex("lName");
        } else if (activeIndex == "First name") {
          displayDataByIndex("fName");
        } else if (activeIndex == "Job title") {
          displayDataByIndex("jTitle");
        } else if (activeIndex == "Company") {
          displayDataByIndex("company");
        } else if (activeIndex == "E-mail") {
          displayDataByIndex("eMail");
        } else if (activeIndex == "Phone") {
          displayDataByIndex("phone");
        } else if (activeIndex == "Age") {
          displayDataByIndex("age");
        }
      }
    };
  }

  function displayDataByKey() {
    tableEntry.innerHTML = "";
    const transaction = db.transaction(["contactsList"], "readonly");
    const objectStore = transaction.objectStore("contactsList");

    objectStore.openCursor().onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML =
          "<td>" +
          cursor.value.id +
          "</td>" +
          "<td>" +
          cursor.value.lName +
          "</td>" +
          "<td>" +
          cursor.value.fName +
          "</td>" +
          "<td>" +
          cursor.value.jTitle +
          "</td>" +
          "<td>" +
          cursor.value.company +
          "</td>" +
          "<td>" +
          cursor.value.eMail +
          "</td>" +
          "<td>" +
          cursor.value.phone +
          "</td>" +
          "<td>" +
          cursor.value.age +
          "</td>";
        tableEntry.appendChild(tableRow);

        cursor.continue();
      } else {
        console.log("Entries all displayed.");
      }
    };
  }

  function displayDataByIndex(activeIndex) {
    tableEntry.innerHTML = "";
    const transaction = db.transaction(["contactsList"], "readonly");
    const objectStore = transaction.objectStore("contactsList");

    const myIndex = objectStore.index(activeIndex);

    console.log(myIndex.name);
    console.log(myIndex.objectStore);
    console.log(myIndex.keyPath);
    console.log(myIndex.multiEntry);
    console.log(myIndex.unique);

    const countRequest = myIndex.count();
    countRequest.onsuccess = function () {
      console.log(countRequest.result);
    };

    if (activeIndex == "fName") {
      const getRequest = myIndex.get("Mr");
      getRequest.onsuccess = function () {
        console.log(getRequest.result);
      };
    }

    if (activeIndex == "lName") {
      const getKeyRequest = myIndex.getKey("Bungle");
      getKeyRequest.onsuccess = function () {
        console.log(getKeyRequest.result);
      };
    }

    myIndex.openCursor().onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML =
          "<td>" +
          cursor.value.id +
          "</td>" +
          "<td>" +
          cursor.value.lName +
          "</td>" +
          "<td>" +
          cursor.value.fName +
          "</td>" +
          "<td>" +
          cursor.value.jTitle +
          "</td>" +
          "<td>" +
          cursor.value.company +
          "</td>" +
          "<td>" +
          cursor.value.eMail +
          "</td>" +
          "<td>" +
          cursor.value.phone +
          "</td>" +
          "<td>" +
          cursor.value.age +
          "</td>";
        tableEntry.appendChild(tableRow);

        cursor.continue();
      } else {
        console.log("Entries all displayed.");
      }
    };
  }
};
