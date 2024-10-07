<?php
require_once "../connexion.php";

$sql = "SELECT preguntes.id, preguntes.enunciat, GROUP_CONCAT(respostes.id SEPARATOR ', ') AS ids, GROUP_CONCAT(respostes.resposta SEPARATOR ', ') AS respostes, GROUP_CONCAT(respostes.imatge SEPARATOR ', ') AS imatges, respostes.respCorrecta
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
        $ids[$i] = explode(",", $row["ids"]);
        $answer[$i] = explode(",", $row["respostes"]);
        $imatges[$i] = explode(",", $row["imatges"]);
        $i++;
    }
} else {
    echo "0 results";
}

$obj = new stdClass();
$obj->id = $id;
$obj->respostes = obtenirObj($answer,$ids,$imatges);
$obj ->preguntes = $question;
$obj ->respostesC = $answers;

echo json_encode($obj);
$conn -> close();

function obtenirObj($answer, $ids, $imatges) {
    $objConv = [];

    for ($j = 0; $j < count($ids); $j++) {
        $fila = [];

        for ($it = 0; $it < count($ids[$j]); $it++) {
            $dadesConv = new stdClass();
            $dadesConv->idR = trim($ids[$j][$it]);
            $dadesConv->resposta = $answer[$j][$it];
            $dadesConv->imatge = $imatges[$j][$it];
            $fila[] = $dadesConv;
        }

        $objConv[] = $fila;
    }

    return $objConv;
}
