self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('humor-cache').then(cache => {
      return cache.addAll(['/', '/index.html', '/style.css'])
    })
  )
})
