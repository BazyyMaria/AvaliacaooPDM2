const btnSalvar = document.getElementById("salvar")
const btnLocalizacao = document.getElementById("localizacao")
const btnLimpar = document.getElementById("limpar")
const nota = document.getElementById("nota")
const humorSelect = document.getElementById("humor")
const registros = document.getElementById("registros")

let latitude = null
let longitude = null


const mapa = L.map("mapa").setView([-23.5, -46.6], 4)

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(mapa)

let marcador = null


btnLocalizacao.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Seu navegador não suporta GPS")
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      latitude = position.coords.latitude
      longitude = position.coords.longitude

      mapa.setView([latitude, longitude], 16)

      if (marcador) {
        mapa.removeLayer(marcador)
      }

      marcador = L.marker([latitude, longitude]).addTo(mapa)
        .bindPopup("Você está aqui 📍")
        .openPopup()
    },
    () => {
      alert("Não foi possível obter sua localização")
    }
  )
})


btnSalvar.addEventListener("click", () => {
  const humor = humorSelect.value
  const texto = nota.value

  if (humor === "" || texto === "") {
    alert("Preencha o humor e a nota")
    return
  }

  if (latitude === null || longitude === null) {
    alert("Clique em 'Salvar localização' primeiro")
    return
  }

  const data = new Date().toLocaleString()

  const registro = {
    humor,
    texto,
    data,
    latitude,
    longitude
  }

  salvarRegistro(registro)
  mostrarRegistro(registro)

  nota.value = ""
  humorSelect.value = ""
})


function salvarRegistro(registro) {
  const lista = JSON.parse(localStorage.getItem("diarioHumor")) || []
  lista.push(registro)
  localStorage.setItem("diarioHumor", JSON.stringify(lista))
}


function mostrarRegistro(registro) {
  const div = document.createElement("div")
  div.classList.add("registro")

  div.innerHTML = `
    <p><strong>${registro.humor}</strong></p>
    <p>${registro.texto}</p>
    <small>${registro.data}</small>
    <p>📍 ${registro.latitude.toFixed(4)}, ${registro.longitude.toFixed(4)}</p>
    <hr>
  `

  registros.prepend(div)
}


function carregarRegistros() {
  const lista = JSON.parse(localStorage.getItem("diarioHumor")) || []

  lista.reverse().forEach((registro) => {
    mostrarRegistro(registro)

    if (!marcador) {
      mapa.setView([registro.latitude, registro.longitude], 12)
      marcador = L.marker([registro.latitude, registro.longitude]).addTo(mapa)
    }
  })
}

carregarRegistros()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.update()
    }
  })
}
// Excluir todos os registros
btnLimpar.addEventListener("click", () => {
  const confirmar = confirm("Tem certeza que quer apagar todos os registros?")
  if (confirmar) {
    localStorage.removeItem("diarioHumor")
    registros.innerHTML = ""
    alert("Todos os registros foram apagados!")
  }
})


