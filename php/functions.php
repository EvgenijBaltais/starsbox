<?

	function get_weights ($data) {

		$weights = array();

		foreach ($data as $key => $value) {
			(int)$value['weight'] == 1 ? $value['weight'] = 1000 : '';
			array_push($weights, (int)$value['weight']);
		}

		$weights = array_unique($weights);
		rsort($weights);
		return $weights;
	}

	function get_brands ($data) {

		$brands = array();

		foreach ($data as $key => $value) {
			in_array($value['brand'], $brands) ? '' : array_push($brands, $value['brand']);
		}
		return $brands;
	}

	function check_get_weight ($weights) {

		$get_weight = false;

		if (isset($_GET['weight']) && in_array($_GET['weight'], $weights)) {
			$get_weight = $_GET['weight'];
		}

		return $get_weight;
	}

?>