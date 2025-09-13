
<?php
require 'vendor/autoload.php'; // install Razorpay SDK via Composer
use Razorpay\Api\Api;

// Read input JSON from checkout.js
$input = json_decode(file_get_contents('php://input'), true);

// Razorpay keys (keep secret key only here, never in JS)
$keyId = "rzp_test_RGFvmNP1FiIT6V";      // replace with your test/live key
$keySecret = "YOUR_SECRET_KEY";         // replace with your test/live secret

$api = new Api($keyId, $keySecret);

// Create Razorpay order
$order = $api->order->create([
    'receipt'  => 'order_' . time(),
    'amount'   => $input['total'] * 100, // in paise
    'currency' => 'INR'
]);

// Return order info to frontend
header('Content-Type: application/json');
echo json_encode($order);
