window.addEventListener("load", function () {
  const successData = JSON.parse(localStorage.getItem("paymentSuccess") || "null");
  if (successData) {
    let summary = "<h3>🧾 Order Summary:</h3><ul>";
    for (const productName in successData.cart) {
      const item = successData.cart[productName];
      let qtyText = item.product.type === "combo"
        ? `${item.quantity} Pack${item.quantity > 1 ? "s" : ""}`
        : item.quantity >= 1000
          ? (item.quantity / 1000).toFixed(2) + " kg"
          : item.quantity + " g";
      summary += `<li>${productName}: ${qtyText}</li>`;
    }
    summary += "</ul>";
    summary += `<p><strong>💰 Total Paid:</strong> ₹${successData.total.toFixed(2)}</p>`;
    summary += `<p><strong>🆔 Payment ID:</strong> ${successData.paymentId}</p>`;
    summary += `<h3>📍 Delivery Details:</h3>`;
    summary += `<p>${successData.customer.name}, ${successData.customer.phone}</p>`;
    summary += `<p>${successData.customer.door}, ${successData.customer.street}, ${successData.customer.area}</p>`;
    summary += `<p>${successData.customer.city}, ${successData.customer.state} - ${successData.customer.pincode}</p>`;

    document.getElementById("orderSummary").innerHTML = summary;
    document.getElementById("successModal").style.display = "flex";

    // OK button closes modal
    document.getElementById("okBtn").onclick = () => {
      document.getElementById("successModal").style.display = "none";
    };

    // Create Screenshot button if it doesn't exist
    if (!document.getElementById("screenshotBtn")) {
      const btn = document.createElement("button");
      btn.id = "screenshotBtn";
      btn.textContent = "📸 Screenshot";
      btn.style.cssText = "position:absolute; top:15px; right:15px; padding:8px 12px; border:none; border-radius:6px; cursor:pointer; background:#ff7043; color:#fff;";
      btn.onclick = () => {
        // Capture screenshot of orderSummary div
        const captureEl = document.getElementById("orderSummary");
        html2canvas(captureEl).then(canvas => {
          const link = document.createElement("a");
          link.download = "order_summary.png";
          link.href = canvas.toDataURL();
          link.click();
        });
      };
      // Append to modal content
      document.getElementById("successModal").querySelector("div").appendChild(btn);
    }

    localStorage.removeItem("paymentSuccess");
  }

  if (localStorage.getItem("paymentFailure")) {
    document.getElementById("failureModal").style.display = "flex";
    document.getElementById("closeFailureModal").onclick = () => document.getElementById("failureModal").style.display = "none";
    document.getElementById("retryBtn").onclick = function () { window.location.href = "checkout.html"; };
    localStorage.removeItem("paymentFailure");
  }
});
