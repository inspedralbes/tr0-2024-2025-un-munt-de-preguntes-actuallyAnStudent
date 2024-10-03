<?php
require_once "../connexion.php";

$sql = "SELECT preguntes.id, preguntes.enunciat, GROUP_CONCAT(respostes.resposta SEPARATOR ', ') AS respostes, GROUP_CONCAT(respostes.imatge SEPARATOR ', ') AS imatges, respostes.respCorrecta
FROM preguntes
JOIN respostes ON respostes.idPregunta = preguntes.id
GROUP BY preguntes.id";

$result = $conn->query($sql);
if ($result->num_rows > 0) {
    $i=0;
    while ($row = $result->fetch_assoc()) {
        $id[$i] = $row["id"];
        $question[$i] = $row["enunciat"];
        $answers[$i] = $row["respCorrecta"];
        $answer[$i] = explode(",", $row["respostes"]);
        $imatges[$i] = explode(",", $row["imatges"]);
        $i++;
    }
} else {
    echo "0 results";
}

$obj = new stdClass();
$obj->id = $id;
$obj ->preguntes = $question;
$obj ->respostesC = $answers;
$obj ->respostes = $answer;
$obj ->imatgesR = $imatges;

echo json_encode($obj);
$conn -> close();