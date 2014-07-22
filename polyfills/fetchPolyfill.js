// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A simple, incomplete implementation of Fetch, intended to facilitate end
// to end serviceworker testing.

// See http://fetch.spec.whatwg.org/#fetch-method

(function (global) {
    "use strict";

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

    // FIXME: Support init argument to fetch.
    var fetch = function(request) {
        request = _castToRequest(request);
        var url = request._url;

        return new Promise(function(resolve, reject) {
            // FIXME: Use extra headers from |request|.
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.open(request.method, url, true /* async */);
            xhr.send(null);
            xhr.onreadystatechange = function() {
                if (xhr.readyState !== 4) return;

                var headers = new HeaderMap();
                xhr.getAllResponseHeaders().split("\n").forEach(function(h) {
                    if (!h || h.indexOf(":") <= 0) { return; }
                    var hn = h.split(":")[0];
                    headers.set(hn, xhr.getResponseHeader(hn));
                });
                var response = new Response(xhr.response ,{
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: headers,
                    url: url,
                    // FIXME: Set response.url when available.
                    // FIXME: Set response.method when available.
                    // FIXME: Set response.body when available.
                });
                // FIXME(slightlyoff): is this wrong WRT to redirect logic?
                response._url = url;
                response.toBlob = function() {
                    return Promise.resolve(xhr.response);
                };

                if (xhr.status === 200) {
                    resolve(response);
                } else {
                    reject(response);
                }
            };
        });
    };

    if (!global.fetch ||
         global.fetch.toString().indexOf("{} [native code] }") == -1) {
        global.fetch = fetch;
    }
}(this));  // window or worker global scope
