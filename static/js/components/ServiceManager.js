// Service Manager Component
export class ServiceManager {
    constructor() {
        this.services = [];
        this.cart = [];
        this.serviceGrid = document.getElementById('service-grid');
        this.searchInput = document.getElementById('global-search');
        this.categoryButtons = document.querySelectorAll('.category-btn');
        this.sortFilter = document.getElementById('sort-filter');
        
        // Cart UI
        this.cartDrawer = document.getElementById('cart-drawer');
        this.cartOverlay = document.getElementById('cart-overlay');
        this.cartItemsContainer = document.getElementById('cart-items');
        this.cartSubtotal = document.getElementById('cart-subtotal');
        this.cartCount = document.getElementById('cart-count');
        this.emptyCartMsg = document.getElementById('empty-cart-msg');
        this.checkoutBtn = document.getElementById('checkout-btn');
        
        this.cartToggleBtn = document.getElementById('cart-toggle');
        this.closeCartBtn = document.getElementById('close-cart');
        this.continueShoppingBtn = document.getElementById('continue-shopping');
        this.toggleCustomerBtn = document.getElementById('toggle-customer-fields');
        this.customerFields = document.getElementById('customer-fields');

        this.CART_KEY = 'wlan0tto_cart';
        this.MAX_QTY = 99;
        this.checkoutInFlight = false;
    }

    async init() {
        await this.loadServices();
        this.restoreCart();
        this.setupSearchAndFilters();
        this.setupCartListeners();
    }

    saveCart() {
        try {
            localStorage.setItem(this.CART_KEY, JSON.stringify(this.cart));
        } catch (e) {
            console.warn('Could not save cart:', e);
        }
    }

    restoreCart() {
        try {
            const stored = JSON.parse(localStorage.getItem(this.CART_KEY) || '[]');
            if (!Array.isArray(stored)) return;
            this.cart = stored
                .map(item => {
                    const service = this.services.find(s => String(s.id) === String(item.id));
                    if (!service) return null;
                    const qty = parseInt(item.quantity, 10);
                    if (!qty || qty < 1) return null;
                    // Re-price from the live catalog, not the stale snapshot
                    return { ...service, quantity: Math.min(qty, this.MAX_QTY) };
                })
                .filter(Boolean);
            this.updateCartUI();
        } catch (e) {
            console.warn('Could not restore cart:', e);
            this.cart = [];
        }
    }

    async loadServices() {
        try {
            console.log('Loading services...');
            const response = await fetch('/api/services/');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            this.services = data.services;

            // Ensure price is a number
            this.services = this.services.map(s => ({
                ...s,
                price: parseFloat(s.price) || 0
            }));

            this.renderServices(this.services);
            this.dispatchServicesLoaded();
        } catch (error) {
            console.error('Failed to load services:', error);
            this.services = this.getFallbackServices();
            this.renderServices(this.services);
            this.dispatchServicesLoaded();
        }
    }

    getFallbackServices() {
        return [
            { id: 0, name: "Print in B/W A4", unit: "/page", price: 10.00, category: "printing-binding", image: "" },
            { id: 1, name: "Print in Color A4", unit: "/page", price: 20.00, category: "printing-binding", image: "" },
            { id: 2, name: "Laptop/Computer Troubleshooting", unit: "", price: 500.00, category: "device", image: "" },
            { id: 3, name: "Burn Music/Videos to USB/Mobile", unit: "/item", price: 10.00, category: "media", image: "" },
            { id: 4, name: "Edit PDFs", unit: "", price: 200.00, category: "documents", image: "" },
            { id: 5, name: "KRA PIN Registration", unit: "", price: 200.00, category: "ecitizen", image: "" },
            { id: 6, name: "Training (In-Person)", unit: "/hour", price: 200.00, category: "training", image: "" }
        ];
    }

    displayName(service) {
        return service.name + (service.unit ? ' ' + service.unit : '');
    }

    getServiceImage(category) {
        // Fallback placeholder images based on category
        const images = {
            'printing-binding': 'https://placehold.co/400x300/2C3947/E8EDF2?text=Printing',
            'device': 'https://placehold.co/400x300/2C3947/E8EDF2?text=Device+Setup',
            'media': 'https://placehold.co/400x300/2C3947/E8EDF2?text=Media',
            'documents': 'https://placehold.co/400x300/2C3947/E8EDF2?text=Documents',
            'ecitizen': 'https://placehold.co/400x300/2C3947/E8EDF2?text=E-Citizen',
            'training': 'https://placehold.co/400x300/2C3947/E8EDF2?text=Training',
            'branding': 'https://placehold.co/400x300/2C3947/E8EDF2?text=Branding',
            'packaging': 'https://placehold.co/400x300/2C3947/E8EDF2?text=Packaging'
        };
        return images[category] || 'https://placehold.co/400x300/2C3947/E8EDF2?text=Service';
    }

