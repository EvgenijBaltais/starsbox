<?php

header('Access-Control-Allow-Origin: *');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once('phpmailer/src/Exception.php');
require_once('phpmailer/src/PHPMailer.php');
require_once('phpmailer/src/SMTP.php');
require_once('../system/db.php');

$mail = new PHPMailer(true);
//$mail->SMTPDebug = 2;
$mail->isSMTP(); 

$mail->Host = 'smtp.mail.ru';

$mail->SMTPAuth = true;

$mail->Username = 'evgenij.baltais@mail.ru';
$mail->Password = 'xgi1dH9hdh9WJwT6Udfz';
$mail->SMTPSecure = 'ssl';
$mail->Port = 465;  
$mail->CharSet = "utf-8";

$mail->setFrom('evgenij.baltais@mail.ru', 'С bluebeans.ru');

$mail->addAddress('evgenij.baltais@yandex.ru');

$name = '';
$email = '';
$comment = '';

if (isset($_POST['name'])) {
  $name = $_POST['name'];
}
if (isset($_POST['email'])) {
  $email = $_POST['email'];
}
if (isset($_POST['comment'])) {
  $comment = $_POST['comment'];
}

// Запись в БД

$sql = "INSERT INTO `client_requests` (`name`, `email`, `text`) VALUES ('" . $name . "', '" . $email . "', '" . $comment . "')";
$result = $conn->query($sql);

if (!$result) {
  echo "Error: " . $conn->error;
}

// Запись в БД, конец


$name == '' ? $name = 'не указано' : '';
$email == '' ? $email = 'не указано' : '';
$comment == '' ? $comment = 'не указано' : '';

$mail->isHTML(true);

$mail->Subject = 'Новый отзыв на главной:';
$mail->Body    = '<p style = "color: #000; font-size: 22px; line-height: 30px;">Данные с формы:</p>';

$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Имя: <span style = "font-weight: bold;">' . $name . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Email: <span style = "font-weight: bold;">' . $email . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Комментарий: <span style = "font-weight: bold;">' . $comment . '</span></p>';

$mail_result = $mail->send();


if ($result && $mail_result) {
  echo 'Успешная отправка!';
}

else if ($result && !$mail_result) {
  echo 'Успешная запись в базу, на почту не дошло';
}

else if (!$result && $mail_result) {
  echo 'На почту дошло, в базу записать не удалось';
}

else if (!$result && !$mail_result) {
  echo 'Неудачная отправка';
}

else {
  echo 'Unknown error';
}

?>