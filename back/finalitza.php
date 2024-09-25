<?php
session_start();

$arr = json_decode($_POST['estatDeLaPartida'], true);
$obj = array(
    "respostesCorrectes" => calcularRespCorr($arr),
    "respostesIncorrectes" => calcularRespIncorr($arr),
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

function calcularRespIncorr($dades){
    $quantitat=0;
    foreach ($dades["preguntes"] as $key => $value) {
        if ($_SESSION["pregunta"]->answers[$key]!=$value["resposta"]+1 && $value["resposta"] != -1) {
            $quantitat++;
        }
    }

    return $quantitat;
}

echo json_encode($obj);