<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<?php
$data = file_get_contents("data.json");
$arr = json_decode($data, true);
$host = 'localhost';
$username = 'quizz';
$password = '1234';
$dbname = 'quizz';

$conn = new mysqli($host, $username, $password, $dbname);

$sql = "CREATE TABLE IF NOT EXISTS preguntes (
        id INT(3) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        enunciat VARCHAR(255)
        )";

if ($conn->query($sql) === TRUE) {
    echo "Table MyGuests created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

foreach ($arr["preguntes"] as $key => $value) {
    $sql = "INSERT INTO preguntes (enunciat) VALUES ('".$value["pregunta"]."')";
    if ($conn->query($sql) === TRUE) {
        echo "insert done successfully";
    } else {
        echo "Error inserting: " . $conn->error;
    }
}

$conn->close();
?>
</body>
</html>