    renderServices(servicesToRender) {
        if (!this.serviceGrid) return;

        this.serviceGrid.innerHTML = '';
        
        if (servicesToRender.length === 0) {
            this.serviceGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-400 text-lg">No services found matching your criteria.</p>
                </div>
            `;
            return;
        }

        servicesToRender.forEach(service => {
            const serviceName = this.displayName(service);
            const card = document.createElement('div');
            card.className = 'bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-transform duration-300 hover:-translate-y-2 hover:shadow-accent-primary flex flex-col h-full';
            card.innerHTML = `
                <div class="h-24 min-[380px]:h-28 sm:h-36 lg:h-44 xl:h-48 overflow-hidden bg-gray-900 relative">
                    <img src="${service.image || this.getServiceImage(service.category)}" alt="${serviceName}" class="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity">
                    <div class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3 bg-gray-900 bg-opacity-80 backdrop-blur px-1.5 py-0.5 sm:px-2 md:py-1 rounded text-[8px] min-[380px]:text-[10px] md:text-xs text-accent-primary font-bold">
                        ${service.category.replace('-', ' ').toUpperCase()}
                    </div>
                </div>
                <div class="p-2.5 min-[380px]:p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
                    <h3 class="text-[11px] min-[380px]:text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white mb-0.5 sm:mb-1 md:mb-2 line-clamp-2">${serviceName}</h3>
                    <div class="flex items-center text-yellow-400 text-[9px] min-[380px]:text-[10px] sm:text-xs md:text-sm mb-1 sm:mb-2 md:mb-4">
                        <svg class="w-2.5 h-2.5 min-[380px]:w-3 min-[380px]:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                        <span class="ml-0.5 sm:ml-1 text-gray-400">5.0</span>
                    </div>
                    <div class="mt-auto">
                        <div class="text-xs min-[380px]:text-sm sm:text-base md:text-lg lg:text-xl font-bold text-accent-primary mb-1.5 sm:mb-2 md:mb-4">KSh ${service.price.toFixed(2)}</div>
                        <button class="add-to-cart-btn w-full bg-gray-700 hover:bg-accent-primary text-white hover:text-gray-900 font-bold py-1 sm:py-1.5 md:py-2 px-1.5 sm:px-3 md:px-4 rounded-lg transition text-[10px] min-[380px]:text-[11px] sm:text-xs md:text-sm md:text-base" data-id="${service.id}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
            this.serviceGrid.appendChild(card);
        });

