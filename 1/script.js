const PRODUCTS = [
  { id: 1, name: "Zandu Turbo Seeder X1", category: "Seed Processing Machines", price: 1450, oldPrice: 1699, rating: 5, image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0f1f2f?auto=format&fit=crop&w=900&q=80", tag: "Featured" },
  { id: 2, name: "Precision Soil Cultivator", category: "Farming Equipment", price: 980, oldPrice: 1190, rating: 4, image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80", tag: "Best" },
  { id: 3, name: "Multi-Nozzle Crop Sprayer", category: "Sprayers", price: 420, oldPrice: 520, rating: 4, image: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=900&q=80", tag: "Trending" },
  { id: 4, name: "Harvest Master Pro", category: "Harvesting Machines", price: 2250, oldPrice: 2580, rating: 5, image: "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=900&q=80", tag: "New" },
  { id: 5, name: "Eco Water Pump 5000", category: "Water Pumps", price: 640, oldPrice: 760, rating: 4, image: "https://images.unsplash.com/photo-1527345931282-806d3b11967f?auto=format&fit=crop&w=900&q=80", tag: "Featured" },
  { id: 6, name: "Smart Fertilizer Spreader", category: "Fertilizer Machines", price: 1120, oldPrice: 1290, rating: 4, image: "https://images.unsplash.com/photo-1625838144804-300f39014de9?auto=format&fit=crop&w=900&q=80", tag: "Best" },
  { id: 7, name: "Titan Tractor Attachment Kit", category: "Tractor Attachments", price: 1790, oldPrice: 1990, rating: 5, image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=900&q=80", tag: "Trending" },
  { id: 8, name: "Agri Toolset Max 12", category: "Agricultural Tools", price: 290, oldPrice: 360, rating: 4, image: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80", tag: "New" }
];

const CATEGORIES = [
  "Seed Processing Machines",
  "Farming Equipment",
  "Agricultural Tools",
  "Water Pumps",
  "Sprayers",
  "Fertilizer Machines",
  "Harvesting Machines",
  "Tractor Attachments"
];

const money = (v) => `$${Number(v).toFixed(2)}`;
const getStorage = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const setStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const isLoggedIn = () => localStorage.getItem("zanduAuth") === "1";

function cartItems() { return getStorage("zanduCart"); }
function wishItems() { return getStorage("zanduWishlist"); }

function addToCart(id, qty = 1) {
  const cart = cartItems();
  const item = cart.find((i) => i.id === id);
  if (item) item.qty += qty;
  else cart.push({ id, qty });
  setStorage("zanduCart", cart);
  updateBadges();
}

function addToWishlist(id) {
  const list = wishItems();
  if (!list.includes(id)) list.push(id);
  setStorage("zanduWishlist", list);
  updateBadges();
}

function removeFromWishlist(id) {
  setStorage("zanduWishlist", wishItems().filter((x) => x !== id));
  updateBadges();
}

function updateBadges() {
  const cartCount = cartItems().reduce((a, b) => a + b.qty, 0);
  const wishCount = wishItems().length;
  document.querySelectorAll("[data-cart-count]").forEach((n) => n.textContent = cartCount);
  document.querySelectorAll("[data-wish-count]").forEach((n) => n.textContent = wishCount);
  document.querySelectorAll("[data-auth-state]").forEach((node) => {
    node.textContent = isLoggedIn() ? "My Account" : "Login";
  });
  const authLink = document.getElementById("authLink");
  if (authLink) authLink.href = isLoggedIn() ? "wishlist.html" : "login.html";
}

function requireLogin(nextUrl) {
  if (isLoggedIn()) return true;
  const next = nextUrl || `${location.pathname.split("/").pop() || "index.html"}${location.search}`;
  location.href = `login.html?next=${encodeURIComponent(next)}`;
  return false;
}

function productCard(product) {
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  const inWish = wishItems().includes(product.id);
  return `
    <article class="product-card">
      <div class="product-media">
        <img src="${product.image}" alt="${product.name}">
        <span class="discount-pill">${discount}% OFF</span>
        <button class="wish-toggle ${inWish ? "active" : ""}" data-wish="${product.id}" aria-label="Toggle wishlist"><i data-lucide="heart"></i></button>
        <button class="quick-view" data-quick="${product.id}">Quick View</button>
      </div>
      <div class="product-body">
        <h3 class="product-title"><a href="product-details.html?id=${product.id}">${product.name}</a></h3>
        <small>${product.category}</small>
        <div class="price-line">
          <span class="price">${money(product.price)}</span>
          <span class="old-price">${money(product.oldPrice)}</span>
        </div>
        <div class="stars">${"&#9733;".repeat(product.rating)}${"&#9734;".repeat(5 - product.rating)}</div>
        <div class="product-actions">
          <button class="btn btn-primary" data-add="${product.id}">Add to Cart</button>
          <button class="btn btn-outline" data-buy="${product.id}">Buy Now</button>
        </div>
      </div>
    </article>
  `;
}

function mountShell() {
  const headerRoot = document.getElementById("site-header");
  const footerRoot = document.getElementById("site-footer");
  if (!headerRoot || !footerRoot) return;
  const page = document.body.dataset.page || "";
  headerRoot.innerHTML = `
    <header class="site-header" id="header">
      <div class="header-topline">
        <div class="container header-topline-inner">
          <span>Premium Agricultural Engineering</span>
          <span>Call: +91 22 4012 9988 | support@zanduengineers.com</span>
        </div>
      </div>
      <div class="container navbar">
        <a class="brand" href="index.html">
          <span class="brand-mark">ZE</span>
          <span>Zandu Engineers</span>
        </a>
        <nav class="nav-links" id="mobileNav">
          <a class="${page === "home" ? "active" : ""}" href="index.html">Home</a>
          <a class="${page === "about" ? "active" : ""}" href="about.html">About</a>
          <a class="${page === "shop" ? "active" : ""}" href="shop.html">Shop</a>
          <a class="${page === "categories" ? "active" : ""}" href="categories.html">Categories</a>
          <a class="${page === "blog" ? "active" : ""}" href="blog.html">Blog</a>
          <a class="${page === "faq" ? "active" : ""}" href="faq.html">FAQ</a>
          <a class="${page === "contact" ? "active" : ""}" href="contact.html">Contact</a>
        </nav>
        <div class="nav-actions">
          <form class="search-wrap" id="globalSearchForm">
            <input id="globalSearchInput" type="search" placeholder="Search products">
            <button aria-label="Search"><i data-lucide="search"></i></button>
          </form>
          <a class="icon-btn" href="wishlist.html"><i data-lucide="heart"></i><span class="badge" data-wish-count>0</span></a>
          <a class="icon-btn" href="cart.html"><i data-lucide="shopping-cart"></i><span class="badge" data-cart-count>0</span></a>
          <a class="btn btn-outline" id="authLink" href="login.html"><span data-auth-state>Login</span></a>
          <button class="icon-btn" id="logoutBtn" aria-label="Logout" title="Logout" style="display:${isLoggedIn() ? "grid" : "none"}"><i data-lucide="log-out"></i></button>
          <button class="icon-btn mobile-toggle" id="mobileToggle" aria-label="Menu"><i data-lucide="menu"></i></button>
        </div>
      </div>
    </header>
  `;
  footerRoot.innerHTML = `
    <footer class="footer">
      <div class="container footer-grid">
        <div>
          <h4>Zandu Engineers</h4>
          <p>Premium agricultural machines and farming technologies for modern productivity and long-term reliability.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <a href="about.html">About Us</a><br>
          <a href="shop.html">Shop</a><br>
          <a href="contact.html">Contact</a><br>
          <a href="faq.html">FAQ</a>
        </div>
        <div>
          <h4>Categories</h4>
          <a href="shop.html?category=Seed%20Processing%20Machines">Seed Processing</a><br>
          <a href="shop.html?category=Farming%20Equipment">Farming Equipment</a><br>
          <a href="shop.html?category=Water%20Pumps">Water Pumps</a><br>
          <a href="shop.html?category=Harvesting%20Machines">Harvesting</a>
        </div>
        <div>
          <h4>Newsletter</h4>
          <form id="footerNewsletter">
            <input style="width:100%;padding:10px;border-radius:8px;border:1px solid #374151;" type="email" placeholder="Your email">
            <button class="btn btn-primary" style="width:100%;margin-top:8px;">Subscribe</button>
          </form>
          <div style="display:flex;gap:8px;margin-top:10px;">
            <a class="icon-btn" href="#" aria-label="Facebook"><i data-lucide="facebook"></i></a>
            <a class="icon-btn" href="#" aria-label="Instagram"><i data-lucide="instagram"></i></a>
            <a class="icon-btn" href="#" aria-label="linkedin"><i data-lucide="linkedin"></i></a>
            <a class="icon-btn" href="#" aria-label="Youtube"><i data-lucide="youtube"></i></a>
          </div>
        </div>
      </div>
      <div class="container footer-bottom">Copyright 2026 Zandu Engineers. All rights reserved. Privacy Policy | Terms & Conditions</div>
    </footer>
  `;
}

function bindSharedUI() {
  const toggle = document.getElementById("mobileToggle");
  const mobileNav = document.getElementById("mobileNav");
  if (toggle && mobileNav) toggle.addEventListener("click", () => mobileNav.classList.toggle("open"));

  const header = document.getElementById("header");
  const scrollTop = document.getElementById("scrollTop");
  window.addEventListener("scroll", () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 10);
    if (scrollTop) scrollTop.classList.toggle("show", window.scrollY > 300);
  });

  if (scrollTop) scrollTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const globalSearchForm = document.getElementById("globalSearchForm");
  if (globalSearchForm) {
    globalSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = document.getElementById("globalSearchInput").value.trim();
      window.location.href = `shop.html?search=${encodeURIComponent(q)}`;
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("zanduAuth");
      window.location.href = "index.html";
    });
  }
}

function bindProductEvents() {
  document.body.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    const buy = e.target.closest("[data-buy]");
    const wish = e.target.closest("[data-wish]");
    const quick = e.target.closest("[data-quick]");
    if (add) addToCart(Number(add.dataset.add), 1);
    if (buy) {
      const id = Number(buy.dataset.buy);
      if (!isLoggedIn()) {
        setStorage("zanduPendingBuy", { id, qty: 1 });
        requireLogin("cart.html");
        return;
      }
      addToCart(id, 1);
      window.location.href = "cart.html";
    }
    if (wish) {
      const id = Number(wish.dataset.wish);
      if (wishItems().includes(id)) removeFromWishlist(id);
      else addToWishlist(id);
      wish.classList.toggle("active");
    }
    if (quick) openQuickView(Number(quick.dataset.quick));
  });
}

