<?php
require_once "../connexion.php";
header('Content-Type: application/json');
$dades = json_decode(file_get_contents('php://input'), true);
$obj = new stdClass();
//$obj -> resR = [];
$stmt = $conn->prepare('INSERT INTO preguntes (enunciat) VALUES (?)');    
$stmt->bind_param('s', $dades['enunciat']);
$stmt -> execute();
//$obj->resP = $stmt->affected_rows;
$obj->idP = $conn->insert_id;
$obj->idR = [];

/*$stmt ->$conn->prepare('INSERT INTO respostes (idPregunta, imatge, respCorrecta, resposta) VALUES ((SELECT id FROM preguntes WHERE enunciat = ?), ?, ?, ?');
$stmt -> bind_param('ssis', $dades->enunciat,$dades->imatge,$dades->respCorrecta,$dades->resposta);*/
foreach ($dades["resposta"] as $key => $value) {
    $stmt = $conn->prepare('INSERT INTO respostes (idPregunta, imatge, respCorrecta, resposta) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('isis', $obj->idP,$dades['imatge'][$key], $dades['respCorrecta'], $value);
    $stmt -> execute();
    $obj->idR[] = $stmt->insert_id;
    //$obj->resR[$key] = $stmt->affected_rows;
}
$obj->success = ($stmt->affected_rows == 0) ? false : true;


echo json_encode($obj);//informacion extra sobre la respuesta de la query
$conn->close();