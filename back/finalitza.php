<?php
session_start();

$arr = json_decode($_POST['estatDeLaPartida'], true);

$resultats = new stdClass();
$resultats -> respostesCorrectes = 0;
$resultats -> respostesIncorrectes = 0;
$resultats -> noResposes = 0;

foreach ($arr["preguntes"] as $key => $value) {
    if ($_SESSION["pregunta"]->answers[$key]==$value["resposta"]+1) $resultats -> respostesCorrectes++;
    else if ($_SESSION["pregunta"]->answers[$key]!=$value["resposta"]+1 && $value["resposta"] != -1) $resultats -> respostesIncorrectes++;
    else $resultats -> noResposes++;
}

echo json_encode($resultats);