/*
##############################################################################################
#   SEC C | ARMORY LOGIC CORE [TITAN BUILD v.21.0]                                           #
#   ARCHITECT: PERPLEXITY AI                                                                 #
#   MODULE: OMEGA_COMMERCE_ENGINE_JS                                                         #
#   STATUS: OPERATIONAL                                                                      #
##############################################################################################
*/

// --- 1. ASSET DATABASE (MAPPED TO YOUR LOCAL FILES) ---
const DB = [
    // --- APPAREL (Jackets, Hoodies, Shirts) ---
    { 
        id: 101, 
        name: "SPECTRE JACKET V4", 
        brand: "MILITECH", 
        category: "apparel",
        price: 4500, 
        rarity: "legendary", 
        img: "C-prodoct/jaket.png", 
        stats: { def: 95, wgt: "1.2kg" } 
    },
    { 
        id: 102, 
        name: "NEON SIGNAL HOODIE", 
        brand: "STREET_KID", 
        category: "apparel",
        price: 850, 
        rarity: "rare", 
        img: "C-prodoct/hoodie.png", 
        stats: { def: 15, wgt: "0.8kg" } 
    },
    { 
        id: 103, 
        name: "PHANTOM HOODIE [BLUE]", 
        brand: "ARASAKA", 
        category: "apparel",
        price: 1200, 
        rarity: "epic", 
        img: "C-prodoct/hoodiBLUE.png", 
        stats: { def: 25, wgt: "0.9kg" } 
    },
    { 
        id: 104, 
        name: "CYBER-STEALTH HOODIE", 
        brand: "NET_RUNNER", 
        category: "apparel",
        price: 950, 
        rarity: "rare", 
        img: "C-prodoct/hoodi3.png", 
        stats: { def: 20, wgt: "0.8kg" } 
    },
    { 
        id: 105, 
        name: "SEC-C OPERATOR TEE", 
        brand: "SEC_C_MERCH", 
        category: "apparel",
        price: 150, 
        rarity: "common", 
        img: "C-prodoct/T-sirt.png", 
        stats: { def: 5, wgt: "0.2kg" } 
    },
    { 
        id: 106, 
        name: "URBAN TAC PANTS", 
        brand: "5.11_TACTICAL", 
        category: "apparel",
        price: 1100, 
        rarity: "epic", 
        img: "C-prodoct/pant.png", 
        stats: { def: 40, wgt: "1.1kg" } 
    },

    // --- ACCESSORIES (Gloves, Hats, Belts) ---
    { 
        id: 107, 
        name: "HACKER GLOVES [GREEN]", 
        brand: "NET_RUNNER", 
        category: "tech",
        price: 450, 
        rarity: "rare", 
        img: "C-prodoct/glaves2.png", 
        stats: { def: 10, wgt: "0.2kg" } 
    },
    { 
        id: 108, 
        name: "COMBAT GLOVES MK.II", 
        brand: "TRAUMA TEAM", 
        category: "apparel",
        price: 350, 
        rarity: "common", 
        img: "C-prodoct/glaves1.png", 
        stats: { def: 25, wgt: "0.3kg" } 
    },
    { 
        id: 109, 
        name: "OPERATOR CAP", 
        brand: "MILITECH", 
        category: "apparel",
        price: 120, 
        rarity: "common", 
        img: "C-prodoct/cap.png", 
        stats: { def: 5, wgt: "0.1kg" } 
    },
    { 
        id: 110, 
        name: "GRAV-UTILITY BELT", 
        brand: "KANG TAO", 
        category: "tech",
        price: 1500, 
        rarity: "epic", 
        img: "C-prodoct/balte.png", 
        stats: { def: 35, wgt: "1.5kg" } 
    },

    // --- FOOTWEAR ---
    { 
        id: 111, 
        name: "SPEEDSTER KICKS V1", 
        brand: "STREET_KID", 
        category: "apparel",
        price: 2200, 
        rarity: "epic", 
        img: "C-prodoct/shose1.png", 
        stats: { def: 15, wgt: "0.5kg" } 
    },
    { 
        id: 112, 
        name: "NEON RUNNERS [GREEN]", 
        brand: "ARASAKA", 
        category: "apparel",
        price: 2800, 
        rarity: "legendary", 
        img: "C-prodoct/shose2.png", 
        stats: { def: 20, wgt: "0.4kg" } 
    },

    // --- TECH & GADGETS ---
    { 
        id: 113, 
        name: "VR INTERFACE KIT", 
        brand: "NEURO_LINK", 
        category: "tech",
        price: 5400, 
        rarity: "legendary", 
        img: "C-prodoct/vr.png", 
        stats: { def: 5, wgt: "0.6kg" } 
    },
    { 
        id: 114, 
        name: "SMART WATCH [HOLO]", 
        brand: "KANG_TAO", 
        category: "tech",
        price: 3200, 
        rarity: "epic", 
        img: "C-prodoct/watch.png", 
        stats: { def: 5, wgt: "0.1kg" } 
    },
    { 
        id: 115, 
        name: "CHRONO ANALOG", 
        brand: "NOIR_LUXE", 
        category: "tech",
        price: 8900, 
        rarity: "legendary", 
        img: "C-prodoct/watch1.png", 
        stats: { def: 8, wgt: "0.2kg" } 
    },

    // --- SPECIAL CHARACTERS / BUNDLES ---
    { 
        id: 116, 
        name: "FULL OPERATOR BUNDLE", 
        brand: "SEC_C_EXCLUSIVE", 
        category: "weapons", // Categorized as weapons/bundle for filter variety
        price: 15000, 
        rarity: "legendary", 
        img: "C-prodoct/mtFrjYzd_UJ9rSzw-tDi.png", // Ensure filename matches exactly!
        stats: { def: 500, wgt: "85kg" } 
    }
];

