// create a reference to the notifications list in the bottom of the app; we will write database messages into this list by
//appending list items on to the inner HTML of this variable - this is all the lines that say note.innerHTML += '<li>foo</li>';
var note = document.getElementById('notifications');

// create an instance of a db object for us to store the IDB data in
var db;

// create a blank instance of the object that is used to transfer data into the IDB. This is mainly for reference
var newItem = [
      { taskTitle: "", hours: 0, minutes: 0, day: "", month: "", year: 0 }
    ];

// all the variables we need for the app    
var taskList = document.getElementById('task-list');

var taskForm = document.getElementById('task-form');
var title = document.getElementById('title');

var hours = document.getElementById('deadline-hours');
var minutes = document.getElementById('deadline-minutes');
var day = document.getElementById('deadline-day');
var month = document.getElementById('deadline-month');
var year = document.getElementById('deadline-year');

var submit = document.getElementById('submit');

window.onload = function() {
  note.innerHTML += '<li>App initialised.</li>';
  // In the following line, you should include the prefixes of implementations you want to test.
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  // DON'T use "var indexedDB = ..." if you're not in a function.
  // Moreover, you may need references to some window.IDB* objects:
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
  // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)


  // Let us open our database
  var request = window.indexedDB.open("toDoList", 4);

  // these two event handlers act on the database being opened successfully, or not
  request.onerror = function(event) {
    note.innerHTML += '<li>Error loading database.</li>';
  };
  
  request.onsuccess = function(event) {
    note.innerHTML += '<li>Database initialised.</li>';
    
    // store the result of grabbing all the data from the database in the db variable. This is used a lot below
    db = request.result;
    
    // Run the displayData() function to populate the task list with all the to-do list data already in the IDB
    displayData();
  };
  
  // This event handles the event whereby a new version of the database needs to be created
  // Either one has not been created before, or a new version number has been submitted via the
  // window.indexedDB.open line above
  //it is only implemented in recent browsers
  request.onupgradeneeded = function(event) { 
    var db = event.target.result;
    
    db.onerror = function(event) {
      note.innerHTML += '<li>Error loading database.</li>';
    };

    // Create an objectStore for this database
    
    var objectStore = db.createObjectStore("toDoList", { keyPath: "taskTitle" });
    
    // define what data items the objectStore will contain
    
    objectStore.createIndex("hours", "hours", { unique: false });
    objectStore.createIndex("minutes", "minutes", { unique: false });
    objectStore.createIndex("day", "day", { unique: false });
    objectStore.createIndex("month", "month", { unique: false });
    objectStore.createIndex("year", "year", { unique: false });
    
    note.innerHTML += '<li>Object store created.</li>';
  };
    
  function displayData() {
    // first clear the content of the task list so that you don't get a huge long list of duplicate stuff each time
    //the display is updated.
    taskList.innerHTML = "";
  
    // Open our object store and then get a cursor list of all the different data items in the IDB to iterate through
    var objectStore = db.transaction('toDoList').objectStore('toDoList');
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
        // if there is still another cursor to go, keep runing this code
        if(cursor) {
          // create a list item to put each data item inside when displaying it
          var listItem = document.createElement('li');
          
          // check which suffix the deadline day of the month needs
          if(cursor.value.day == 1 || cursor.value.day == 21 || cursor.value.day == 31) {
            daySuffix = "st";
          } else if(cursor.value.day == 2 || cursor.value.day == 22) {
            daySuffix = "nd";
          } else if(cursor.value.day == 3 || cursor.value.day == 23) {
            daySuffix = "rd";
          } else {
            daySuffix = "th";  
          }
          
          // build the to-do list entry and put it into the list item via innerHTML.
          listItem.innerHTML = cursor.value.taskTitle + ' — ' + cursor.value.hours + ':' + cursor.value.minutes + ', ' + cursor.value.month + ' ' + cursor.value.day + daySuffix + ' ' + cursor.value.year + '.';
          
          // put the item item inside the task list
          taskList.appendChild(listItem);  
          
          // create a delete button inside each list item, giving it an event handler so that it runs the deleteButton()
          // function when clicked
          var deleteButton = document.createElement('button');
          listItem.appendChild(deleteButton);
          deleteButton.innerHTML = 'X';
          // here we are setting a data attribute on our delete button to say what task we want deleted if it is clicked! 
          deleteButton.setAttribute('data-task', cursor.value.taskTitle);
          deleteButton.onclick = function(event) {
            deleteItem(event);
          }
          
          // continue on to the next item in the cursor
          cursor.continue();
        
        // if there are no more cursor items to iterate through, say so, and exit the function 
        } else {
          note.innerHTML += '<li>Entries all displayed.</li>';
      }
    }
  }
  
  // give the form submit button an event listener so that when the form is submitted the addData() function is run
  taskForm.addEventListener('submit',addData,false);
  
  function addData(e) {
    // prevent default - we don't want the form to submit in the conventional way
    e.preventDefault();
    
    // Stop the form submitting if any values are left empty. This is just for browsers that don't support the HTML5 form
    // required attributes
    if(title.value == '' || hours.value == null || minutes.value == null || day.value == '' || month.value == '' || year.value == null) {
      note.innerHTML += '<li>Data not submitted — form incomplete.</li>';
      return;
    } else {
      
      // grab the values entered into the form fields and store them in an object ready for being inserted into the IDB
      var newItem = [
        { taskTitle: title.value, hours: hours.value, minutes: minutes.value, day: day.value, month: month.value, year: year.value }
      ];

      // open a read/write db transaction, ready for adding the data
      var transaction = db.transaction(["toDoList"], "readwrite");
    
      // report on the success of opening the transaction
      transaction.oncomplete = function(event) {
        note.innerHTML += '<li>Transaction opened for task addition.</li>';
      };

      transaction.onerror = function(event) {
        note.innerHTML += '<li>Transaction not opened due to error. Duplicate items not allowed.</li>';
      };

      // create an object store on the transaction
      var objectStore = transaction.objectStore("toDoList");
      // add our newItem object to the object store
      var request = objectStore.add(newItem[0]);        
        request.onsuccess = function(event) {
          // if the addition was successful, build a date object out of our form field entries
          var date = new Date(month.value + " " + day.value + ", " + year.value + " " + hours.value + ":" + minutes.value + ":00");
          
          
          // If alarms are supported and permissions defined in manifest,run the scheduleAlarm function, which
          // sets an alarm at that date and time
          if(navigator.mozAlarms && navigator.mozAlarms !== null) {
            scheduleAlarm(title.value,date);
          }
          
          // report the success of our new item going into the database
          note.innerHTML += '<li>New item added to database.</li>';
          
          // clear the form, ready for adding the next entry
          title.value = '';
          hours.value = null;
          minutes.value = null;
          day.value = 01;
          month.value = 'January';
          year.value = 2020;
          
        };
         
      };
      
      // update the display of data to show the newly added item, by running displayData() again.
      displayData(); 
    };
  
  function deleteItem(event) {
    // retrieve the name of the task we want to delete 
    var dataTask = event.target.getAttribute('data-task');
    
    // delete the parent of the button, which is the list item, so it no longer is displayed
    event.target.parentNode.parentNode.removeChild(event.target.parentNode);
    
    // open a database transaction and delete the task, finding it by the name we retrieved above
    var request = db.transaction(["toDoList"], "readwrite").objectStore("toDoList").delete(dataTask);
    
    // report that the data item has been deleted
    request.onsuccess = function(event) {
      note.innerHTML += '<li>Task \"' + dataTask + '\" deleted.</li>';
    };
    
  }
  
  // this function checks whether the deadline for each task is up or not, and responds appropriately
  function checkDeadlines() {
    
    // grab the time and date right now 
    var now = new Date();
    
    // from the now variable, store the current minutes, hours, day of the month (getDate is needed for this, as getDay 
    // returns the day of the week, 1-7), month, year (getFullYear needed; getYear is deprecated, and returns a weird value
    // that is not much use to anyone!) and seconds
    var minuteCheck = now.getMinutes();
    var hourCheck = now.getHours();
    var dayCheck = now.getDate();
    var monthCheck = now.getMonth();
    var yearCheck = now.getFullYear();
    var secondsCheck = now.getSeconds();
     
    // again, open a transaction then a cursor to iterate through all the data items in the IDB   
    var objectStore = db.transaction(['toDoList'], "readwrite").objectStore('toDoList');
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
        if(cursor) {
        
        // convert the month names we have installed in the IDB into a month number that JavaScript will understand. 
        // The JavaScript date object creates month values as a number between 0 and 11.
        switch(cursor.value.month) {
          case "January":
            var monthNumber = 0;
            break;
          case "February":
            var monthNumber = 1;
            break;
          case "March":
            var monthNumber = 2;
            break;
          case "April":
            var monthNumber = 3;
            break;
          case "May":
            var monthNumber = 4;
            break;
          case "June":
            var monthNumber = 5;
            break;
          case "July":
            var monthNumber = 6;
            break;
          case "August":
            var monthNumber = 7;
            break;
          case "September":
            var monthNumber = 8;
            break;
          case "October":
            var monthNumber = 9;
            break;
          case "November":
            var monthNumber = 10;
            break;
          case "December":
            var monthNumber = 11;
            break;
          default:
          alert('Incorrect month entered in database.');
        }
          // check if the current hours, minutes, day, month and year values match the stored values for each task in the IDB.
          // The + operator in this case converts numbers with leading zeros into their non leading zero equivalents, so e.g.
          // 09 -> 9. This is needed because JS date number values never have leading zeros, but our data might.
          // The secondsCheck = 0 check is so that you don't get duplicate notifications for the same task. The notification
          // will only appear when the seconds is 0, meaning that you won't get more than one notification for each task
          if(+(cursor.value.hours) == hourCheck && +(cursor.value.minutes) == minuteCheck && +(cursor.value.day) == dayCheck && monthNumber == monthCheck && cursor.value.year == yearCheck && secondsCheck == 0) {
            
            // If the numbers all do match, run the createNotification() function to create a system notification
            createNotification(cursor.value.taskTitle);
          }
          
          // move on and perform the same deadline check on the next cursor item
          cursor.continue();
        }
        
    }
    
  }
  
  
  // Function for scheduling alarms, on systems that do support the alarm API
  function scheduleAlarm(title,date) {
    // arbitrary alarm data. Here I'm just including the title in case we want to use it some way later
    var data = {
      alarmTitle: title
    }
    
    // only add the alarm if alarm api is supported and mozAlarms property is not null, meaning the app is installed
    //  and permissions to use it defined in the manifest.webapp file
    if(navigator.mozAlarms && navigator.mozAlarms !== null) {
      var request = navigator.mozAlarms.add(date, "honorTimezone", data);
    }
  }
  
  // function for creating the notification
  function createNotification(title) {

    // Let's check if the browser supports notifications
    if (!"Notification" in window) {
      alert("This browser does not support desktop notification");
    }

    // Let's check if the user is okay to get some notification
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification('HEY! Your task "' + title + '" is now overdue.');
      window.navigator.vibrate(500);
    }

    // Otherwise, we need to ask the user for permission
    // Note, Chrome does not implement the permission static property
    // So we have to check for NOT 'denied' instead of 'default'
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {

        // Whatever the user answers, we make sure Chrome stores the information
        if(!('permission' in Notification)) {
          Notification.permission = permission;
        }

        // If the user is okay, let's create a notification
        if (permission === "granted") {
          var notification = new Notification('HEY! Your task "' + title + '" is now overdue.');
          window.navigator.vibrate(500);
        }
      });
    }

    // At last, if the user already denied any notification, and you 
    // want to be respectful there is no need to bother him any more.
  }
  
  // using a setInterval to run the checkDeadlines() function every second
  setInterval(checkDeadlines, 1000);
}