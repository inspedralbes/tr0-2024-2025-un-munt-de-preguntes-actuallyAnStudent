<?php
require_once "connexion.php";
session_start();
header('Content-Type: application/json');
$numPreg = json_decode(file_get_contents('php://input'), true)["num"];
$sql = "SELECT preguntes.id, preguntes.enunciat, GROUP_CONCAT(respostes.resposta SEPARATOR ', ') AS respostes, GROUP_CONCAT(respostes.imatge SEPARATOR ', ') AS imatges, respostes.respCorrecta
    FROM preguntes
    JOIN respostes ON respostes.idPregunta = preguntes.id
    GROUP BY preguntes.id
    ORDER BY RAND()
    LIMIT $numPreg";

$data = $conn->query($sql);
$arr = [];
if ($data->num_rows > 0) {
    $i = 0;
    while ($row = $data->fetch_assoc()) {
        $question[$i] = $row["enunciat"];
        $answers[$i] = $row["respCorrecta"];
        $answer[$i]["etiqueta"] = explode(",", $row["respostes"]);
        $answer[$i]["imatge"] = explode(",", $row["imatges"]);
        $i++;
    }
}

$_SESSION["pregunta"] = new stdClass();
$_SESSION["pregunta"]->question = $question;
$_SESSION["pregunta"]->answer = $answer;
$_SESSION["pregunta"]->answers = $answers;


$obj = new stdClass();
$obj->preguntes = $_SESSION["pregunta"]->question;
$obj->respostesP = $_SESSION["pregunta"]->answer;
//$obj ->resp = $_SESSION["pregunta"]->answers;

echo json_encode($obj);
$conn->close();