// --- 2. STATE MANAGEMENT ---
let cart = [];
let currentFilter = 'all';

// --- 3. SYSTEM INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
    console.log("%c SYSTEM ONLINE ", "background: #00ff88; color: #000; font-weight: bold; padding: 5px;");
    
    // Initial Render
    renderGrid(DB);
    setupSearch();
    setupSlider();
    setupMobileHooks();
});

// --- 4. RENDER ENGINE (UPDATED WITH IMAGE ERROR HANDLING) ---
function renderGrid(data) {
    const grid = document.getElementById('gridTarget');
    grid.innerHTML = ''; // Clear skeleton/previous
    
    // Empty State
    if(data.length === 0) {
        grid.innerHTML = `
            <div style="color:#666; text-align:center; grid-column:1/-1; padding-top:60px;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem; margin-bottom:10px;"></i><br>
                NO ASSETS FOUND IN DATABASE
            </div>`;
        return;
    }

    // Generate Cards
    data.forEach((item, index) => {
        const el = document.createElement('article');
        el.className = `prod-card ${item.rarity}`;
        el.style.animation = `fadeIn 0.5s ease forwards ${index * 0.05}s`;
        
        // Prevent click when hitting "Add" button
        el.onclick = (e) => { 
            if(!e.target.closest('.pc-add') && !e.target.closest('.pc-fav')) openModal(item.id); 
        };
        
        el.innerHTML = `
            <div class="pc-head">
                <span class="pc-badge">${item.rarity.toUpperCase()}</span>
                <button class="pc-fav"><i class="fa-regular fa-heart"></i></button>
            </div>
            <div class="pc-img-box">
                <img src="${item.img}" 
                     alt="${item.name}" 
                     class="pc-img" 
                     loading="lazy"
                     onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'img-fallback\\'><i class=\\'fa-solid fa-triangle-exclamation\\'></i><span>IMG_ERR</span></div>'">
                <div class="pc-glow"></div>
                <div class="scan-line"></div>
            </div>
            <div class="pc-body">
                <div class="pc-meta">
                    <span class="brand">${item.brand}</span>
                    <span class="stock">IN_STOCK</span>
                </div>
                <h3 class="pc-title">${item.name}</h3>
                <div class="pc-stats">
                    <div class="stat"><i class="fa-solid fa-shield"></i> ${item.stats.def}</div>
                    <div class="stat"><i class="fa-solid fa-weight-hanging"></i> ${item.stats.wgt}</div>
                </div>
            </div>
            <div class="pc-foot">
                <span class="pc-price">${item.price.toLocaleString()} <small>CR</small></span>
                <button class="pc-add" onclick="addToCart(${item.id})"><i class="fa-solid fa-plus"></i></button>
            </div>
        `;
        grid.appendChild(el);
    });
}

