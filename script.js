/* ---------- Slideshow (unchanged behavior) ---------- */
let slideIndex = 1;
let slideTimer;

function showSlides(n) {
  const slides = document.querySelectorAll(".slides");
  const dots = document.querySelectorAll(".dot");

  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;

  slides.forEach(slide => slide.style.display = "none");
  dots.forEach(dot => dot.classList.remove("active-dot"));

  if (slides.length) {
    slides[slideIndex - 1].style.display = "block";
    if (dots[slideIndex - 1]) dots[slideIndex - 1].classList.add("active-dot");
  }
}

function nextSlide() {
  slideIndex++;
  showSlides(slideIndex);
}

function currentSlide(n) {
  clearTimeout(slideTimer);
  slideIndex = n;
  showSlides(slideIndex);
  autoSlides();
}

function autoSlides() {
  slideTimer = setTimeout(() => {
    nextSlide();
    autoSlides();
  }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
  showSlides(slideIndex);
  autoSlides();

  const dots = document.querySelectorAll(".dot");
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.getAttribute("data-index"));
      currentSlide(index);
    });
  });
});

/* ---------- Products (with descriptions) ---------- */
const products = [
  { name: "Combo Pack 1", image: "b1.jpeg", price: 999, type: "combo", category: "combo", minQty: null, description: "Premium combo - assorted millet snacks, great for gifting." },
  { name: "Combo Pack 2", image: "b2.jpeg", price: 299, type: "combo", category: "combo", description: "Tasty combo with a mix of crunchy favourites." },
  { name: "Combo Pack 3", image: "b3.jpeg", price: 399, type: "combo", category: "combo", description: "Value combo for daily snacking." },
  { name: "Combo Pack 4", image: "b4.jpeg", price: 599, type: "combo", category: "combo", description: "Pack of 9 items Any 7 items each 100 grams Any 2 items Each 150 Grams Total 1 Kg Free shipping anywhere in India Special offer - 100 Grams Dry Fruit Laddu Free Free Free." },

  { name: "Ragi Mixture", image: "Ragi Mixture.jpeg", price: 60, type: "weight", category: "hots", description: "Crunchy and wholesome Ragi mixture — evening snack." },
  { name: "Ragi Chegodilu", image: "Ragi Chegodilu.jpeg", price: 60, type: "weight", category: "hots", description: "Traditional chegodilu made from ragi." },
  { name: "Ragi Murukkulu", image: "Ragi Murukkulu.jpeg", price: 60, type: "weight", category: "hots", description: "Crispy murukkulu with millet goodness." },
  { name: "Jowar Mixture", image: "Jowar Mixture.jpeg", price: 60, type: "weight", category: "hots", description: "Light and tasty jowar mixture." },
  { name: "Jowar Murukkulu", image: "Jowar Murukkulu.jpeg", price: 60, type: "weight", category: "hots", description: "Jowar murukkulu - crunchy, less oil." },
  { name: "Jowar Ribbon Pakodi", image: "Jowar Ribbon Pakodi.jpeg", price: 60, type: "weight", category: "hots", description: "Ribbon pakodi with jowar flour." },
  { name: "Foxtail Sev", image: "Foxtail Sev.jpeg", price: 60, type: "weight", category: "hots", description: "Sev made from foxtail millet." },
  { name: "Arikalu Jantikalu", image: "Arikalu Jantikalu.jpeg", price: 60, type: "weight", category: "hots", description: "Traditional arikalu/jantikalu mix." },
  { name: "Samalu Boondi", image: "Samalu Boondi.jpeg", price: 60, type: "weight", category: "hots", description: "Small boondi snacks made from millet." },

  { name: "Dry Fruit Mixture", image: "Dry Fruit Mixture.jpeg", price: 180, type: "weight", category: "dryfruits", description: "Energy-dense dry fruit mix with millets." },
  { name: "Dry Fruit Laddu", image: "Dry Fruit Laddu.jpeg", price: 300, type: "weight", category: "sweets", minQty: 250, pricePer: 250, description: "Rich laddus with dry fruits — sweet & healthy." },
  { name: "Cashew Bar", image: "Cashew Bar.jpeg", price: 200, type: "combo", category: "dryfruits", minQty:170, description: "Crunchy cashew bars, great snack." },
  { name: "Panchadara Gavvalu", image: "Panchadara Gavvalu.jpg", price: 100, type: "weight", category: "sweets", minQty: 250, pricePer: 250, description: "Sweet gavvalu made with panchadara." },
  { name: "Bellam Gavvalu", image: "Bellam Gavvalu.jpeg", price: 100, type: "weight", category: "sweets", minQty: 250, pricePer: 250, description: "Bellam (jaggery) gavvalu — traditional sweet." },
  { name: "Hot Gavvalu", image: "Hot Gavvalu.jpeg", price: 100, type: "weight", category: "hots", minQty: 250, pricePer: 250, description: "Spicy hot gavvalu for spicy lovers." }
];

