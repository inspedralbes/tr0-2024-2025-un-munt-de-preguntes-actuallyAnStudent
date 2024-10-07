<?php
require_once "../connexion.php";
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true)["idTr"];
$id = explode("_", $data)[1]; 

$obj = new stdClass();
$consulta= "DELETE FROM respostes WHERE respostes.idPregunta=?";
$stmt = $conn ->prepare($consulta);
$stmt ->bind_param("i", $id);
$stmt -> execute();
/*$obj->res1 = $stmt->affected_rows;
$obj->con1 = $consulta;*/

$consulta= "DELETE FROM preguntes WHERE preguntes.id=?";
$stmt = $conn ->prepare($consulta);
$stmt ->bind_param("i", $id);
$stmt -> execute();
$obj->success = ($stmt->affected_rows == 0) ? false : true;
$obj->id = $id;
/*$obj->res2 = $stmt->affected_rows;
$obj->con2 = $consulta;*/

echo json_encode($obj);//informacion extra sobre la respuesta de la query
$conn -> close();