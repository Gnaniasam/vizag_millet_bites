document.addEventListener("DOMContentLoaded", () => {
  // Load cart and total from localStorage
  let cart = JSON.parse(localStorage.getItem("orderCart")) || {};
  let total = parseFloat(localStorage.getItem("orderTotal")) || 0;

  const orderItemsTbody = document.getElementById("order-items");
  const orderTotalP = document.getElementById("order-total");
  const checkoutForm = document.getElementById("checkout-form");

  // Helper: format quantity string for display
  function formatQuantity(item) {
    if (item.product.type === "combo") {
      return `${item.quantity} Pack${item.quantity > 1 ? "s" : ""}`;
    } else {
      const unit = item.product.pricePer === 250 ? 250 : 100;
      if (item.quantity >= 1000) {
        return (item.quantity / 1000).toFixed(2) + " kg";
      } else {
        return item.quantity + " g";
      }
    }
  }

  // Helper: compute item total price
  function computeItemTotal(item) {
    if (item.product.type === "combo") {
      return item.quantity * item.product.price;
    } else {
      const unit = item.product.pricePer === 250 ? 250 : 100;
      return (item.quantity / unit) * item.product.price;
    }
  }

  // Populate the table body
  if (Object.keys(cart).length === 0) {
    orderItemsTbody.innerHTML =
      `<tr><td colspan="3" style="text-align:center; padding:12px;">Your cart is empty.</td></tr>`;
    orderTotalP.textContent = "";
  } else {
    orderItemsTbody.innerHTML = ""; // clear existing rows
    for (const productName in cart) {
      const item = cart[productName];
      const itemTotal = computeItemTotal(item);
      const qtyText = formatQuantity(item);

      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.innerHTML = `<strong>${productName}</strong>`;

      const tdQty = document.createElement("td");
      tdQty.textContent = qtyText;

      const tdPrice = document.createElement("td");
      tdPrice.textContent = `₹${itemTotal.toFixed(2)}`;
      tdPrice.style.textAlign = "right";

      tr.appendChild(tdName);
      tr.appendChild(tdQty);
      tr.appendChild(tdPrice);

      orderItemsTbody.appendChild(tr);
    }

    orderTotalP.textContent = "Total: ₹" + total.toFixed(2);
  }

  // Handle checkout form submission (Razorpay flow)
  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty. Please add items before checkout.");
      return;
    }

    // Collect customer info
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const door = document.getElementById("door").value.trim();
    const street = document.getElementById("street").value.trim();
    const area = document.getElementById("area").value.trim();
    const nearby = document.getElementById("nearby").value.trim() || "";
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const pincode = document.getElementById("pincode").value.trim();

    const customer = { name, phone, email, door, street, area, nearby, city, state, pincode };

    // Razorpay options - replace key with your actual key
    const options = {
      key: "rzp_test_RGFvmNP1FiIT6V", // TODO: replace with your Razorpay key
      amount: Math.round(total * 100), // amount in paise (integer)
      currency: "INR",
      name: "Millet Bites",
      description: "Order Payment",
      handler: function (response) {
        // Save success summary
        const orderSummary = {
          cart,
          total,
          customer,
          paymentId: response.razorpay_payment_id
        };
        localStorage.setItem("paymentSuccess", JSON.stringify(orderSummary));
        // Clear cart
        localStorage.removeItem("orderCart");
        localStorage.removeItem("orderTotal");
        // Redirect to home (or success page)
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

    const rzp = new Razorpay(options);
    rzp.open();

    // Payment failed handler
    rzp.on("payment.failed", function () {
      localStorage.setItem("paymentFailure", "true");
      window.location.href = "index.html#home";
    });
  });
});

// Back to Cart function
function goBackToCart() {
  window.history.back();
}

