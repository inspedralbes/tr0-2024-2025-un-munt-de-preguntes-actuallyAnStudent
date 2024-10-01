<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adminer</title>
    <style>
        body{
            display: flex;
            flex-direction: column;
        }
        table,td,th {
            border: 2px solid black;
            border-collapse: collapse;
        }
        #taulerContainer{
            display: flex;
            flex-direction: row;
        }
    </style>
</head>

<body>
    <?php
    require_once "connexion.php";
    $sql = "SELECT preguntes.id, preguntes.enunciat, GROUP_CONCAT(respostes.resposta SEPARATOR ', ') AS respostes, GROUP_CONCAT(respostes.imatge SEPARATOR ', ') AS imatges, respostes.respCorrecta
FROM preguntes
JOIN respostes ON respostes.idPregunta = preguntes.id
GROUP BY preguntes.id";
    $result = $conn->query($sql);

    echo '<div id="taulerContainer">';
    if ($result->num_rows > 0) {
        ?>
        <table>
            <tr>
                <th>ID</th>
                <th>Pregunta</th>
                <th>Respostes</th>
                <th>Imatges</th>
                <th>Resposta Correcta</th>
            </tr>
            <?php
            while ($row = $result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $row["id"] . "</td>";
                echo "<td>" . $row["enunciat"] . "</td>";
                echo "<td>" . $row["respostes"]. "</td>";
                echo "<td>" . $row["imatges"]. "</td>";
                echo "<td>" . $row["respCorrecta"] . "</td>";
                echo "</tr>";
            }
            echo "</table>";
    } else {
        echo "0 results";
    }
    ?>
    </div>
    <div id="botons"><!--Quizas tienen que ser forms-->
        <button id="crear">Crear pregunta</button>
        <button id="eliminar">Eliminar pregunta</button>
        <button id="modificar">Modificar pregunta</button>
    </div>
</body>
</html>