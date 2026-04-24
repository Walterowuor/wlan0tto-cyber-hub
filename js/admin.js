import { analytics } from './utils/AnalyticsManager.js';

const ADMIN_CONFIG = {
    // SHA-256 hash of 'admin123'
    PASSWORD_HASH: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
    STORAGE_KEY_SERVICES: 'custom_services',
    SESSION_KEY: 'admin_session_valid'
};

document.addEventListener('DOMContentLoaded', () => {
    checkSession();

    // Login Form Handler
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('admin-key').value;

            if (await verifyPassword(password)) {
                sessionStorage.setItem(ADMIN_CONFIG.SESSION_KEY, 'true');
                showDashboard();
            } else {
                alert('Access Denied: Invalid security token.');
            }
        });
    }

    // Logout Handler
    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.removeItem(ADMIN_CONFIG.SESSION_KEY);
        location.reload();
    });

    // Add Service Handler
    document.getElementById('add-service-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('service-id').value;
        const price = document.getElementById('service-price').value;
        const title = document.getElementById('service-title').value;
        const category = document.getElementById('service-category').value;
        const description = document.getElementById('service-desc').value;
        const imageFile = document.getElementById('service-img').files[0];

        let imageData = null;
        if (imageFile) {
            try {
                imageData = await readFileAsDataURL(imageFile);
            } catch (err) {
                console.error('Image processing failed:', err);
            }
        }

        // Format value to match main site expectations: "Title - KShPrice"
        const formattedValue = `${title} - KSh${price}`;

        addService({ 
            id, 
            value: formattedValue, 
            price, 
            category, 
            description, 
            image: imageData,
            title // Still keep title for admin display
        });
        
        e.target.reset();
        refreshServiceList();
    });
});

async function verifyPassword(password) {
    // Fallback for non-secure contexts (local file testing)
    if (!window.crypto || !window.crypto.subtle) {
        console.warn('Crypto API not available. Falling back to plain text comparison for local testing.');
        return password === 'admin123';
    }

    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex === ADMIN_CONFIG.PASSWORD_HASH;
}

function checkSession() {
    if (sessionStorage.getItem(ADMIN_CONFIG.SESSION_KEY) === 'true') {
        showDashboard();
    }
}

function showDashboard() {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('dashboard-container').classList.remove('hidden');
    refreshServiceList();
    updateStats();
}

function updateStats() {
    const stats = analytics.getStats();
    document.getElementById('stat-visits').textContent = stats.totalVisits.toLocaleString();
    document.getElementById('stat-orders').textContent = stats.totalOrders.toLocaleString();
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Data Management
function getServices() {
    return JSON.parse(localStorage.getItem(ADMIN_CONFIG.STORAGE_KEY_SERVICES) || '[]');
}

function addService(service) {
    const services = getServices();
    services.push(service);
    localStorage.setItem(ADMIN_CONFIG.STORAGE_KEY_SERVICES, JSON.stringify(services));
    alert('Service added successfully! It will now appear on the main page.');
}

function deleteService(index) {
    const services = getServices();
    services.splice(index, 1);
    localStorage.setItem(ADMIN_CONFIG.STORAGE_KEY_SERVICES, JSON.stringify(services));
    refreshServiceList();
}

function refreshServiceList() {
    const container = document.getElementById('custom-services-list');
    const services = getServices();

    container.innerHTML = '';

    if (services.length === 0) {
        container.innerHTML = '<p class="text-gray-400">No custom services added yet.</p>';
        return;
    }

    services.forEach((service, index) => {
        const div = document.createElement('div');
        div.className = 'bg-gray-900 p-4 rounded flex justify-between items-center gap-4';
        div.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded bg-gray-800 overflow-hidden flex-shrink-0">
                    ${service.image ? `<img src="${service.image}" class="w-full h-full object-cover">` : `<div class="w-full h-full flex items-center justify-center text-[10px] text-gray-600">No Img</div>`}
                </div>
                <div>
                    <h4 class="font-bold text-accent-primary">${service.title || service.value.split(' - ')[0]}</h4>
                    <p class="text-sm text-gray-400">${service.category} | KSh ${service.price}</p>
                </div>
            </div>
            <button onclick="window.deleteServiceWrapper(${index})" class="text-red-500 hover:text-red-400 font-medium">Delete</button>
        `;
        container.appendChild(div);
    });
}

// Expose delete for onclick
window.deleteServiceWrapper = deleteService;
