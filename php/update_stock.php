<?php
include 'db.php';
$id = $_POST['id'];
$newStock = $_POST['stock'];

$stmt = $conn->prepare("UPDATE products SET stock_status=? WHERE id=?");
$stmt->bind_param("si", $newStock, $id);

if($stmt->execute()){
    echo json_encode(["success"=>true]);
} else {
    echo json_encode(["success"=>false]);
}
?>
