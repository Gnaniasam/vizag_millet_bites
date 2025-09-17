// script.js - Adding search, filtering, wishlist, and other features
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

/* ---------- Products (with descriptions) ---------- */
const products = [
  { name: "Combo Pack 1", image: "b1.jpeg", price: 999, type: "combo", category: "combo", minQty: null, description: "Premium combo - assorted millet snacks, great for gifting." },
  { name: "Combo Pack 2", image: "b2.jpeg", price: 299, type: "combo", category: "combo", description: "Pack of 9 items Each 50 Grams Total 450 Grams Price - 299 Free shipping." },
  { name: "Combo Pack 3", image: "b3.jpeg", price: 399, type: "combo", category: "combo", description: "Pack of 7 items Each 100 Grams Total 700 Grams Free shipping ." },
  { name: "Combo Pack 4", image: "b4.jpeg", price: 599, type: "combo", category: "combo", description: "Pack of 9 items Any 7 items each 100 grams Any 2 items Each 150 Grams Total 1 Kg Free shipping anywhere in India Special offer - 100 Grams Dry Fruit Laddu Free." },

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
const wishlist = {}; // key: productName => product
const safeId = (name) => name.replace(/\s+/g, '_').replace(/[^\w-]/g, '');

/* ---------- Search and Filter Functions ---------- */
function filterProducts() {
  const searchText = document.getElementById('productSearch').value.toLowerCase();
  const priceFilter = document.getElementById('priceFilter').value;
  const categoryFilter = document.getElementById('categoryFilter').value;
  
  return products.filter(product => {
    // Search text filter
    if (searchText && !product.name.toLowerCase().includes(searchText) && 
        !product.description.toLowerCase().includes(searchText)) {
      return false;
    }
    
    // Price filter
    if (priceFilter !== 'all') {
      if (priceFilter === '0-100' && product.price > 100) return false;
      if (priceFilter === '100-300' && (product.price <= 100 || product.price > 300)) return false;
      if (priceFilter === '300-500' && (product.price <= 300 || product.price > 500)) return false;
      if (priceFilter === '500+' && product.price <= 500) return false;
    }
    
    // Category filter
    if (categoryFilter !== 'all' && product.category !== categoryFilter) {
      return false;
    }
    
    return true;
  });
}

function highlightSearchText(text, searchTerm) {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
}

/* ---------- Render categories & products with filtering ---------- */
function renderCategories() {
  const categoryGrid = document.getElementById("category-grid");
  categoryGrid.innerHTML = "";

  const allCard = document.createElement("div");
  allCard.className = "product-card";
  allCard.style.cursor = "pointer";
  allCard.innerHTML = `<h4>All Products</h4>`;
  allCard.addEventListener("click", () => {
    document.getElementById('productSearch').value = '';
    document.getElementById('priceFilter').value = 'all';
    document.getElementById('categoryFilter').value = 'all';
    renderProductsByCategory("all");
  });
  categoryGrid.appendChild(allCard);

  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.style.cursor = "pointer";
    div.innerHTML = `<h4>${cat.toUpperCase()}</h4>`;
    div.addEventListener("click", () => {
      document.getElementById('productSearch').value = '';
      document.getElementById('priceFilter').value = 'all';
      document.getElementById('categoryFilter').value = cat;
      renderProductsByCategory(cat);
    });
    categoryGrid.appendChild(div);
  });
}

