<?php
session_start();

// Get form data
$name = $_POST['name'] ?? '';
$phone = $_POST['phone'] ?? '';
$email = $_POST['email'] ?? '';
$door = $_POST['door'] ?? '';
$street = $_POST['street'] ?? '';
$area = $_POST['area'] ?? '';
$nearby = $_POST['nearby'] ?? '';
$city = $_POST['city'] ?? '';
$state = $_POST['state'] ?? '';
$pincode = $_POST['pincode'] ?? '';

$cart_json = $_POST['cart'] ?? '[]';
$cart = json_decode($cart_json, true);

$total = 0;
foreach($cart as $item) {
    if($item['product']['type'] == 'combo') {
        $total += $item['quantity'] * $item['product']['price'];
    } else {
        $unit = isset($item['product']['pricePer']) && $item['product']['pricePer']==250 ? 250 : 100;
        $total += ($item['quantity'] / $unit) * $item['product']['price'];
    }
}

// Simulate payment
$paymentSuccess = rand(0,1); // 1 = success, 0 = failure
$paymentId = 'PAYMENT_' . rand(100000,999999);
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Payment Status | Millet Bites</title>
<style>
.modal { display:flex; position:fixed; top:0; left:0; width:100%; height:100%; justify-content:center; align-items:center; background:rgba(0,0,0,0.6); }
.modal-content { background:#fff; padding:20px; border-radius:8px; max-width:500px; width:90%; text-align:center; }
button { padding:10px 15px; margin-top:10px; cursor:pointer; }
</style>
</head>
<body>

<?php if($paymentSuccess): ?>
<!-- Success Modal -->
<div id="successModal" class="modal">
  <div class="modal-content">
    <h2>✅ Payment Successful!</h2>
    <p style="color:red; font-weight:bold;">📸 Please take a screenshot of this page for your reference.</p>
    <div id="orderSummary">
      <h3>🧾 Order Summary:</h3>
      <ul>
        <?php foreach($cart as $item): 
            $qty = $item['product']['type']=='combo' ? $item['quantity'].' Pack'.($item['quantity']>1?'s':'') : 
                   ($item['quantity']>=1000 ? number_format($item['quantity']/1000,2).' kg' : $item['quantity'].' g'); 
            $price = $item['product']['type']=='combo' ? $item['quantity']*$item['product']['price'] : 
                     ($item['quantity']/($item['product']['pricePer']??100))*$item['product']['price'];
        ?>
        <li><?php echo $item['product']['name']; ?>: <?php echo $qty; ?> - ₹<?php echo number_format($price,2); ?></li>
        <?php endforeach; ?>
      </ul>
      <p><strong>💰 Total Paid:</strong> ₹<?php echo number_format($total,2); ?></p>
      <p><strong>🆔 Payment ID:</strong> <?php echo $paymentId; ?></p>
      <h3>📍 Delivery Details:</h3>
      <p><?php echo "$name, $phone, $email"; ?></p>
      <p><?php echo "$door, $street, $area, $nearby"; ?></p>
      <p><?php echo "$city, $state - $pincode"; ?></p>
    </div>
    <button onclick="window.location.href='index.html#home'">OK</button>
  </div>
</div>

<?php else: ?>
<!-- Failure Modal -->
<div id="failureModal" class="modal">
  <div class="modal-content">
    <h2 style="color:red;">❌ Payment Failed or Canceled</h2>
    <p>Please try again. Your cart is still saved.</p>
    <button onclick="window.location.href='checkout.html'">Order Again</button>
  </div>
</div>
<?php endif; ?>

</body>
</html>
