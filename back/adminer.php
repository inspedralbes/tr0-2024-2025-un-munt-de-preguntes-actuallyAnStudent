<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adminer</title>
    <style>
        body{
            display: flex;
            flex-direction: row;
        }
        table,td,th {
            border: 2px solid black;
            border-collapse: collapse;
        }
        #respostes{
            border-left: 0;
        }
    </style>
</head>

<body>
    <?php
    $host = 'localhost';
    $username = 'quizz';
    $password = '1234';
    $dbname = 'quizz';
    $conn = new mysqli($host, $username, $password, $dbname);

    $sql = "SELECT * FROM preguntes";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        ?>
        <table>
            <tr>
                <th>ID</th>
                <th>Pregunta</th>
            </tr>
            <?php
            while ($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $row["id"] . "</td>";
                echo "<td>" . $row["enunciat"] . "</td>";
                echo "</tr>";
            }
            echo "</table>";
    } else {
        echo "0 results";
    }

    $sql = "SELECT * FROM respostes";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        ?>
        <table id="respostes">
            <tr>
                <th>Respostes</th>
                <th>Respota Correcta</th>
                <th>Imatges</th>
            </tr>
            <?php
            while ($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $row["resposta1"]. ",". $row["resposta2"]. ",".$row["resposta3"]. ",". $row["resposta4"] . "</td>";
                echo "<td>" . $row["respCorrecta"] . "</td>";
                echo "<td>" . $row["imatge1"]. ",". $row["imatge2"]. ",".$row["imatge3"]. ",". $row["imatge4"] . "</td>";
                echo "</tr>";
            }
            echo "</table>";
    } else {
        echo "0 results";
    }

    ?>
    <div id="botons"><!--Quizas tienen que ser forms-->
        <button id="crear">Crear pregunta</button>
        <button id="eliminar">Eliminar pregunta</button>
        <button id="modificar">Modificar pregunta</button>
    </div>
    <!--<script>
    document.getElementById("div").addEventListener('click', (event) => {
        if(event.target.id==="crear"){
            crearPregunta();
        }else if(event.target.id==="elimimar"){
            eliminarPregutna();
        }else if(event.target.id==="modificarPregunta"){
            modificarPregunta();
        }
    });
    </script>-->
</body>
</html>