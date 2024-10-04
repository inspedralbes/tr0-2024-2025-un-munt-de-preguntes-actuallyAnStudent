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
        strElement += `<td><button id="eliminar">Eliminar</button><button id="editar">Editar</button></td>`;
        strElement += `</tr>`
    }
    body.innerHTML= strElement;
}

function actualitzarTaula(id){
    const tr = document.getElementById(id);

    if (tr) {
        tr.remove();
        Swal.fire("SweetAlert2 is working!");
    }
}

function peticioEliminar(idTr){
    fetch("../back/admin/delete.php", {
        method: "POST",
        body: JSON.stringify({idTr}),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())//estas dos no hacen falta ni hacen nada ahora
    .then(data => actualitzarTaula(idTr));
}

function peticioCrear(){
    
}

function crearListener(){
    document.getElementById("bodyTaula").addEventListener('click', (event)=>{
        const fila = event.target.closest('tr');

        if(event.target.id === "eliminar"){
            peticioEliminar(fila.id);
        }else if (event.target.id === "editar") {
            peticioUpdate(fila.id);
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
