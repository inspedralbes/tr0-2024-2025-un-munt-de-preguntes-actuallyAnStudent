<?php
require_once "connexion.php";
header('Content-Type: application/json');
$id = json_decode(file_get_contents('php://input'), true);