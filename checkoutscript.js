
// ✅ Get order details from localStorage
var total = parseFloat(localStorage.getItem("orderTotal")) || 0;
var orderCart = JSON.parse(localStorage.getItem("orderCart")) || {};

function renderOrderSummary() {
  const orderItemsDiv = document.getElementById("order-items");
  const orderTotalP = document.getElementById("order-total");

  if (Object.keys(orderCart).length === 0) {
    orderItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    orderTotalP.textContent = "Total: ₹0.00";
    return;
  }

  let html = "<ul>";
  for (const productName in orderCart) {
    const item = orderCart[productName];

    let qtyText = item.product.type === "combo"
      ? `${item.quantity} Pack${item.quantity > 1 ? "s" : ""}`
      : item.quantity >= 1000
        ? (item.quantity / 1000).toFixed(2) + " kg"
        : item.quantity + " g";

    let itemPrice = item.product.type === "combo"
      ? item.quantity * item.product.price
      : (item.quantity / (item.product.pricePer === 250 ? 250 : 100)) * item.product.price;

    html += `<li>${productName} - ${qtyText} - ₹${itemPrice.toFixed(2)}</li>`;
  }
  html += "</ul>";

  orderItemsDiv.innerHTML = html;
  orderTotalP.textContent = `Total: ₹${total.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", renderOrderSummary);

// ✅ Handle payment
document.getElementById("checkout-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const customer = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    door: document.getElementById("door").value,
    street: document.getElementById("street").value,
    area: document.getElementById("area").value,
    nearby: document.getElementById("nearby").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    pincode: document.getElementById("pincode").value,
  };

  if (total <= 0) {
    alert("Invalid total amount!");
    return;
  }

  // ✅ Step 1: Ask backend to create Razorpay order
  const res = await fetch("create_order.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ total: total, customer: customer, cart: orderCart })
  });

  const orderData = await res.json();

  // ✅ Step 2: Open Razorpay Checkout
  var options = {
    key: "rzp_test_RGFvmNP1FiIT6V", // Public key only
    amount: orderData.amount,
    currency: "INR",
    name: "Millet Bites",
    description: "Product Purchase",
    order_id: orderData.id, // Razorpay order_id from backend
    handler: async function (response) {
      // ✅ Step 3: Verify payment on backend
      const verifyRes = await fetch("verify_payment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response: response,
          customer: customer,
          cart: orderCart,
          total: total
        })
      });

      const result = await verifyRes.json();

      if (result.status === "success") {
        // Save details for success modal (like before)
        localStorage.setItem("paymentSuccess", JSON.stringify({
          customer: customer,
          cart: orderCart,
          total: total,
          paymentId: response.razorpay_payment_id
        }));

        localStorage.removeItem("orderTotal");
        localStorage.removeItem("orderCart");

        window.location.href = "index.html";
      } else {
        // Save failure info
        localStorage.setItem("paymentFailure", "true");
        window.location.href = "index.html";
      }
    },
    prefill: {
      name: customer.name,
      email: customer.email,
      contact: customer.phone,
    },
    theme: { color: "#3399cc" },
    modal: {
      ondismiss: function () {
        localStorage.setItem("paymentFailure", "true");
        window.location.href = "index.html";
      }
    }
  };

  var rzp1 = new Razorpay(options);
  rzp1.open();
});
