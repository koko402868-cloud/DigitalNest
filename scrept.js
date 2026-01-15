let products = [];
let cart = [];
let currentProduct = null;

/* LOAD PRODUCTS */
fetch("products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts(products);
  });

function renderProducts(list) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    if (item.stock === 0) card.classList.add("out-stock");
    else if (item.stock <= 3) card.classList.add("low-stock");

    card.innerHTML = `
      <img src="${item.image}" onclick="openOverlay(${item.id})">
      <div class="info">
        <h3>${item.name}</h3>
        <p class="price">${item.price} Ks</p>
      </div>
    `;
    container.appendChild(card);
  });
}

/* SEARCH */
function searchProducts() {
  const text = searchInput.value.toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(text)));
}

/* OPEN OVERLAY */
function openOverlay(id) {
  currentProduct = products.find(p => p.id === id);
  overlay.style.display = "flex";

  oImg.src = currentProduct.image;
  oName.innerText = currentProduct.name;
  oDesc.innerText = currentProduct.description;
  oPrice.innerText = "Price: " + currentProduct.price + " Ks";

  if (currentProduct.stock === 0) {
    oStock.innerText = "OUT OF STOCK";
    addBtn.disabled = true;
  } else {
    oStock.innerText = "In Stock";
    addBtn.disabled = false;
  }
}

/* ADD TO CART */
addBtn.onclick = function () {
  const found = cart.find(i => i.id === currentProduct.id);
  if (found) found.qty++;
  else cart.push({ ...currentProduct, qty: 1 });

  updateCartUI();
  closeOverlay();
};

/* UPDATE CART */
function updateCartUI() {
  cartCount.innerText = cart.reduce((s, i) => s + i.qty, 0);
  cartTotal.innerText = cart.reduce((s, i) => s + i.price * i.qty, 0);
}

/* CHECKOUT */
function checkout() {
  if (cart.length === 0) return alert("Cart is empty!");

  const order = {
    orderId: "ORD-" + Date.now(),
    items: cart,
    total: cart.reduce((s, i) => s + i.price * i.qty, 0),
    time: new Date().toLocaleString()
  };

  const blob = new Blob([JSON.stringify(order, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = order.orderId + ".json";
  a.click();

  cart = [];
  updateCartUI();
}

/* CLOSE */
function closeOverlay() {
  overlay.style.display = "none";
}
