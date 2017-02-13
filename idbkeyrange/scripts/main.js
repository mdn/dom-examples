// create an instance of a db object for us to store the IDB data in
var db;

var things = [
      { fThing: 'Drum kit', fRating: 10 },
      { fThing: 'Family', fRating: 10 },
      { fThing: 'Batman', fRating: 9 },      
      { fThing: 'Brass eye', fRating: 9 },
      { fThing: 'The web', fRating: 9 },
      { fThing: 'Mozilla', fRating: 9 },
      { fThing: 'Firefox OS', fRating: 9 },
      { fThing: 'Curry', fRating: 9 },
      { fThing: 'Paneer cheese', fRating: 8 },
      { fThing: 'Mexican food', fRating: 8 },
      { fThing: 'Chocolate', fRating: 7 },
      { fThing: 'Heavy metal', fRating: 10 },
      { fThing: 'Monty Python', fRating: 8 },
      { fThing: 'Aphex Twin', fRating: 8 },
      { fThing: 'Gaming', fRating: 7 },
      { fThing: 'Frank Zappa', fRating: 9 },
      { fThing: 'Open minds', fRating: 10 },
      { fThing: 'Hugs', fRating: 9 },
      { fThing: 'Ale', fRating: 9 },
      { fThing: 'Christmas', fRating: 8 },
    ];

// all the variables we need for the app    

var list = document.querySelector('ul');

var button = document.querySelector('button');

var onlyText = document.querySelector('#onlytext');
var rangeLowerText = document.querySelector('#rangelowertext');
var rangeUpperText = document.querySelector('#rangeuppertext');
var lowerBoundText = document.querySelector('#lowerboundtext');
var upperBoundText = document.querySelector('#upperboundtext');

window.onload = function() {
  // In the following line, you should include the prefixes of implementations you want to test.
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  // DON'T use "var indexedDB = ..." if you're not in a function.
  // Moreover, you may need references to some window.IDB* objects:
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
  // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

  var DBOpenRequest = window.indexedDB.open('fThings', 1);
  
  DBOpenRequest.onsuccess = function(event) {
    db = DBOpenRequest.result;
    populateData();
  };
  
  DBOpenRequest.onupgradeneeded = function(event) { 
    var db = event.target.result;
    
    db.onerror = function(event) {
      note.innerHTML += '<li>Error loading database.</li>';
    };
    
    var objectStore = db.createObjectStore('fThings', { keyPath: 'fThing' });  
    objectStore.createIndex('fRating', 'fRating', { unique: false });
  };
    
  function populateData() {
    var transaction = db.transaction(['fThings'], 'readwrite');
    var objectStore = transaction.objectStore('fThings');
    for(i = 0; i < things.length ; i++) {
      var request = objectStore.put(things[i]);
    };

    transaction.oncomplete = function() {
      displayData();
    };
  };

  var keyRangeValue = null;

  function displayData() {
    checkedValue = document.querySelector('input[name="value"]:checked').value;
    
    if(checkedValue == "none") {
      keyRangeValue = null;
    } else if(checkedValue == "only") {
      keyRangeValue = IDBKeyRange.only(onlyText.value);
    } else if(checkedValue == "range") {
      keyRangeValue = IDBKeyRange.bound(rangeLowerText.value, rangeUpperText.value, false, false);
    } else if(checkedValue == "lower") {
      keyRangeValue = IDBKeyRange.lowerBound(lowerBoundText.value);
    } else if(checkedValue == "upper") {
      keyRangeValue = IDBKeyRange.upperBound(upperBoundText.value);
    }
    
    if(keyRangeValue != null) {
      console.log(keyRangeValue.lower);
      console.log(keyRangeValue.upper);
      console.log(keyRangeValue.lowerOpen);
      console.log(keyRangeValue.upperOpen);
    };

    list.innerHTML = '';
    var transaction = db.transaction(['fThings'], 'readonly');
    var objectStore = transaction.objectStore('fThings');
    
    var countRequest = objectStore.count();
    countRequest.onsuccess = function() {
      console.log(countRequest.result);
    }

    objectStore.openCursor(keyRangeValue).onsuccess = function(event) {
      var cursor = event.target.result;
        if(cursor) {
          var listItem = document.createElement('li');
          listItem.innerHTML = '<strong>' + cursor.value.fThing + '</strong>, ' + cursor.value.fRating;
          list.appendChild(listItem);  
          
          cursor.continue();
        } else {
          console.log('Entries all displayed.');
          
        }
    };

  };
  
  button.onclick = function(e) {
    e.preventDefault();

    displayData();
  };

};