/* ---------- Helpers & cart state ---------- */
const cart = {}; // key: productName => { product, quantity }
const safeId = (name) => name.replace(/\s+/g, '_').replace(/[^\w-]/g, '');

/* ---------- Render categories & products ---------- */
function renderCategories() {
  const categoryGrid = document.getElementById("category-grid");
  categoryGrid.innerHTML = "";

  const allCard = document.createElement("div");
  allCard.className = "product-card";
  allCard.style.cursor = "pointer";
  allCard.innerHTML = `<h4>All Products</h4>`;
  allCard.addEventListener("click", () => renderProductsByCategory("all"));
  categoryGrid.appendChild(allCard);

  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.style.cursor = "pointer";
    div.innerHTML = `<h4>${cat.toUpperCase()}</h4>`;
    div.addEventListener("click", () => renderProductsByCategory(cat));
    categoryGrid.appendChild(div);
  });
}

function renderProductsByCategory(category) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  const filtered = category === "all" ? products : products.filter(p => p.category === category);

  filtered.forEach(product => {
    const id = safeId(product.name);
    const div = document.createElement("div");
    div.className = "product-card";

    // build qty options
    let optionsHtml = "";
    if (product.type === "combo") {
      [1, 2, 3, 5].forEach(q => optionsHtml += `<option value="${q}">${q} Pack${q>1?'s':''}</option>`);
    } else {
      const opts = product.minQty === 250 ? [250, 500, 1000] : [100, 250, 500, 1000];
      opts.forEach(o => optionsHtml += `<option value="${o}">${o === 1000 ? '1KG' : o + 'g'}</option>`);
    }

    const weightLabel = (product.type === "combo") ? (product.minQty === 170 ? '170g' : 'Pack') : (product.minQty === 250 ? '250g' : '100g');

    div.innerHTML = `
      <div class="discount-badge">${product.type === 'combo' ? 'Best Offer' : '20% OFF'}</div>
      <img src="${product.image}" alt="${product.name}" />
      <h4>${product.name}</h4>
      <p>₹${product.price} - ${weightLabel}</p>
      <div class="quantity-controls">
        <button class="card-remove">-</button>
        <select id="select-${id}">${optionsHtml}</select>
        <button class="card-add">+</button>
      </div>
      <div class="cart-status" id="status-${id}"></div>
    `;

    grid.appendChild(div);

    // attach listeners (safe, no inline handlers)
    const selectEl = div.querySelector(`#select-${id}`);
    div.querySelector('.card-add').addEventListener('click', () => {
      const qty = parseInt(selectEl.value, 10);
      addToCartWithQty(product.name, qty);
      updateStatus(product.name);
    });
    div.querySelector('.card-remove').addEventListener('click', () => {
      const qty = parseInt(selectEl.value, 10);
      removeFromCartWithQty(product.name, qty);
      updateStatus(product.name);
    });

    // open modal on image or title click
    div.querySelector('img').addEventListener('click', () => openProductModal(product));
    div.querySelector('h4').addEventListener('click', () => openProductModal(product));
  });
}

/* ---------- Cart functions (robust, used by both cards and modal) ---------- */
function addToCartWithQty(productName, qty) {
  const product = products.find(p => p.name === productName);
  if (!product) return;

  if (!cart[productName]) {
    cart[productName] = { product, quantity: 0 };
  }
  cart[productName].quantity += qty;
  updateCartDisplay();
  updateCartCount();
  // keep statuses in sync
  updateStatus(productName);
}