function openQuickView(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  const modal = document.getElementById("quickModal");
  const body = document.getElementById("quickBody");
  if (!p || !modal || !body) return;
  body.innerHTML = `
    <div class="detail-grid">
      <img src="${p.image}" alt="${p.name}" style="border-radius:10px;aspect-ratio:1/1;object-fit:cover;">
      <div>
        <h3>${p.name}</h3>
        <p>${p.category}</p>
        <p class="price">${money(p.price)} <span class="old-price">${money(p.oldPrice)}</span></p>
        <p>Engineered for high-efficiency field operations and consistent long-term performance.</p>
        <button class="btn btn-primary" data-add="${p.id}">Add to Cart</button>
      </div>
    </div>
  `;
  modal.classList.add("open");
  if (window.lucide) lucide.createIcons();
}

function mountCollections() {
  document.querySelectorAll("[data-collection]").forEach((root) => {
    const type = root.dataset.collection;
    let items = [];
    if (type === "featured") items = PRODUCTS.slice(0, 4);
    if (type === "best") items = [PRODUCTS[1], PRODUCTS[5], PRODUCTS[3], PRODUCTS[0]];
    if (type === "trending") items = [PRODUCTS[2], PRODUCTS[6], PRODUCTS[4], PRODUCTS[1]];
    if (type === "new") items = [PRODUCTS[7], PRODUCTS[3], PRODUCTS[5], PRODUCTS[0]];
    root.innerHTML = items.map(productCard).join("");
  });
}

