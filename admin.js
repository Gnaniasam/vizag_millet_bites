document.addEventListener("DOMContentLoaded", () => {
  const addItemForm = document.getElementById("addItemForm");
  const itemsList = document.getElementById("itemsList");
  const ordersTable = document.querySelector("#ordersTable tbody");

  // ✅ Load saved items (or empty array if none)
  let items = JSON.parse(localStorage.getItem("items")) || [];

  // ✅ Render items in admin panel
  function renderItems() {
    itemsList.innerHTML = "";
    if (items.length === 0) {
      itemsList.innerHTML = "<p>No products added yet.</p>";
      return;
    }
    items.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("item-card");
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="info">
          <h3>${item.name}</h3>
          <p>₹${item.price} — ${item.stock}</p>
        </div>
        <div class="actions">
          <button onclick="removeItem(${index})">❌ Remove</button>
          <button onclick="toggleStock(${index})">🔄 Toggle Stock</button>
        </div>
      `;
      itemsList.appendChild(div);
    });
  }

  // ✅ Add Item
addItemForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const file = document.getElementById("itemImage").files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);
  formData.append("name", document.getElementById("itemName").value);
  formData.append("description", document.getElementById("itemDesc").value);
  formData.append("price", parseFloat(document.getElementById("itemPrice").value));
  formData.append("category", document.getElementById("itemCategory").value);
  formData.append("type", document.getElementById("itemType").value);
  formData.append("minQty", parseInt(document.getElementById("itemMinQty").value));
  formData.append("stock_status", document.getElementById("itemStock").value === "in" ? "In Stock" : "Out of Stock");

  fetch("php/add_product.php", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if(data.success){
      alert("Product added successfully!");
      loadProducts(); // reload products in admin panel
      addItemForm.reset();
    } else {
      alert("Failed to add product.");
    }
  })
});

  // ✅ Remove item
  window.removeItem = function (index) {
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));
    renderItems();
  };

  // ✅ Toggle stock
  window.toggleStock = function (index) {
    items[index].stock =
      items[index].stock === "In Stock" ? "Out of Stock" : "In Stock";
    localStorage.setItem("items", JSON.stringify(items));
    renderItems();
  };

  // ✅ Load Orders
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  if (orders.length === 0) {
    ordersTable.innerHTML = `<tr><td colspan="5" style="text-align:center;">No orders yet.</td></tr>`;
  } else {
    orders.forEach((order) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${order.id}</td>
        <td>${order.customer.name} (${order.customer.phone})</td>
        <td>${order.items.map((i) => `${i.name} x${i.qty}`).join(", ")}</td>
        <td>₹${order.total}</td>
        <td>${order.status}</td>
      `;
      ordersTable.appendChild(tr);
    });
  }

  // ✅ Initial render
  renderItems();
});
