let data;
const estatDeLaPartida = 
  {
    contPregunta: 0,
    preguntes: []
  };

  fetch("http://localhost/tr0-2024-2025-un-munt-de-preguntes-actuallyAnStudent/back/getPreguntes.php", {
    method: "POST",
    body: JSON.stringify(10),
    headers: {
      "Content-Type": "application/json",
    },
  })
.then(response => response.json())
.then(dades => partida(dades));

function partida(info){
  data = info;

  omplirPreguntes();
  imprimirPregunta();
}

function omplirPreguntes(){
  for (let index = 0; index < data.preguntes.length; index++) {
    let pregunta = {
      id: index,
      resposta: -1
    };
    estatDeLaPartida.preguntes.push(pregunta);
  }
}

function imprimirPregunta(){
  const tauler = document.getElementById("partida");
  let strElement = '';

  strElement += `<p>${data.preguntes[estatDeLaPartida.contPregunta]}</p><br>`;
  for (let i = 0; i < data.respostesP[estatDeLaPartida.contPregunta].length; i++) {
    strElement += `<button id="${i}" class="resposta">${data.respostesP[estatDeLaPartida.contPregunta][i].etiqueta}</button>`;
  }
  strElement += `<button id="cancel" class="reset">Cancel·lar resposta</button>`;
  strElement += `<button class="anterior">Anterior</button>`;
  strElement += `<button class="seguent">Seguent</button>`;
  strElement += `<button class="enviar">Enviar</button>`;
  tauler.innerHTML = strElement;

  const botones = tauler.querySelectorAll("button");
  botones.forEach(boto => {
    verificacions(boto);
  }); 
}

function modificarPreguntes(idRespSel){
  let pregunta = {
    id: estatDeLaPartida.contPregunta,
    resposta: data.respostesP[estatDeLaPartida.contPregunta][idRespSel].id-1
  };
  estatDeLaPartida.preguntes.splice(estatDeLaPartida.contPregunta, 1, pregunta);
}

function resetResposta(){
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

function enviarJSON(){
  const tauler = document.getElementById("partida");
  let strElement = "";
  fetch("http://localhost/tr0-2024-2025-un-munt-de-preguntes-actuallyAnStudent/back/finalitza.php", {
    method: "POST",
    body: JSON.stringify(estatDeLaPartida),
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json()})
  .then(response => {
    console.log(response);
    strElement += `Felicitats, has respos ${response.respostesCorectes} de ${response.totalRespostes}`;
    tauler.innerHTML=strElement;
  })
  .catch(error => console.log("Error: ", error));
  
  clearInterval(interval);
}

function verificacions(boto){
  if (boto.className==="anterior" && estatDeLaPartida.contPregunta==0) {
    boto.className = "notUsable";
  }
  if (boto.className==="seguent" && estatDeLaPartida.contPregunta==data.length-1) {
    boto.className = "notUsable";
  }
  /*if (boto.className==="enviar" && estatDeLaPartida.contPregunta!=data.length-1) {
    boto.className = "notUsable";
  }*/
  if (boto.className==="reset" && estatDeLaPartida.preguntes[estatDeLaPartida.contPregunta].resposta==-1) {
    boto.className = "notUsable";
  }
  if (boto.id === "cancel" && estatDeLaPartida.preguntes[estatDeLaPartida.contPregunta].resposta!=-1) {
    boto.className = "reset";
  }
}

document.getElementById("partida").addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    if(event.target.className==="resposta"){
      modificarPreguntes(event.target.id);
    }
    if(event.target.className==="reset"){
      resetResposta();
    }
    if(event.target.className==="seguent"){
      nextQuestion();
    }
    if(event.target.className==="anterior"){
      lastQuestion();
    }
    imprimirPregunta();
  }
  if(event.target.className==="enviar"){
    enviarJSON();
  }
});

let time=30;
const timer = document.getElementById("timer");
const interval = setInterval(() => stillPlaying(timer), 1000);

function stillPlaying(place){
  if (time>0) {
    place.innerHTML=time;
    console.log(time);
    time--;
  }else{
    clearInterval(interval);
    place.innerHTML="time out"
  }
}