function removeFromCartWithQty(productName, qty) {
  if (!cart[productName]) return;
  cart[productName].quantity -= qty;
  if (cart[productName].quantity <= 0) delete cart[productName];
  updateCartDisplay();
  updateCartCount();
  updateStatus(productName);
}

function updateStatus(productName) {
  const s = document.getElementById(`status-${safeId(productName)}`);
  if (!s) return;
  if (cart[productName]) {
    const item = cart[productName];
    if (item.product.type === "combo") {
      s.textContent = `In cart: ${item.quantity} Pack${item.quantity > 1 ? 's' : ''}`;
    } else {
      s.textContent = `In cart: ${item.quantity >= 1000 ? (item.quantity/1000).toFixed(2) + ' kg' : item.quantity + ' g'}`;
    }
  } else {
    s.textContent = "";
  }
}

function updateCartCount() {
  const count = Object.keys(cart).length;
  const el1 = document.getElementById("cartCount");
  const el2 = document.getElementById("cartCount2");
  if (el1) el1.textContent = count;
  if (el2) el2.textContent = count;
}

function updateCartDisplay() {
  const container = document.getElementById("panel-cart-items");
  let total = 0;

  if (Object.keys(cart).length === 0) {
    container.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    document.querySelector(".cart-summary p").textContent = `Total: ₹0.00`;
    return;
  }

  let html = '';
  for (const name in cart) {
    const item = cart[name];
    let itemTotal = 0;
    let qtyControls = '';

    if (item.product.type === "combo") {
      itemTotal = item.quantity * item.product.price;
      qtyControls = `
        <button onclick="adjustCartItem('${name}', -1)">-</button>
        ${item.quantity} Pack${item.quantity > 1 ? 's' : ''}
        <button onclick="adjustCartItem('${name}', 1)">+</button>
      `;
    } else {
      const unit = item.product.pricePer === 250 ? 250 : 100;
      itemTotal = (item.quantity / unit) * item.product.price;
      qtyControls = `
        <button onclick="adjustCartItem('${name}', -${item.product.minQty === 250 ? 250 : 100})">-</button>
        ${item.quantity >= 1000 ? (item.quantity/1000).toFixed(2) + ' kg' : item.quantity + ' g'}
        <button onclick="adjustCartItem('${name}', ${item.product.minQty === 250 ? 250 : 100})">+</button>
      `;
    }

    total += itemTotal;
    html += `
      <div class="cart-item">
        <div class="cart-item-name">${name}</div>
        <div class="cart-item-qty">${qtyControls}</div>
        <div class="cart-item-price">₹${itemTotal.toFixed(2)}</div>
      </div>
    `;
  }

  container.innerHTML = html;
  document.querySelector(".cart-summary p").textContent = `Total: ₹${total.toFixed(2)}`;
  document.dispatchEvent(new Event("cartUpdated"));
}

function adjustCartItem(productName, adjustment) {
  if (!cart[productName]) return;
  cart[productName].quantity += adjustment;
  if (cart[productName].quantity <= 0) delete cart[productName];
  updateCartDisplay();
  updateCartCount();
  updateStatus(productName);
}

/* ---------- Cart panel toggles & initial DOM wiring ---------- */
function toggleCartPanel() {
  document.getElementById("cartPanel").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderProductsByCategory("all");

  // cart panel toggle wiring
  const ic1 = document.getElementById("cartIcon");
  const ic2 = document.getElementById("cartIcon2");
  if (ic1) ic1.addEventListener("click", toggleCartPanel);
  if (ic2) ic2.addEventListener("click", toggleCartPanel);
  document.getElementById("closeCart").addEventListener("click", toggleCartPanel);
  document.getElementById("overlay").addEventListener("click", toggleCartPanel);

  // clear cart
  const clearBtn = document.querySelector(".clear");
  if (clearBtn) clearBtn.addEventListener("click", () => {
    for (const name in cart) delete cart[name];
    updateCartDisplay();
    updateCartCount();
    // clear statuses
    products.forEach(p => updateStatus(p.name));
  });
});

