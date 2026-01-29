let cart = JSON.parse(localStorage.getItem('cart')||'{}');
fetch('products.json').then(r=>r.json()).then(p=>{
  let html='';
  for(let id in cart){
    let item = p.find(x=>x.id==id);
    html+=`<p>${item.name} | Qty: ${cart[id]} <button onclick="cart[id]++">+</button></p>`;
  }
  cartItems.innerHTML=html;
});