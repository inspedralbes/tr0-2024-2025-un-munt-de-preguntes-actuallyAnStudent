let data;
const estatDeLaPartida = 
  {
    contPregunta: 0,
    preguntes: []
  };
const URL = "http://localhost/tr0-2024-2025-un-munt-de-preguntes-actuallyAnStudent/back/data.json";
fetch(URL)
.then(response => response.json())
.then(dades => partida(dades));

function partida(info){
  data = info.preguntes;

  omplirPreguntes();
  imprimirPregunta();
}

function omplirPreguntes(){
  for (let index = 0; index < data.length; index++) {
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

  strElement += `<p>${data[estatDeLaPartida.contPregunta].pregunta}</p><br>`;
  for (let i = 0; i < data[estatDeLaPartida.contPregunta].respostes.length; i++) {
    strElement += `<button class="resposta" onclick="buttonPressed(${i})">${data[estatDeLaPartida.contPregunta].respostes[i].etiqueta}</button>`;
  }
  strElement += `<button id="cancel" class="reset" onclick="resetResposta(${estatDeLaPartida.contPregunta})">Cancel·lar resposta</button>`;
  strElement += `<button class="anterior" onclick="lastQuestion()">Anterior</button>`;
  strElement += `<button class="seguent" onclick="nextQuestion()">Seguent</button>`;
  strElement += `<button class="enviar" onclick="enviar()">Enviar</button>`;//no he hecho la funcion todavia
  tauler.innerHTML = strElement;

  const botones = tauler.querySelectorAll("[class]");
  botones.forEach(boto => {
    verificacions(boto);
  }); 
}

function buttonPressed(idRespSel){
  alert(`Soc la resposta ${data[estatDeLaPartida.contPregunta].respostes[idRespSel].id} de la pregunta ${data[estatDeLaPartida.contPregunta].pregunta}`);
  modificarPreguntes(idRespSel);
  //con el eventListener lo quitare esto de abajo
  const tauler = document.getElementById("partida");
  const botones = tauler.querySelectorAll("[class]");
  botones.forEach(boto => {
    verificacions(boto);
  }); 
}

function modificarPreguntes(idRespSel){
  let pregunta = {
    id: estatDeLaPartida.contPregunta,
    resposta: data[estatDeLaPartida.contPregunta].respostes[idRespSel].id-1
  };
  estatDeLaPartida.preguntes.splice(estatDeLaPartida.contPregunta, 1, pregunta);
}

function resetResposta(){
  let pregunta = {
    id: estatDeLaPartida.contPregunta,
    resposta: -1
  };

  estatDeLaPartida.preguntes.splice(estatDeLaPartida.contPregunta, 1, pregunta);

  //con el eventListener lo quitare esto de abajo
  const tauler = document.getElementById("partida");
  const botones = tauler.querySelectorAll("[class]");
  botones.forEach(boto => {
    verificacions(boto);
  }); 
}

function lastQuestion() {
  estatDeLaPartida.contPregunta--;
  imprimirPregunta();
}

function nextQuestion() {
  estatDeLaPartida.contPregunta++;
  imprimirPregunta();
}

function verificacions(boto){
  if (boto.classList.contains("anterior") && estatDeLaPartida.contPregunta==0) {
    boto.className = "notUsable";
  }
  if (boto.classList.contains("seguent") && estatDeLaPartida.contPregunta==data.length-1) {
    boto.className = "notUsable";
  }
  if (boto.classList.contains("enviar") && estatDeLaPartida.contPregunta!=data.length-1) {
    boto.className = "notUsable";
  }
  if (boto.classList.contains("reset") && estatDeLaPartida.preguntes[estatDeLaPartida.contPregunta].resposta==-1) {
    boto.className = "notUsable";
  }
  if (boto.id === "cancel" && estatDeLaPartida.preguntes[estatDeLaPartida.contPregunta].resposta!=-1) {
    boto.className = "reset";
  }
}

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