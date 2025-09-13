document.addEventListener("DOMContentLoaded", () => {
  // ✅ Try orderCart first (retry flow), else fallback to cart
  let cart = JSON.parse(localStorage.getItem("orderCart")) 
          || JSON.parse(localStorage.getItem("cart")) 
          || {};
  let total = 0;

  const orderItemsTbody = document.getElementById("order-items");
  const orderTotalP = document.getElementById("order-total");
  const checkoutForm = document.getElementById("checkout-form");

  // Helper: format quantity
  function formatQuantity(item) {
    if (item.product.type === "combo") {
      return `${item.quantity} Pack${item.quantity > 1 ? "s" : ""}`;
    } else {
      const unit = item.product.pricePer === 250 ? 250 : 100;
      return item.quantity >= 1000
        ? (item.quantity / 1000).toFixed(2) + " kg"
        : item.quantity + " g";
    }
  }

  // Helper: compute subtotal
  function computeItemTotal(item) {
    if (item.product.type === "combo") {
      return item.quantity * item.product.price;
    } else {
      const unit = item.product.pricePer === 250 ? 250 : 100;
      return (item.quantity / unit) * item.product.price;
    }
  }

  // ✅ Populate table
  if (Object.keys(cart).length === 0) {
    orderItemsTbody.innerHTML =
      `<tr><td colspan="3" style="text-align:center; padding:12px;">Your cart is empty.</td></tr>`;
    orderTotalP.textContent = "";
  } else {
    orderItemsTbody.innerHTML = "";
    total = 0;
    for (const productName in cart) {
      const item = cart[productName];
      const itemTotal = computeItemTotal(item);
      total += itemTotal;

      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.innerHTML = `<strong>${productName}</strong>`;

      const tdQty = document.createElement("td");
      tdQty.textContent = formatQuantity(item);

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

  // ✅ Save cart + total before submitting form
  checkoutForm.addEventListener("submit", function () {
    localStorage.setItem("orderCart", JSON.stringify(cart));
    localStorage.setItem("orderTotal", total);
  });
});

// ✅ Back to Cart button
function goBackToCart() {
  window.location.href = "cart.html";
}
