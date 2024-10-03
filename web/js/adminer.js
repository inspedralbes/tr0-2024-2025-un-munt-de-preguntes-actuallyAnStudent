let dades;

function start(){
    fetch("../back/admin/getPreguntes.php")
    .then(response => response.json())
    .then(dades => imprimir(dades));
}

function imprimir(data){
    dades=data;
    imprimirHeader();
    imprimirBody(data);
}

function imprimirHeader(){
    const header=document.getElementById("headerTaula");
    let strElement = "";
    strElement += `<tr>`
    strElement += `<th>ID</th>`;
    strElement += `<th>Pregunta</th>`;
    strElement += `<th>Respostes</th>`;
    strElement += `<th>Imatges</th>`;
    strElement += `<th>Resposta Correcta</th>`;
    strElement += `<th>Operacions</th>`;
    strElement += `</tr>`
    header.innerHTML = strElement;
}

function imprimirBody(d){
    const body=document.getElementById("bodyTaula");
    let strElement = "";
    for (let index = 0; index < d.id.length; index++) {
        strElement += `<tr id=${d.id[index]}>`
        strElement += `<td>${d.id[index]}</td>`;
        strElement += `<td>${d.preguntes[index]}</td>`;
        strElement += `<td>${d.respostes[index]}</td>`;
        strElement += `<td>${d.imatgesR[index]}</td>`;
        strElement += `<td>${d.respostesC[index]}</td>`;
        strElement += `<td><button id=${d.id[index]} class="eliminar">Eliminar</button><button id=${d.id[index]} class="editar">Editar</button></td>`;
        strElement += `</tr>`
    }
    body.innerHTML= strElement;
}

function peticioEliminar(idPre){
    fetch("../back/admin/delete.php", {
        method: "POST",
        body: JSON.stringify({idPre}),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())//estas dos no hacen falta ni hacen nada ahora
    .then(data => confirmacioEliminacio(data));//no declarada, podria mostrar la query realizada
}

function crearListener(){
    document.getElementById("bodyTaula").addEventListener('click', (event)=>{
        let id=event.target.id;

        if(event.target.className === "eliminar"){
            peticioEliminar(id);
        }else if (event.target.className === "editar") {
            peticioUpdate(id);
        }
    });

    document.getElementById("crear").addEventListener('click', (event) => {
        if(event.target.id === "crear"){
            peticioCrear();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    start();
    crearListener();
});
