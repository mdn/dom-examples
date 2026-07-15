(function () {
  const DB_NAME = 'mdn-demo-indexeddb-epublications';
  const DB_VERSION = 1; // Use a long long for this value (don't use a float)
  const DB_STORE_NAME = 'publications';

  var db;

  // Used to keep track of which view is displayed to avoid uselessly reloading it
  var current_view_pub_key;

  function openDb() {
    console.log("openDb ...");
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function (evt) {
      // Equal to: db = req.result;
      db = this.result;
      console.log("openDb DONE");
    };
    req.onerror = function (evt) {
      console.error("openDb:", evt.target.errorCode);
    };

    req.onupgradeneeded = function (evt) {
      console.log("openDb.onupgradeneeded");
      var store = evt.currentTarget.result.createObjectStore(
        DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });

      store.createIndex('biblioid', 'biblioid', { unique: true });
      store.createIndex('title', 'title', { unique: false });
      store.createIndex('year', 'year', { unique: false });
    };
  }

  /**
   * @param {string} store_name
   * @param {string} mode either "readonly" or "readwrite"
   */
  function getObjectStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
  }

  function clearObjectStore() {
    var store = getObjectStore(DB_STORE_NAME, 'readwrite');
    var req = store.clear();
    req.onsuccess = function(evt) {
      displayActionSuccess("Store cleared");
      displayPubList(store);
    };
    req.onerror = function (evt) {
      console.error("clearObjectStore:", evt.target.errorCode);
      displayActionFailure(this.error);
    };
  }

  function getBlob(key, store, success_callback) {
    var req = store.get(key);
    req.onsuccess = function(evt) {
      var value = evt.target.result;
      if (value)
        success_callback(value.blob);
    };
  }

  /**
   * @param {IDBObjectStore=} store
   */
  function displayPubList(store) {
    console.log("displayPubList");

    if (typeof store == 'undefined')
      store = getObjectStore(DB_STORE_NAME, 'readonly');

    var pub_msg = document.querySelector('#pub-msg');
    pub_msg.replaceChildren();
    var pub_list = document.querySelector('#pub-list');
    pub_list.replaceChildren();
    // Resetting the iframe so that it doesn't display previous content
    newViewerFrame();

    var req;
    req = store.count();
    // Requests are executed in the order in which they were made against the
    // transaction, and their results are returned in the same order.
    // Thus the count text below will be displayed before the actual pub list
    // (not that it is algorithmically important in this case).
    req.onsuccess = function(evt) {
      var countMessage = document.createElement('p');
      countMessage.append('There are ');
      var count = document.createElement('strong');
      count.textContent = evt.target.result;
      countMessage.append(count, ' record(s) in the object store.');
      pub_msg.append(countMessage);
    };
    req.onerror = function(evt) {
      console.error("add error", this.error);
      displayActionFailure(this.error);
    };

    var i = 0;
    req = store.openCursor();
    req.onsuccess = function(evt) {
      var cursor = evt.target.result;

      // If the cursor is pointing at something, ask for the data
      if (cursor) {
        console.log("displayPubList cursor:", cursor);
        const key = cursor.key;
        req = store.get(key);
        req.onsuccess = function (evt) {
          var value = evt.target.result;
          var list_item = document.createElement('li');
          list_item.textContent = '[' + key + '] ' +
                                  '(biblioid: ' + value.biblioid + ') ' +
                                  value.title;
          if (value.year != null)
            list_item.append(' - ', value.year);

          if (value.hasOwnProperty('blob') &&
              typeof value.blob != 'undefined') {
            var link = document.createElement('a');
            link.setAttribute('href', key);
            link.textContent = 'File';
            link.addEventListener('click', function(evt) {
              evt.preventDefault();
            });
            link.addEventListener('mouseenter', function(evt) {
              setInViewer(evt.currentTarget.getAttribute('href'));
            });
            list_item.append(' / ');
            list_item.append(link);
          } else {
            list_item.append(" / No attached file");
          }
          pub_list.append(list_item);
        };

        // Move on to the next object in store
        cursor.continue();

        // This counter serves only to create distinct ids
        i++;
      } else {
        console.log("No more entries");
      }
    };
  }

  function newViewerFrame() {
    var viewer = document.querySelector('#pub-viewer');
    viewer.replaceChildren();
    var iframe = document.createElement('iframe');
    viewer.append(iframe);
    return iframe;
  }

  function setPageCursor(cursor) {
    document.querySelectorAll('*').forEach(function(element) {
      element.style.cursor = cursor;
    });
  }

  function setInViewer(key) {
    console.log("setInViewer:", arguments);
    key = Number(key);
    if (key == current_view_pub_key)
      return;

    current_view_pub_key = key;

    var store = getObjectStore(DB_STORE_NAME, 'readonly');
    getBlob(key, store, function(blob) {
      console.log("setInViewer blob:", blob);
      var iframe = newViewerFrame();

      // It is not possible to set a direct link to the
      // blob to provide a mean to directly download it.
      if (blob.type == 'text/html') {
        var reader = new FileReader();
        reader.onload = function(evt) {
          var html = evt.target.result;
          iframe.addEventListener('load', function() {
            iframe.contentDocument.documentElement.innerHTML = html;
          }, { once: true });
          iframe.src = 'about:blank';
        };
        reader.readAsText(blob);
      } else if (blob.type.indexOf('image/') == 0) {
        iframe.addEventListener('load', function() {
          var img_id = 'image-' + key;
          var img = iframe.contentDocument.createElement('img');
          img.id = img_id;
          iframe.contentDocument.body.replaceChildren(img);
          var obj_url = window.URL.createObjectURL(blob);
          // Ensure the image loads before revoking its url.
          img.addEventListener('load', function() {
            window.URL.revokeObjectURL(obj_url);
          });
          img.src = obj_url;
        }, { once: true });
        iframe.src = 'about:blank';
      } else if (blob.type == 'application/pdf') {
        setPageCursor('wait');
        var obj_url = window.URL.createObjectURL(blob);
        iframe.addEventListener('load', function() {
          setPageCursor('auto');
          window.URL.revokeObjectURL(obj_url);
        }, { once: true });
        iframe.src = obj_url;
      } else {
        iframe.addEventListener('load', function() {
          iframe.contentDocument.body.textContent = "No view available";
        }, { once: true });
        iframe.src = 'about:blank';
      }

    });
  }

  /**
   * @param {string} biblioid
   * @param {string} title
   * @param {number} year
   * @param {string} url the URL of the image to download and store in the local
   *   IndexedDB database. The resource behind this URL is subjected to the
   *   "Same origin policy", thus for this method to work, the URL must come from
   *   the same origin as the web site/app this code is deployed on.
   */
  function addPublicationFromUrl(biblioid, title, year, url) {
    console.log("addPublicationFromUrl:", arguments);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    // Setting the wanted responseType to "blob"
    // http://www.w3.org/TR/XMLHttpRequest2/#the-response-attribute
    xhr.responseType = 'blob';
    xhr.onload = function (evt) {
      if (xhr.status == 200) {
        console.log("Blob retrieved");
        var blob = xhr.response;
        console.log("Blob:", blob);
        addPublication(biblioid, title, year, blob);
      } else {
        console.error("addPublicationFromUrl error:",
        xhr.responseText, xhr.status);
      }
    };
    xhr.send();
  }

  /**
   * @param {string} biblioid
   * @param {string} title
   * @param {number} year
   * @param {Blob=} blob
   */
  function addPublication(biblioid, title, year, blob) {
    console.log("addPublication arguments:", arguments);
    var obj = { biblioid: biblioid, title: title, year: year };
    if (typeof blob != 'undefined')
      obj.blob = blob;

    var store = getObjectStore(DB_STORE_NAME, 'readwrite');
    var req;
    try {
      req = store.add(obj);
    } catch (e) {
      if (e.name == 'DataCloneError')
        displayActionFailure("This engine doesn't know how to clone a Blob, " +
                             "use Firefox");
      throw e;
    }
    req.onsuccess = function (evt) {
      console.log("Insertion in DB successful");
      displayActionSuccess();
      displayPubList(store);
    };
    req.onerror = function() {
      console.error("addPublication error", this.error);
      displayActionFailure(this.error);
    };
  }

  /**
   * @param {string} biblioid
   */
  function deletePublicationFromBib(biblioid) {
    console.log("deletePublication:", arguments);
    var store = getObjectStore(DB_STORE_NAME, 'readwrite');
    var req = store.index('biblioid');
    req.get(biblioid).onsuccess = function(evt) {
      if (typeof evt.target.result == 'undefined') {
        displayActionFailure("No matching record found");
        return;
      }
      deletePublication(evt.target.result.id, store);
    };
    req.onerror = function (evt) {
      console.error("deletePublicationFromBib:", evt.target.errorCode);
    };
  }

  /**
   * @param {number} key
   * @param {IDBObjectStore=} store
   */
  function deletePublication(key, store) {
    console.log("deletePublication:", arguments);

    if (typeof store == 'undefined')
      store = getObjectStore(DB_STORE_NAME, 'readwrite');

    // As per spec http://www.w3.org/TR/IndexedDB/#object-store-deletion-operation
    // the result of the Object Store Deletion Operation algorithm is
    // undefined, so it's not possible to know if some records were actually
    // deleted by looking at the request result.
    var req = store.get(key);
    req.onsuccess = function(evt) {
      var record = evt.target.result;
      console.log("record:", record);
      if (typeof record == 'undefined') {
        displayActionFailure("No matching record found");
        return;
      }
      // Warning: The exact same key used for creation needs to be passed for
      // the deletion. If the key was a Number for creation, then it needs to
      // be a Number for deletion.
      var deleteReq = store.delete(key);
      deleteReq.onsuccess = function(evt) {
        console.log("evt:", evt);
        console.log("evt.target:", evt.target);
        console.log("evt.target.result:", evt.target.result);
        console.log("delete successful");
        displayActionSuccess("Deletion successful");
        displayPubList(store);
      };
      deleteReq.onerror = function (evt) {
        console.error("deletePublication:", evt.target.errorCode);
      };
    };
    req.onerror = function (evt) {
      console.error("deletePublication:", evt.target.errorCode);
    };
  }

  function displayActionSuccess(msg) {
    msg = typeof msg != 'undefined' ? "Success: " + msg : "Success";
    var status = document.querySelector('#msg');
    var statusMessage = document.createElement('span');
    statusMessage.className = 'action-success';
    statusMessage.textContent = msg;
    status.replaceChildren(statusMessage);
  }
  function displayActionFailure(msg) {
    msg = typeof msg != 'undefined' ? "Failure: " + msg : "Failure";
    var status = document.querySelector('#msg');
    var statusMessage = document.createElement('span');
    statusMessage.className = 'action-failure';
    statusMessage.textContent = msg;
    status.replaceChildren(statusMessage);
  }
  function resetActionStatus() {
    console.log("resetActionStatus ...");
    document.querySelector('#msg').replaceChildren();
    console.log("resetActionStatus DONE");
  }

  function addEventListeners() {
    console.log("addEventListeners");

    document.querySelector('#register-form-reset').addEventListener('click', function() {
      resetActionStatus();
    });

    document.querySelector('#add-button').addEventListener('click', function() {
      console.log("add ...");
      var title = document.querySelector('#pub-title').value;
      var biblioid = document.querySelector('#pub-biblioid').value;
      if (!title || !biblioid) {
        displayActionFailure("Required field(s) missing");
        return;
      }
      var year = document.querySelector('#pub-year').value;
      if (year != '') {
        // Better use Number.isInteger if the engine has EcmaScript 6
        if (isNaN(year))  {
          displayActionFailure("Invalid year");
          return;
        }
        year = Number(year);
      } else {
        year = null;
      }

      var file_input = document.querySelector('#pub-file');
      var selected_file = file_input.files[0];
      console.log("selected_file:", selected_file);
      // Keeping a reference on how to reset the file input in the UI once we
      // have its value, but instead of doing that we rather use a "reset" type
      // input in the HTML form.
      //file_input.value = '';
      var file_url = document.querySelector('#pub-file-url').value;
      if (selected_file) {
        addPublication(biblioid, title, year, selected_file);
      } else if (file_url) {
        addPublicationFromUrl(biblioid, title, year, file_url);
      } else {
        addPublication(biblioid, title, year);
      }

    });

    document.querySelector('#delete-button').addEventListener('click', function() {
      console.log("delete ...");
      var biblioid = document.querySelector('#pub-biblioid-to-delete').value;
      var key = document.querySelector('#key-to-delete').value;

      if (biblioid != '') {
        deletePublicationFromBib(biblioid);
      } else if (key != '') {
        // Better use Number.isInteger if the engine has EcmaScript 6
        if (key == '' || isNaN(key))  {
          displayActionFailure("Invalid key");
          return;
        }
        key = Number(key);
        deletePublication(key);
      }
    });

    document.querySelector('#clear-store-button').addEventListener('click', function() {
      clearObjectStore();
    });

    var search_button = document.querySelector('#search-list-button');
    search_button.addEventListener('click', function() {
      displayPubList();
    });

  }

  openDb();
  addEventListeners();

})(); // Immediately-Invoked Function Expression (IIFE)
