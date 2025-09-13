// checkoutscript.js

document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let orderItemsDiv = document.getElementById("order-items");
  let orderTotalP = document.getElementById("order-total");
  let checkoutForm = document.getElementById("checkout-form");

  // ✅ Show cart items in checkout page
  if (cart.length === 0) {
    orderItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    orderTotalP.textContent = "";
  } else {
    let total = 0;
    orderItemsDiv.innerHTML = "";

    cart.forEach(item => {
      let div = document.createElement("div");
      div.classList.add("order-item");
      div.innerHTML = `
        <p><strong>${item.name}</strong> × ${item.quantity}</p>
        <p>₹${(item.price * item.quantity).toFixed(2)}</p>
      `;
      orderItemsDiv.appendChild(div);

      total += item.price * item.quantity;
    });

    orderTotalP.textContent = "Total: ₹" + total.toFixed(2);
  }

  // ✅ Handle checkout form submission
  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      return;
    }

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let door = document.getElementById("door").value;
    let street = document.getElementById("street").value;
    let area = document.getElementById("area").value;
    let nearby = document.getElementById("nearby").value || "";
    let city = document.getElementById("city").value;
    let state = document.getElementById("state").value;
    let pincode = document.getElementById("pincode").value;

    let address = `${door}, ${street}, ${area}, ${nearby}, ${city}, ${state} - ${pincode}`;

    // ✅ Calculate total amount
    let totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // ✅ Razorpay options
    let options = {
      key: "rzp_test_xxxxxxxxx", // replace with your Razorpay key
      amount: totalAmount * 100, // in paise
      currency: "INR",
      name: "Millet Bites",
      description: "Order Payment",
      handler: function (response) {
        alert("✅ Payment Successful! Payment ID: " + response.razorpay_payment_id);

        // Save order summary (optional: send to backend instead)
        let orderSummary = {
          name,
          phone,
          email,
          address,
          items: cart,
          total: totalAmount,
          paymentId: response.razorpay_payment_id
        };

        console.log("Order Placed:", orderSummary);

        // ✅ Clear cart after success
        localStorage.removeItem("cart");
        window.location.href = "index.html#home"; // back to home
      },
      prefill: {
        name: name,
        email: email,
        contact: phone
      },
      theme: {
        color: "#ff7043"
      }
    };

    let rzp = new Razorpay(options);
    rzp.open();
  });
});

// ✅ Back to Cart function
function goBackToCart() {
  window.location.href = "index.html#menu";
}
