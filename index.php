<?php

require "system/Route.php";
require_once("php/products_from_db.php");
require_once("php/functions.php");

// Костыль на случай если есть параметры, например utm метки 
$url = '';
if (strpos( $_SERVER["REQUEST_URI"], '?' ) !== false) {
	$url = substr($_SERVER["REQUEST_URI"], strpos( $_SERVER["REQUEST_URI"], '?' ));
}


$r = new Router();
$r->addRoute('/' . $url, 'main.php');
$r->addRoute('/about' . $url, 'about.php');
$r->addRoute('/delivery' . $url, 'delivery.php');
$r->addRoute('/return' . $url, 'return.php');
$r->addRoute('/cart' . $url, 'cart.php');
$r->addRoute('/catalog' . $url, 'catalog.php');
$r->addRoute('/sale' . $url, 'sale.php');
$r->addRoute('/contacts' . $url, 'contacts.php');
$r->addRoute('/404' . $url, '404.php');
$r->addRoute('/catalog/kofe_v_zernah' . $url, 'kofe_v_zernah.php');
$r->addRoute('/catalog/molotiy_kofe' . $url, 'molotiy_kofe.php');
$r->addRoute('/php/cart_data' . $url, 'php/cart_data.php');

for ($i = 0; $i < count($products); $i++) {
	$r->addRoute('/catalog/' . $products[$i]['url_name'] . $url, 'catalog/page.php');
}

$r->route($_SERVER["REQUEST_URI"], $products);

?>