// --- 5. CART OPERATIONS ---
function addToCart(id) {
    const item = DB.find(p => p.id === id);
    const exist = cart.find(c => c.id === id);
    
    if(exist) {
        exist.qty++;
        showToast(`QUANTITY UPDATED: ${item.name}`);
    } else {
        cart.push({ ...item, qty: 1 });
        showToast(`ADDED TO MANIFEST: ${item.name}`);
    }
    
    // Animation effect on button (optional)
    const btn = event.currentTarget;
    if(btn) {
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => { btn.innerHTML = originalIcon; }, 1000);
    }
    
    updateCart();
}

function modQty(id, delta) {
    const item = cart.find(c => c.id === id);
    if(!item) return;
    
    item.qty += delta;
    if(item.qty <= 0) {
        cart = cart.filter(c => c.id !== id); // Remove
    }
    updateCart();
}

function updateCart() {
    const list = document.getElementById('cartListTarget');
    const mobBadge = document.getElementById('mobBadge'); 
    const deskBadge = document.getElementById('cartBadge'); 
    
    const totalQty = cart.reduce((acc, c) => acc + c.qty, 0);
    
    // Update Badges
    if(mobBadge) {
        mobBadge.innerText = totalQty;
        mobBadge.style.display = totalQty > 0 ? 'flex' : 'none';
    }
    if(deskBadge) deskBadge.innerText = totalQty;

    // Render List
    list.innerHTML = '';
    if(cart.length === 0) {
        list.innerHTML = `
            <div class="empty-msg">
                <div class="icon-circle"><i class="fa-solid fa-box-open"></i></div>
                <span>NO ASSETS REQUISITIONED</span>
                <small>Select items from the grid to add them.</small>
            </div>`;
    } else {
        cart.forEach(item => {
            const row = document.createElement('div');
            row.className = 'cart-item'; 
            row.style.cssText = "display:flex; align-items:center; gap:10px; margin-bottom:10px; background:rgba(255,255,255,0.05); padding:8px; border-radius:4px;";
            
            row.innerHTML = `
                <img src="${item.img}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
                <div style="flex:1;">
                    <div style="font-family:'Rajdhani'; font-weight:600; color:#fff;">${item.name}</div>
                    <div style="color:var(--c-prim); font-size:0.9rem;">${(item.price * item.qty).toLocaleString()} CR</div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <button onclick="modQty(${item.id}, -1)" style="background:none; border:1px solid #444; color:#fff; width:24px; cursor:pointer;">-</button>
                    <span style="font-family:'Share Tech Mono';">${item.qty}</span>
                    <button onclick="modQty(${item.id}, 1)" style="background:none; border:1px solid #444; color:#fff; width:24px; cursor:pointer;">+</button>
                </div>
            `;
            list.appendChild(row);
        });
    }
    
    calcMath();
}

function calcMath() {
    const sub = cart.reduce((acc, c) => acc + (c.price * c.qty), 0);
    const tax = Math.floor(sub * 0.05);
    const ship = sub > 0 ? 150 : 0;
    const total = sub + tax + ship;

    // Animate Numbers
    if(document.getElementById('valSub')) document.getElementById('valSub').innerText = sub.toLocaleString();
    if(document.getElementById('valTax')) document.getElementById('valTax').innerText = tax.toLocaleString();
    if(document.getElementById('valShip')) document.getElementById('valShip').innerText = ship;
    if(document.getElementById('valTotal')) document.getElementById('valTotal').innerText = total.toLocaleString();
}

function checkout() {
    if(cart.length === 0) {
        alert("ERROR: MANIFEST EMPTY. PLEASE SELECT ASSETS.");
    } else {
        alert("TRANSACTION APPROVED. DISPATCHING DRONES...");
        cart = []; 
        updateCart();
        if(window.innerWidth <= 1024) togglePanel('right');
    }
}

