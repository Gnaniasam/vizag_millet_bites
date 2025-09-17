<?php
include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$customer_name = $data['customer']['name'];
$customer_phone = $data['customer']['phone'];
$customer_email = $data['customer']['email'];
$address = $data['customer']['door'] . ", " . $data['customer']['street'] . ", " . $data['customer']['area'] . ", " . $data['customer']['city'] . ", " . $data['customer']['state'] . ", " . $data['customer']['pincode'];
$total = $data['total'];
$items = json_encode($data['cart']);
$payment_id = $data['paymentId'];
$status = 'Completed';

$stmt = $conn->prepare("INSERT INTO orders (customer_name, customer_phone, customer_email, address, total, items, payment_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssdsss", $customer_name, $customer_phone, $customer_email, $address, $total, $items, $payment_id, $status);

if($stmt->execute()){
    echo json_encode(["success"=>true]);
} else {
    echo json_encode(["success"=>false]);
}
?>