function renderProductsByCategory(category) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  const searchText = document.getElementById('productSearch').value.toLowerCase();
  const filtered = category === "all" ? filterProducts() : filterProducts().filter(p => p.category === category);

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="no-products">No products found matching your criteria.</div>';
    return;
  }

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
    
    // Highlight search text in product name and description
    const highlightedName = highlightSearchText(product.name, searchText);
    const highlightedDesc = highlightSearchText(product.description, searchText);

    div.innerHTML = `
      <div class="discount-badge">${product.type === 'combo' ? 'Best Offer' : '20% OFF'}</div>
      <img src="${product.image}" alt="${product.name}" />
      <h4>${highlightedName}</h4>
      <p class="product-description">${highlightedDesc}</p>
      <p>₹${product.price} - ${weightLabel}</p>
      <div class="quantity-controls">
        <button class="card-remove">-</button>
        <select id="select-${id}">${optionsHtml}</select>
        <button class="card-add">+</button>
      </div>
      <div class="cart-status" id="status-${id}"></div>
      <button class="wishlist-toggle" data-product="${product.name}">
        ${wishlist[product.name] ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
      </button>
    `;

    grid.appendChild(div);

    // attach listeners (safe, no inline handlers)
    const selectEl = div.querySelector(`#select-${id}`);
    div.querySelector('.card-add').addEventListener('click', () => {
      const qty = parseInt(selectEl.value, 10);
      addToCartWithQty(product.name, qty);
      updateStatus(product.name);
      showToast(`Added ${qty} ${product.type === 'combo' ? 'pack(s)' : 'g'} of ${product.name} to cart`);
    });
    
    div.querySelector('.card-remove').addEventListener('click', () => {
      const qty = parseInt(selectEl.value, 10);
      removeFromCartWithQty(product.name, qty);
      updateStatus(product.name);
      showToast(`Removed ${qty} ${product.type === 'combo' ? 'pack(s)' : 'g'} of ${product.name} from cart`);
    });
    
    // wishlist toggle
    div.querySelector('.wishlist-toggle').addEventListener('click', (e) => {
      toggleWishlist(product);
      e.target.textContent = wishlist[product.name] ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist';
      showToast(wishlist[product.name] ? `Added ${product.name} to wishlist` : `Removed ${product.name} from wishlist`);
    });

    // open modal on image or title click
    div.querySelector('img').addEventListener('click', () => openProductModal(product));
    div.querySelector('h4').addEventListener('click', () => openProductModal(product));
  });
  
  // Lazy load images
  lazyLoadImages();
}

/* ---------- Lazy Load Images ---------- */
function lazyLoadImages() {
  const images = document.querySelectorAll('.product-card img');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('src');
        img.classList.remove('loading');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => {
    img.classList.add('loading');
    imageObserver.observe(img);
  });
}

/* ---------- Toast Notifications ---------- */
function showToast(message, duration = 3000) {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    document.body.removeChild(existingToast);
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // Show toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Hide toast after duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, duration);
}

/* ---------- Wishlist Functions ---------- */
function toggleWishlist(product) {
  if (wishlist[product.name]) {
    delete wishlist[product.name];
  } else {
    wishlist[product.name] = product;
  }
  updateWishlistDisplay();
  updateWishlistCount();
  saveWishlistToStorage();
}

function updateWishlistDisplay() {
  const container = document.getElementById("wishlistItems");
  
  if (Object.keys(wishlist).length === 0) {
    container.innerHTML = '<div class="empty-wishlist">Your wishlist is empty</div>';
    return;
  }

  let html = '';
  for (const name in wishlist) {
    const product = wishlist[name];
    html += `
      <div class="wishlist-item">
        <img src="${product.image}" alt="${product.name}" />
        <div class="wishlist-item-details">
          <div class="wishlist-item-name">${product.name}</div>
          <div class="wishlist-item-price">₹${product.price}</div>
        </div>
        <div class="wishlist-item-actions">
          <button class="add-to-cart-btn" data-product="${product.name}">Add to Cart</button>
          <button class="remove-from-wishlist" data-product="${product.name}">Remove</button>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
  
  // Add event listeners to wishlist items
  container.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productName = e.target.getAttribute('data-product');
      const product = wishlist[productName];
      const defaultQty = product.type === 'combo' ? 1 : (product.minQty === 250 ? 250 : 100);
      addToCartWithQty(productName, defaultQty);
      showToast(`Added ${productName} to cart`);
      updateStatus(productName);
    });
  });
  
  container.querySelectorAll('.remove-from-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productName = e.target.getAttribute('data-product');
      toggleWishlist(wishlist[productName]);
      showToast(`Removed ${productName} from wishlist`);
    });
  });
}

function updateWishlistCount() {
  const count = Object.keys(wishlist).length;
  const els = document.querySelectorAll(".wishlist-count");
  els.forEach(el => {
    if (el) el.textContent = count;
  });
}

function saveWishlistToStorage() {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function loadWishlistFromStorage() {
  const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "{}");
  // Merge with current products
  for (const name in savedWishlist) {
    const product = products.find(p => p.name === name);
    if (product) {
      wishlist[name] = product;
    }
  }
  updateWishlistDisplay();
  updateWishlistCount();
}

function toggleWishlistPanel() {
  document.getElementById("wishlistPanel").classList.toggle("active");
  document.getElementById("overlay").
