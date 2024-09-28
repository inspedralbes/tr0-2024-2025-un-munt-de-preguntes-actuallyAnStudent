<?php
require_once("connexion.php");
session_start();
header('Content-Type: application/json');
$numPreg = json_decode(file_get_contents('php://input'), true);
$sql = "SELECT * FROM preguntes JOIN respostes ON respostes.idPregunta=preguntes.id";
$data = $conn->query($sql);
$numAns=4;
$arr = [];
if ($data->num_rows > 0) {
    $i=0;
    while ($row = $data->fetch_assoc()){
        $arr[$i]["pregunta"]=$row["enunciat"];
        $arr[$i]["resposta_correcta"]=$row["respCorrecta"];
        for ($j=0; $j < $numAns; $j++) { 
            $arr[$i]["respostes"][$j]["etiqueta"]=$row["resposta". $j+1];
            $arr[$i]["respostes"][$j]["imatge"]=$row["imatge". $j+1];
        }
        $i++;
    }

}

for ($i = 0; $i < $numPreg; $i++) {
    $pos = rand(0, count($arr) - 1);
    $question[] = $arr[$pos]["pregunta"];
    $answers[] = $arr[$pos]["resposta_correcta"];
    $answer[] = $arr[$pos]["respostes"];
    array_splice($arr, $pos, 1);
}

$_SESSION["pregunta"] = new stdClass();
$_SESSION["pregunta"]->question = $question;
$_SESSION["pregunta"]->answer = $answer;
$_SESSION["pregunta"]->answers = $answers;

$obj = new stdClass();
$obj ->preguntes = $_SESSION["pregunta"]->question;
$obj ->respostesP = $_SESSION["pregunta"]->answer;

echo json_encode($obj);