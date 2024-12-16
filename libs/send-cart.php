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

$data['name'] = '';
$data['email'] = '';
$data['phone'] = '';
$data['textarea'] = '';
$data['payment'] = '';
$data['order'] = '';
$data['items'] = '';
$data['final_price'] = '';

$data = json_decode(file_get_contents('php://input'), true);


$data['name'] == '' ? $data['name'] = 'не указано' : '';
$data['email'] == '' ? $data['email'] = 'не указано' : '';
$data['phone'] == '' ? $data['phone'] = 'не указано' : '';
$data['textarea'] == '' ? $data['textarea'] = 'не указано' : '';
$data['payment'] == '' ? $data['payment'] = 'не указано' : '';
$data['order'] == '' ? $data['order'] = 'не указано' : '';
$data['items'] == '' ? $data['items'] = 'не указано' : '';
$data['final_price'] == '' ? $data['final_price'] = 'не указано' : '';
$order_text = '';

$mail->isHTML(true);

$mail->Subject = 'Новый заказ из корзины:';
$mail->Body    = '<p style = "color: #000; font-size: 22px; line-height: 30px;">Данные с формы:</p>';

$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Имя: <span style = "font-weight: bold;">' . $data['name'] . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Email: <span style = "font-weight: bold;">' . $data['email'] . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Телефон: <span style = "font-weight: bold;">' . $data['phone'] . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Комментарий: <span style = "font-weight: bold;">' . $data['textarea'] . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Тип платежа: <span style = "font-weight: bold;">' . $data['payment'] . '</span></p>';
$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Финальная цена: <span style = "font-weight: bold;">' . number_format($data['final_price'], 0, '', ' ') . '</span></p>';

if ($data['items']) {
  $mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">Заказ:</p>';
  foreach ($data['items'] as $item) {

    $order_text .= $item['name'] . ', кол-во: ' . $item['amount'] . ', цена: ' . number_format($item['price'], 0, '', ' ') . '; ';

    $mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;">
    <span style = "font-weight: bold;">' . $item['name'] . ', кол-во: ' . $item['amount'] . ', цена: ' . number_format($item['price'], 0, '', ' ') . '</span>
    </p>';
  }
}

$mail->Body    .= '<p style = "color: #000; font-size: 18px; line-height: 24px;"><br><br>Заказ в формате json: <span style = "font-weight: bold;">' . $data['order'] . '</span></p>';

$mail_result = $mail->send();


// Запись в БД


$sql = "INSERT INTO `client_orders` (`name`, `email`, `phone`, `comment`, `paymethod`, `order`, `final_price`, `items`) VALUES (
  '" . $data["name"] . "', '" . $data["email"] . "', '" . $data["phone"] . "', '" . $data['textarea'] . "', '" . $data["payment"] . "', '" . $data["order"] . "', '" . $data["final_price"] . "', '" . $order_text . "')";

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