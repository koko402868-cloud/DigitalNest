let products = [];
let cart = [];

/* LOAD PRODUCTS */
fetch("products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts(products);
  });

/* RENDER PRODUCTS */
function renderProducts(list) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    let label = "";
    if (item.stock === 0) label = `<div class="stock-label">OUT OF STOCK</div>`;
    else if (item.stock < 10) label = `<div class="stock-label low-stock">LOW STOCK</div>`;

    card.innerHTML = `
      ${label}
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
  const text = document.getElementById("searchInput").value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(text)
  );
  renderProducts(filtered);
}

/* OPEN OVERLAY */
function openOverlay(id) {
  const item = products.find(p => p.id === id);

  document.getElementById("overlay").style.display = "flex";
  document.getElementById("oImg").src = item.image;
  document.getElementById("oName").innerText = item.name;
  document.getElementById("oDesc").innerText = item.description;
  document.getElementById("oPrice").innerText = "Price: " + item.price;

  const stockText = document.getElementById("oStock");

  if (item.stock === 0) {
    stockText.innerText = "Status: OUT OF STOCK";
    stockText.style.color = "red";
    document.getElementById("addBtn").disabled = true;
  } else if (item.stock < 10) {
    stockText.innerText = "Status: LOW STOCK";
    stockText.style.color = "orange";
    document.getElementById("addBtn").disabled = false;
  } else {
    stockText.innerText = "In Stock";
    stockText.style.color = "green";
    document.getElementById("addBtn").disabled = false;
  }

  // Add to Cart overlay button
  const addBtn = document.getElementById("addBtn");
  addBtn.onclick = () => addToCart(item);
}

/* CLOSE OVERLAY */
function closeOverlay() {
  document.getElementById("overlay").style.display = "none";
}

/* ------------------ */
/* CART LOGIC         */
/* ------------------ */
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const itemInput = document.getElementById("itemInput");
const addItemBtn = document.getElementById("addItemBtn");
const itemList = document.getElementById("item-list");

function addToCart(item) {
  const existing = cart.find(c => c.id === item.id);
  if (existing) existing.qty++;
  else cart.push({...item, qty: 1});

  updateCartDisplay();
  saveOrder({...item, qty: 1}); // save to localStorage orders
  closeOverlay();
}

function updateCartDisplay() {
  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(i => {
    totalItems += i.qty;
    totalPrice += parseInt(i.price.replace(/,/g,'').replace(' Ks','')) * i.qty;
  });

  cartCountEl.innerText = totalItems;
  cartTotalEl.innerText = totalPrice.toLocaleString() + " Ks";
}

/* ------------------ */
/* CUSTOM ADD ITEM    */
/* ------------------ */
addItemBtn.addEventListener("click", () => {
  const itemName = itemInput.value.trim();
  if (!itemName) return;

  const li = document.createElement("li");
  li.textContent = itemName;

  // Controls container
  const controls = document.createElement("span");
  controls.className = "item-controls";

  // Quantity
  let qty = 1;
  const qtySpan = document.createElement("span");
  qtySpan.textContent = `Qty: ${qty}`;

  // Increase quantity
  const incBtn = document.createElement("button");
  incBtn.textContent = "+";
  incBtn.addEventListener("click", () => {
    qty++;
    qtySpan.textContent = `Qty: ${qty}`;
  });

  // Decrease quantity
  const decBtn = document.createElement("button");
  decBtn.textContent = "-";
  decBtn.addEventListener("click", () => {
    if (qty > 1) {
      qty--;
      qtySpan.textContent = `Qty: ${qty}`;
    }
  });

  // Delete item
  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.addEventListener("click", () => {
    itemList.removeChild(li);
  });

  controls.appendChild(qtySpan);
  controls.appendChild(incBtn);
  controls.appendChild(decBtn);
  controls.appendChild(delBtn);

  li.textContent = itemName + " ";
  li.appendChild(controls);
  itemList.appendChild(li);

  // Clear input
  itemInput.value = "";
});

/* ------------------ */
/* SAVE ORDERS        */
/* ------------------ */
function saveOrder(item) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  const timestamp = new Date().toLocaleString();
  orders.push({
    id: item.id,
    name: item.name,
    price: item.price,
    time: timestamp,
    qty: item.qty
  });
  localStorage.setItem("orders", JSON.stringify(orders));
}
