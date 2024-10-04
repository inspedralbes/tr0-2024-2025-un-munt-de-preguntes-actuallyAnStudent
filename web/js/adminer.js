document.addEventListener('DOMContentLoaded', () => {
    start();
    crearListener();
});

function crearListener(){
    document.getElementById("bodyTaula").addEventListener('click', (event)=>{
        const fila = event.target.closest('tr');

        if(event.target.className === "eliminar"){
            confirmacioEliminacio(fila);
        }else if (event.target.className === "editar") {
            peticioUpdate(fila.id);
        }
    });

    document.getElementById("crear").addEventListener('click', (event) => {
        document.getElementById("divInsert").className="divInsert";
    });

    document.getElementById("insert").addEventListener('click', (event) => {
        const dadesP = {
            enunciat: document.getElementById("enunciatPregunta").value.trim(),
            respCorrecta: document.getElementById("respostaCorrecta").value.trim(),
            imatge: [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKgvmJ8Oz3pJmypAHKuOuXvfR5_iRg3rNJMQ&s",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKgvmJ8Oz3pJmypAHKuOuXvfR5_iRg3rNJMQ&s",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKgvmJ8Oz3pJmypAHKuOuXvfR5_iRg3rNJMQ&s",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKgvmJ8Oz3pJmypAHKuOuXvfR5_iRg3rNJMQ&s"
            ],
            resposta: [
                document.getElementById("resposta1").value.trim(),
                document.getElementById("resposta2").value.trim(),
                document.getElementById("resposta3").value.trim(),
                document.getElementById("resposta4").value.trim()
            ]
        }

        peticioCrear(dadesP);
    });
}

function start(){
    fetch("../back/admin/getPreguntes.php")
    .then(response => response.json())
    .then(dades => imprimir(dades));
}

function imprimir(data){
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
        strElement += `<td><button class="eliminar">Eliminar</button><button class="editar">Editar</button></td>`;
        strElement += `</tr>`
    }
    body.innerHTML= strElement;
}

function eliminarFilera(id){
    const tr = document.getElementById(id);
    
    if (tr) {
        tr.remove();
        Swal.fire({
            text: "Pregunta eliminada correctament",
            icon: "success"
        });
    }
}

function confirmacioEliminacio(fila){
    Swal.fire({
        icon: "warning",
        title: "Vols eliminar la pregunta?",
        showDenyButton: true,
        confirmButtonText: "Si",
    }).then((result) => {
        if (result.isConfirmed) {
            peticioEliminar(fila.id);
        } else if (result.isDenied) {
            Swal.fire("Pregunta no eliminada");
        }
    });
}

function omplirFilera(tr, dades){
    const values = [tr["id"],dades["enunciat"],dades["resposta"],dades["imatge"],dades["respCorrecta"]];

    for (let i = 0; i < 5; i++) {
        const td = document.createElement("td");
        td.textContent = values[i];
        tr.appendChild(td);
    }
    const td = document.createElement("td");

    const btnEliminar = document.createElement("button");
    btnEliminar.className = "eliminar";
    btnEliminar.textContent = "Eliminar";

    const btnEditar = document.createElement("button");
    btnEditar.className = "editar";
    btnEditar.textContent = "Editar";
    td.appendChild(btnEliminar);
    td.appendChild(btnEditar);
    tr.appendChild(td);
}

function afegirFilera(d, obj){
    const body = document.getElementById("bodyTaula");
    const tr = body.appendChild(document.createElement("tr"));
    tr.id = d["id"];
    omplirFilera(tr,obj);
    document.getElementById("divInsert").className="notUsable";
    Swal.fire({
        title: "Pregunta creada!",
        icon: "success"
      });
}

function peticioEliminar(idTr){
    fetch("../back/admin/delete.php", {
        method: "POST",
        body: JSON.stringify({idTr}),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())
    .then(data => eliminarFilera(idTr));
}

function peticioCrear(obj){
    fetch("../back/admin/insert.php", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())
    .then(data => afegirFilera(data,obj));
}