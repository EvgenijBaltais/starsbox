<?

require_once '../system/db.php';

$postdata = json_decode(file_get_contents("php://input"));

if (!$postdata || $postdata == '') {
    echo json_encode(['success'=> '1']);
    die();
}

$id_values = '(';

foreach ($postdata->order as $value) {
    $id_values .= '"' . $value->id . '",';
}

$id_values = substr($id_values, 0, -1);
$id_values .= ')';


$sql = 'SELECT products.id AS id, products.name AS name, category.name AS category, brands.name AS brand, countries.name AS country, weights.value AS weight, rating, sale, price, value, url_name FROM products JOIN weights ON products.weight=weights.id JOIN brands ON products.brand=brands.id JOIN countries ON products.country=countries.id JOIN category ON products.category=category.id where products.id IN' . $id_values;

$result = $conn->query($sql);

while($row = mysqli_fetch_assoc($result)) {
    $products[] = $row;
}

echo json_encode(['data' => $products]);

?>