import { ServiceManager } from './components/ServiceManager.js';
import { UIManager } from './components/UIManager.js';
import { analytics } from './utils/AnalyticsManager.js';

class App {
    constructor() {
        this.serviceManager = new ServiceManager();
        this.uiManager = new UIManager();
        analytics.logVisit();
    }

    async init() {
        try {
            console.log('Initializing application...');

            // Initialize UI components
            try {
                this.uiManager.init();
            } catch (uiError) {
                console.error('UI Manager initialization failed:', uiError);
            }

            // Initialize service management
            try {
                await this.serviceManager.init();
            } catch (serviceError) {
                console.error('Service Manager initialization failed:', serviceError);
            }

            // Register service worker
            this.registerServiceWorker();

            console.log('Application initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError(`Failed to initialize application: ${error.message || error}. Please refresh the page.`);
        }
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful');
                })
                .catch(error => {
                    console.error('ServiceWorker registration failed:', error);
                });
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 5000);
    }

    cleanup() {
        this.uiManager.cleanup();
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();

    // Dynamic Copyright Year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    } else {
        // Fallback if span doesn't exist, try to find a copyright element
        const footerText = document.querySelector('footer p');
        if (footerText && footerText.textContent.includes('©')) {
            footerText.innerHTML = footerText.innerHTML.replace(/© \d{4}/, `© ${new Date().getFullYear()}`);
        }
    }

    // Cleanup when the page is unloaded
    window.addEventListener('unload', () => {
        app.cleanup();
    });
}); 