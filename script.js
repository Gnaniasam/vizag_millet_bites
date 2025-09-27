// Product List with Badges
const products = [
  {
    name: "Dry Fruit Laddu",
    type: "weight",
    price: 300,
    pricePer: 250,
    category: "Sweets",
    image: "images/laddu.jpg",
    description: "Delicious dry fruit laddu.",
    badge: "20% OFF"
  },
  {
    name: "Combo Pack 1",
    type: "combo",
    price: 500,
    category: "Combos",
    image: "images/combo1.jpg",
    description: "Special combo pack.",
    badge: "Best Offer"
  },
  {
    name: "Cashew Bar",
    type: "weight",
    price: 250,
    pricePer: 170,
    category: "Snacks",
    image: "images/cashewbar.jpg",
    description: "Rich cashew bar.",
    badge: "Limited Edition"
  },
  {
    name: "Kaju Katli",
    type: "weight",
    price: 450,
    pricePer: 250,
    category: "Sweets",
    image: "images/kajukatli.jpg",
    description: "Premium cashew sweet.",
    badge: "New Arrival"
  }
];

// State
let cart = {};
let currentCategory = "All";

// Category Nav
const categories = ["All", ...new Set(products.map(p => p.category))];
const categoryNav = document.getElementById("categoryNav");
categories.forEach(cat => {
  const btn = document.createElement("button");
  btn.textContent = cat;
  if (cat === "All") btn.classList.add("active");
  btn.onclick = () => {
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = cat;
    renderProducts();
  };
  categoryNav.appendChild(btn);
});

// Render Products
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  const searchVal = document.getElementById("searchBar").value.toLowerCase();

  const filtered = products.filter(p => {
    const matchesCat = currentCategory === "All" || p.category === currentCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchVal);
    return matchesCat && matchesSearch;
  });

  if (!filtered.length) {
    grid.innerHTML = `<p>No products found...</p>`;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      ${p.badge ? `<div class="discount-badge">${p.badge}</div>` : ""}
      <img src="${p.image}" alt="${p.name}">
      <div class="product-info">
        <h4>${p.name}</h4>
        <p>₹${p.price}${p.type === "weight" ? ` / ${p.pricePer}g` : ""}</p>
      </div>
    `;
    card.onclick = () => openProductModal(p);
    grid.appendChild(card);
  });
}
renderProducts();

// Search
document.getElementById("searchBar").addEventListener("input", renderProducts);

// Product Modal
const modal = document.getElementById("productModal");
function openProductModal(product) {
  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalName").textContent = product.name;
  document.getElementById("modalDesc").textContent = product.description;
  document.getElementById("modalQty").value = product.type === "combo" ? 1 : product.pricePer;

  modal.style.display = "block";
  document.getElementById("addToCartBtn").onclick = () => addToCart(product);
}
document.getElementById("modalClose").onclick = () => modal.style.display = "none";

// Cart
function addToCart(product) {
  const qty = parseInt(document.getElementById("modalQty").value);
  if (!qty || qty < 1) return;

  if (cart[product.name]) {
    cart[product.name].quantity += qty;
  } else {
    cart[product.name] = { product, quantity: qty };
  }
  updateCart();
  modal.style.display = "none";
}

function updateCart() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";
  let total = 0;

  Object.values(cart).forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";

    let itemTotal;
    if (item.product.type === "combo") {
      itemTotal = item.product.price * item.quantity;
    } else {
      itemTotal = (item.quantity / item.product.pricePer) * item.product.price;
    }
    total += itemTotal;

    row.innerHTML = `
      <p>${item.product.name} - ${item.quantity}${item.product.type === "weight" ? "g" : ""}</p>
      <p>₹${itemTotal.toFixed(2)}</p>
    `;
    container.appendChild(row);
  });

  document.getElementById("cartTotal").textContent = total.toFixed(2);
  document.getElementById("cartCount").textContent =
    Object.values(cart).reduce((sum, i) => sum + i.quantity, 0);
}

// Cart Toggle
const cartPanel = document.getElementById("cartPanel");
document.getElementById("cartToggle").onclick = () => {
  cartPanel.classList.toggle("open");
};

// Clear Cart
document.getElementById("clearCartBtn").onclick = () => {
  cart = {};
  updateCart();
};

// Checkout
document.getElementById("checkoutBtn").onclick = () => {
  let valid = false;
  for (let key in cart) {
    if (cart[key].product.type === "combo") {
      valid = true;
      break;
    }
    if (cart[key].product.type === "weight" && cart[key].quantity >= 500) {
      valid = true;
      break;
    }
  }

  if (valid) {
    document.getElementById("checkoutSuccess").style.display = "block";
    cart = {};
    updateCart();
  } else {
    document.getElementById("checkoutFail").style.display = "block";
  }
};

// Checkout Modals
document.getElementById("successClose").onclick = () =>
  document.getElementById("checkoutSuccess").style.display = "none";
document.getElementById("failClose").onclick = () =>
  document.getElementById("checkoutFail").style.display = "none";

// Slideshow
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.getElementById("dots");
let currentSlide = 0;

slides.forEach((_, i) => {
  const dot = document.createElement("span");
  if (i === 0) dot.classList.add("active");
  dot.onclick = () => showSlide(i);
  dotsContainer.appendChild(dot);
});

function showSlide(i) {
  slides[currentSlide].classList.remove("active");
  dotsContainer.children[currentSlide].classList.remove("active");
  currentSlide = i;
  slides[currentSlide].classList.add("active");
  dotsContainer.children[currentSlide].classList.add("active");
}

setInterval(() => {
  let next = (currentSlide + 1) % slides.length;
  showSlide(next);
}, 4000);
