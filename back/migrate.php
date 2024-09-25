<?php
$data = file_get_contents("data.json");
$arr = json_decode($data, true);
$host = 'localhost';
$username = 'quizz';
$password = '1234';
$dbname = 'quizz';

$conn = new mysqli($host, $username, $password, $dbname);

//eliminant les taules si existeixen
$table = "preguntes";
$table2 = "respostes";

$sql = "DROP TABLE IF EXISTS $table2";
if ($conn->query($sql) === TRUE) {
    echo "Tabla $table eliminada correctamente.<br>";
} else {
    echo "Error al eliminar la tabla: " . $conn->error . "<br>";
}

$sql = "DROP TABLE IF EXISTS $table";
if ($conn->query($sql) === TRUE) {
    echo "Tabla $table eliminada correctamente.<br>";
} else {
    echo "Error al eliminar la tabla: " . $conn->error . "<br>";
}

//creant les taules
$sql = "CREATE TABLE $table (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        enunciat VARCHAR(255)
        )";
if ($conn->query($sql) === TRUE) {
    echo "Table $table created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

echo "<br>";

$sql = "CREATE TABLE respostes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    idPregunta INT UNSIGNED,
    resposta1 VARCHAR(255),
    resposta2 VARCHAR(255),
    resposta3 VARCHAR(255),
    resposta4 VARCHAR(255),
    respCorrecta int,
    imatge1 VARCHAR(255),
    imatge2 VARCHAR(255),
    imatge3 VARCHAR(255),
    imatge4 VARCHAR(255),
    CONSTRAINT fk_PreguntaResposta FOREIGN KEY (idPregunta) REFERENCES preguntes(id)
    )";
if ($conn->query($sql) === TRUE) {
echo "Table $table2 created successfully";
} else {
echo "Error creating table: " . $conn->error;
}

echo "<br>";
//insertem valors
foreach ($arr["preguntes"] as $key => $value) {
    $stmt = $conn->prepare("INSERT INTO $table (enunciat) VALUES (?)");
    $stmt->bind_param("s",$value["pregunta"]);
    $stmt->execute();
}

foreach ($arr["preguntes"] as $key => $value) {
    $stmt = $conn->prepare("INSERT INTO $table2 (idPregunta, resposta1, resposta2, resposta3, resposta4, respCorrecta, imatge1, imatge2, imatge3, imatge4) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $key++;
    $res = $value["respostes"];
    $stmt->bind_param("issssissss",$key,$res[0]["etiqueta"],$res[1]["etiqueta"],$res[2]["etiqueta"],$res[3]["etiqueta"],$value["resposta_correcta"],$res[0]["imatge"],$res[1]["imatge"],$res[2]["imatge"],$res[3]["imatge"]);
    $stmt->execute();
}

$conn->close();
?>