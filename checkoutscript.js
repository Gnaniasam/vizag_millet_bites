document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("orderCart")) || {};
  let total = parseFloat(localStorage.getItem("orderTotal")) || 0;

  let orderItemsDiv = document.getElementById("order-items");
  let orderTotalP = document.getElementById("order-total");
  let checkoutForm = document.getElementById("checkout-form");

  // ✅ Show cart items in checkout page
  if (Object.keys(cart).length === 0) {
    orderItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    orderTotalP.textContent = "";
  } else {
    orderItemsDiv.innerHTML = "";
    for (const productName in cart) {
      const item = cart[productName];
      let itemTotal = 0;

      if (item.product.type === "combo") {
        itemTotal = item.quantity * item.product.price;
      } else {
        const unit = item.product.pricePer === 250 ? 250 : 100;
        itemTotal = (item.quantity / unit) * item.product.price;
      }

      const div = document.createElement("div");
      div.classList.add("order-item");
      div.innerHTML = `
        <p><strong>${productName}</strong> × 
           ${item.product.type === "combo" 
              ? `${item.quantity} Pack${item.quantity > 1 ? "s" : ""}` 
              : item.quantity >= 1000 
                ? (item.quantity / 1000).toFixed(2) + " kg" 
                : item.quantity + " g"}
        </p>
        <p>₹${itemTotal.toFixed(2)}</p>
      `;
      orderItemsDiv.appendChild(div);
    }

    orderTotalP.textContent = "Total: ₹" + total.toFixed(2);
  }

  // ✅ Handle checkout form submission
  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (Object.keys(cart).length === 0) {
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

    // ✅ Customer object
    let customer = { name, phone, email, door, street, area, nearby, city, state, pincode };

    // ✅ Razorpay options
    let options = {
      key: "rzp_test_xxxxxxxxx", // replace with your Razorpay key
      amount: total * 100, // in paise
      currency: "INR",
      name: "Millet Bites",
      description: "Order Payment",
      handler: function (response) {
        // ✅ Save order summary for success modal
        let orderSummary = {
          cart,
          total,
          customer,
          paymentId: response.razorpay_payment_id
        };

        localStorage.setItem("paymentSuccess", JSON.stringify(orderSummary));

        // Clear cart
        localStorage.removeItem("orderCart");
        localStorage.removeItem("orderTotal");

        // Redirect back to home (modal will show)
        window.location.href = "index.html#home";
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

    // If user cancels, mark as failure
    rzp.on("payment.failed", function () {
      localStorage.setItem("paymentFailure", "true");
      window.location.href = "index.html#home";
    });
  });
});

// ✅ Back to Cart function
function goBackToCart() {
  window.location.href = "index.html#menu";
}
