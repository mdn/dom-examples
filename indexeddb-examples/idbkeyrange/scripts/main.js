// create an instance of a db object for us to store the IDB data in
let db;

const things = [
  { fThing: "Drum kit", fRating: 10 },
  { fThing: "Family", fRating: 10 },
  { fThing: "Batman", fRating: 9 },
  { fThing: "Brass eye", fRating: 9 },
  { fThing: "The web", fRating: 9 },
  { fThing: "Mozilla", fRating: 9 },
  { fThing: "Firefox OS", fRating: 9 },
  { fThing: "Curry", fRating: 2 },
  { fThing: "Paneer cheese", fRating: 8 },
  { fThing: "Mexican food", fRating: 8 },
  { fThing: "Chocolate", fRating: 1 },
  { fThing: "Heavy metal", fRating: 10 },
  { fThing: "Monty Python", fRating: 8 },
  { fThing: "Aphex Twin", fRating: 8 },
  { fThing: "Gaming", fRating: 7 },
  { fThing: "Frank Zappa", fRating: 10 },
  { fThing: "Open minds", fRating: 10 },
  { fThing: "Hugs", fRating: 9 },
  { fThing: "Ale", fRating: 5 },
  { fThing: "Christmas", fRating: 8 },
];

// all the variables we need for the app

const list = document.querySelector("ul");

const button = document.querySelector("button");

const onlyText = document.querySelector("#onlyText");
const rangeLowerText = document.querySelector("#rangeLowerText");
const rangeUpperText = document.querySelector("#rangeUpperText");
const lowerBoundText = document.querySelector("#lowerBoundText");
const upperBoundText = document.querySelector("#upperBoundText");

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

  const DBOpenRequest = window.indexedDB.open("fThings", 1);

  DBOpenRequest.onsuccess = function (event) {
    db = DBOpenRequest.result;
    populateData();
  };

  DBOpenRequest.onupgradeneeded = function (event) {
    const db = event.target.result;

    db.onerror = function () {
      console.error(e);
    };

    const objectStore = db.createObjectStore("fThings", { keyPath: "fThing" });
    objectStore.createIndex("fRating", "fRating", { unique: false });
  };

  function populateData() {
    const transaction = db.transaction(["fThings"], "readwrite");
    const objectStore = transaction.objectStore("fThings");
    for (let i = 0; i < things.length; i++) {
      objectStore.put(things[i]);
    }

    transaction.oncomplete = function () {
      displayData();
    };
  }

  let keyRangeValue = null;

  function displayData() {
    checkedValue = document.querySelector('input[name="value"]:checked').value;
    const filterIndex = document.querySelector(
      'input[name="filterIndex"]:checked'
    ).value;

    if (filterIndex == "fThing") {
      if (checkedValue == "none") {
        keyRangeValue = null;
      } else if (checkedValue == "only") {
        keyRangeValue = IDBKeyRange.only(onlyText.value);
      } else if (checkedValue == "range") {
        keyRangeValue = IDBKeyRange.bound(
          rangeLowerText.value,
          rangeUpperText.value,
          false,
          false
        );
      } else if (checkedValue == "lower") {
        keyRangeValue = IDBKeyRange.lowerBound(lowerBoundText.value);
      } else if (checkedValue == "upper") {
        keyRangeValue = IDBKeyRange.upperBound(upperBoundText.value);
      }
    } else {
      //filterIndex=="fRating"
      if (checkedValue == "none") {
        keyRangeValue = null;
      } else if (checkedValue == "only") {
        keyRangeValue = IDBKeyRange.only(parseFloat(onlyText.value));
      } else if (checkedValue == "range") {
        keyRangeValue = IDBKeyRange.bound(
          parseFloat(rangeLowerText.value),
          parseFloat(rangeUpperText.value),
          false,
          false
        );
      } else if (checkedValue == "lower") {
        keyRangeValue = IDBKeyRange.lowerBound(
          parseFloat(lowerBoundText.value)
        );
      } else if (checkedValue == "upper") {
        keyRangeValue = IDBKeyRange.upperBound(
          parseFloat(upperBoundText.value)
        );
      }
    }

    if (keyRangeValue != null) {
      console.log(keyRangeValue.lower);
      console.log(keyRangeValue.upper);
      console.log(keyRangeValue.lowerOpen);
      console.log(keyRangeValue.upperOpen);
    }

    list.innerHTML = "";
    const transaction = db.transaction(["fThings"], "readonly");
    let objectStore = transaction.objectStore("fThings");

    const countRequest = objectStore.count();
    countRequest.onsuccess = function () {
      console.log(countRequest.result);
    };

    //iterate over the fRating index instead of the object store:
    if (filterIndex == "fRating") {
      objectStore = objectStore.index("fRating");
    }

    objectStore.openCursor(keyRangeValue).onsuccess = function (event) {
      const cursor = event.target.result;
      if (cursor) {
        const listItem = document.createElement("li");
        listItem.innerHTML =
          "<strong>" +
          cursor.value.fThing +
          "</strong>, " +
          cursor.value.fRating;
        list.appendChild(listItem);

        cursor.continue();
      } else {
        console.log("Entries all displayed.");
      }
    };
  }

  button.onclick = function (e) {
    e.preventDefault();

    displayData();
  };
};
