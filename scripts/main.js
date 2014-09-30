// create an instance of a db object for us to store the IDB data in
var db;

var activeIndex;

var contacts = [
      { id: 1, fName: 'Brian', lName: 'Damage', jTitle: 'Master of Synergies', company: 'Acme', eMail: 'brian@acme.com', phone: '+441210000000', age: 37 },
      { id: 2, fName: 'Ted', lName: 'Maul', jTitle: 'Chief Reporter', company: 'Brass eye', eMail: 'ted@itsthenews.co.uk', phone: '+442081111111', age: 46 },
      { id: 3, fName: 'Mr', lName: 'Bungle', jTitle: 'Bad Clown', company: 'Stub a Dub', eMail: 'bungle@maiof.com', phone: '+1508888888', age: 50 },
      { id: 4, fName: 'Richard', lName: 'James', jTitle: 'Sound Engineer', company: 'Aphex Twin', eMail: 'richard@drukqs.com', phone: '+1517777777', age: 43 },
      { id: 5, fName: 'Brian', lName: 'Umlaut', jTitle: 'Shredmeister', company: 'Minions of metal', eMail: 'brian@raiseyourhorns.com', phone: '+14086666666', age: 40 },
      { id: 6, fName: 'Jonathan', lName: 'Crane', jTitle: 'Freelance Psychologist', company: 'Arkham', eMail: 'jon@arkham.com', phone: 'n/a', age: 38 },
      { id: 7, fName: 'Julian', lName: 'Day', jTitle: 'Schedule Keeper', company: 'Arkham', eMail: 'julian@arkham.com', phone: 'n/a', age: 43 },
      { id: 8, fName: 'Bolivar', lName: 'Trask', jTitle: 'Head of R&D', company: 'Trask', eMail: 'bolivar@trask.com', phone: '+14095555555', age: 55 },
      { id: 9, fName: 'Cloud', lName: 'Strife', jTitle: 'Weapons Instructor', company: 'Avalanche', eMail: 'cloud@avalanche.com', phone: '+17083333333', age: 24 },
      { id: 10, fName: 'Bilbo', lName: 'Bagshot', jTitle: 'Comic Shop Owner', company: 'Fantasy Bazaar', eMail: 'bilbo@fantasybazaar.co.uk', phone: '+12084444444', age: 43 }
    ];

// all the variables we need for the app    

var tableEntry = document.querySelector('tbody');


window.onload = function() {
  // In the following line, you should include the prefixes of implementations you want to test.
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  // DON'T use "var indexedDB = ..." if you're not in a function.
  // Moreover, you may need references to some window.IDB* objects:
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
  // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

  var DBOpenRequest = window.indexedDB.open('contactsList', 1);
  
  DBOpenRequest.onsuccess = function(event) {
    db = DBOpenRequest.result;
    populateData();
  };
  
  DBOpenRequest.onupgradeneeded = function(event) { 
    var db = event.target.result;
    
    db.onerror = function(event) {
      console.log('Error loading database.');
    };
    
    var objectStore = db.createObjectStore('contactsList', { keyPath: 'id' }); 
    objectStore.createIndex('lName', 'lName', { unique: false }); 
    objectStore.createIndex('fName', 'fName', { unique: false });
    objectStore.createIndex('jTitle', 'jTitle', { unique: false });
    objectStore.createIndex('company', 'company', { unique: false });
    objectStore.createIndex('eMail', 'eMail', { unique: false });
    objectStore.createIndex('phone', 'phone', { unique: false });
    objectStore.createIndex('age', 'age', { unique: false });
  };
    
  function populateData() {
    var transaction = db.transaction(['contactsList'], 'readwrite');
    var objectStore = transaction.objectStore('contactsList');
    for(i = 0; i < contacts.length ; i++) {
      var request = objectStore.put(contacts[i]);
    };

    transaction.oncomplete = function() {
      displayDataByKey();
    };
  };

  var thControls = document.querySelectorAll('th');
  console.log(thControls[0]);
  for(i = 0; i < thControls.length; i++) {
    console.log(thControls[i]);
    var activeThead = thControls[i];
    activeThead.onclick = function(e) {
      activeIndex = e.target.innerHTML;
      if(activeIndex == 'ID') {
        displayDataByKey(); 
      } else {
        if(activeIndex == "Last name") {
          displayDataByIndex('lName');
        } else if(activeIndex == "First name") {
          displayDataByIndex('fName');
        } else if(activeIndex == "Job title") {
          displayDataByIndex('jTitle');
        } else if(activeIndex == "Company") {
          displayDataByIndex('company');
        } else if(activeIndex == "E-mail") {
          displayDataByIndex('eMail');
        } else if(activeIndex == "Phone") {
          displayDataByIndex('phone');
        } else if(activeIndex == "Age") {
          displayDataByIndex('age');
        }
      }
    }
  }

  function displayDataByKey() {
    tableEntry.innerHTML = '';
    var transaction = db.transaction(['contactsList'], 'readonly');
    var objectStore = transaction.objectStore('contactsList');

    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor) {
        var tableRow = document.createElement('tr');
        tableRow.innerHTML =   '<td>' + cursor.value.id + '</td>'
                             + '<td>' + cursor.value.lName + '</td>'
                             + '<td>' + cursor.value.fName + '</td>'
                             + '<td>' + cursor.value.jTitle + '</td>'
                             + '<td>' + cursor.value.company + '</td>'
                             + '<td>' + cursor.value.eMail + '</td>'
                             + '<td>' + cursor.value.phone + '</td>'
                             + '<td>' + cursor.value.age + '</td>';
        tableEntry.appendChild(tableRow);  
        
        //console.log(cursor.source);
        //console.log(cursor.key);
        //console.log(cursor.primaryKey);
        //console.log(cursor.value);
        cursor.continue();
      } else {
        console.log('Entries all displayed.');    
      }
    };
  };

  function displayDataByIndex(activeIndex) {
    console.log(activeIndex);
    tableEntry.innerHTML = '';
    var transaction = db.transaction(['contactsList'], 'readonly');
    var objectStore = transaction.objectStore('contactsList');


    var myIndex = objectStore.index(activeIndex);
     
    myIndex.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor) {
        var tableRow = document.createElement('tr');
        tableRow.innerHTML =   '<td>' + cursor.value.id + '</td>'
                             + '<td>' + cursor.value.lName + '</td>'
                             + '<td>' + cursor.value.fName + '</td>'
                             + '<td>' + cursor.value.jTitle + '</td>'
                             + '<td>' + cursor.value.company + '</td>'
                             + '<td>' + cursor.value.eMail + '</td>'
                             + '<td>' + cursor.value.phone + '</td>'
                             + '<td>' + cursor.value.age + '</td>';
        tableEntry.appendChild(tableRow);  
        
        //console.log(cursor.source);
        //console.log(cursor.key);
        //console.log(cursor.primaryKey);
        //console.log(cursor.value);
        cursor.continue();
      } else {
        console.log('Entries all displayed.');    
      }
    };
  };

};

