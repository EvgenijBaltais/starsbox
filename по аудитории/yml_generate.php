<?php

$filename = 'YML_sample_catalog.xml';

rename("$filename","*" . "$filename");
unlink("*" . "$filename");

  $dom = new domDocument("1.0", "utf-8"); // Создаём XML-документ версии 1.0 с кодировкой utf-8
  $root = $dom->createElement("yml_catalog"); // Создаём корневой элемент
  $root->setAttribute("date", date("Y-m-d H:i:s"));
  $dom->appendChild($root);
  $shop = $dom->createElement("shop"); // Создаём корневой элемент

  $name = $dom->createElement("name", ucfirst($_SERVER[SERVER_NAME]));
  $company = $dom->createElement("company", ucfirst($_SERVER[SERVER_NAME]));
  $url = $dom->createElement("url", 'https://' . $_SERVER[SERVER_NAME]);

  // Валюты
  $currencies = $dom->createElement("currencies");
  $currency = $dom->createElement("currency");
  $currency->setAttribute("id", "RUR");
  $currency->setAttribute("rate", "1");
  $currencies->appendChild($currency);

  // Категории
  // 
   // Костыль - удаление крабов из yandex feed
  //$categories_array = array("Живые раки", "Свежесваренные раки", "Крабы");
  $categories_array = array("Живые раки", "Свежесваренные раки");
  $categories = $dom->createElement("categories");

  for ($i = 0; $i < count($categories_array); $i++) {
      $id = $i + 1;
      $category = $dom->createElement("category", $categories_array[$i]);
      $category->setAttribute("id", $id);
      $categories->appendChild($category);
  }

  // Доставка
  $delivery = $dom->createElement("delivery-options");
  $deliveryoption = $dom->createElement("option");
  $deliveryoption->setAttribute("cost", "2000");
  $deliveryoption->setAttribute("days", "1");
  $delivery->appendChild($deliveryoption);

  $shop->appendChild($name);
  $shop->appendChild($company);
  $shop->appendChild($url);
  $shop->appendChild($currencies);
  $shop->appendChild($categories);
  $shop->appendChild($delivery);

  // Offers
  $in = file_get_contents('php://input');
  $offers = $dom->createElement("offers");
  $offers_array = json_decode($in, true);
  $offers_array = $offers_array["items"];

  for ($i = 0; $i < count($offers_array); $i++) {

      // Костыль - удаление 4 товаров - крабов из yandex feed
      if ($offers_array[$i]['id'] == 70 || $offers_array[$i]['id'] == 71 || $offers_array[$i]['id'] == 100632 || $offers_array[$i]['id'] == 100637) continue;

      $name = $dom->createElement("name", $offers_array[$i]['name']);
      $url = $dom->createElement("url", 'https://' . $_SERVER[SERVER_NAME] . '/product/' . $offers_array[$i]['id']);
      $price = $dom->createElement("price", $offers_array[$i]['price']);
      $currencyId = $dom->createElement("currencyId", "RUR");
      $categoryId = $dom->createElement("categoryId", $offers_array[$i]["categoryId"]);
      $picture = $dom->createElement("picture", 'https://' . $_SERVER[SERVER_NAME] . '/public/shab2/img/products/' . $offers_array[$i]['pic']);

      $description = $dom->createElement("description");

      $text = '<p>' . $offers_array[$i]['name'] . '</p><p>Масса: ' . $offers_array[$i]['weight'];
      if ($offers_array[$i]['kolvo']) {
        $text .= '<br />Кол-во: ' . $offers_array[$i]['kolvo'];
      }
      $text .= '</p>';

      $no = $dom->createCDATASection($text);
      $description->appendChild($no);

      $offer = $dom->createElement("offer");
      $offer->setAttribute("id", "product" . $offers_array[$i]['id']);
      $offer->setAttribute("available", "true");
      $offer->appendChild($name);
      $offer->appendChild($url);
      $offer->appendChild($price);
      $offer->appendChild($currencyId);
      $offer->appendChild($categoryId);
      $offer->appendChild($picture);
      $offer->appendChild($description);

      $offers->appendChild($offer);
  }

  $shop->appendChild($offers);
  $root->appendChild($shop);

  $dom->save("YML_sample_catalog.xml"); // Сохраняем полученный XML-документ в файл
?>