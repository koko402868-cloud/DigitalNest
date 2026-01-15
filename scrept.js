let products = [];
let cart = [];
let currentProduct = null;

/* GET ELEMENTS (အရင်ဆုံး) */
const productsDiv = document.getElementById("products");
const overlay = document.getElementById("overlay");
const oImg = document.getElementById("oImg");
const oName = document.getElementById("oName");
const oDesc = document.getElementById("oDesc");
const oPrice = document.getElementById("oPrice");
const oStock = document.getElementById("oStock");
const addBtn = document.getElementById("addBtn");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const searchInput = document.getElementById("searchInput");

/* PRICE STRING → NUMBER */
function parsePrice(priceStr) {
  return Number(priceStr.replace(/[^0-9]/g, ""));
}

/* LOAD PRODUCTS */
fetch("products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts(products);
  })
  .catch(err => {
    productsDiv.innerHTML = "❌ Failed to load data";
    console.error(err);
  });

/* RENDER PRODUCTS */
function renderProducts(list) {
  productsDiv.innerHTML = "";

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    if (item.stock === 0) card.classList.add("out-stock");
    else if (item.stock <= 3) card.classList.add("low-stock");

    card.innerHTML = `
      <img src="${item.image}" onclick="openOverlay(${item.id})">
      <div class="info">
        <h3>${item.name}</h3>
        <p class="price">${item.price}</p>
      </div>
    `;
    productsDiv.appendChild(card);
  });
}

/* SEARCH */
function searchProducts() {
  const text = searchInput.value.toLowerCase();
  renderProducts(products.filter(p =>
    p.name.toLowerCase().includes(text)
  ));
}

/* OPEN OVERLAY */
function openOverlay(id) {
  currentProduct = products.find(p => p.id === id);
  overlay.style.display = "flex";

  oImg.src = currentProduct.image;
  oName.innerText = currentProduct.name;
  oDesc.innerText = currentProduct.description;
  oPrice.innerText = "Price: " + currentProduct.price;

  if (currentProduct.stock === 0) {
    oStock.innerText = "OUT OF STOCK";
    oStock.style.color = "red";
    addBtn.disabled = true;
  } else {
    oStock.innerText = "In Stock";
    oStock.style.color = "green";
    addBtn.disabled = false;
  }
}

/* ADD TO CART */
addBtn.onclick = function () {
  const found = cart.find(i => i.id === currentProduct.id);

  if (found) {
    found.qty++;
  } else {
    cart.push({
      id: currentProduct.id,
      name: currentProduct.name,
      priceText: currentProduct.price,
      price: parsePrice(currentProduct.price),
      qty: 1
    });
  }

  updateCartUI();
  closeOverlay();
};

/* UPDATE CART */
function updateCartUI() {
  cartCount.innerText = cart.reduce((s, i) => s + i.qty, 0);
  cartTotal.innerText =
    cart.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString() + " Ks";
}

/* CHECKOUT */
function checkout() {
  if (cart.length === 0) {
    alert("🛒 Cart is empty!");
    return;
  }

  const order = {
    orderId: "ORD-" + Date.now(),
    items: cart,
    total: cart.reduce((s, i) => s + i.price * i.qty, 0) + " Ks",
    time: new Date().toLocaleString()
  };

  const blob = new Blob([JSON.stringify(order, null, 2)], {
    type: "application/json"
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = order.orderId + ".json";
  a.click();

  cart = [];
  updateCartUI();
}

/* CLOSE OVERLAY */
function closeOverlay() {
  overlay.style.display = "none";
}
