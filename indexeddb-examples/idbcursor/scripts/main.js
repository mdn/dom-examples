// create an instance of a db object for us to store the IDB data in
var db;

var records = [
      { albumTitle: 'Power windows', year: 1985 },
      { albumTitle: 'Grace under pressure', year: 1984 },
      { albumTitle: 'Signals', year: 1982 },
      { albumTitle: 'Moving pictures', year: 1981 },
      { albumTitle: 'Permanent waves', year: 1980 },
      { albumTitle: 'Hemispheres', year: 1978 },
      { albumTitle: 'A farewell to kings', year: 1977 },
      { albumTitle: '2112', year: 1976 },
      { albumTitle: 'Caress of steel', year: 1975 },
      { albumTitle: 'Fly by night', year: 1975 },
      { albumTitle: 'Rush', year: 1974 }
    ];

// all the variables we need for the app    

var list = document.querySelector('ul');
var advance = document.querySelector('.advance');
var useContinue = document.querySelector('.continue');
var useDelete = document.querySelector('.delete');
var update = document.querySelector('.update');
var changeDirection = document.querySelector('.direction');


window.onload = function() {
  // In the following line, you should include the prefixes of implementations you want to test.
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  // DON'T use "var indexedDB = ..." if you're not in a function.
  // Moreover, you may need references to some window.IDB* objects:
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
  // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)

  var DBOpenRequest = window.indexedDB.open('albumLists', 1);
  
  DBOpenRequest.onsuccess = function(event) {
    db = DBOpenRequest.result;
    populateData();
  };
  
  DBOpenRequest.onupgradeneeded = function(event) { 
    var db = event.target.result;
    
    db.onerror = function(event) {
      note.innerHTML += '<li>Error loading database.</li>';
    };
    
    var objectStore = db.createObjectStore('rushAlbumList', { keyPath: 'albumTitle' });  
    objectStore.createIndex('year', 'year', { unique: false });
  };
    
  function populateData() {
    var transaction = db.transaction(['rushAlbumList'], 'readwrite');
    var objectStore = transaction.objectStore('rushAlbumList');
    for(i = 0; i < records.length ; i++) {
      var request = objectStore.put(records[i]);
    };

    transaction.oncomplete = function() {
      displayData();
    };
  };

  useContinue.onclick = function() {
    displayData();
  }

  function displayData() {
    list.innerHTML = '';
    var transaction = db.transaction(['rushAlbumList'], 'readonly');
    var objectStore = transaction.objectStore('rushAlbumList');

    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
        if(cursor) {
          var listItem = document.createElement('li');
          listItem.innerHTML = '<strong>' + cursor.value.albumTitle + '</strong>, ' + cursor.value.year;
          list.appendChild(listItem);  
          
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

  advance.onclick = function() {
      advanceResult();
  };

  function advanceResult() {
    list.innerHTML = '';
    var transaction = db.transaction(['rushAlbumList'], 'readonly');
    var objectStore = transaction.objectStore('rushAlbumList');

    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor) {
        var listItem = document.createElement('li');
        listItem.innerHTML = '<strong>' + cursor.value.albumTitle + '</strong>, ' + cursor.value.year;
        list.appendChild(listItem);  
        cursor.advance(2);         
      } else {
        console.log('Every other entry displayed.');         
      }
    };
  };

  useDelete.onclick = function() {
      deleteResult();
  };

  function deleteResult() {
    list.innerHTML = '';
    var transaction = db.transaction(['rushAlbumList'], 'readwrite');
    var objectStore = transaction.objectStore('rushAlbumList');

    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor) {
        if(cursor.value.albumTitle === 'Grace under pressure') {
          var request = cursor.delete();
          request.onsuccess = function() {
            console.log('Deleted that mediocre album from 1984. Even Power windows is better.');
          };
        } else {
          var listItem = document.createElement('li');
          listItem.innerHTML = '<strong>' + cursor.value.albumTitle + '</strong>, ' + cursor.value.year;
          list.appendChild(listItem);   
        }
        cursor.continue();        
      } else {
        console.log('Entries displayed.');         
      }
    };
  };

  update.onclick = function() {
      updateResult();
  };

  function updateResult() {
    list.innerHTML = '';
    var transaction = db.transaction(['rushAlbumList'], 'readwrite');
    var objectStore = transaction.objectStore('rushAlbumList');

    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if(cursor) {
        if(cursor.value.albumTitle === 'A farewell to kings') {
          var updateData = cursor.value;
          
          updateData.year = 2050;
          var request = cursor.update(updateData);
          request.onsuccess = function() {
            console.log('A better album year?');
          };
        };
        
        var listItem = document.createElement('li');
        listItem.innerHTML = '<strong>' + cursor.value.albumTitle + '</strong>, ' + cursor.value.year;
        list.appendChild(listItem);   
        
        cursor.continue();        
      } else {
        console.log('Entries displayed.');         
      }
    };
  };

  changeDirection.onclick = function() {
    backwards();
  }

  function backwards() {
    list.innerHTML = '';
    var transaction = db.transaction(['rushAlbumList'], 'readonly');
    var objectStore = transaction.objectStore('rushAlbumList');

    objectStore.openCursor(null,'prev').onsuccess = function(event) {
      var cursor = event.target.result;
        if(cursor) {
          var listItem = document.createElement('li');
          listItem.innerHTML = '<strong>' + cursor.value.albumTitle + '</strong>, ' + cursor.value.year;
          list.appendChild(listItem);  
          
          console.log(cursor.direction);
          cursor.continue();
        } else {
          console.log('Entries displayed backwards.');
          
        }
    };

  };

};

