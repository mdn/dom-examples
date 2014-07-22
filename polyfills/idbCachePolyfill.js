// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A simple, incomplete implementation of the Cache API, intended to facilitate
// end to end serviceworker testing.

// See https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#cache-objects

// FIXME: Support AbstractResponse/OpaqueResponse correctly.
// FIXME: Serialize the cache.
// FIXME: Bind all function references.
(function(global) {
    "use strict";

    var log = console.log.bind(console);
    var err = console.error.bind(console);

    var _castToRequest = function(item) {
        if (typeof item === 'string') {
            var r = new Request({
                url: item,
            });
            // Workaround for property swallowing
            r._url = item.toString();
            return r;
        } else {
            if (item.url) {
                item._url = item.url;
            }
            return item;
        }
    };

    var _key = function(cn, request) {
        return cn + ":" + request.method + ":" + request._url;
    };

    var Cache = function() {
        this._name = "";
    };

    // FIXME: Should this be in the spec?
    Cache.prototype.keys = function() {
        // FIXME(slightlyoff): we're losing the method differentiation here = \
        return idbCacheUtils.getAllItemsInCache(this._name).then(
            function(items) {
                return items.map(function(i) {
                    return new Request({ url: i.url });
                });
            },
            err
        );
    };

    // FIXME: Implement this.
    Cache.prototype.each = function(callback, scope) {
        var that = this;
        return idbCacheUtils.getAllItemsInCacheAsResponses(this._name).then(
            function(responses) {
                return Promise.all(responses.map(function(response) {
                    var key = new Request({ url: response._url });
                    var value = response;
                    return callback.call(scope||global, value, key, that);
                }));
            }
        );
    };

    Cache.prototype.put = function(request, response) {
        request = _castToRequest(request);
        var cache = this._name;
        return idbCacheUtils.writeResponseTo(cache,
                                             _key(cache, request),
                                             response);
    };

    Cache.prototype.add = function(request) {
        request = _castToRequest(request);
        var put = this.put.bind(this);
        return fetch(request).then(
            function(response) { return put(request, response); },
            err
        );
    };

    // FIXME: Add QueryParams argument.
    Cache.prototype.delete = function(request) {
        return idbCacheUtils.delete(_key(this._name, _castToRequest(request)));
    };

    // FIXME: Add QueryParams argument.
    Cache.prototype.match = function(request) {
        return idbCacheUtils.getAsResponse(
            _key(this._name, _castToRequest(request))
        );
    };

    // FIXME: Implement this.
    Cache.prototype.matchAll = Promise.reject.bind(Promise, 'Cache.prototype.matchAll not implemented.');

    if (!global.Cache ||
         global.Cache.toString().indexOf("{} [native code] }") == -1) {
        global.Cache = Cache;
    }
}(this));  // window or worker global scope.