function initShopPage() {
  const grid = document.getElementById("shopGrid");
  if (!grid) return;
  const search = document.getElementById("shopSearch");
  const chips = document.querySelectorAll(".chip");
  const params = new URLSearchParams(location.search);
  let currentCategory = params.get("category") || "All";
  if (!CATEGORIES.includes(currentCategory)) currentCategory = "All";
  let query = params.get("search") || "";
  if (search) search.value = query;

  function render() {
    let list = PRODUCTS;
    if (currentCategory !== "All") list = list.filter((p) => p.category === currentCategory);
    if (query) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    grid.innerHTML = list.map(productCard).join("") || `<p>No products found.</p>`;
    chips.forEach((c) => c.classList.toggle("active", c.dataset.cat === currentCategory));
    if (window.lucide) lucide.createIcons();
  }

  chips.forEach((chip) => chip.addEventListener("click", () => {
    currentCategory = chip.dataset.cat;
    render();
  }));

  if (search) search.addEventListener("input", (e) => {
    query = e.target.value.trim();
    render();
  });
  render();
}

function initProductDetailsPage() {
  const wrap = document.getElementById("productDetail");
  if (!wrap) return;
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id")) || 1;
  const p = PRODUCTS.find((x) => x.id === id) || PRODUCTS[0];
  wrap.innerHTML = `
    <div class="detail-grid">
      <div>
        <div class="gallery-main"><img id="mainProductImage" src="${p.image}" alt="${p.name}"></div>
        <div class="thumbs">
          <img class="active" src="${p.image}" alt="${p.name}">
          <img src="${PRODUCTS[(p.id % PRODUCTS.length)].image}" alt="alt 1">
          <img src="${PRODUCTS[(p.id + 1) % PRODUCTS.length].image}" alt="alt 2">
          <img src="${PRODUCTS[(p.id + 2) % PRODUCTS.length].image}" alt="alt 3">
        </div>
      </div>
      <div>
        <h2>${p.name}</h2>
        <p>${p.category}</p>
        <div class="price-line"><span class="price">${money(p.price)}</span><span class="old-price">${money(p.oldPrice)}</span></div>
        <p class="stars">${"&#9733;".repeat(p.rating)}${"&#9734;".repeat(5 - p.rating)} (128 reviews)</p>
        <p>Built for demanding field conditions with precision engineering and premium-grade material quality.</p>
        <div class="qty-wrap" style="margin:12px 0;">
          <button id="qtyDown">-</button>
          <input id="qtyInput" value="1" readonly>
          <button id="qtyUp">+</button>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-primary" id="detailAdd">Add to Cart</button>
          <button class="btn btn-outline" id="detailBuy">Buy Now</button>
        </div>
      </div>
    </div>
  `;
  const qtyInput = document.getElementById("qtyInput");
  document.getElementById("qtyDown").onclick = () => qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
  document.getElementById("qtyUp").onclick = () => qtyInput.value = Number(qtyInput.value) + 1;
  document.getElementById("detailAdd").onclick = () => addToCart(p.id, Number(qtyInput.value));
  document.getElementById("detailBuy").onclick = () => {
    const qty = Number(qtyInput.value);
    if (!isLoggedIn()) {
      setStorage("zanduPendingBuy", { id: p.id, qty });
      requireLogin("cart.html");
      return;
    }
    addToCart(p.id, qty);
    location.href = "cart.html";
  };
  document.querySelectorAll(".thumbs img").forEach((img) => {
    img.addEventListener("click", () => {
      document.getElementById("mainProductImage").src = img.src;
      document.querySelectorAll(".thumbs img").forEach((x) => x.classList.remove("active"));
      img.classList.add("active");
    });
  });
  const related = document.getElementById("relatedProducts");
  if (related) related.innerHTML = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 4).map(productCard).join("");
}

function initTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      const panel = document.getElementById(target);
      if (panel) panel.classList.add("active");
    });
  });
}

function initCartPage() {
  const body = document.getElementById("cartBody");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  if (!body) return;

  function render() {
    const cart = cartItems();
    if (!cart.length) {
      body.innerHTML = `<tr><td colspan="5">Your cart is empty.</td></tr>`;
      subtotalEl.textContent = money(0);
      totalEl.textContent = money(0);
      return;
    }
    body.innerHTML = cart.map((item) => {
      const p = PRODUCTS.find((x) => x.id === item.id);
      if (!p) return "";
      return `
        <tr>
          <td><img src="${p.image}" alt="${p.name}" style="width:70px;height:56px;object-fit:cover;border-radius:8px;"></td>
          <td>${p.name}</td>
          <td>${money(p.price)}</td>
          <td>
            <div class="qty-wrap">
              <button data-cart-qty="${p.id}" data-act="down">-</button>
              <input value="${item.qty}" readonly>
              <button data-cart-qty="${p.id}" data-act="up">+</button>
            </div>
          </td>
          <td><button class="btn btn-outline" data-remove="${p.id}">Remove</button></td>
        </tr>
      `;
    }).join("");

    const subtotal = cart.reduce((sum, item) => {
      const p = PRODUCTS.find((x) => x.id === item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
    subtotalEl.textContent = money(subtotal);
    totalEl.textContent = money(subtotal + 25);
    updateBadges();
  }

  body.addEventListener("click", (e) => {
    const qtyBtn = e.target.closest("[data-cart-qty]");
    const remove = e.target.closest("[data-remove]");
    const cart = cartItems();
    if (qtyBtn) {
      const id = Number(qtyBtn.dataset.cartQty);
      const item = cart.find((i) => i.id === id);
      if (item) item.qty = qtyBtn.dataset.act === "up" ? item.qty + 1 : Math.max(1, item.qty - 1);
      setStorage("zanduCart", cart);
      render();
    }
    if (remove) {
      setStorage("zanduCart", cart.filter((i) => i.id !== Number(remove.dataset.remove)));
      render();
    }
  });
  render();

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (!cartItems().length) {
        alert("Your cart is empty.");
        return;
      }
      if (!requireLogin("cart.html")) return;
      alert("Checkout flow UI only: user authenticated.");
    });
  }
}

