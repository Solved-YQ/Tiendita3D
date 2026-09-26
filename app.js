/* =========================================================
   SOLVED STORE — app.js
   =========================================================
   CÓMO AGREGAR UN PRODUCTO NUEVO:
   Solo agrega un objeto nuevo al arreglo PRODUCTS de abajo.
   No necesitas tocar el HTML ni el resto del JS.

   CÓMO PONER UNA FOTO REAL:
   1. Guarda la foto en la carpeta img/productos/
   2. Escribe la ruta en el campo "image", por ejemplo:
      image: "img/productos/soporte-celular.jpg"
   Si el campo "image" está vacío o el archivo no existe,
   la tarjeta muestra automáticamente un placeholder con
   textura de rayas y una etiqueta — no rompe el diseño.
   ========================================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "Organizador de cables",
    category: "organizacion",
    price: 189,
    material: "PLA",
    image: "img/productos/organizador-cables.jpg",
  },
  {
    id: 2,
    name: "Portalápices modular",
    category: "organizacion",
    price: 169,
    material: "PLA",
    image: "img/productos/portalapices.jpg",
  },
  {
    id: 3,
    name: "Soporte para celular",
    category: "escritorio",
    price: 149,
    material: "PLA",
    image: "img/productos/soporte-celular.jpg",
  },
  {
    id: 4,
    name: "Elevador para laptop",
    category: "escritorio",
    price: 349,
    material: "PETG",
    image: "img/productos/elevador-laptop.jpg",
  },
  {
    id: 5,
    name: "Maceta geométrica",
    category: "decoracion",
    price: 229,
    material: "PLA",
    image: "img/productos/maceta.jpg",
  },
  {
    id: 6,
    name: "Figura decorativa low-poly",
    category: "decoracion",
    price: 199,
    material: "PLA",
    image: "img/productos/figura-lowpoly.jpg",
  },
  {
    id: 7,
    name: "Soporte para audífonos",
    category: "gaming",
    price: 259,
    material: "PLA",
    image: "img/productos/soporte-audifonos.jpg",
  },
  {
    id: 8,
    name: "Soporte para control",
    category: "gaming",
    price: 179,
    material: "PLA",
    image: "img/productos/soporte-control.jpg",
  },
];

// --- ESTADO ---
let cart = JSON.parse(localStorage.getItem("solved_store_cart") || "[]");
let activeCategory = "todos";

function saveCart() {
  localStorage.setItem("solved_store_cart", JSON.stringify(cart));
}

// --- CATÁLOGO ---
function renderProducts() {
  const grid = document.getElementById("productGrid");
  const list = activeCategory === "todos"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory);

  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-thumb">
        <span class="placeholder-label">${p.image.split("/").pop()}</span>
        <img src="${p.image}" alt="${p.name}" onerror="this.remove()">
      </div>
      <div class="product-info">
        <span class="product-cat">${p.category.toUpperCase()} · ${p.material}</span>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-price">$${p.price} MXN</p>
        <button class="add-to-cart" data-id="${p.id}">+ AGREGAR AL CARRITO</button>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      addToCart(Number(btn.dataset.id));
      btn.textContent = "AGREGADO ✓";
      btn.classList.add("added");
      setTimeout(() => {
        btn.textContent = "+ AGREGAR AL CARRITO";
        btn.classList.remove("added");
      }, 1100);
    });
  });
}

// --- FILTROS (pills del catálogo) ---
function setActiveFilter(category) {
  activeCategory = category;
  document.querySelectorAll(".filter-pill").forEach(pill => {
    pill.classList.toggle("active", pill.dataset.category === category);
  });
  renderProducts();
}

function setupFilters() {
  document.querySelectorAll(".filter-pill").forEach(pill => {
    pill.addEventListener("click", () => setActiveFilter(pill.dataset.category));
  });
}

// --- TARJETAS DE CATEGORÍA (filtran el catálogo y bajan a la sección) ---
function setupCategoryCards() {
  document.querySelectorAll(".cat-card").forEach(card => {
    card.addEventListener("click", () => {
      setActiveFilter(card.dataset.category);
      document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
    });
  });
}

// --- CARRITO ---
function addToCart(id) {
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, qty: 1 });
  saveCart();
  renderCart();
  showToast("Se agregó al carrito");
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function cartSubtotal() {
  return cart.reduce((sum, item) => {
    const p = PRODUCTS.find(p => p.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function cartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function renderCart() {
  document.getElementById("cartCount").textContent = cartCount();

  const box = document.getElementById("cartItems");
  const continueBtn = document.getElementById("continueBtn");

  if (cart.length === 0) {
    box.innerHTML = `<p class="cart-empty">Tu carrito está vacío.</p>`;
    continueBtn.disabled = true;
  } else {
    box.innerHTML = cart.map(item => {
      const p = PRODUCTS.find(p => p.id === item.id);
      return `
        <div class="cart-item">
          <div class="cart-item-thumb"></div>
          <div class="cart-item-info">
            <h4>${p.name}</h4>
            <span class="price">$${p.price * item.qty} MXN</span>
            <div class="qty-row">
              <button data-action="minus" data-id="${p.id}">−</button>
              <span>${item.qty}</span>
              <button data-action="plus" data-id="${p.id}">+</button>
            </div>
            <button class="remove-btn" data-action="remove" data-id="${p.id}">Quitar</button>
          </div>
        </div>
      `;
    }).join("");
    continueBtn.disabled = false;
  }

  document.getElementById("cartSubtotal").textContent = "$" + cartSubtotal() + " MXN";

  box.querySelectorAll("button[data-action]").forEach(btn => {
    const id = Number(btn.dataset.id);
    btn.addEventListener("click", () => {
      if (btn.dataset.action === "plus") updateQty(id, 1);
      if (btn.dataset.action === "minus") updateQty(id, -1);
      if (btn.dataset.action === "remove") removeFromCart(id);
    });
  });
}

function setupCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("overlay");

  document.getElementById("openCart").addEventListener("click", () => {
    drawer.classList.add("open");
    overlay.classList.add("open");
  });

  function close() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
  }

  document.getElementById("closeCart").addEventListener("click", close);
  overlay.addEventListener("click", close);
}

// --- CHECKOUT (placeholder, todavía sin pagos) ---
function setupContinueButton() {
  document.getElementById("continueBtn").addEventListener("click", () => {
    showToast("El checkout se conectará próximamente");
  });
}

// --- MENÚ MÓVIL ---
function setupMobileMenu() {
  const nav = document.getElementById("mainNav");
  document.getElementById("menuToggle").addEventListener("click", () => {
    nav.classList.toggle("open");
  });
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

// --- TOAST ---
function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

// --- INIT ---
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupFilters();
  setupCategoryCards();
  renderCart();
  setupCartDrawer();
  setupContinueButton();
  setupMobileMenu();
});
