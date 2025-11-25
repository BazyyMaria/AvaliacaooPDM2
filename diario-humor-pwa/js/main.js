import { salvarHumor, listarHumores, removerHumor } from './db.js'

let lat = null
let lng = null
let map

document.getElementById('localizacao').onclick = () => {
  navigator.geolocation.getCurrentPosition(pos => {
    lat = pos.coords.latitude
    lng = pos.coords.longitude

    map = L.map('mapa').setView([lat, lng], 15)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      .addTo(map)

    L.marker([lat, lng]).addTo(map)
      .bindPopup('Você estava aqui')
      .openPopup()
  })
}

document.getElementById('salvar').onclick = async () => {
  const emoji = document.getElementById('emoji').value
  const nota = document.getElementById('nota').value
  const data = new Date().toLocaleDateString()

  await salvarHumor({ emoji, nota, data, lat, lng })

  carregar()
}

async function carregar() {
  const lista = document.getElementById('lista')
  lista.innerHTML = ''

  const registros = await listarHumores()

  registros.forEach(r => {
    const li = document.createElement('li')
    li.innerHTML = `
      ${r.emoji} - ${r.nota} (${r.data})
      <button data-id="${r.id}">❌</button>
    `

    li.querySelector('button').onclick = async () => {
      await removerHumor(r.id)
      carregar()
    }

    lista.appendChild(li)
  })
}

carregar()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
