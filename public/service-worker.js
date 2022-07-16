const CACHE_NAME = "budget-tracker-cache-v1"
const DATA_CACHE_NAME = "data-cache-v1"
const FILES_TO_CACHE = [
    "/",
    "../public/index.html",
    "../public/manifest.json",
    "../public/icons/icon-72x72.png",
    "../public/icons/icon-96x96.png",
    "../public/icons/icon-128x128.png",
    "../public/icons/icon-144x144.png",
    "../public/icons/icon-152x152.png",
    "../public/icons/icon-192x192.png",
    "../public/icons/icon-384x384.png",
    "../public/icons/icon-512x512.png",
    "../public/css/styles.css",
    "../public/js/index.js",
    "../public/js/idb.js",
]

// Respond with cached resources
self.addEventListener("fetch", function (evt) {
    console.log("fetch request : " + evt.request.url)
    evt.respondWith(
        caches.match(evt.request).then(function (request) {
            if (request) {
                // if cache is available, respond with cache
                console.log("responding with cache : " + evt.request.url)
                return request
            } else {
                // if there are no cache, try fetching request
                console.log("file is not cached, fetching : " + evt.request.url)
                return fetch(evt.request)
            }
        })
    )
})

// Cache resources
self.addEventListener("install", function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log("installing cache : " + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

// Delete outdated caches
self.addEventListener("activate", function (evt) {
    evt.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX)
            })
            // add current cache name to keeplist
            cacheKeeplist.push(CACHE_NAME)

            return Promise.all(
                keyList.map(function (key, i) {
                    if (cacheKeeplist.indexOf(key) === -1) {
                        console.log("deleting cache : " + keyList[i])
                        return caches.delete(keyList[i])
                    }
                })
            )
        })
    )
})
