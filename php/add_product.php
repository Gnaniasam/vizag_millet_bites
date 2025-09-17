<?php
include 'db.php';

$name = $_POST['name'];
$description = $_POST['description'];
$price = $_POST['price'];
$category = $_POST['category'];
$stock = $_POST['stock'];

// Handle image upload
if(isset($_FILES['image'])){
    $imageName = time().'_'.$_FILES['image']['name'];
    $target = 'uploads/' . $imageName;
    move_uploaded_file($_FILES['image']['tmp_name'], $target);
} else {
    $imageName = '';
}

$stmt = $conn->prepare("INSERT INTO products (name, description, price, category, stock_status, image) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssdsss", $name, $description, $price, $category, $stock, $imageName);
if($stmt->execute()){
    echo json_encode(["success"=>true]);
} else {
    echo json_encode(["success"=>false]);
}
?>
