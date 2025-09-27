// Product List with Badges
const products = [
  { name: "Combo Pack 1", image: "b1.jpeg", price: 999, type: "combo", category: "combo", minQty: null, description: "Premium combo - assorted millet snacks, great for gifting.", badge: "Best Offer" },
  { name: "Combo Pack 2", image: "b2.jpeg", price: 299, type: "combo", category: "combo", description: "Tasty combo with a mix of crunchy favourites.", badge: "Best Offer" },
  { name: "Combo Pack 3", image: "b3.jpeg", price: 399, type: "combo", category: "combo", description: "Value combo for daily snacking.", badge: "Best Offer" },
  { name: "Combo Pack 4", image: "b4.jpeg", price: 599, type: "combo", category: "combo", description: "Assorted premium millet selections.", badge: "Best Offer" },

  { name: "Ragi Mixture", image: "Ragi Mixture.jpeg", price: 60, type: "weight", category: "hots", minQty: null, description: "Crunchy and wholesome Ragi mixture — evening snack.", badge: "Best Offer" },
  { name: "Ragi Chegodilu", image: "Ragi Chegodilu.jpeg", price: 60, type: "weight", category: "hots", description: "Traditional chegodilu made from ragi.", badge: "Best Offer" },
  { name: "Ragi Murukkulu", image: "Ragi Murukkulu.jpeg", price: 60, type: "weight", category: "hots", description: "Crispy murukkulu with millet goodness.", badge: "Best Offer" },
  { name: "Jowar Mixture", image: "Jowar Mixture.jpeg", price: 60, type: "weight", category: "hots", description: "Light and tasty jowar mixture.", badge: "Best Offer" },
  { name: "Jowar Murukkulu", image: "Jowar Murukkulu.jpeg", price: 60, type: "weight", category: "hots", description: "Jowar murukkulu - crunchy, less oil.", badge: "Best Offer" },
  { name: "Jowar Ribbon Pakodi", image: "Jowar Ribbon Pakodi.jpeg", price: 60, type: "weight", category: "hots", description: "Ribbon pakodi with jowar flour.", badge: "Best Offer" },
  { name: "Foxtail Sev", image: "Foxtail Sev.jpeg", price: 60, type: "weight", category: "hots", description: "Sev made from foxtail millet.", badge: "Best Offer" },
  { name: "Arikalu Jantikalu", image: "Arikalu Jantikalu.jpeg", price: 60, type: "weight", category: "hots", description: "Traditional arikalu/jantikalu mix.", badge: "Best Offer" },
  { name: "Samalu Boondi", image: "Samalu Boondi.jpeg", price: 60, type: "weight", category: "hots", description: "Small boondi snacks made from millet.", badge: "Best Offer" },

  { name: "Dry Fruit Mixture", image: "Dry Fruit Mixture.jpeg", price: 180, type: "weight", category: "dryfruits", description: "Energy-dense dry fruit mix with millets.", badge: "Best Offer" },
  { name: "Dry Fruit Laddu", image: "Dry Fruit Laddu.jpeg", price: 300, type: "weight", category: "sweets", minQty: 250, pricePer: 250, description: "Rich laddus with dry fruits — sweet & healthy.", badge: "Best Offer" },
  { name: "Cashew Bar", image: "Cashew Bar.jpeg", price: 200, type: "combo", category: "dryfruits", minQty:170, description: "Crunchy cashew bars, great snack.", badge: "Best Offer" },
  { name: "Panchadara Gavvalu", image: "Panchadara Gavvalu.jpg", price: 100, type: "weight", category: "sweets", minQty: 250, pricePer: 250, description: "Sweet gavvalu made with panchadara.", badge: "Best Offer" },
  { name: "Bellam Gavvalu", image: "Bellam Gavvalu.jpeg", price: 100, type: "weight", category: "sweets", minQty: 250, pricePer: 250, description: "Bellam (jaggery) gavvalu — traditional sweet.", badge: "Best Offer" },
  { name: "Hot Gavvalu", image: "Hot Gavvalu.jpeg", price: 100, type: "weight", category: "hots", minQty: 250, pricePer: 250, description: "Spicy hot gavvalu for spicy lovers.", badge: "Best Offer" }
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
