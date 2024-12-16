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
$type_of_connect = '';
$type_of_call = '';
$communication_method = '';

if (isset($_POST['name'])) {
  $name = $_POST['name'];
}
if (isset($_POST['email'])) {
  $email = $_POST['email'];
}
if (isset($_POST['phone'])) {
  $phone = $_POST['phone'];
}
if (isset($_POST['comment'])) {
  $comment = $_POST['comment'];
}
if (isset($_POST['type_of_connect'])) {
  $type_of_connect = $_POST['type_of_connect'];
}
if (isset($_POST['type_of_call'])) {
  $type_of_call = $_POST['type_of_call'];
}

$communication_method = $type_of_connect . '; ' . $type_of_call;


// Запись в БД


$sql = "INSERT INTO `client_contacts_messages` (`name`, `email`, `phone`, `text`, `communication_method`) VALUES ('" . $name . "', '" . $email . "', '" . $phone . "', '" . $comment . "', '" . $communication_method . "')";
$result = $conn->query($sql);

if (!$result) {
  echo $sql . "Error: " . $conn->error;
}

// Запись в БД, конец

$name == '' ? $name = 'не указано' : '';
$email == '' ? $email = 'не указано' : '';
$phone == '' ? $phone = 'не указано' : '';
$comment == '' ? $comment = 'не указано' : '';
$type_of_connect == '' ? $type_of_connect = 'не указано' : '';
$type_of_call == '' ? $type_of_call = 'не указано' : '';

$mail->isHTML(true);

$mail->Subject = 'Новое сообщение с формы "Отправить заявку":';
$mail->Body    = '<p style = "color: #000; font-size: 22px; line-height: 30px;">Данные с формы:</p>';

$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Имя: <span style = "font-weight: bold;">' . $name . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Email: <span style = "font-weight: bold;">' . $email . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Телефон: <span style = "font-weight: bold;">' . $phone . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Способ связи: <span style = "font-weight: bold;">' . $type_of_connect . '; ' . $type_of_call . '</span></p>';
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