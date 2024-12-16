<?php

header('Access-Control-Allow-Origin: *');

require_once('../system/db.php');

if (isset($_POST['email'])) {
  $email = $_POST['email'];
}

// Запись в БД

$sql = "INSERT INTO `subscribe_emails` (`email`) VALUES ('" . $email . "')";
$result = $conn->query($sql);

// Запись в БД, конец

if ($result) {
  echo 'Успешная отправка!';
}
else if (!$result) {
  echo 'Неудачная отправка';
}
else {
  echo 'Unknown error';
}

?>