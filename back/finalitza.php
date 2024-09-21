<?php
session_start();

header('Content-Type: application/json');
$arr = json_decode(file_get_contents('php://input'), true);
$obj = array(
    "respostesCorrectes" => calcularRespCorr($arr),
    "respostesTotal" => count($arr["preguntes"])
);

function calcularRespCorr($dades){
    $quantitat=0;
    foreach ($dades["preguntes"] as $key => $value) {
        if ($_SESSION["pregunta"]->answers[$key]==$value["resposta"]+1) {
            $quantitat++;
        }
    }

    return $quantitat;
}

echo json_encode($obj);