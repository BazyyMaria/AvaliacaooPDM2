const btnSalvar = document.getElementById("salvar");
const btnLocalizacao = document.getElementById("localizacao");
const btnLimpar = document.getElementById("limpar");
const descricaoInput = document.getElementById("descricao"); // input para descrição
const registros = document.getElementById("registros");

let latitude = null;
let longitude = null;

const mapa = L.map("mapa").setView([-23.5, -46.6], 4);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(mapa);

let marcador = null;

// mensagem de que o mapa não carrega offline
const mapaOffline = document.getElementById("mapaOffline");

function verificarConexao() {
  if (navigator.onLine) {
    mapaOffline.style.display = "none";
    mapa.getContainer().style.display = "block";
  } else {
    mapaOffline.style.display = "block";
    mapa.getContainer().style.display = "none";
  }
}

verificarConexao();
window.addEventListener("online", verificarConexao);
window.addEventListener("offline", verificarConexao);

// botão para pegar GPS
btnLocalizacao.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Seu navegador não suporta GPS");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;

      mapa.setView([latitude, longitude], 16);

      if (marcador) {
        mapa.removeLayer(marcador);
      }

      marcador = L.marker([latitude, longitude]).addTo(mapa)
        .bindPopup("Você está aqui 📍")
        .openPopup();
    },
    () => {
      alert("Não foi possível obter sua localização");
    }
  );
});

// botão salvar registro
btnSalvar.addEventListener("click", () => {
  const descricao = descricaoInput.value.trim();

  if (!descricao) {
    alert("Digite uma descrição para o local");
    return;
  }

  if (latitude === null || longitude === null) {
    alert("Clique em 'Salvar localização' primeiro");
    return;
  }

  const data = new Date().toLocaleString();

  const registro = {
    descricao,
    data,
    latitude,
    longitude
  };

  salvarRegistro(registro);
  mostrarRegistro(registro);

  descricaoInput.value = "";
});

function salvarRegistro(registro) {
  const lista = JSON.parse(localStorage.getItem("lugaresVisitados")) || [];
  lista.push(registro);
  localStorage.setItem("lugaresVisitados", JSON.stringify(lista));
}

function mostrarRegistro(registro) {
  const div = document.createElement("div");
  div.classList.add("registro");

  div.innerHTML = `
    <p><strong>${registro.descricao}</strong></p>
    <small>${registro.data}</small>
    <p>📍 ${registro.latitude.toFixed(4)}, ${registro.longitude.toFixed(4)}</p>
    <hr>
  `;

  registros.prepend(div);

  // adiciona marcador no mapa
  L.marker([registro.latitude, registro.longitude]).addTo(mapa)
    .bindPopup(registro.descricao);
}

function carregarRegistros() {
  const lista = JSON.parse(localStorage.getItem("lugaresVisitados")) || [];

  lista.reverse().forEach((registro) => {
    mostrarRegistro(registro);
  });
}

carregarRegistros();

// botão excluir todos os registros
btnLimpar.addEventListener("click", () => {
  if (confirm("Tem certeza que quer apagar todos os registros?")) {
    localStorage.removeItem("lugaresVisitados");
    registros.innerHTML = "";
    alert("Todos os registros foram apagados!");
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.update();
    }
  });
}
