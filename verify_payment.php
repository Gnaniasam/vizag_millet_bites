
<?php
require 'vendor/autoload.php';
use Razorpay\Api\Api;

$input = json_decode(file_get_contents('php://input'), true);

// Razorpay keys
$keyId = "rzp_test_RGFvmNP1FiIT6V";
$keySecret = "YOUR_SECRET_KEY";

$api = new Api($keyId, $keySecret);

try {
    // Verify payment signature
    $attributes = [
        'razorpay_order_id'   => $input['response']['razorpay_order_id'],
        'razorpay_payment_id' => $input['response']['razorpay_payment_id'],
        'razorpay_signature'  => $input['response']['razorpay_signature']
    ];

    $api->utility->verifyPaymentSignature($attributes);

    // Build order data
    $orderData = [
        "customer"   => $input['customer'],
        "cart"       => $input['cart'],
        "total"      => $input['total'],
        "payment_id" => $input['response']['razorpay_payment_id'],
        "order_id"   => $input['response']['razorpay_order_id'],
        "time"       => date("Y-m-d H:i:s")
    ];

    // ✅ Save order to file (you can use database instead)
    file_put_contents("orders.txt", json_encode($orderData) . PHP_EOL, FILE_APPEND);

    // ✅ (Optional) Send email notification
    $to = "youremail@example.com"; // change to your email
    $subject = "New Order Received - " . $orderData['order_id'];
    $message = "Payment Successful!\n\n" . print_r($orderData, true);
    @mail($to, $subject, $message);

    echo json_encode(["status" => "success"]);
} catch (Exception $e) {
    echo json_encode(["status" => "failed", "message" => $e->getMessage()]);
}