/* ---------- Checkout / sendOrder logic (unchanged behavior) ---------- */
function sendOrder() {
  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let totalWeight = 0;
  let hasWeight = false;
  let hasCombo = false;
  let total = 0;

  for (const productName in cart) {
    const item = cart[productName];
    if (item.product.type === "combo") {
      hasCombo = true;
      total += item.quantity * item.product.price;
    } else {
      hasWeight = true;
      const unit = item.product.pricePer === 250 ? 250 : 100;
      totalWeight += item.quantity;
      total += (item.quantity / unit) * item.product.price;
    }
  }

  if (hasWeight && !hasCombo && totalWeight < 500) {
    alert("Minimum order for weight-based products is 500g!");
    return;
  }

  localStorage.setItem("orderTotal", total);
  localStorage.setItem("orderCart", JSON.stringify(cart));
  window.location.href = "checkout.html";
}

/* ---------- Payment success/failure modals (loads from localStorage on page load) ---------- */
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

    document.getElementById("closeSuccessModal").onclick = () => document.getElementById("successModal").style.display = "none";
    document.getElementById("okBtn").onclick = () => document.getElementById("successModal").style.display = "none";

    localStorage.removeItem("paymentSuccess");
  }

  if (localStorage.getItem("paymentFailure")) {
    document.getElementById("failureModal").style.display = "flex";
    document.getElementById("closeFailureModal").onclick = () => document.getElementById("failureModal").style.display = "none";
    document.getElementById("retryBtn").onclick = function () { window.location.href = "checkout.html"; };
    localStorage.removeItem("paymentFailure");
  }
});

/* ---------- Product Modal: open, add/remove, close ---------- */
function openProductModal(product) {
  const modal = document.getElementById("productModal");
  if (!product) return;

  document.getElementById("modalProductImage").src = product.image;
  document.getElementById("modalProductName").textContent = product.name;
  document.getElementById("modalProductDescription").textContent = product.description || "";
  document.getElementById("modalProductPrice").textContent = `₹${product.price}`;

  const select = document.getElementById("modalQuantity");
  select.innerHTML = "";

  if (product.type === "combo") {
    [1,2,3,5].forEach(q => {
      const opt = document.createElement("option");
      opt.value = q;
      opt.textContent = `${q} Pack${q>1?'s':''}`;
      select.appendChild(opt);
    });
  } else {
    const opts = product.minQty === 250 ? [250,500,1000] : [100,250,500,1000];
    opts.forEach(o => {
      const opt = document.createElement("option");
      opt.value = o;
      opt.textContent = o === 1000 ? '1KG' : `${o}g`;
      select.appendChild(opt);
    });
  }

  // add / remove handlers (use qty from modal)
  const addBtn = document.getElementById("modalAddBtn");
  const removeBtn = document.getElementById("modalRemoveBtn");

  addBtn.onclick = function() {
    const qty = parseInt(select.value, 10);
    addToCartWithQty(product.name, qty);
    updateStatus(product.name);
    updateModalStatus(product.name);
  };
  removeBtn.onclick = function() {
    const qty = parseInt(select.value, 10);
    removeFromCartWithQty(product.name, qty);
    updateStatus(product.name);
    updateModalStatus(product.name);
  };

  updateModalStatus(product.name);
  modal.style.display = "flex";
  // focus for accessibility
  select.focus();
}

function updateModalStatus(productName) {
  const statusEl = document.getElementById("modalStatus");
  if (!statusEl) return;
  if (cart[productName]) {
    const item = cart[productName];
    if (item.product.type === "combo") {
      statusEl.textContent = `In cart: ${item.quantity} Pack${item.quantity > 1 ? 's' : ''}`;
    } else {
      statusEl.textContent = `In cart: ${item.quantity >= 1000 ? (item.quantity/1000).toFixed(2) + ' kg' : item.quantity + ' g'}`;
    }
  } else {
    statusEl.textContent = "Not in cart";
  }
}

document.getElementById("closeProductModal").addEventListener("click", () => {
  document.getElementById("productModal").style.display = "none";
});

// close modal by clicking outside content
document.getElementById("productModal").addEventListener("click", function(e) {
  if (e.target && e.target.id === 'productModal') {
    document.getElementById("productModal").style.display = "none";
  }
});
