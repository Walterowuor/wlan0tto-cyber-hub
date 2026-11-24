// Profile & Settings Manager
export class ProfileManager {
    constructor() {
        this.drawer = document.getElementById('profile-drawer');
        this.overlay = document.getElementById('profile-overlay');
        this.openBtn = document.getElementById('user-menu-toggle');
        this.closeBtn = document.getElementById('close-profile');
        this.tabs = document.querySelectorAll('.profile-tab');
        this.tabContents = document.querySelectorAll('.profile-tab-content');

        this.PROFILE_KEY = 'wlan0tto_profile';
    }

    init() {
        this.loadProfile();
        this.setupListeners();
        this.updateThemeState();
    }

    setupListeners() {
        if (this.openBtn) this.openBtn.addEventListener('click', () => this.toggleProfile());
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.toggleProfile());
        if (this.overlay) this.overlay.addEventListener('click', () => this.closeProfile());

        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => this.activateTab(tab.getAttribute('data-ptab')));
        });

        const saveBtn = document.getElementById('save-profile');
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveProfile());

        const lookupBtn = document.getElementById('lookup-orders');
        if (lookupBtn) lookupBtn.addEventListener('click', () => this.lookupOrders());

        const ordersPhone = document.getElementById('orders-phone');
        if (ordersPhone) {
            ordersPhone.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') this.lookupOrders();
            });
        }

        const themeBtn = document.getElementById('settings-theme');
        if (themeBtn) themeBtn.addEventListener('click', () => this.toggleTheme());

        const clearCartBtn = document.getElementById('settings-clear-cart');
        if (clearCartBtn) clearCartBtn.addEventListener('click', () => this.clearCart());

        const clearDataBtn = document.getElementById('settings-clear-data');
        if (clearDataBtn) clearDataBtn.addEventListener('click', () => this.clearLocalData());
    }

    // --- Drawer open/close (same pattern as cart) ---
    isOpen() {
        return this.drawer && !this.drawer.classList.contains('translate-x-full');
    }

    toggleProfile() {
        if (this.isOpen()) {
            this.closeProfile();
        } else {
            this.openProfile();
        }
    }

    openProfile() {
        // Close the cart if it's open so the two panels don't overlap
        const cartDrawer = document.getElementById('cart-drawer');
        if (cartDrawer && !cartDrawer.classList.contains('translate-x-full')) {
            document.getElementById('cart-toggle')?.click();
        }

        this.drawer.classList.remove('translate-x-full');
        this.overlay.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
        this.overlay.classList.add('opacity-100', 'pointer-events-auto');
    }

    closeProfile() {
        this.drawer.classList.add('translate-x-full');
        this.overlay.classList.add('opacity-0', 'pointer-events-none');
        this.overlay.classList.remove('opacity-100', 'pointer-events-auto');
        setTimeout(() => {
            if (!this.isOpen()) this.overlay.classList.add('hidden');
        }, 300);
    }

    // --- Tabs ---
    activateTab(tabId) {
        this.tabs.forEach(t => {
            const active = t.getAttribute('data-ptab') === tabId;
            t.classList.toggle('text-accent-primary', active);
            t.classList.toggle('border-accent-primary', active);
            t.classList.toggle('text-gray-400', !active);
            t.classList.toggle('border-transparent', !active);
        });
        this.tabContents.forEach(c => c.classList.toggle('hidden', c.id !== `ptab-${tabId}`));
        if (tabId === 'orders') this.prefillOrdersPhone();
    }

    // --- Profile ---
    loadProfile() {
        try {
            const p = JSON.parse(localStorage.getItem(this.PROFILE_KEY) || '{}');
            const nameEl = document.getElementById('profile-name');
            const phoneEl = document.getElementById('profile-phone');
            if (nameEl && p.name) nameEl.value = p.name;
            if (phoneEl && p.phone) phoneEl.value = p.phone;
        } catch (e) { /* ignore corrupt data */ }
    }

    saveProfile() {
        const name = document.getElementById('profile-name')?.value.trim() || '';
        const phone = document.getElementById('profile-phone')?.value.trim() || '';
        localStorage.setItem(this.PROFILE_KEY, JSON.stringify({ name, phone }));

        // Also fill the cart checkout fields for convenience
        const cartName = document.getElementById('customer-name');
        const cartPhone = document.getElementById('customer-phone');
        if (cartName && !cartName.value) cartName.value = name;
        if (cartPhone && !cartPhone.value) cartPhone.value = phone;

        const msg = document.getElementById('profile-saved-msg');
        if (msg) {
            msg.classList.remove('hidden');
            setTimeout(() => msg.classList.add('hidden'), 2500);
        }
    }

    // --- Orders ---
    prefillOrdersPhone() {
        const ordersPhone = document.getElementById('orders-phone');
        const profile = JSON.parse(localStorage.getItem(this.PROFILE_KEY) || '{}');
        if (ordersPhone && !ordersPhone.value && profile.phone) {
            ordersPhone.value = profile.phone;
        }
    }

    async lookupOrders() {
        const input = document.getElementById('orders-phone');
        const list = document.getElementById('orders-list');
        const phone = input ? input.value.trim() : '';
        if (!list) return;

        if (phone.replace(/\D/g, '').length < 9) {
            list.innerHTML = '<p class="text-sm text-red-400">Enter a valid phone number.</p>';
            return;
        }

        list.innerHTML = '<p class="text-sm text-gray-500">Searching…</p>';
        try {
            const res = await fetch(`/api/orders/lookup/?phone=${encodeURIComponent(phone)}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Lookup failed');
            this.renderOrders(data.orders || []);
        } catch (err) {
            list.innerHTML = `<p class="text-sm text-red-400">${err.message}</p>`;
        }
    }

    renderOrders(orders) {
        const list = document.getElementById('orders-list');
        if (!orders.length) {
            list.innerHTML = '<p class="text-sm text-gray-500">No orders found for this number.</p>';
            return;
        }
        list.innerHTML = orders.map(o => `
            <div class="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <div class="flex justify-between items-center mb-1">
                    <span class="text-xs text-gray-400">#${o.id} · ${o.date}</span>
                    <span class="text-xs font-bold ${o.status === 'completed' ? 'text-green-400' : o.status === 'cancelled' ? 'text-red-400' : 'text-yellow-400'}">${o.status_label}</span>
                </div>
                <div class="text-sm text-white font-semibold mb-1">KSh ${o.total.toFixed(2)}</div>
                <ul class="text-xs text-gray-400 space-y-0.5">
                    ${o.items.map(i => `<li>· ${i.name} × ${i.quantity}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    // --- Settings ---
    updateThemeState() {
        const el = document.getElementById('settings-theme-state');
        if (el) el.textContent = document.body.classList.contains('light-theme') ? 'Light' : 'Dark';
    }

    toggleTheme() {
        document.getElementById('theme-toggle')?.click();
        // Update label after the toggle's own handler runs
        setTimeout(() => this.updateThemeState(), 50);
    }

    clearCart() {
        localStorage.removeItem('wlan0tto_cart');
        const event = new CustomEvent('cartCleared');
        document.dispatchEvent(event);
        location.reload();
    }

    clearLocalData() {
        ['wlan0tto_cart', this.PROFILE_KEY, 'wlan0tto_analytics', 'theme', 'visit_logged'].forEach(k => {
            try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch (e) {}
        });
        location.reload();
    }
}
