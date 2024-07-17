let cache;
async function cacheOpen () {
    return cache ?? caches.open("volcanos")
                          .then(cash => cache = cash)
                          .catch(responseError);
}
self.addEventListener("install", evt => {
    evt.waitUntil(cacheOpen().then(() =>
        cache.addAll(["./", "./index.html", "./volcanos.js", "./sw.js"])
             .catch(responseError)
    ));
});
self.addEventListener("fetch", evt => {
    const request = evt.request;
    evt.respondWith(cacheOpen().then(() =>
        cache.match(request).then(match =>
            match ??
            fetch(request.clone()).then(response => {
                cache.put(request, response.clone()).catch(catchError);
                return response;
            }).catch(responseError)
        ).catch(responseError)
    ));
});
self.addEventListener("message", evt => {
    const id = evt.data.id;
    if (id) {                   // home page has no id
        const dir = `./${id}/`;
        const html = `${dir}index.html`;
        cache.match(html).then(response => {
            if (!response) {
                const name = `${dir}${id}`;
                const all = Array.from(
                    {length: evt.data.count},
                    (_, i) => `${name}${i}.jpg`
                );
                all.push(html);
                cache.addAll(all).catch(responseError);
            }
        }).catch(catchError);
    }
});
function catchError(err) {
    console.error(err.stack ?? err);
}
function responseError(err) {
    catchError(err);
    return new Response(
        "Network error",
        {status: 408, headers:{"Content-Type":"text/plain"}}
    );
}