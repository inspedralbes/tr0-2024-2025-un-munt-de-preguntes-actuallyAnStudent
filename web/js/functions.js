const URL = "http://localhost/Projecte_Back/data.json";
fetch(URL)
.then(response => response.json())
.then(data => renderPreguntes(data));

function renderPreguntes(info){
  let strElement = '';
  data = info.preguntes;

  const tauler = document.getElementById("preguntes");
  for (let index = 0; index < data.length; index++) {
    strElement += `<p>${data[index].pregunta}</p><br>`;
    for (let it = 0; it < data[index].respostes.length; it++) {
      //strElement += `<button onclick="verify(${data[index].resposta_correcta},${data[index].respostes[it].id})">${data[index].respostes[it].etiqueta}</button>`;
      strElement += `<button onclick="verify(${index},${it})">${data[index].respostes[it].etiqueta}</button>`;
      //strElement += `<img src="" alt="${data[index].respostes[it].etiqueta} image"><br>`;
    }
  }
  tauler.innerHTML = strElement;
}

/*function play(){
  let estatDeLaPartida = {
    preguntesFetes: [],
    respCorrectes: 0, 
  };


}*/

function verify(itPregunta,respSelec){
  alert("funciona");
}

let time=30;
const timer = document.getElementById("timer");
const interval = setInterval(() => stillPlaying(timer), 1000);

function stillPlaying(place){
  if (time>0) {
    place.innerHTML=time;//no me lo muestra pero el console si
    console.log(time);
    time--;
  }else{
    clearInterval(interval);
    place.innerHTML="time out"
  }
}


/*for (let index = 0; index < data.preguntes.length; index++) {
  strElement = `<p>${data.preguntes[index].pregunta}</p><br>`;
  document.write(strElement);
  let botElement='';
  for (let it = 0; it < data.preguntes[index].respostes.length; it++) {
    botElement = `<button onclick="verify(${data.preguntes[index].resposta_correcta},${data.preguntes[index].respostes[it].id})">${data.preguntes[index].respostes[it].etiqueta}</button>`;
    document.write(botElement);
  }
}*/