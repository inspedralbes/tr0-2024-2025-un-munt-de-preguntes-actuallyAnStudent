<?php
session_start();

$arr = json_decode($_POST['estatDeLaPartida'], true);
$obj = array(
    "respostesCorrectes" => 0,
    "respostesIncorrectes" => calcularRespIncorr($arr),
    "respostesTotal" => count($arr["preguntes"]),
    //"peticio" => $arr,
    //"debug" => array()
);
$obj["respostesCorrectes"] = calcularRespCorr($arr);
function calcularRespCorr($dades){
    $quantitat=0;
    foreach ($dades["preguntes"] as $key => $value) {
        /*$tmp = new stdClass;
        $tmp->val1 = $_SESSION["pregunta"]->answers[$key];
        $tmp->val2 =$value["resposta"]+1;
        $tmp->comp = $_SESSION["pregunta"]->answers[$key]==$value["resposta"]+1;*/

        //$debug[] = $tmp;
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