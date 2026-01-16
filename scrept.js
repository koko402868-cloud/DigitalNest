// ------------------------
// Existing product overlay logic
// ------------------------
const overlay = document.getElementById("overlay");
const oImg = document.getElementById("oImg");
const oName = document.getElementById("oName");
const oDesc = document.getElementById("oDesc");
const oPrice = document.getElementById("oPrice");
const oStock = document.getElementById("oStock");
const addBtn = document.getElementById("addBtn");

function closeOverlay() {
  overlay.style.display = "none";
}

// Dummy function for search
function searchProducts() {
  // Implement search logic here
}

// Dummy checkout
function checkout() {
  alert("Checkout not implemented yet");
}

// ------------------------
// ADD ITEM FUNCTION
// ------------------------
const itemInput = document.getElementById("itemInput");
const addItemBtn = document.getElementById("addItemBtn");
const itemList = document.getElementById("item-list");

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
