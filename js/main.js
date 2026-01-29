const box = document.getElementById('products');
const search = document.getElementById('search');


function render(list) {
box.innerHTML='';
list.forEach(p => {
box.innerHTML += `
<div class="card">
<img src="${p.image}" onclick="openModal(${p.id})" />
<h3>${p.name}</h3>
<p>${p.price} Ks</p>
<p class="${p.stock}">${p.stock.toUpperCase()}</p>
<button onclick="addCart(${p.id})">Add to cart</button>
</div>`;
});
}


search.oninput = () => render(PRODUCTS.filter(p=>p.name.toLowerCase().includes(search.value.toLowerCase())));


function addCart(id){
let c = JSON.parse(localStorage.getItem('cart')||'{}');
c[id] = (c[id]||0)+1;
localStorage.setItem('cart',JSON.stringify(c));
}


function openModal(id){
let p = PRODUCTS.find(x=>x.id==id);
modal.style.display='block';
modalImg.src=p.image;
modalTitle.innerText=p.name;
modalDesc.innerText=p.description;
}


close.onclick=()=>modal.style.display='none';
setTimeout(()=>render(PRODUCTS),500);
