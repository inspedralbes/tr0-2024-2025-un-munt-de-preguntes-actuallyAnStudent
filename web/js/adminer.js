document.addEventListener('DOMContentLoaded', () => {
    start();
    crearListener();
});

function crearListener() {
    document.getElementById("bodyTaula").addEventListener('click', (event) => {
        const fila = event.target.closest('tr');

        if (event.target.className === "eliminar") {
            confirmacioEliminacio(fila.id);
        } else if (event.target.className === "editar") {
            fila.querySelector("button").className="notUsable";
            carregarNovesDades(fila.id);
            document.getElementById("eliminar")
            event.target.className = "guardar";
            event.target.textContent = "Guardar";
        } else if (event.target.className === "guardar") {
            fila.querySelector("button").className="eliminar";
            peticioUpdate(fila.id);
            event.target.className = "editar";
            event.target.textContent = "Editar";
        }
    });

    document.getElementById("crearContainer").addEventListener('click', (event) => {
        if (event.target.id === "crear") {
            event.target.id = "cancelar";
            event.target.textContent = "Cancel·lar";
            document.getElementById("divInsert").className = "divInsert";
        } else if (event.target.id === "cancelar") {
            event.target.id = "crear";
            event.target.textContent = "Crear pregunta";
            document.getElementById("divInsert").className = "notUsable";
            reiniciarInputValues(document.getElementById("divInsert"));
        }else if (event.target.id === "insert"){
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
            if (dadesP["enunciat"] && dadesP["respCorrecta"] && dadesP["resposta"][0] && dadesP["resposta"][1] && dadesP["resposta"][2] && dadesP["resposta"][3]) {
                peticioCrear(dadesP);
                const boto = document.getElementById("cancelar");
                boto.id = "crear";
                boto.textContent = "Crear pregunta";
            } else {
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
                Toast.fire({
                    icon: "warning",
                    title: "Tots els camps son obligatoris"
                });
            }
        }
    });

    
}

function start() {
    fetch("../back/admin/getPreguntes.php")
        .then(response => response.json())
        .then(data => imprimir(data))
        .catch(error => {
            alert("Error obtenint les preguntes");
        });
}

function imprimir(data) {
    imprimirHeader();
    imprimirBody(data);
}

function imprimirHeader() {
    const header = document.getElementById("headerTaula");
    let strElement = "";
    strElement += `<tr>`
    strElement += `<th>ID</th>`;
    strElement += `<th>Pregunta</th>`;
    strElement += `<th>Respostes</th>`;
    strElement += `<th>Imatges Resposta</th>`;
    strElement += `<th>Resposta Correcta</th>`;
    strElement += `<th>Operacions</th>`;
    strElement += `</tr>`
    header.innerHTML = strElement;
}

function imprimirBody(d) {
    const body = document.getElementById("bodyTaula");
    let strElement = "";
    for (let index = 0; index < d.id.length; index++) {
        strElement += `<tr id="pregunta_${d.id[index]}">`
        strElement += `<td>${d.id[index]}</td>`;
        strElement += `<td>${d.preguntes[index]}</td>`;
        strElement += `<td>`;
        for (let it = 0; it < d.respostes[index].length; it++) {
            strElement += `<p id=${d.respostes[index][it][`idR`]}>${d.respostes[index][it][`resposta`]}</p>`;
        }
        strElement += `</td>`;
        strElement += `<td>`;
        for (let it = 0; it < d.respostes[index].length; it++) {
            strElement += `<div style="margin: 16px 0"><a target="_blank" href="${d.respostes[index][it][`imatge`]}">Imatge ${it+1}</a></div>`;
            //strElement += `<p>${d.respostes[index][it][`imatge`]}</p>`;
        }
        strElement += `</td>`;
        strElement += `<td>${d.respostesC[index]}</td>`;
        strElement += `<td><button class="eliminar">Eliminar</button><button class="editar">Editar</button></td>`;
        strElement += `</tr>`
    }
    body.innerHTML = strElement;
}

function eliminarFilera(id) {
    const tr = document.getElementById(id);

    if (tr) {
        tr.remove();
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
        Toast.fire({
            icon: "success",
            title: "Pregunta eliminada"
        });
    }
}

function confirmacioEliminacio(idFila) {
    Swal.fire({
        icon: "warning",
        title: "Vols eliminar la pregunta?",
        showDenyButton: true,
        confirmButtonText: "Si",
    }).then((result) => {
        if (result.isConfirmed) {
            peticioEliminar(idFila);
        } else if (result.isDenied) {
            Swal.fire("Pregunta no eliminada");
        }
    });
}

function parseTdInput(tr) {
    const allTd= tr.querySelectorAll("td");
    allTd.forEach((td, i) => {
        if (td !== tr.firstElementChild && td !== tr.lastElementChild) {
            if (i == 3) {
                const allA = td.querySelectorAll("a");
                allA.forEach(a => {
                    const input = document.createElement("input");
                    input.value = a.getAttribute("href");
                    a.parentElement.remove();
                    td.appendChild(input);
                });
            }else{
                const allP = td.querySelectorAll("p");
                if (allP.length > 0) {
                    allP.forEach(p => {
                        const input = document.createElement("input");
                        input.value = p.textContent;
                        if (i == 2) input.id = p.id;
                        p.remove();
                        td.appendChild(input);
                    });
                }else{
                    const input = document.createElement("input");
                    input.value = td.textContent;
                    td.innerHTML = '';
                    td.appendChild(input);
                }
            }
        }
    });
}

