// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

(function(global) {
    "use strict";

    var log = console.log.bind(console);
    var err = console.error.bind(console);

    var noop = function() {};

    var DB_NAME = "cache_polyfill";
    var DB_VERSION = 5;
    // Only dealing in a single object store here for simplicity. Don't really
    // want to deal with version upgrades which would be required for putting
    // each cache in their own store (the obvious model).
    var CACHE_STORE_NAME = "cache";
    var CACHE_LIST_STORE_NAME = "cache_list";

    var opened = false;
    // I still can't believe Mark Miller was allowed to fuck this up.
    var openedResolver;
    var openedRejecter;
    var openedPromise = new Promise(function(res, rej) {
        openedResolver = res;
        openedRejecter = rej;
    });

    var resolveWithTransaction = function(trans, bag) {
        bag = bag || {};
        return new Promise(function(resolve, reject) {
            bag.resolve = trans.oncomplete = resolve;
            bag.reject = trans.onabort = trans.onerror = reject;
        });
    };

    var _makeObjectStores = function(db) {
        var cacheStore = db.createObjectStore(CACHE_STORE_NAME);
        var cacheIndex = cacheStore.createIndex("by_cache", "cache");
        // FIXME: add indexes for URL, method, etc.
        var cacheListStore = db.createObjectStore(CACHE_LIST_STORE_NAME);
        var cacheIndex = cacheListStore.createIndex("by_name", "name");
    };

    var ensureOpen = function(storeName) {
        if (opened) {
            return openedPromise;
        }
        opened = true;

        var openRequest = global.indexedDB.open(DB_NAME, DB_VERSION);
        openRequest.onupgradeneeded = function(e) {
            _makeObjectStores(e.target.result);
        };
        openRequest.onsuccess = function(e) {
            openedResolver(e.target.result);
        };
        openRequest.onfailure = openedRejecter;

        return openedPromise;
    };

    var _openStore = function(policy, storeName) {
        storeName = storeName || CACHE_STORE_NAME;
        policy = policy || "readonly";
        return ensureOpen().then(function(db) {
            return function() {
                return db.transaction([storeName], policy).
                          objectStore(storeName);
            }
        });
    };

    var addCacheToList = function(name) {
        return _openStore("readwrite", CACHE_LIST_STORE_NAME).then(
            function(store) {
                var s = store();
                var request = s.put({ name: name }, name);
                var resovler = {};
                return resolveWithTransaction(s.transaction, resovler);
                request.onsucess = resovler.resolve;
            }
        );
    };

    var removeCacheFromList = function(name) {
        return Promise.all([
            clear(name),
            _openStore("readwrite", CACHE_LIST_STORE_NAME).then(
                function(store) {
                    var s = store();
                    var request = s.delete(name);
                    return resolveWithTransaction(s.transaction);
                }
            )
        ]);
    };

    var isCacheInList = function(name) {
        return get(name, CACHE_LIST_STORE_NAME);
    };

    var getAllCacheNames = function() {
        var result = [];
        return _openStore("readonly", CACHE_LIST_STORE_NAME).then(
            function(store) {
                var s = store();
                return new Promise(function(resolve, reject) {
                    var index = s.index("by_name");
                    var request = index.openCursor();
                    request.onabort = request.onerror = reject;
                    request.onsuccess = function(e) {
                        var cursor = e.target.result;
                        if (!cursor) {
                            resolve(result);
                            return;
                        }
                        result.push(cursor.key);
                        cursor.continue();
                    };
                }
            );
        });
    };


    var writeTo = function(cacheName, key, obj) {
        return _openStore("readwrite").then(function(store) {
            obj.cache = cacheName;
            var s = store();
            var req = s.put(obj, key);
            req.onerror = err;


            return new Promise(function(resolve, reject) {
                s.transaction.oncomplete = resolve;
                s.transaction.onabort = s.transaction.onerror = reject;
            });
        });
    };

    var writeBatchTo = function(cacheName, items) {
        return _openStore("readwrite").then(function(store) {
            var s = store();
            items.forEach(function(item) {
                item.value.cache = cacheName;
                s.put(item.value, item.key);
            });
            return resolveWithTransaction(s.transaction);
        });
    };

    var get = function(key, storeName) {
        var storeName = storeName || CACHE_STORE_NAME;
        return _openStore("readonly", storeName).then(function(store) {
            return new Promise(function(resolve, reject) {
                var request = store().get(key);
                request.onabort = request.onerror = reject;
                request.onsuccess = function(e) {
                    var result = e.target.result;
                    if (result) {
                        resolve(result);
                    } else {
                        reject(e);
                    }
                };
            });
        });
    };

    var getAll = function(cacheName, key) {
        var result = [];
        return _openStore().then(function(store) {
            var s = store();
            return new Promise(function(resolve, reject) {
                var index = s.index("by_cache");
                var request = index.openCursor(IDBKeyRange.only(key));
                request.onabort = request.onerror = reject;
                request.onsuccess = function(e) {
                    var cursor = e.target.result;
                    if (!cursor) {
                        resolve(result);
                        return;
                    }
                    result.push(cursor.value);
                    cursor.continue();
                };
            });
        });
    };

    var _delete = function(key) {
        return _openStore("readwrite").then(function(store) {
            var request = store().delete(key);
            return resolveWithTransaction(request.transaction);
        });
    };

    var iterateOver = function(cacheName, func, scope, mode, value) {
        func = func || noop;
        scope = scope || global;
        mode = mode || "readonly";
        return ensureOpen().then(function(db) {
            return new Promise(function(resolve, reject) {
                var trans = db.transaction([CACHE_STORE_NAME], mode);
                trans.onabort = trans.onerror = reject;
                var store = trans.objectStore(CACHE_STORE_NAME);
                var index = store.index("by_cache");
                var iterateRequest = index.openCursor(
                                        IDBKeyRange.only(cacheName));
                iterateRequest.onerror = reject;
                iterateRequest.onsuccess = function(e) {
                    var cursor = e.target.result;
                    if (!cursor) {
                        resolve(value);
                    }
                    func.call(scope, cursor, cursor.key, cursor.value,
                                     db, store);
                };
            });
        });
    };

    var clear = function(cacheName) {
        return iterateOver(
            cacheName,
            function(cursor, key, value, db, store) {
                store.delete(key);
                cursor.continue();
            },
            this,
            "readwrite"
        );
    };

    var getAllItemsInCache = function(cacheName) {
        var items = [];
        return iterateOver(
            cacheName,
            function(cursor, key, value) {
                if (value.cache != cacheName) {
                    log("getAllItemsInCache error:", value.cache, cacheName);
                }
                items.push(value);
                cursor.continue();
            },
            null,
            null,
            items
        );
    };

    var clearAll = function() {
        return getAllCacheNames().then(function(names) {
            return Promise.all(
                names.map(clear).concat(names.map(removeCacheFromList)));
        });
    };

    var clobber = function() {
        var req = indexedDB.deleteDatabase(DB_NAME);
        return resolveWithTransaction(req);
    };

    ///////////////////////////////////////////////////////////////////////////
    // Export
    global.idbCacheUtils = {
        writeTo: writeTo,
        writeBatchTo: writeBatchTo,
        get: get,
        getAll: getAll,
        getAllItemsInCache: getAllItemsInCache,
        "delete": _delete,
        clear: clear,
        clearAll: clearAll,
        clobber: clobber,
        addCacheToList: addCacheToList,
        removeCacheFromList: removeCacheFromList,
        isCacheInList: isCacheInList,
        getAllCacheNames: getAllCacheNames,
    };

    // Don't bother with Response coercion if we're in an env that can't hack
    // it.
    if (typeof Response == "undefined") { return; }

    var objToResponse = function(obj) {
        var headers = new HeaderMap();
        Object.keys(obj.headers).forEach(function(k) {
            headers.set(k, obj.headers[k]);
        });
        var response = new Response(obj.blob ,{
            status: obj.status,
            statusText: obj.statusText,
            headers: headers,
        });
        // Workaround for property swallowing
        response._url = obj.url;
        response.toBlob = function() {
            return Promise.resolve(obj.blob);
        };
        return response;
    };

    var objFromResponse = function(response) {
        var headers = {};
        response.headers.forEach(function(v, k) {
            headers[k] = v;
        });
        return response.toBlob().then(function(blob) {
            return {
                url: response._url,
                blob: blob,
                status: response.status,
                statusText: response.statusText,
                headers: headers
            };
        });
    };

    var getAsResponse = function() {
        return get.apply(this, arguments).then(objToResponse);
    };

    var getAllAsResponses = function() {
        return getAll.apply(this, arguments).then(function(objs) {
            return Promise.all(objs.map(objToResponse));
        });
    };

    var getAllItemsInCacheAsResponses = function() {
        return getAllItemsInCache.apply(this, arguments).then(
            function(objs) {
                return Promise.all(objs.map(objToResponse));
            }
        );
    };

    var writeResponseTo = function(cacheName, key, response) {
        return objFromResponse(response).then(function(obj) {
            return writeTo(cacheName, key, obj);
        });
    };

    ///////////////////////////////////////////////////////////////////////
    // Export
    global.idbCacheUtils.objToResponse = objToResponse;
    global.idbCacheUtils.objFromResponse = objFromResponse;
    global.idbCacheUtils.getAsResponse = getAsResponse;
    global.idbCacheUtils.getAllAsResponses = getAllAsResponses;
    global.idbCacheUtils.writeResponseTo = writeResponseTo;
    global.idbCacheUtils.getAllItemsInCacheAsResponses =
                                            getAllItemsInCacheAsResponses;
})(this);
