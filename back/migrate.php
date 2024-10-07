<?php
$data = file_get_contents("data.json");
$arr = json_decode($data, true);
require_once "connexion.php";

//eliminant les taules si existeixen
$table = "preguntes";
$table2 = "respostes";

$sql = "DROP TABLE IF EXISTS $table2";
if ($conn->query($sql) === TRUE) {
    echo "Tabla $table2 eliminada correctamente.<br>";
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
        enunciat VARCHAR(255) UNIQUE  NOT NULL
        )";
if ($conn->query($sql) === TRUE) {
    echo "Table $table created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

echo "<br>";

$sql = "CREATE TABLE $table2 (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    idPregunta INT UNSIGNED NOT NULL,
    resposta VARCHAR(255) NOT NULL,
    respCorrecta int NOT NULL,
    imatge VARCHAR(255) NOT NULL,
    CONSTRAINT fk_PreguntaResposta FOREIGN KEY (idPregunta) REFERENCES $table(id)
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
    $key++;
    foreach ($value["respostes"] as $resp) {
        $stmt = $conn->prepare("INSERT INTO $table2 (idPregunta, resposta, respCorrecta, imatge) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isis",$key,$resp["etiqueta"],$value["resposta_correcta"],$resp["imatge"]);
        $stmt->execute();
    }
}

$conn->close();