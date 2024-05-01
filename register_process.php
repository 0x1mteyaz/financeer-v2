<?php
$servername="localhost";
$username="imteyaz";
$password="1";
$dbname="financeerusers";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: ". $conn->connect_error);
}

$username = $_POST['username'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?,?)");
$stmt->bind_param("ss", $username, $password);

if ($stmt->execute()){
    echo "Registration successful! <a href='login.php'>Login</a>";
} else {
    echo "Registration failed: ". $stmt->error;
}

$stmt->close();
$conn->close();
?>
