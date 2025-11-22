// ==========================================================
// 1. INISIALISASI & PENGAMBILAN DATA DARI LOCALSTORAGE
// ==========================================================

let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

// Ambil referensi elemen-elemen DOM
const cartToggle = document.getElementById('cart-toggle');
const cartEl = document.getElementById('cart');
const cartListEl = document.getElementById('cart-list');
const totalEl = document.getElementById('total-price');
const quantityIndicator = document.getElementById('jumlah-cart');
const checkoutBtn = document.getElementById('checkout-btn');
const infoFormEl = document.getElementById('info-form');
const customAlertEl = document.getElementById('custom-alert');
const thankYouMessageEl = document.getElementById('thank-you-message');
const thankYouMessageContentEl = document.getElementById('thank-you-message-content');
const desMenuEl = document.getElementById('des-menu-muncul'); 


// ==========================================================
// 2. FUNGSI UTAMA PENGELOLA DATA
// ==========================================================

function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cart));
}

function addToCart(item, price) {
    const existingItem = cart.find(cartItem => cartItem.name === item);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: item, price: price, quantity: 1 });
    }
    
    saveCart(); 
    renderCart(); 
}

function removeItem(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    saveCart(); 
    renderCart(); 
}

function changeQuantity(itemName, change) {
    const item = cart.find(cartItem => cartItem.name === itemName);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeItem(itemName);
        } else {
            saveCart(); 
            renderCart(); 
        }
    }
}


// ==========================================================
// 3. FUNGSI TAMPILAN KERANJANG (RENDER)
// ==========================================================

function renderCart() {
    // Memastikan elemen ada sebelum mencoba merender
    if (!cartListEl || !totalEl || !quantityIndicator) return;
    
    cartListEl.innerHTML = '';
    let total = 0;
    let totalQuantity = 0;
    
    if (cart.length === 0) {
        cartListEl.innerHTML = '<li style="text-align:center; color: #777; margin-top: 15px;">Keranjang masih kosong.</li>';
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        
        const listItem = document.createElement('li');
        listItem.classList.add('isi-cart-item');
        
        const escapedName = item.name.replace(/'/g, "\\'"); 

        listItem.innerHTML = `
            <div class="details-item">
                <span class="nama-item">${item.name}</span>
                <span class="harga-item">Rp${itemTotal.toLocaleString('id-ID')}</span>
            </div>
            <div class="item-quantity">
                <button onclick="changeQuantity('${escapedName}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity('${escapedName}', 1)">+</button>
                <button onclick="removeItem('${escapedName}')" style="background-color: #ff3b30; margin-left: 10px;">Hapus</button>
            </div>
        `;
        cartListEl.appendChild(listItem);
        
        total += itemTotal;
        totalQuantity += item.quantity;
    });
    
    totalEl.textContent = `Rp${total.toLocaleString('id-ID')}`;
    quantityIndicator.textContent = totalQuantity;
    
    if (checkoutBtn) {
        if (totalQuantity > 0) {
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
        } else {
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
        }
    }
}


// ==========================================================
// 4. FUNGSI UI (POPUP, TOGGLE, ALERT)
// ==========================================================

function toggleCart() {
    if (cartEl) {
        cartEl.classList.toggle('muncul');
    }
}

/**
 * Menampilkan custom alert dengan pesan tertentu.
 * Dibuat karena fungsi ini hilang di kode Anda.
 */
function showAlert(message) {
    if (customAlertEl) {
        const alertContent = customAlertEl.querySelector('.alert-content p');
        if (alertContent) {
            alertContent.textContent = message;
        }
        customAlertEl.classList.remove('hidden');
    }
}

function closeAlert() {
    if (customAlertEl) {
        customAlertEl.classList.add('hidden');
    }
}

// Fungsi untuk menangani popup deskripsi menu (MENGGUNAKAN LOGIKA TERBALIK CSS: muncul = hidden)
function addDes() {
    if (desMenuEl) {
        desMenuEl.classList.remove('muncul'); 
    }
}

