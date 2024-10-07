<?php
require_once "../connexion.php";
header('Content-Type: application/json');
$obj = json_decode(file_get_contents('php://input'), true)["values"];
$idPregunta = explode("_", $obj["idPregunta"])[1]; 
$success = false;

$stmt = $conn->prepare('UPDATE preguntes SET enunciat = ? WHERE id=?');
$stmt->bind_param("si", $obj["enunciat"], $idPregunta);
$stmt->execute();

foreach ($obj["respostes"] as $key => $resposta) {
    $stmt = $conn->prepare('UPDATE respostes SET resposta=?, imatge=?, respCorrecta=? WHERE id=?');
    $stmt->bind_param("ssii", $resposta["resposta"],$resposta["imatge"],$obj["respostaC"],$resposta["id"]);
    $stmt->execute();
    if ($stmt->affected_rows > 0) $success=true;
}
echo json_encode($success);
$conn->close();