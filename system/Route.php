<?php

class Router
{
	private $pages = array();

	function addRoute($url, $path) {
		$this->pages[$url] = $path;
	}

	function route($url, $data) {

		array_key_exists($url, $this->pages) ? $path = $this->pages[$url] : $path = '404.php';

		$file_dir = "pages/".$path;
		if ($path == "") {
			require "pages/404.php";
			die();
		}
	
		if (file_exists($file_dir)) {
			require $file_dir;
		}else {
			require "pages/404.php";
			die();
		}
	}
}

?>