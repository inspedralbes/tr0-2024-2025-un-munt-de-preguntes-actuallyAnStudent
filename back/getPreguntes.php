<?php
require_once("connexion.php");
session_start();
header('Content-Type: application/json');
$numPreg = json_decode(file_get_contents('php://input'), true);
$sql = "SELECT * FROM preguntes JOIN respostes ON respostes.idPregunta=preguntes.id";
$data = $conn->query($sql);
$arr = [];
if ($data->num_rows > 0) {
    $i=0;
    while ($row = $data->fetch_assoc()){
        $arr[$i]["pregunta"]=$row["enunciat"];
        $arr[$i]["resposta_correcta"]=$row["respCorrecta"];
        $arr[$i]["respostes"][]=$row["resposta1"];
        $arr[$i]["respostes"][]=$row["resposta2"];
        $arr[$i]["respostes"][]=$row["resposta3"];
        $arr[$i]["respostes"][]=$row["resposta4"];
        $i++;
        /*$arr[$i]["imatge"][]=$row["imatge1"];
        $arr[$i]["imatge"][]=$row["imatge2"];
        $arr[$i]["imatge"][]=$row["imatge3"];
        $arr[$i]["imatge"][]=$row["imatge4"];*/
    }

}

for ($i = 0; $i < $numPreg; $i++) {
    $pos = rand(0, count($arr["preguntes"]) - 1);
    $question[] = $arr["preguntes"][$pos]["pregunta"];
    $answers[] = $arr["preguntes"][$pos]["resposta_correcta"];
    $answer[] = $arr["preguntes"][$pos]["respostes"];
    //$urlImage[] = $arr["preguntes"][$pos]["imatge"];
    array_splice($arr["preguntes"], $pos, 1);
}

$_SESSION["pregunta"] = new stdClass();
$_SESSION["pregunta"]->question = $question;
$_SESSION["pregunta"]->answer = $answer;
$_SESSION["pregunta"]->answers = $answers;
//$_SESSION["pregunta"]->urlImage = $urlImage;
$_SESSION["respostaUsuari"] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

$obj = new stdClass();
$obj ->preguntes = $_SESSION["pregunta"]->question;
$obj ->respostesP = $_SESSION["pregunta"]->answer;
//$obj ->imatgesR = $_SESSION["pregunta"]->urlImage;

echo json_encode($arr);