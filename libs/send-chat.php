<?php

header('Access-Control-Allow-Origin: *');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once('phpmailer/src/Exception.php');
require_once('phpmailer/src/PHPMailer.php');
require_once('phpmailer/src/SMTP.php');
require_once('../system/db.php');

$mail = new PHPMailer(true);
$mail->SMTPDebug = 2;
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

$data['product_name'] = '';
$data['amount'] = '';
$data['default_price'] = '';
$data['price'] = '';
$data['when_pay'] = '';
$data['client_name'] = '';
$data['client_phone'] = '';
$data['adress'] = '';
$data['confirmation'] = '';
$data['id'] = '';

$data = json_decode(file_get_contents('php://input'), true);

var_dump($data);


$data['product_name'] == '' ? $data['product_name'] = 'не указано' : '';
$data['amount'] == '' ? $data['amount'] = 'не указано' : '';
$data['price'] == '' ? $data['price'] = 'не указано' : '';
$data['when_pay'] == '' ? $data['when_pay'] = 'не указано' : '';
$data['client_name'] == '' ? $data['client_name'] = 'не указано' : '';
$data['client_phone'] == '' ? $data['client_phone'] = 'не указано' : '';
$data['adress'] == '' ? $data['adress'] = 'не указано' : '';
$data['confirmation'] == '' ? $data['confirmation'] = 'не указано' : '';
$data['id'] == '' ? $data['id'] = 'не указано' : '';

$mail->isHTML(true);

$mail->Subject = 'Новый заказ из чата:';
$mail->Body    = '<p style = "color: #000; font-size: 22px; line-height: 30px;">Данные с формы:</p>';

$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Заказали: <span style = "font-weight: bold;">' . $data['product_name'] . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Количество: <span style = "font-weight: bold;">' . $data['amount'] . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Имя: <span style = "font-weight: bold;">' . $data['client_name'] . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Адрес: <span style = "font-weight: bold;">' . $data['adress'] . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Телефон: <span style = "font-weight: bold;">' . $data['client_phone'] . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Подтверждение: <span style = "font-weight: bold;">' . $data['confirmation'] . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Когда платить: <span style = "font-weight: bold;">' . $data['when_pay'] . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">ID: <span style = "font-weight: bold;">' . $data['id'] . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Финальная цена: <span style = "font-weight: bold;">' . number_format($data['price'], 0, '', ' ') . '</span></p>';

$mail_result = $mail->send();


// Запись в БД


$sql = "INSERT INTO `chat_orders` (`name`, `phone`, `adress`, `product`, `product_id`, `price`, `when_pay`, `confirmation`) VALUES (
  '" . $data['client_name'] . "', '" . $data['client_phone'] . "', '" . $data['adress'] . "', '" . $data['product_name'] . "', '" . $data['id'] . "', '" . $data['price'] . "', '" . $data['when_pay'] . "', '" . $data['confirmation'] . "')";

echo $sql;
$result = $conn->query($sql);

if (!$result) {
  echo "Error: " . $conn->error;
}

// Запись в БД, конец


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