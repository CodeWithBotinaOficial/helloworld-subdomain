'use strict';

const App = {
    config: {
        corsHeaders: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        apiTimeout: 5000
    },

    init() {
        this.setupEventListeners();
        this.logEnvironment();
    },

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.handlePageLoad();
        });

        window.addEventListener('load', () => {
            this.optimizePerformance();
        });
    },

    handlePageLoad() {
        console.log('Hello World - CodeWithBotina');
        this.addAccessibilityFeatures();
    },

    addAccessibilityFeatures() {
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.setAttribute('tabindex', '0');
            logo.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.location.href = 'https://codewithbotina.com';
                }
            });
        }
    },

    optimizePerformance() {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.preloadResources();
            });
        } else {
            setTimeout(() => {
                this.preloadResources();
            }, 1000);
        }
    },

    preloadResources() {
        const logo = document.querySelector('.logo');
        if (logo && !logo.complete) {
            logo.decode().catch(err => {
                console.warn('Image decode failed:', err);
            });
        }
    },

    async fetchWithCORS(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: this.config.corsHeaders,
            mode: 'cors',
            credentials: 'omit'
        };

        const mergedOptions = { ...defaultOptions, ...options };

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.apiTimeout);

            const response = await fetch(url, {
                ...mergedOptions,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error('Request timeout');
            } else {
                console.error('Fetch error:', error);
            }
            throw error;
        }
    },

    logEnvironment() {
        const isDevelopment = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1';
        
        if (isDevelopment) {
            console.log('Environment: Development');
            console.log('CORS configured for cross-origin requests');
        }
    }
};

App.init();
