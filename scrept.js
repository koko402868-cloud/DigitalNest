let products = [];
let currentProduct = null;

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

    if (item.stock === 0) {
      card.classList.add("out-stock");
      label = `<div class="stock-label stock-out">OUT OF STOCK</div>`;
    } 
    else if (item.stock <= 5) {
      label = `<div class="stock-label stock-low">LOW STOCK</div>`;
    }

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
  currentProduct = item;

  document.getElementById("overlay").style.display = "flex";
  document.getElementById("oImg").src = item.image;
  document.getElementById("oName").innerText = item.name;
  document.getElementById("oDesc").innerText = item.description;
  document.getElementById("oPrice").innerText = "Price: " + item.price;

  const stockText = document.getElementById("oStock");
  const btn = document.getElementById("buyBtn");

  if (item.stock === 0) {
    stockText.innerText = "OUT OF STOCK";
    stockText.style.color = "red";
    btn.disabled = true;
    btn.innerText = "Unavailable";
  } 
  else if (item.stock <= 5) {
    stockText.innerText = "LOW STOCK";
    stockText.style.color = "orange";
    btn.disabled = false;
    btn.innerText = "Add to Cart";
    btn.onclick = addToCart;
  } 
  else {
    stockText.innerText = "In Stock";
    stockText.style.color = "green";
    btn.disabled = false;
    btn.innerText = "Add to Cart";
    btn.onclick = addToCart;
  }
}

/* ADD TO CART */
function addToCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({
    id: currentProduct.id,
    name: currentProduct.name,
    price: currentProduct.price,
    image: currentProduct.image,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("🛒 Added to cart!");
  closeOverlay();
}

/* CLOSE OVERLAY */
function closeOverlay() {
  document.getElementById("overlay").style.display = "none";
}
