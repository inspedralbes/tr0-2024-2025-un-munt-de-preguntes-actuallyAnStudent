<?php
require_once "../connexion.php";
header('Content-Type: application/json');
$dades = json_decode(file_get_contents('php://input'), true);
$obj = new stdClass();
$obj -> resR = [];
$stmt = $conn->prepare('INSERT INTO preguntes (enunciat) VALUES (?)');    
$stmt->bind_param('s', $dades['enunciat']);
$stmt -> execute();
$obj->resP = $stmt->affected_rows;
$obj->id = $conn->insert_id;

/*$stmt ->prepare('INSERT INTO respostes (idPregunta, imatge, respCorrecta, resposta) VALUES ((SELECT id FROM preguntes WHERE enunciat = ?), ?, ?, ?');
$stmt -> bind_param('ssis', $dades->enunciat,$dades->imatge,$dades->respCorrecta,$dades->resposta);*/
foreach ($dades["resposta"] as $key => $value) {
    $stmt = $conn->prepare('INSERT INTO respostes (idPregunta, imatge, respCorrecta, resposta) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('isis', $obj->id,$dades['imatge'][$key], $dades['respCorrecta'], $value);
    $stmt -> execute();
    $obj->resR[$key] = $stmt->affected_rows;
}


echo json_encode($obj);//informacion extra sobre la respuesta de la query
$conn->close();