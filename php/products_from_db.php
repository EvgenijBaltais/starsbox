<?

require_once('./system/db.php');

// Products - для слияния JOIN с другими таблицами. Products_info для вытаскивания готовой инфы

$sql = "SELECT 
    products.id AS id,
    products.name AS name,
    category.name AS category,
    brands.name AS brand,
    countries.name AS country,
    weights.value AS weight,
    blends.blend AS blend,
    package_types.name AS package_type,
    product_info.products_text AS products_text,
    product_info.products_smalltext AS products_smalltext,
    product_info.images AS images,
    product_info.tastes AS tastes,
    product_info.beans_region AS beans_region,
    rating,
    sale,
    price,
    roasting,
    storage_life,
    gabarites,
    energy_value,
    additional_tastes,
    flavor_shade,
    storage_temperature,
    proteins,
    available,
    fats,
    carbs,
    url_name FROM products
    JOIN weights ON products.weight=weights.id
    JOIN blends ON products.blend=blends.id
    JOIN brands ON products.brand=brands.id
    JOIN countries ON products.country=countries.id
    JOIN category ON products.category=category.id
    JOIN product_info ON products.id=product_info.products_id
    JOIN package_types ON products.package_type=package_types.id
    where available = 1 order by `priority`";
$result = $conn->query($sql);

while($row = mysqli_fetch_assoc($result)) {
    $products[] = $row;
}

$result->free_result();
$conn->close();

?>