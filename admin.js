document.addEventListener("DOMContentLoaded", () => {
  const addItemForm = document.getElementById("addItemForm");
  const itemsList = document.getElementById("itemsList");
  const ordersTable = document.querySelector("#ordersTable tbody");

  // Load saved items
  let items = JSON.parse(localStorage.getItem("items")) || [];

  function renderItems() {
    itemsList.innerHTML = "";
    items.forEach((item, index) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <img src="${item.image}" width="60">
        <strong>${item.name}</strong> - ₹${item.price} (${item.stock})
        <button onclick="removeItem(${index})">Remove</button>
        <button onclick="toggleStock(${index})">Toggle Stock</button>
      `;
      itemsList.appendChild(div);
    });
  }

  // Add Item
  addItemForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const file = document.getElementById("itemImage").files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
      const newItem = {
        image: event.target.result,
        name: document.getElementById("itemName").value,
        description: document.getElementById("itemDesc").value,
        price: parseFloat(document.getElementById("itemPrice").value),
        category: document.getElementById("itemCategory").value,
        stock: document.getElementById("itemStock").value === "in" ? "In Stock" : "Out of Stock"
      };

      items.push(newItem);
      localStorage.setItem("items", JSON.stringify(items));
      renderItems();
      addItemForm.reset();
    };

    reader.readAsDataURL(file);
  });

  // Remove item
  window.removeItem = function(index) {
    items.splice(index, 1);
    localStorage.setItem("items", JSON.stringify(items));
    renderItems();
  };

  // Toggle stock
  window.toggleStock = function(index) {
    items[index].stock = items[index].stock === "In Stock" ? "Out of Stock" : "In Stock";
    localStorage.setItem("items", JSON.stringify(items));
    renderItems();
  };

  // Load Orders
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.forEach(order => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${order.id}</td>
      <td>${order.customer.name} (${order.customer.phone})</td>
      <td>${order.items.map(i => `${i.name} x${i.qty}`).join(", ")}</td>
      <td>₹${order.total}</td>
      <td>${order.status}</td>
    `;
    ordersTable.appendChild(tr);
  });

  renderItems();
});