function initWishlistPage() {
  const grid = document.getElementById("wishlistGrid");
  if (!grid) return;
  const ids = wishItems();
  const list = PRODUCTS.filter((p) => ids.includes(p.id));
  grid.innerHTML = list.length ? list.map(productCard).join("") : `<p>Your wishlist is empty.</p>`;
}

function initFaqPage() {
  document.querySelectorAll(".faq-q").forEach((q) => {
    q.addEventListener("click", () => q.closest(".faq-item").classList.toggle("open"));
  });
}

function initSimpleSlider() {
  document.querySelectorAll("[data-slider]").forEach((slider) => {
    const slides = slider.querySelector(".slides");
    if (!slides) return;
    let index = 0;
    const count = slides.children.length;
    setInterval(() => {
      index = (index + 1) % count;
      slides.style.transform = `translateX(-${index * 100}%)`;
    }, 3500);
  });
}

function initHeroSlider() {
  const slides = document.querySelectorAll("[data-hero-slide]");
  if (!slides.length) return;
  let idx = 0;
  setInterval(() => {
    slides[idx].classList.remove("active");
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add("active");
  }, 4200);
}

function initCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => {
    const target = Number(el.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 35);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current.toLocaleString();
    }, 45);
  });
}

function initAuthForms() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const toRegister = document.getElementById("toRegister");
  const toLogin = document.getElementById("toLogin");
  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "index.html";
  const nextEncoded = encodeURIComponent(next);

  if (toRegister) toRegister.href = `register.html?next=${nextEncoded}`;
  if (toLogin) toLogin.href = `login.html?next=${nextEncoded}`;

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      localStorage.setItem("zanduAuth", "1");
      const pending = getStorage("zanduPendingBuy");
      if (pending && pending.id) {
        addToCart(Number(pending.id), Number(pending.qty) || 1);
        localStorage.removeItem("zanduPendingBuy");
      }
      location.href = next;
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      localStorage.setItem("zanduAuth", "1");
      const pending = getStorage("zanduPendingBuy");
      if (pending && pending.id) {
        addToCart(Number(pending.id), Number(pending.qty) || 1);
        localStorage.removeItem("zanduPendingBuy");
      }
      location.href = next;
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  mountShell();
  bindSharedUI();
  bindProductEvents();
  mountCollections();
  initShopPage();
  initProductDetailsPage();
  initTabs();
  initCartPage();
  initWishlistPage();
  initFaqPage();
  initSimpleSlider();
  initHeroSlider();
  initCounters();
  initAuthForms();
  updateBadges();
  const modal = document.getElementById("quickModal");
  if (modal) modal.addEventListener("click", (e) => {
    if (e.target.id === "quickModal" || e.target.closest("[data-close-modal]")) modal.classList.remove("open");
  });
  document.querySelectorAll("#scrollTop").forEach((btn) => btn.textContent = "Top");
  const loader = document.getElementById("loader");
  setTimeout(() => loader && loader.classList.add("hide"), 550);
  if (window.lucide) lucide.createIcons();
});
