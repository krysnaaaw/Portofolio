/>>>>>>>>>>>>>>>>>>> SISTEM JUAL <<<<<<<<<<<<<<<<<<</
let isCartVisible = true;

function toggleCart() {
  const cartElement = document.querySelector('.cart');
  isCartVisible = !isCartVisible;
  cartElement.classList.toggle('muncul', isCartVisible);
}
console.log('memunculkan keranjang');

let cart = [];
let totalPrice = 0;

function addToCart(itemName, itemPrice) {
  const existingItem = cart.find((item) => item.name === itemName);

  if (existingItem) {
    existingItem.quantity++;
    totalPrice += itemPrice;
  } else {
    cart.push({ name: itemName, price: itemPrice, quantity: 1 });
    totalPrice += itemPrice;
  }

  updateCart();
}
console.log('menambahkan item ke keranjang');

function updateCart() {
  const cartItemsContainer = document.getElementById("isi-cart");
  const cartCountElement = document.getElementById("jumlah-cart");

  cartItemsContainer.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "isi-cart";
    li.innerHTML = `
    <div class="details-item">
      <span class="nama-item">${item.name}</span>
      <span class="harga-item">Rp${item.price.toLocaleString()}</span>
    </div>
    <div class="item-quantity">
      <button onclick="decrementQuantity(${index})">-</button>
      <span>${item.quantity}</span>
      <button onclick="incrementQuantity(${index})">+</button>
    </div>
    `;
    cartItemsContainer.appendChild(li);
  });
  
  document.getElementById("total-harga").textContent = `Rp ${totalPrice.toLocaleString()}`;
  cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}
console.log('menjumlah harga');

function removeFromCart(index) {
  totalPrice -= cart[index].price * cart[index].quantity;
  cart.splice(index, 1);
  updateCart();
}
console.log('menghapus item di keranjang');
  
function incrementQuantity(index) {
  cart[index].quantity++;
  totalPrice += cart[index].price;
  updateCart();
}
console.log('menambah item di keranjang');
  
function decrementQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
    totalPrice -= cart[index].price;
  } else {
    removeFromCart(index);
  }
  updateCart();
} 
console.log('mengurangi item di keranjang');

function resetCart() {
  cart = [];
  totalPrice = 0;
  updateCart();
}
console.log('mereset keranjang');

function closeAlert() {
  document.getElementById("custom-alert").classList.add("hidden");
}
console.log('menghilangkan teks jika keranjang kosong');

function addDes() {
  document.querySelector('.des-menu').style.display = 'block';
}

function toggleDes() {
  document.querySelector('.des-menu').style.display = 'none';
}

function checkout() {
  if (cart.length === 0) {
    document.getElementById("custom-alert").classList.remove("hidden");
  } else {
    document.querySelector('.cart').style.display = 'none';
    document.getElementById('info-form').style.display = 'block';

    resetCart();
  }
}
console.log('memunculkan tampilan form dan menghilangkan tampilan keranjang');

document.addEventListener('DOMContentLoaded', function () {
document.getElementById('form-data-diri').addEventListener('submit', function (event) {
  event.preventDefault();
  console.log('Formulir dikirim');

  const form = document.getElementById('info-form');
  console.log('Elemen form', form);
  form.style.display = 'none';

  const thankYouMessage = document.getElementById('thank-you-message-content');
  console.log('thank-you-message', thankYouMessage);
  thankYouMessage.style.display = 'block';

  setTimeout(function () {
    console.log('Menyembunyikan pesan terima kasih');
    thankYouMessage.style.display = 'none';
  }, 4000);

});
});