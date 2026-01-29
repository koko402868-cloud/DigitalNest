let PRODUCTS = [];
fetch('products.json')
.then(res => res.json())
.then(data => PRODUCTS = data);
