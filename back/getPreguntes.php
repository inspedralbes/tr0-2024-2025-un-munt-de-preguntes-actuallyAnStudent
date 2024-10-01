<?php
require_once("connexion.php");
session_start();
header('Content-Type: application/json');
$numPreg = json_decode(file_get_contents('php://input'), true);
$sql = "SELECT preguntes.id, preguntes.enunciat, GROUP_CONCAT(respostes.resposta SEPARATOR ', ') AS respostes, GROUP_CONCAT(respostes.imatge SEPARATOR ', ') AS imatges, respostes.respCorrecta
FROM preguntes
JOIN respostes ON respostes.idPregunta = preguntes.id
GROUP BY preguntes.id";

$data = $conn->query($sql);
$arr = [];
if ($data->num_rows > 0) {
    $i=0;
    while ($row = $data->fetch_assoc()){
        $arr[$i]["pregunta"]=$row["enunciat"];
        $arr[$i]["resposta_correcta"]=$row["respCorrecta"];
        $arr[$i]["respostes"]["etiqueta"]=explode(",", $row["respostes"]);
        $arr[$i]["respostes"]["imatge"]=explode(",", $row["imatges"]);
        $i++;
    }
}

for ($i = 0; $i < $numPreg; $i++) {
    $pos = rand(0, count($arr) - 1);
    $question[] = $arr[$pos]["pregunta"];
    $answers[] = $arr[$pos]["resposta_correcta"];
    $answer[] = $arr[$pos]["respostes"];
    array_splice($arr, $pos, 1);
}

$_SESSION["pregunta"] = new stdClass();
$_SESSION["pregunta"]->question = $question;
$_SESSION["pregunta"]->answer = $answer;
$_SESSION["pregunta"]->answers = $answers;


$obj = new stdClass();
$obj ->preguntes = $_SESSION["pregunta"]->question;
$obj ->respostesP = $_SESSION["pregunta"]->answer;
//$obj ->resp = $_SESSION["pregunta"]->answers;

echo json_encode($obj);