// Fungsi untuk menutup popup deskripsi menu
function toggleDes() {
    if (desMenuEl) {
        desMenuEl.classList.add('muncul');
    }
}


// ==========================================================
// 5. LOGIKA FORM DAN PEMESANAN
// ==========================================================

// Event listener untuk tombol 'OK' pada alert kustom (alert-ok-btn)
document.addEventListener('DOMContentLoaded', () => {
    const alertOkBtn = document.getElementById('alert-ok-btn');
    if (alertOkBtn) {
        alertOkBtn.addEventListener('click', closeAlert);
    }
    
    // Event listener untuk tombol checkout utama (Membuka form)
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length > 0) {
                if (cartEl) cartEl.classList.add('muncul'); // Sembunyikan keranjang
                if (infoFormEl) infoFormEl.style.display = 'block'; // Tampilkan form info pelanggan
            } else {
                showAlert("Keranjang Anda masih kosong."); // Tampilkan alert jika kosong
            }
        });
    }

    // Event listener untuk submit form info pelanggan
    const formPesanan = document.getElementById('form-pesanan');
    if (formPesanan) {
        formPesanan.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const nama = document.getElementById('nama-cust').value; 
            const alamat = document.getElementById('alamat-cust').value;
            const nomor = document.getElementById('nomor-cust').value;

            // 1. Buat pesan WhatsApp
            let whatsappMessage = `Halo Kopi CaKz! Saya ingin memesan. Berikut detail pesanan saya:%0A%0A`;
            whatsappMessage += `*Nama:* ${nama}%0A`;
            whatsappMessage += `*Alamat:* ${alamat}%0A`;
            whatsappMessage += `*Nomor HP:* ${nomor}%0A%0A`;
            whatsappMessage += `*Detail Pesanan:*%0A`;

            let total = 0;
            // Gunakan salinan cart sebelum dikosongkan
            const finalOrder = [...cart]; 
            
            finalOrder.forEach(item => {
                whatsappMessage += `- ${item.name} (${item.quantity}x) - Rp${(item.price * item.quantity).toLocaleString('id-ID')}%0A`;
                total += item.price * item.quantity;
            });

            whatsappMessage += `%0A*Total Pembayaran:* Rp${total.toLocaleString('id-ID')}`;

            const phoneNumber = '6281234567890'; // Ganti dengan nomor WhatsApp toko Anda (diawali kode negara: 62)
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
            
            // 2. Tampilkan pesan terima kasih & Sembunyikan form
            if (infoFormEl) infoFormEl.style.display = 'none';
            if (thankYouMessageContentEl) {
                document.getElementById('thank-you-name').textContent = `Terima Kasih, ${nama}!`; 
                thankYouMessageContentEl.style.display = 'block';
                if (thankYouMessageEl) thankYouMessageEl.style.display = 'flex';
            }
            
            // 3. Buka jendela WhatsApp
            window.open(whatsappURL, '_blank');
            
            // 4. Kosongkan keranjang
            cart = [];
            localStorage.removeItem('cartItems'); 
            renderCart(); 
        });
    }

    // Event listener untuk menutup form info pelanggan
    const closeFormBtn = document.getElementById('close-form');
    if (closeFormBtn) {
        closeFormBtn.addEventListener('click', function() {
            if (infoFormEl) infoFormEl.style.display = 'none';
        });
    }

    // Event listener untuk menutup pesan terima kasih
    const thankYouCloseBtn = document.getElementById('thank-you-close');
    if (thankYouCloseBtn) {
        thankYouCloseBtn.addEventListener('click', function() {
            if (thankYouMessageContentEl) thankYouMessageContentEl.style.display = 'none';
            if (thankYouMessageEl) thankYouMessageEl.style.display = 'none';
        });
    }
    
    // Panggil renderCart saat halaman pertama kali dimuat
    renderCart();
});