function carregarNovesDades(idTr) {
    parseTdInput(document.getElementById(idTr));
}

/*function obtenirObjecte(inputs) {
    const inputValue = {};

    inputs.forEach((input, index) => {
        inputValue[`input${index + 1}`] = input.value;
    });

    return inputValue;
}*/

function valorsInputs(id, inputs){
    const arr = {
        idPregunta: id,
        enunciat: inputs[0].value,
        respostaC: inputs[9].value,
        respostes: []    
    }
    for (let index = 1; index < 5; index++) {
        const obj = {
            id: inputs[index].id,
            resposta: inputs[index].value,
            imatge: inputs[index+4].value
        }
        arr["respostes"].push(obj);
    }

    return arr;
}

function actualitzarFilera(inputs) {
    inputs.forEach((input, i) => {
        const parent = input.parentElement;
        if (i>4 && i<9) {
            const div = document.createElement('div');
            div.style.margin = '16px 0';
            const a = document.createElement('a');
            a.href = input.value;
            a.target = '_blank';
            a.textContent = `Imatge ${i-4}`;
            div.appendChild(a);
            parent.appendChild(div);
        }else{
            const p = document.createElement('p');
            p.textContent = input.value;
            p.id = input.id;
            parent.appendChild(p);
        }
        input.remove();
    });
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
    Toast.fire({
        icon: "success",
        title: "Pregunta actualitzada"
    });
}

function omplirFilera(tr, fetchData, dades) {
    const values = [fetchData["idP"], dades["enunciat"], dades["resposta"], dades["imatge"], dades["respCorrecta"]];

    values.forEach((value, i) => {
        const td = document.createElement("td");

        if (i === 2) {
            value.forEach((item, index) => {
                const p = document.createElement("p");
                p.textContent = item;
                p.id = fetchData["idR"][index];
                td.appendChild(p);
            });
        } else if(i===3){
            value.forEach((item, index) => {
                const div = document.createElement('div');
                div.style.margin = '16px 0';

                const a = document.createElement('a');
                a.href = item;
                a.target = '_blank';
                a.textContent = `Imatge ${index+1}`;

                div.appendChild(a);
                td.appendChild(div);
            });
        }else td.textContent = value;

        tr.appendChild(td);
    });

    const tdBotons = document.createElement("td");
    const btnEliminar = document.createElement("button");
    btnEliminar.className = "eliminar";
    btnEliminar.textContent = "Eliminar";

    const btnEditar = document.createElement("button");
    btnEditar.className = "editar";
    btnEditar.textContent = "Editar";

    tdBotons.appendChild(btnEliminar);
    tdBotons.appendChild(btnEditar);
    tr.appendChild(tdBotons);
}

function reiniciarInputValues(div){
    const inputs = div.querySelectorAll("input");

    inputs.forEach(input => input.value = '');
}

function afegirFilera(d, obj) {
    const body = document.getElementById("bodyTaula");
    const tr = body.appendChild(document.createElement("tr"));
    tr.id = `pregunta_${d["idP"]}`;
    omplirFilera(tr, d, obj);
    document.getElementById("divInsert").className = "notUsable";
    reiniciarInputValues(document.getElementById("divInsert"));
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
    Toast.fire({
        icon: "success",
        title: "Pregunta creada"
    });
}

function peticioEliminar(idTr) {
    fetch("../back/admin/delete.php", {
        method: "POST",
        body: JSON.stringify({ idTr }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => response.json())
        .then(data => eliminarFilera(idTr))
        .catch(error => {
            Swal.fire({
                title: "Error eliminant pregunta",
                text: error,
                icon: "error"
            });
        });
}

function peticioUpdate(idTr) {
    //const obj = obtenirObjecte(document.getElementById(idTr).querySelectorAll("td:not(:first-child):not(:last-child) input"));
    const allInput = Array.from(document.getElementById(idTr).querySelectorAll("td:not(:first-child):not(:last-child) input"));//m'he trobat que hi ha una funcio que fa el mateix, transforma el NodeList en array
    const values = valorsInputs(idTr, allInput);

    fetch("../back/admin/update.php", {
        method: "POST",
        body: JSON.stringify({ values }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => response.json())
    .then(data => actualitzarFilera(allInput))
    .catch(error => {
        Swal.fire({
            title: "Error actualitzant pregunta",
            text: error.message,
            icon: "error"
        });
    });
}

function peticioCrear(obj) {
    fetch("../back/admin/insert.php", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(response => response.json())
        .then(data => afegirFilera(data, obj))
        .catch(error => {
            Swal.fire({
                title: "Error creant pregunta",
                text: error,
                icon: "error"
            });
        });
}