<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ProjecteBack</title>
</head>

<body>
    <div>
        <?php
        if (!isset($_SESSION["pregunta"]) || empty($_SESSION["pregunta"])) {
            $data = file_get_contents(filename: "data.json");
            $arr = json_decode($data, true);
            $numPreg = 10;
            $questions = array();
            $answers = array();

            for ($i = 0; $i < $numPreg; $i++) {
                $pos = rand(0, count($arr["preguntes"]) - 1);
                $question[] = $arr["preguntes"][$pos]["pregunta"];
                $answers[] = $arr["preguntes"][$pos]["resposta_correcta"];
                $answer[] = $arr["preguntes"][$pos]["respostes"];
                $urlImage[] = $arr["preguntes"][$pos]["imatge"];
                array_splice($arr["preguntes"], $pos, 1);
            }
            $_SESSION["pregunta"] = new stdClass();
            $_SESSION["pregunta"]->question = $question;
            $_SESSION["pregunta"]->answers = $answers;
            $_SESSION["pregunta"]->answer = $answer;
            $_SESSION["pregunta"]->urlImage = $urlImage;
            $_SESSION["contPreguntes"] = 0;
            $_SESSION["respostaUsuari"] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        }
        if ($_SESSION["contPreguntes"] !== count($_SESSION["pregunta"]->question)) {
            //per veure quines son les 10 preguntes descomenta el foreach i l'echo per separar de les prepguntes individuals
            /*foreach ($_SESSION["pregunta"]->question as $key => $value) {
                echo 'Key: '. $key. '| Value: '. $value. '<br>';
            }*/
            //echo "<br>------------<br><br>";
            echo $_SESSION["pregunta"]->question[$_SESSION["contPreguntes"]];
            echo '<br><img src="' . $_SESSION["pregunta"]->urlImage[$_SESSION["contPreguntes"]] . '" alt="[question image]" width="150" height="180"><br>';
            ?>
            <form action="index.php" method="post">
                <?php
                for ($j = 0; $j < count($_SESSION["pregunta"]->answer[0]); $j++) {
                    echo '<button type="submit" name="respostaUser" value='.$_SESSION["pregunta"]->answer[$_SESSION["contPreguntes"]][$j]["id"].'>' . $_SESSION["pregunta"]->answer[$_SESSION["contPreguntes"]][$j]["etiqueta"] . '</button>';
                }
                echo '<button type="submit" name="resetResposta" value="reset">Cancel·lar resposta</button>';
                ?>
            </form>
            <?php
            echo "<br><br>";
            ?>
            <form action="index.php" method="post">
                <?php
                if ($_SESSION["contPreguntes"]!==0) {
                    ?>
                    <input type="submit" name="last_question" value="Anterior">
                    <?php
                }
                ?>
                <input type="submit" name="next_question" value="Siguiente">
            </form>
            <?php
        } else {
            $_SESSION["respostesCorr"] = calcularRespCorr();
            var_dump($_SESSION["respostaUsuari"]);
            ?>
            <p>Felicitats, has acertat <?php echo $_SESSION["respostesCorr"] ?> de <?php echo count($_SESSION["pregunta"]->question) ?></p>
            <form action="index.php" method="post">
                <input type="submit" name="restart" value="Tornar a jugar">
            </form>
            <?php
        }
        if (isset($_POST['next_question'])) {
            $_SESSION['contPreguntes'] += 1;
            if (headers_sent()) {
                ?>
                <script>
                window.location.href="<?=$_SERVER['PHP_SELF']?>";  
                </script>
                <?php
            }else {
                header("Location: " . $_SERVER['PHP_SELF']);
            }
        }
        if (isset($_POST['last_question'])) {
            $_SESSION['contPreguntes'] -= 1;
            if (headers_sent()) {
                ?>
                <script>
                window.location.href="<?=$_SERVER['PHP_SELF']?>";  
                </script>
                <?php
            }else {
                header("Location: " . $_SERVER['PHP_SELF']);
            }
        }
        if (isset($_POST['resetResposta'])) {
            $_SESSION["respostaUsuari"][$_SESSION["contPreguntes"]] = "0";
            if (headers_sent()) {
                ?>
                <script>
                window.location.href="<?=$_SERVER['PHP_SELF']?>";  
                </script>
                <?php
            }else {
                header("Location: " . $_SERVER['PHP_SELF']);
            }
        }
        if (isset($_POST['restart'])) {
            session_destroy();
            if (headers_sent()) {
                ?>
                <script>
                window.location.href="<?=$_SERVER['PHP_SELF']?>";  
                </script>
                <?php
            }else {
                header("Location: " . $_SERVER['PHP_SELF']);
            }
        }
        if (isset($_POST['respostaUser'])) {
            $_SESSION["respostaUsuari"][$_SESSION["contPreguntes"]] = $_POST["respostaUser"];
            if($_SESSION["respostaUsuari"][$_SESSION["contPreguntes"]]==$_SESSION["pregunta"]->answers[$_SESSION["contPreguntes"]]){
                echo '<p style="color: green">Correcto</p>';
            }else{
                echo '<p style="color: red">Incorrecto</p>';
            }
        }
        function calcularRespCorr(){
            $quantitat=0;
            foreach ($_SESSION["respostaUsuari"] as $key => $value) {
                if ($_SESSION["pregunta"]->answers[$key]==$value) {
                    $quantitat++;
                }
            }

            return $quantitat;
        }
        //per veure el valor que s'esta guardant en cada resposta descomenta el if
        /*if ($_SESSION["contPreguntes"]!=10) {
            echo $_SESSION["respostaUsuari"][$_SESSION["contPreguntes"]];
        }*/
        ?>
        <div>
            <?php
            if ($_SESSION["contPreguntes"]<10) {
            ?>
                <p style="border: solid black 3px; width: min-content"><?php echo $_SESSION["contPreguntes"]+1 .'/'. count($_SESSION["pregunta"]->question); ?></p>
            <?php
            }
            ?>    
        </div>
    </div>
</body>
</html>