// --- 6. MOBILE PANEL LOGIC ---
function togglePanel(panel) {
    const left = document.getElementById('leftPanel');
    const right = document.getElementById('rightPanel');
    
    if(panel === 'left') {
        left.classList.toggle('active');
        if(right) right.classList.remove('active');
    } else {
        right.classList.toggle('active');
        if(left) left.classList.remove('active');
    }
}

function setupMobileHooks() {
    const center = document.querySelector('.center-panel');
    if(center) {
        center.addEventListener('click', () => {
            const left = document.getElementById('leftPanel');
            const right = document.getElementById('rightPanel');
            if(left) left.classList.remove('active');
            if(right) right.classList.remove('active');
        });
    }
}

// --- 7. FILTER & SEARCH ---
function setupSearch() {
    const input = document.getElementById('searchInput');
    if(!input) return;
    
    input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = DB.filter(i => 
            i.name.toLowerCase().includes(term) || 
            i.brand.toLowerCase().includes(term)
        );
        renderGrid(filtered);
    });
}

function filterCategory(cat) {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    renderGrid(DB.filter(i => i.category === cat));
    if(window.innerWidth <= 1024) togglePanel('left');
}

function filterRarity(r) {
    renderGrid(DB.filter(i => i.rarity === r));
    if(window.innerWidth <= 1024) togglePanel('left');
}

function resetFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(b => b.classList.remove('active'));
    if(btns[0]) btns[0].classList.add('active');
    
    renderGrid(DB);
    if(window.innerWidth <= 1024) togglePanel('left');
}

function setupSlider() {
    const slider = document.getElementById('priceRange');
    const display = document.getElementById('priceDisplay');
    
    if(!slider) return;

    slider.addEventListener('input', (e) => {
        const val = e.target.value;
        display.innerHTML = (val/1000).toFixed(1) + "k <small>CR</small>";
        renderGrid(DB.filter(i => i.price <= val));
    });
}

// --- 8. MODAL SYSTEM ---
function openModal(id) {
    const item = DB.find(p => p.id === id);
    if(!item) return;

    // Inject Content
    const imgEl = document.getElementById('m-img');
    if(imgEl) {
        imgEl.src = item.img;
        imgEl.onerror = function() {
            this.onerror = null;
            this.parentElement.innerHTML = '<div class="img-fallback"><i class="fa-solid fa-triangle-exclamation"></i><span>IMG_ERR</span></div>';
        };
    }
    
    if(document.getElementById('m-brand')) document.getElementById('m-brand').innerText = item.brand;
    if(document.getElementById('m-title')) document.getElementById('m-title').innerText = item.name;
    if(document.getElementById('m-price')) document.getElementById('m-price').innerText = item.price.toLocaleString() + " CR";
    if(document.getElementById('m-def')) document.getElementById('m-def').innerText = item.stats.def;
    if(document.getElementById('m-wgt')) document.getElementById('m-wgt').innerText = item.stats.wgt;
    
    // Dynamic Rarity Glow
    const colors = { 
        legendary: 'rgba(255, 170, 0, 0.4)', 
        epic: 'rgba(179, 0, 255, 0.4)', 
        rare: 'rgba(0, 136, 255, 0.4)', 
        common: 'rgba(136, 136, 136, 0.4)' 
    };
    if(document.getElementById('m-glow')) {
        document.getElementById('m-glow').style.background = `radial-gradient(circle, ${colors[item.rarity]}, transparent 70%)`;
    }

    // Hook up "Add" button inside modal
    const btn = document.getElementById('m-add-btn');
    if(btn) {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        newBtn.onclick = () => { 
            addToCart(id); 
            closeModal(); 
        };
    }

    // Show Modal
    const modal = document.getElementById('prodModal');
    if(modal) {
        modal.style.display = 'flex'; // Use flex to center
        setTimeout(() => modal.classList.add('active'), 10); // Fade in
    }
}

function closeModal() {
    const modal = document.getElementById('prodModal');
    if(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300); // Wait for transition
    }
}

// --- 9. UTILS ---
function showToast(msg) {
    console.log("TOAST:", msg);
}

// --- 10. CSS INJECTION FOR ANIMATIONS ---
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
`;
document.head.appendChild(styleSheet);