        // Attach event listeners to Add to Cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const serviceId = e.currentTarget.getAttribute('data-id');
                const service = this.services.find(s => String(s.id) === serviceId);
                if (service) {
                    const btn = e.currentTarget;
                    this.addToCart(service);

                    // Button animation
                    const originalText = btn.innerText;
                    btn.innerText = 'Added!';
                    btn.classList.add('bg-accent-primary', 'text-gray-900');
                    btn.classList.remove('bg-gray-700', 'text-white');

                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.classList.remove('bg-accent-primary', 'text-gray-900');
                        btn.classList.add('bg-gray-700', 'text-white');
                    }, 1000);
                }
            });
        });
    }

    setupSearchAndFilters() {
        let currentFilter = 'all';
        let currentSort = 'featured';
        let currentSearch = '';

        const applyFilters = () => {
            let filtered = this.services;

            // Apply category
            if (currentFilter !== 'all') {
                filtered = filtered.filter(s => s.category === currentFilter);
            }

            // Apply search (name, unit suffix, and category label)
            if (currentSearch) {
                const term = currentSearch.toLowerCase();
                filtered = filtered.filter(s =>
                    s.name.toLowerCase().includes(term) ||
                    (s.unit || '').toLowerCase().includes(term) ||
                    (s.category || '').replace('-', ' ').toLowerCase().includes(term));
            }

            // Apply sort
            if (currentSort === 'price-low') {
                filtered.sort((a, b) => a.price - b.price);
            } else if (currentSort === 'price-high') {
                filtered.sort((a, b) => b.price - a.price);
            } else {
                // 'featured' - just use original order
            }

            this.renderServices(filtered);
        };

        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                currentSearch = e.target.value;
                applyFilters();
            });
        }

        if (this.categoryButtons) {
            this.categoryButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    // Update active state
                    this.categoryButtons.forEach(b => {
                        b.classList.remove('bg-gray-800', 'text-accent-primary');
                        b.classList.add('text-gray-300');
                    });
                    e.currentTarget.classList.add('bg-gray-800', 'text-accent-primary');
                    e.currentTarget.classList.remove('text-gray-300');

                    currentFilter = e.currentTarget.getAttribute('data-filter');
                    applyFilters();
                });
            });
        }

        if (this.sortFilter) {
            this.sortFilter.addEventListener('change', (e) => {
                currentSort = e.target.value;
                applyFilters();
            });
        }
    }

    // --- Cart Functionality ---

    setupCartListeners() {
        if (this.cartToggleBtn) {
            this.cartToggleBtn.addEventListener('click', () => this.toggleCart());
        }
        if (this.closeCartBtn) {
            this.closeCartBtn.addEventListener('click', () => this.toggleCart());
        }
        if (this.cartOverlay) {
            this.cartOverlay.addEventListener('click', () => this.toggleCart());
        }
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => this.handleCheckout());
        }
        if (this.continueShoppingBtn) {
            this.continueShoppingBtn.addEventListener('click', () => this.toggleCart());
        }
        if (this.toggleCustomerBtn && this.customerFields) {
            this.toggleCustomerBtn.addEventListener('click', () => {
                const isHidden = this.customerFields.classList.contains('hidden');
                this.customerFields.classList.toggle('hidden', !isHidden);
                this.customerFields.classList.toggle('flex', isHidden);
                this.toggleCustomerBtn.textContent = isHidden
                    ? '− Hide details'
                    : '+ Add name / phone (optional)';
            });
        }
    }

    toggleCart() {
        if (!this.cartDrawer || !this.cartOverlay) return;

        const willOpen = this.cartDrawer.classList.contains('translate-x-full');

        if (willOpen) {
            this.cartDrawer.classList.remove('translate-x-full');
            this.cartOverlay.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
            this.cartOverlay.classList.add('opacity-100', 'pointer-events-auto');
        } else {
            this.cartDrawer.classList.add('translate-x-full');
            this.cartOverlay.classList.add('opacity-0', 'pointer-events-none');
            this.cartOverlay.classList.remove('opacity-100', 'pointer-events-auto');
            setTimeout(() => {
                if (this.cartDrawer.classList.contains('translate-x-full')) {
                    this.cartOverlay.classList.add('hidden');
                }
            }, 300); // Wait for transition
        }

        // Split-view mode on desktop: shrink main content while cart is open
        document.body.classList.toggle('cart-open', willOpen);
    }

    addToCart(service) {
        const existingItem = this.cart.find(item => String(item.id) === String(service.id));
        if (existingItem) {
            existingItem.quantity = Math.min(existingItem.quantity + 1, this.MAX_QTY);
        } else {
            this.cart.push({ ...service, quantity: 1 });
        }
        this.updateCartUI();
        
        // Open cart drawer temporarily as feedback
        if (this.cartDrawer.classList.contains('translate-x-full')) {
            this.toggleCart();
        }
    }

    removeFromCart(serviceId) {
        this.cart = this.cart.filter(item => String(item.id) !== String(serviceId));
        this.updateCartUI();
    }

    updateQuantity(serviceId, change) {
        const item = this.cart.find(item => String(item.id) === String(serviceId));
        if (item) {
            item.quantity = Math.min(item.quantity + change, this.MAX_QTY);
            if (item.quantity <= 0) {
                this.removeFromCart(serviceId);
            } else {
                this.updateCartUI();
            }
        }
    }

    updateCartUI() {
        // Update Count
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (this.cartCount) {
            this.cartCount.innerText = totalItems;
        }

        // Render Items
        if (this.cartItemsContainer) {
            this.cartItemsContainer.innerHTML = '';
            
            if (this.cart.length === 0) {
                if (this.emptyCartMsg) this.emptyCartMsg.classList.remove('hidden');
                if (this.checkoutBtn) this.checkoutBtn.disabled = true;
                this.checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                if (this.emptyCartMsg) this.emptyCartMsg.classList.add('hidden');
                if (this.checkoutBtn) this.checkoutBtn.disabled = false;
                this.checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');

                this.cart.forEach(item => {
                    const serviceName = this.displayName(item);
                    const itemTotal = item.price * item.quantity;
                    
                    const div = document.createElement('div');
                    div.className = 'flex justify-between items-center bg-gray-800 p-4 rounded-xl border border-gray-700';
                    div.innerHTML = `
                        <div class="flex-1">
                            <h4 class="text-white font-bold text-sm mb-1">${serviceName}</h4>
                            <div class="text-accent-primary text-sm font-bold">KSh ${itemTotal.toFixed(2)}</div>
                        </div>
                        <div class="flex items-center space-x-3 bg-gray-900 rounded-lg p-1">
                            <button class="cart-dec-btn text-gray-400 hover:text-white px-2 py-1" data-id="${item.id}">-</button>
                            <span class="text-white text-sm font-bold w-4 text-center">${item.quantity}</span>
                            <button class="cart-inc-btn text-gray-400 hover:text-white px-2 py-1" data-id="${item.id}">+</button>
                            <button class="cart-remove-btn text-red-400 hover:text-red-300 px-2 py-1" data-id="${item.id}" title="Remove">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </div>
                    `;
                    this.cartItemsContainer.appendChild(div);
                });

                // Attach events
                this.cartItemsContainer.querySelectorAll('.cart-dec-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => this.updateQuantity(e.currentTarget.getAttribute('data-id'), -1));
                });
                this.cartItemsContainer.querySelectorAll('.cart-inc-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => this.updateQuantity(e.currentTarget.getAttribute('data-id'), 1));
                });
                this.cartItemsContainer.querySelectorAll('.cart-remove-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => this.removeFromCart(e.currentTarget.getAttribute('data-id')));
                });
            }
        }

        // Update Subtotal
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (this.cartSubtotal) {
            this.cartSubtotal.innerText = `KSh ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        }

        this.saveCart();
    }

    getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : '';
    }

    async submitOrder() {
        const nameInput = document.getElementById('customer-name');
        const phoneInput = document.getElementById('customer-phone');
        const payload = {
            customer_name: nameInput ? nameInput.value.trim() : '',
            phone: phoneInput ? phoneInput.value.trim() : '',
            items: this.cart.map(i => ({ id: i.id, quantity: i.quantity }))
        };
        const response = await fetch('/api/orders/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCookie('csrftoken')
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || `Order failed (${response.status})`);
        }
        return response.json();
    }

    async handleCheckout() {
        if (this.cart.length === 0 || this.checkoutInFlight) return;
        this.checkoutInFlight = true;
        this.checkoutBtn.disabled = true;
        this.checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');

        let message = "Hello Wlan0tto, I would like to place an order for the following premium services:\n\n";

        let total = 0;
        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            message += `* ${this.displayName(item)} x${item.quantity} (KSh ${itemTotal.toLocaleString()})\n`;
        });

        message += `\n*Total: KSh ${total.toLocaleString()}*`;

        const nameInput = document.getElementById('customer-name');
        const phoneInput = document.getElementById('customer-phone');
        if (nameInput && nameInput.value.trim()) {
            message = `*Name:* ${nameInput.value.trim()}\n` + message;
        }
        if (phoneInput && phoneInput.value.trim()) {
            message += `\n*Contact:* ${phoneInput.value.trim()}`;
        }

        const phoneNumber = "254743149316";
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        // Log the checkout locally
        import('../utils/AnalyticsManager.js').then(({ analytics }) => {
            analytics.logCheckout({
                total: total,
                services: this.cart.map(i => ({ name: this.displayName(i), quantity: i.quantity, price: i.price * i.quantity }))
            });
        }).catch(err => console.error('Analytics load error:', err));

        // Record the order server-side (prices computed by the backend)
        try {
            await this.submitOrder();
        } catch (err) {
            console.error('Failed to record order:', err);
        } finally {
            this.checkoutInFlight = false;
            this.checkoutBtn.disabled = false;
            this.checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        window.open(whatsappUrl, '_blank');

        // Empty cart and close drawer
        this.cart = [];
        this.updateCartUI();
        if (nameInput) nameInput.value = '';
        if (phoneInput) phoneInput.value = '';
        this.toggleCart();

        // Give feedback
        const btnText = this.checkoutBtn.innerText;
        this.checkoutBtn.innerText = "Order Sent!";
        setTimeout(() => this.checkoutBtn.innerText = btnText, 2000);
    }

    dispatchServicesLoaded() {
        const event = new Event('servicesLoaded');
        document.dispatchEvent(event);
    }
}