// Utility functions
const utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    showError(message, element) {
        element.textContent = message;
        element.classList.remove('hidden');
        setTimeout(() => element.classList.add('hidden'), 3000);
    }
};

// Fallback services data for local development
const fallbackServices = {
    services: [
        { value: "Print in B/W A4 - KSh10.00/page", price: 10.00, category: "printing-binding" },
        { value: "Print in Color A4 - KSh20.00/page", price: 20.00, category: "printing-binding" },
        { value: "Laptop/Computer Troubleshooting - KSh500.00", price: 500.00, category: "device" },
        { value: "Burn Music/Videos to USB/Mobile - KSh10.00/item", price: 10.00, category: "media" },
        { value: "Edit PDFs - KSh200.00", price: 200.00, category: "documents" },
        { value: "KRA PIN Registration - KSh200.00", price: 200.00, category: "ecitizen" },
        { value: "Training (In-Person) - KSh200.00/hour", price: 200.00, category: "training" }
    ]
};

// Typed.js initialization
const initTyped = () => {
    try {
        console.log('Initializing Typed.js...');
        if (typeof Typed === 'undefined') {
            throw new Error('Typed.js not loaded');
        }
        new Typed('#typing-text', {
            strings: ['Security Researcher', 'Cyber guard', 'Kali Master', 'Network Ninja'],
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
        console.log('Typed.js initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Typed.js:', error);
    }
};

// Carousel functionality
const initCarousel = () => {
    try {
        console.log('Initializing carousel...');
        const carouselItems = document.getElementById('carousel-items');
        if (!carouselItems) {
            throw new Error('Carousel element not found');
        }
        const items = document.querySelectorAll('.carousel-item');
        let currentIndex = 0;

        const slideCarousel = () => {
            currentIndex = (currentIndex + 1) % items.length;
            carouselItems.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        console.log('Carousel initialized successfully');
        return setInterval(slideCarousel, 5000);
    } catch (error) {
        console.error('Failed to initialize carousel:', error);
        return null;
    }
};

// Tab management
const TabManager = {
    init(mainTabButtons, mainTabContents) {
        mainTabButtons.forEach(button => {
            button.addEventListener('click', () => this.switchTab(button, mainTabButtons, mainTabContents));
        });
    },

    switchTab(activeButton, allButtons, allContents) {
        allButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-neon-green', 'text-white');
            btn.classList.add('bg-gray-600', 'text-gray-200');
        });
        allContents.forEach(content => content.classList.add('hidden'));

        activeButton.classList.add('active', 'bg-neon-green', 'text-white');
        activeButton.classList.remove('bg-gray-600', 'text-gray-200');
        const tabId = activeButton.getAttribute('data-tab');
        document.getElementById(tabId).classList.remove('hidden');
    }
};

// Service management
const ServiceManager = {
    init(serviceTabButtons, serviceTabContents, serviceList) {
        serviceTabButtons.forEach(button => {
            button.addEventListener('click', () => this.handleServiceTab(button, serviceTabButtons, serviceTabContents, serviceList));
        });
    },

    sortServices(category, serviceList) {
        const services = Array.from(serviceList.children);
        const sortedServices = services.sort((a, b) => {
            const aCategory = a.querySelector('input').getAttribute('data-category');
            const bCategory = b.querySelector('input').getAttribute('data-category');
            if (aCategory === category && bCategory !== category) return -1;
            if (aCategory !== category && bCategory === category) return 1;
            return aCategory.localeCompare(bCategory);
        });
        serviceList.innerHTML = '';
        sortedServices.forEach(service => serviceList.appendChild(service));
    },

    handleServiceTab(button, allButtons, allContents, serviceList) {
        allButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-neon-green', 'text-white');
            btn.classList.add('bg-gray-600', 'text-gray-200');
        });
        allContents.forEach(content => content.classList.add('hidden'));

        button.classList.add('active', 'bg-neon-green', 'text-white');
        button.classList.remove('bg-gray-600', 'text-gray-200');
        const tabId = button.getAttribute('data-tab');
        document.getElementById(tabId).classList.remove('hidden');

        const categoryMap = {
            'service-printing': 'printing-binding',
            'service-device': 'device',
            'service-media': 'media',
            'service-documents': 'documents',
            'service-ecitizen': 'ecitizen',
            'service-training': 'training'
        };
        this.sortServices(categoryMap[tabId], serviceList);
    }
};

