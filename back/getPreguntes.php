<?php
session_start();
header('Content-Type: application/json');
$numPreg = json_decode(file_get_contents('php://input'), true);
$data = file_get_contents(filename: "data.json");
$arr = json_decode($data, true);

for ($i = 0; $i < $numPreg; $i++) {
    $pos = rand(0, count($arr["preguntes"]) - 1);
    $question[] = $arr["preguntes"][$pos]["pregunta"];
    $_SESSION["respostes"] = $arr["preguntes"][$pos]["resposta_correcta"];
    $answer[] = $arr["preguntes"][$pos]["respostes"];
    $urlImage[] = $arr["preguntes"][$pos]["imatge"];
    array_splice($arr["preguntes"], $pos, 1);
}
$_SESSION["pregunta"] = new stdClass();
$_SESSION["pregunta"]->question = $question;
$_SESSION["pregunta"]->answer = $answer;
$_SESSION["pregunta"]->urlImage = $urlImage;
$_SESSION["respostaUsuari"] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//$_SESSION["contPreguntes"] = 0;

$obj = new stdClass();
$obj ->preguntes = $_SESSION["pregunta"]->question;
$obj ->respostesP = $_SESSION["pregunta"]->answer;
$obj ->imatgesR = $_SESSION["pregunta"]->urlImage;

echo json_encode($obj);