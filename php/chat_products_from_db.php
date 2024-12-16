<?

if (!isset($_POST['get_data']) || $_POST['get_data'] != 1) {
    echo '[]';
    die();
}

require_once('../system/db.php');

$sql = "SELECT 
    products.id AS id,
    products.name AS name,
    brands.name AS brand,
    weights.value AS weight,
    blends.blend AS blend,
    product_info.images AS images,
    tastes.value AS chat_tastes,
    sale,
    price,
    roasting,
    url_name FROM products
    JOIN weights ON products.weight=weights.id
    JOIN blends ON products.blend=blends.id
    JOIN brands ON products.brand=brands.id
    JOIN tastes ON products.chat_tastes=tastes.id
    JOIN product_info ON products.id=product_info.products_id
    where available = 1";
$result = $conn->query($sql);

$row = $result->fetch_all(MYSQLI_ASSOC);

$result->free_result();
$conn->close();

echo json_encode($row);

?>