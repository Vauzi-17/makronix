const WA_NUMBER = '6282328440349'; 

const PRODUCTS = {
    'Makronix Spicy Crunch': {
        basePrice: 25000,
        variants: { type: 'level', options: ['Level 1', 'Level 2', 'Level 3'] },
        sizes: ['90gr', '150gr', '250gr'],
        sizeMult: [1, 1.4, 1.9]
    },
    'Makronix Spicy Melt': {
        basePrice: 25000,
        variants: { type: 'level', options: ['Level 1', 'Level 2', 'Level 3'] },
        sizes: ['90gr', '150gr', '250gr'],
        sizeMult: [1, 1.4, 1.9]
    },
    'Makronix Classic Crunch': {
        basePrice: 15000,
        variants: { type: 'rasa', options: ['Original', 'Gurih', 'Keju'] },
        sizes: ['90gr', '150gr', '250gr'],
        sizeMult: [1, 1.4, 1.9]
    },
    'Makronix Ori Classic': {
        basePrice: 15000,
        variants: { type: 'rasa', options: ['Original', 'Gurih', 'Keju'] },
        sizes: ['90gr', '150gr', '250gr'],
        sizeMult: [1, 1.4, 1.9]
    },
    'Makronix Varian Crunch': {
        basePrice: 15000,
        variants: { type: 'rasa', options: ['Original', 'Gurih', 'Keju'] },
        sizes: ['90gr', '150gr', '250gr'],
        sizeMult: [1, 1.4, 1.9]
    },
    'Makronix Classic Cheese': {
        basePrice: 15000,
        variants: { type: 'rasa', options: ['Original', 'Gurih', 'Keju'] },
        sizes: ['90gr', '150gr', '250gr'],
        sizeMult: [1, 1.4, 1.9]
    },
};

let cart = JSON.parse(localStorage.getItem('makronix_cart') || '[]');

// ---- Utils ----
function saveCart() {
    localStorage.setItem('makronix_cart', JSON.stringify(cart));
}

function getPrice(productName, sizeIndex) {
    const p = PRODUCTS[productName];
    return Math.round(p.basePrice * p.sizeMult[sizeIndex]);
}

function formatRp(n) {
    return 'Rp. ' + n.toLocaleString('id-ID');
}

function updateBadge() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    document.getElementById('cartBadge').textContent = total;
}

// ---- Add to Cart ----
function addToCart(productName) {
    const existing = cart.find(i => i.name === productName);
    if (existing) {
        existing.qty++;
    } else {
        const p = PRODUCTS[productName];
        cart.push({
            id: Date.now(),
            name: productName,
            variant: p.variants.options[0],
            sizeIndex: 0,
            qty: 1
        });
    }
    saveCart();
    updateBadge();
    openDrawer();
}

// ---- Drawer ----
function openDrawer() {
    document.getElementById('cartDrawer').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');
    renderCart();
}

function closeDrawer() {
    document.getElementById('cartDrawer').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
}

// ---- Render Cart ----
function renderCart() {
    const container = document.getElementById('cartItems');

    if (cart.length === 0) {
        container.innerHTML = `<div class="cart-empty">
            <i class="fa-solid fa-cart-shopping" style="font-size:2.5rem;color:#ddd;margin-bottom:1rem;display:block"></i>
            Keranjang masih kosong
        </div>`;
        document.getElementById('cartFooter').style.display = 'none';
        return;
    }

    document.getElementById('cartFooter').style.display = 'flex';

    container.innerHTML = cart.map((item, idx) => {
        const p = PRODUCTS[item.name];
        const price = getPrice(item.name, item.sizeIndex);

        const variantOptions = p.variants.options.map(o =>
            `<option value="${o}" ${item.variant === o ? 'selected' : ''}>${o}</option>`
        ).join('');

        const sizeOptions = p.sizes.map((s, si) =>
            `<option value="${si}" ${item.sizeIndex === si ? 'selected' : ''}>${s} — ${formatRp(getPrice(item.name, si))}</option>`
        ).join('');

        return `
        <div class="cart-item">
            <div class="cart-item-top">
                <span class="cart-item-name">${item.name}</span>
                <button class="cart-item-remove" onclick="removeItem(${idx})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            <div class="cart-item-selectors">
                <label>${p.variants.type === 'level' ? 'Level' : 'Rasa'}:
                    <select onchange="updateVariant(${idx}, this.value)">${variantOptions}</select>
                </label>
                <label>Size:
                    <select onchange="updateSize(${idx}, this.value)">${sizeOptions}</select>
                </label>
            </div>
            <div class="cart-item-bottom">
                <span class="cart-item-price">${formatRp(price * item.qty)}</span>
                <div class="cart-qty">
                    <button onclick="changeQty(${idx}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${idx}, 1)">+</button>
                </div>
            </div>
        </div>`;
    }).join('');

    // Total
    const total = cart.reduce((s, i) => s + getPrice(i.name, i.sizeIndex) * i.qty, 0);
    document.getElementById('cartTotal').textContent = formatRp(total);

    // Generate WA message
    generateWAMessage();
}

// ---- Cart Actions ----
function removeItem(idx) {
    cart.splice(idx, 1);
    saveCart();
    updateBadge();
    renderCart();
}

function changeQty(idx, delta) {
    cart[idx].qty = Math.max(1, cart[idx].qty + delta);
    saveCart();
    renderCart();
}

function updateVariant(idx, val) {
    cart[idx].variant = val;
    saveCart();
    generateWAMessage();
}

function updateSize(idx, val) {
    cart[idx].sizeIndex = parseInt(val);
    saveCart();
    renderCart();
}

// ---- WA Message ----
function generateWAMessage() {
    const lines = cart.map((item, i) => {
        const p = PRODUCTS[item.name];
        const price = getPrice(item.name, item.sizeIndex);
        const varLabel = p.variants.type === 'level' ? item.variant : `Rasa ${item.variant}`;
        return `${i+1}. ${item.name} - ${varLabel}, ${p.sizes[item.sizeIndex]} x${item.qty} = ${formatRp(price * item.qty)}`;
    });
    const total = cart.reduce((s, i) => s + getPrice(i.name, i.sizeIndex) * i.qty, 0);
    const msg = `Halo Makronix! Saya mau pesan:\n\n${lines.join('\n')}\n\nTotal: ${formatRp(total)}\n\nMohon konfirmasi ketersediaan. Terima kasih!`;
    document.getElementById('waMessage').value = msg;
}

// ---- Send WA ----
function sendWA() {
    const msg = document.getElementById('waMessage').value;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
}

// ---- Event Listeners ----
document.addEventListener('DOMContentLoaded', () => {
    updateBadge();

    document.getElementById('cartFab').addEventListener('click', openDrawer);
    document.getElementById('cartClose').addEventListener('click', closeDrawer);
    document.getElementById('cartOverlay').addEventListener('click', closeDrawer);
    document.getElementById('cartSend').addEventListener('click', sendWA);

    // Hook tombol Add di setiap card
    document.querySelectorAll('.add-btn').forEach(btn => {
        const name = btn.closest('.menu-card').querySelector('h2').textContent.trim();
        btn.addEventListener('click', () => addToCart(name));
    });
});