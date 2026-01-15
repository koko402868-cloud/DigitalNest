let products = [];
let cart = [];
let currentProduct = null;

/* PRICE STRING → NUMBER */
function parsePrice(priceStr) {
  // "42,000 Ks" → 42000
  return Number(priceStr.replace(/[^0-9]/g, ""));
}

/* LOAD PRODUCTS */
fetch("products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts(products);
  })
  .catch(() => {
    document.getElementById("products").innerHTML = "Failed to load data";
  });

/* RENDER PRODUCTS */
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
        <p class="price">${item.price}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

/* SEARCH */
function searchProducts() {
  const text = searchInput.value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(text)
  );
  renderProducts(filtered);
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

/* UPDATE CART UI */
function updateCartUI() {
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  cartCount.innerText = totalQty;
  cartTotal.innerText = totalPrice.toLocaleString() + " Ks";
}

/* CHECKOUT */
function checkout() {
  if (cart.length === 0) {
    alert("🛒 Cart is empty!");
    return;
  }

  const order = {
    orderId: "ORD-" + Date.now(),
    items: cart.map(i => ({
      id: i.id,
      name: i.name,
      price: i.priceText,
      quantity: i.qty,
      subTotal: (i.price * i.qty).toLocaleString() + " Ks"
    })),
    total: cart.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString() + " Ks",
    time: new Date().toLocaleString()
  };

  const blob = new Blob(
    [JSON.stringify(order, null, 2)],
    { type: "application/json" }
  );

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
