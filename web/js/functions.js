let data;
let time = 30;
let interval;
const estatDeLaPartida =
{
  contPregunta: 0,
  preguntes: []
};

function iniciar(){
  const pagina = document.getElementById("pagina");
  fetch("../back/getPreguntes.php", {
    method: "POST",
    body: JSON.stringify({num: localStorage.getItem("numPreguntes")}),
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(response => response.json())
  .then(dades => {
    partida(dades);
    pagina.className = "pagina";
    document.getElementById("inici").className = "notUsable";
    const timer = document.getElementById("timer");
    timer.style.color = 'black';
    interval = setInterval(() => stillPlaying(timer), 1000);
  })
  .catch(error => {
    alert("Error obtenint les preguntes");
  });
}
  
function partida(info) {
  data = info;

  omplirPreguntes();
  imprimirPregunta();
}

function omplirPreguntes() {
  for (let index = 0; index < data.preguntes.length; index++) {
    let pregunta = {
      id: index,
      resposta: -1
    };
    estatDeLaPartida.preguntes.push(pregunta);
  }
}

function imprimirPregunta() {
  const tauler = document.getElementById("partida");
  let strElement = '';

  strElement += `<p>${data.preguntes[estatDeLaPartida.contPregunta]}</p><br>`;
  strElement += `<div style="display:flex; justify-content:center">`;
  for (let i = 0; i < data.respostesP[estatDeLaPartida.contPregunta].etiqueta.length; i++) {
    strElement += `<div class="rtas">`;
    strElement += `<button id="${i}" class="resposta">${data.respostesP[estatDeLaPartida.contPregunta].etiqueta[i]}</button>`;
    strElement += `<img src="${data.respostesP[estatDeLaPartida.contPregunta].imatge[i]}" alt="image" width="100" height="150"><br>`;
    strElement += `</div>`;
  }
  strElement += `</div>`;
  tauler.innerHTML = strElement;

  const botones = document.getElementById("botons").querySelectorAll("button");
  botones.forEach(boto => {
    boto.className=boto.id;
    verificacions(boto);
  });
}

function modificarPreguntes(idRespSel) {
  let pregunta = {
    id: estatDeLaPartida.contPregunta,
    resposta: idRespSel
  };
  estatDeLaPartida.preguntes.splice(estatDeLaPartida.contPregunta, 1, pregunta);
}

function mostrarResposta(){
  const botoRes = document.getElementById(estatDeLaPartida.preguntes[estatDeLaPartida.contPregunta]["resposta"]);
  if (botoRes) botoRes.style.backgroundColor = "#007BFF";
  /*const tauler = document.getElementById("respostaSelec");
  strElement = `<p>Opcio seleccionada: ${data.respostesP[estatDeLaPartida.contPregunta].etiqueta[estatDeLaPartida.preguntes[estatDeLaPartida.contPregunta].resposta]}</p>`;
  tauler.innerHTML = strElement;*/
}

function resetResposta() {
  let pregunta = {
    id: estatDeLaPartida.contPregunta,
    resposta: -1
  };

  estatDeLaPartida.preguntes.splice(estatDeLaPartida.contPregunta, 1, pregunta);
}

function lastQuestion() {
  estatDeLaPartida.contPregunta--;
}

function nextQuestion() {
  estatDeLaPartida.contPregunta++;
}

function ocultarBotons(){
  const botones = document.getElementById("botons").querySelectorAll("button");
  botones.forEach(boto => {
    boto.className="notUsable";
  });
}

function enviarJSON() {
  const formData = new FormData();
  formData.append("estatDeLaPartida", JSON.stringify(estatDeLaPartida));
  const tauler = document.getElementById("partida");
  let strElement = "";

  fetch("../back/finalitza.php", {
    method: "POST",
    body: formData,
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json()
    })
    .then(response => {
      strElement += `Felicitats ${localStorage.getItem("nomUsuari")}, has respos ${response.respostesCorrectes} bé i ${response.respostesIncorrectes} malament de ${data.preguntes.length}<br>`;
      strElement += `No has respós ${response.noResposes}`;
      strElement += `<br><br><br><br><button class="tornarAJugar">Tornar a jugar</button>`
      tauler.innerHTML = strElement;
    })
    .catch(error => console.log("Error: ", error));
}

function reiniciarPartida() {
  estatDeLaPartida.contPregunta=0;
  estatDeLaPartida.preguntes=[];
  time=30;
  iniciar();
}

function verificacions(boto) {
  if (boto.className === "anterior" && estatDeLaPartida.contPregunta == 0) {
    boto.className = "notUsable";
  }
  if (boto.className === "seguent" && estatDeLaPartida.contPregunta == data.preguntes.length - 1) {
    boto.className = "notUsable";
  }
  if (boto.className === "enviar" && estatDeLaPartida.contPregunta != data.preguntes.length - 1) {
    boto.className = "notUsable";
  }
  if ((boto.className === "reset" || boto.className === "respostaSelec") && estatDeLaPartida.preguntes[estatDeLaPartida.contPregunta].resposta == -1) {
    boto.className = "notUsable";
  }
}

function creacioListener(){
  document.getElementById("pagina").addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      if (event.target.className === "resposta") {
        modificarPreguntes(event.target.id);
      }
      if (event.target.className === "reset") {
        resetResposta();
      }
      if (event.target.className === "seguent") {
        nextQuestion();
      }
      if (event.target.className === "anterior") {
        lastQuestion();
      }
      imprimirPregunta();
      mostrarResposta();
    }
    if (event.target.className === "enviar") {
      ocultarBotons();
      enviarJSON();
      clearInterval(interval);
    }
    if (event.target.className === "tornarAJugar") {
      reiniciarPartida();
    }
  });

  document.getElementById("inici").addEventListener('click', (event) => {
    if (event.target.className === "iniciar") { 
      const nomU = document.getElementById("nom").value.trim();
      const numP = document.getElementById("nPreg").value.trim();
      localStorage.setItem("nomUsuari", nomU);
      localStorage.setItem("numPreguntes", numP);
      
      if (localStorage.getItem("nomUsuari") && localStorage.getItem("numPreguntes")) {
        iniciar();
      }
    }else if (event.target.className === "adminer") {
      window.location.href = './adminer.html';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  creacioListener();
});

function stillPlaying(place) {
  if (time >= 0) {
    if (time<5 ) place.style.color='red';
    else if( time <10 ) place.style.color='orange';
    place.innerHTML = time+"s";
    time--;
  } else {
    ocultarBotons();
    enviarJSON();
    clearInterval(interval);
    place.innerHTML = `time out`;
  }
}