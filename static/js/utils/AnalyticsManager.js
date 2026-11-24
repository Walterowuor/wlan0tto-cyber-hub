/**
 * AnalyticsManager
 * Handles tracking of site statistics using LocalStorage.
 * Design ensures flexibility by decoupling storage logic from tracking logic.
 */
export class AnalyticsManager {
    constructor(storageKey = 'wlan0tto_analytics') {
        this.storageKey = storageKey;
        this.data = this.loadData();
    }

    /**
     * Loads data from storage or initializes default structure.
     */
    loadData() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : {
            visits: 0,
            orders: [],
            lastVisit: null
        };
    }

    /**
     * Saves current state to storage.
     */
    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    /**
     * Logs a new page visit.
     * Prevents duplicate logging on refresh by checking session storage or simple time threshold?
     * For now, we'll keep it simple: log every load, or we could use sessionStorage to track "active session".
     */
    logVisit() {
        // Simple session check to avoid inflating numbers on reload
        if (!sessionStorage.getItem('visit_logged')) {
            this.data.visits += 1;
            this.data.lastVisit = new Date().toISOString();
            this.saveData();
            sessionStorage.setItem('visit_logged', 'true');
            console.log('Analytics: Visit logged.');
        }
    }

    /**
     * Logs a completed order/checkout.
     * @param {Object} orderDetails - The details of the order.
     */
    logCheckout(orderDetails) {
        const order = {
            id: Date.now().toString(36), // Simple unique ID
            timestamp: new Date().toISOString(),
            ...orderDetails
        };
        this.data.orders.unshift(order); // Add to beginning
        this.saveData();
        console.log('Analytics: Order logged.', order);
        return order;
    }

    /**
     * Retrieves current statistics.
     */
    getStats() {
        return {
            totalVisits: this.data.visits,
            totalOrders: this.data.orders.length,
            recentOrders: this.data.orders.slice(0, 10) // Return last 10 orders
        };
    }

    /**
     * Clears all analytics data (for admin use).
     */
    clearData() {
        localStorage.removeItem(this.storageKey);
        this.data = this.loadData();
    }
}

// Export a singleton instance for shared use across the app
export const analytics = new AnalyticsManager();
