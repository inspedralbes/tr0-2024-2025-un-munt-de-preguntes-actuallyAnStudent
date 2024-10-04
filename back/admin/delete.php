<?php
require_once "../connexion.php";
header('Content-Type: application/json');
$id = json_decode(file_get_contents('php://input'), true)["idTr"];
$obj = new stdClass();

$consulta= "DELETE FROM respostes WHERE respostes.idPregunta=?";
$stmt = $conn ->prepare($consulta);
$stmt ->bind_param("i", $id);
$stmt -> execute();
$obj->res1 = $stmt->affected_rows;
$obj->con1 = $consulta;

$consulta= "DELETE FROM preguntes WHERE preguntes.id=?";
$stmt = $conn ->prepare($consulta);
$stmt ->bind_param("i", $id);
$stmt -> execute();
$obj->res2 = $stmt->affected_rows;
$obj->con2 = $consulta;

echo json_encode($obj);//informacion que no tendria porque recibir
$conn -> close();