// Form handling
const FormManager = {
    init(form, totalPriceSpan, submitButton) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'text-red-500 mt-2 text-center hidden';
        form.appendChild(errorMessage);

        const validateForm = () => {
            const checkboxes = form.querySelectorAll('input[name="service"]:checked');
            if (checkboxes.length === 0) {
                utils.showError('Please select at least one service', errorMessage);
                return false;
            }
            errorMessage.classList.add('hidden');
            return true;
        };

        form.addEventListener('change', () => {
            validateForm();
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateForm()) return;

            const originalText = submitButton.textContent;
            
            try {
                submitButton.disabled = true;
                submitButton.textContent = 'Processing...';
                
                const selectedServices = Array.from(form.querySelectorAll('input[name="service"]:checked'))
                    .map(checkbox => {
                        const quantityInput = checkbox.closest('.flex').querySelector('.quantity-input');
                        const quantity = parseInt(quantityInput.value) || 1;
                        return `${checkbox.value} (${quantity} items)`;
                    })
                    .join(', ');
                const total = totalPriceSpan.textContent;
                const message = `Selected Services: ${selectedServices}\nTotal: KSh ${total}`;
                const whatsappUrl = `https://wa.me/+254743149316?text=${encodeURIComponent(message)}`;
                
                await new Promise(resolve => setTimeout(resolve, 500));
                window.open(whatsappUrl, '_blank');
            } catch (error) {
                utils.showError('An error occurred. Please try again.', errorMessage);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }
};

// Mode management
const ModeManager = {
    init() {
        const modeToggle = document.getElementById('mode-toggle');
        const modeIcon = document.getElementById('mode-icon');
        
        // Load saved mode from localStorage
        const savedMode = localStorage.getItem('mode') || 'sudo';
        this.setMode(savedMode);
        
        modeToggle.addEventListener('click', () => {
            const currentMode = document.body.classList.contains('bish-mode') ? 'bish' : 'sudo';
            const nextMode = currentMode === 'sudo' ? 'bish' : 'sudo';
            
            this.setMode(nextMode);
            localStorage.setItem('mode', nextMode);
        });
    },

    setMode(mode) {
        document.body.classList.remove('bish-mode', 'sudo-mode');
        document.body.classList.add(`${mode}-mode`);
        this.updateModeIcon();
    },

    updateModeIcon() {
        const modeIcon = document.getElementById('mode-icon');
        const currentMode = document.body.classList.contains('bish-mode') ? 'bish' : 'sudo';
        
        // Update icon color based on mode
        modeIcon.style.color = currentMode === 'bish' ? '#b026ff' : '#39ff14';
    }
};

// Load services from JSON file
async function loadServices() {
    try {
        console.log('Attempting to load services...');
        
        // Check if we're running locally
        const isLocal = window.location.protocol === 'file:';
        
        if (isLocal) {
            console.log('Running locally, using fallback services data');
            window.services = fallbackServices.services;
            const event = new Event('servicesLoaded');
            document.dispatchEvent(event);
            return fallbackServices.services;
        }

        const response = await fetch('services.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Services loaded:', data.services.length, 'items');
        
        window.services = data.services;
        console.log('Services set to window.services');
        
        const event = new Event('servicesLoaded');
        document.dispatchEvent(event);
        console.log('servicesLoaded event dispatched');
        
        return data.services;
    } catch (error) {
        console.error('Failed to load services:', error);
        // Use fallback data if fetch fails
        console.log('Using fallback services data');
        window.services = fallbackServices.services;
        const event = new Event('servicesLoaded');
        document.dispatchEvent(event);
        return fallbackServices.services;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('DOM loaded, starting initialization...');
        
        // Load services first
        await loadServices();
        console.log('Services loaded, initializing other components...');
        
        // Initialize components
        initTyped();
        const carouselInterval = initCarousel();
        
        // Initialize tab managers
        TabManager.init(
            document.querySelectorAll('.main-tab-button'),
            document.querySelectorAll('.main-tab-content')
        );
        
        ServiceManager.init(
            document.querySelectorAll('.tab-button'),
            document.querySelectorAll('.tab-content'),
            document.getElementById('service-list')
        );
        
        // Initialize form
        FormManager.init(
            document.getElementById('service-form'),
            document.getElementById('total-price'),
            document.getElementById('submit-services')
        );
        
        // Initialize mode
        ModeManager.init();
        
        // Cleanup on page unload
        window.addEventListener('unload', () => {
            if (carouselInterval) {
                clearInterval(carouselInterval);
            }
        });
        
        console.log('Initialization complete');
    } catch (error) {
        console.error('Initialization error:', error);
    }
});
