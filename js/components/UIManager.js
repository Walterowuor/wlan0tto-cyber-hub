// UI Manager Component
export class UIManager {
    constructor() {
        this.carouselInterval = null;
    }

    init() {
        this.initCarousel();
        this.initTabs();
        this.initInfoCards();
        this.initThemeToggle();
    }

    initCarousel() {
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

            this.carouselInterval = setInterval(slideCarousel, 5000);
            console.log('Carousel initialized successfully');
        } catch (error) {
            console.error('Failed to initialize carousel:', error);
        }
    }

    initTabs() {
        // Main tabs
        const mainTabButtons = document.querySelectorAll('.main-tab-button');
        const mainTabContents = document.querySelectorAll('.main-tab-content');
        this.initTabSystem(mainTabButtons, mainTabContents);

        // Service tabs
        const serviceTabButtons = document.querySelectorAll('.tab-button');
        const serviceTabContents = document.querySelectorAll('.tab-content');
        this.initTabSystem(serviceTabButtons, serviceTabContents);
    }

    initTabSystem(buttons, contents) {
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active state from all buttons
                buttons.forEach(btn => {
                    btn.classList.remove('active', 'bg-accent-primary', 'text-white');
                    btn.classList.add('bg-gray-600', 'text-gray-200');
                });

                // Hide all contents
                contents.forEach(content => content.classList.add('hidden'));

                // Activate clicked button
                button.classList.add('active', 'bg-accent-primary', 'text-white');
                button.classList.remove('bg-gray-600', 'text-gray-200');

                // Show corresponding content
                const tabId = button.getAttribute('data-tab');
                const content = document.getElementById(tabId);
                if (content) {
                    content.classList.remove('hidden');
                }
            });
        });
    }

    initInfoCards() {
        const infoData = {
            'internet-safety': { title: 'Internet Safety', text: 'Use strong, unique passwords for every account. Enable Two-Factor Authentication (2FA) wherever possible. Be cautious of public Wi-Fi and use a VPN if necessary.' },
            'malware-detection': { title: 'Malware Detection', text: 'Look out for unexpected pop-ups, slow device performance, and unrecognized apps. Run regular scans with trusted antivirus software.' },
            'malware-removal': { title: 'Malware Removal', text: 'Disconnect from the internet, enter safe mode, and run a full system scan. If the issue persists, consider a clean OS installation or seek professional help.' },
            'privacy': { title: 'Privacy Protection', text: 'Review app permissions regularly. Avoid sharing sensitive personal information on public platforms. Use privacy-focused search engines and browsers.' },
            'ad-blocking': { title: 'Ad Blocking', text: 'Install reputable browser extensions like uBlock Origin. Use DNS-level blocking like Pi-hole or AdGuard DNS for network-wide protection.' },
            'device-config': { title: 'Device Configuration', text: 'Keep your OS and software updated. Disable unnecessary services and features. Ensure your firewall is active and properly configured.' },
            'public-wifi': { title: 'Public Wi-Fi Safety', text: 'Never access banking or sensitive accounts on public Wi-Fi. Use a reliable VPN to encrypt your traffic. Turn off file sharing on your device.' },
            'surviving-hacks': { title: 'Surviving Hacks', text: 'Change all compromised passwords immediately. Contact your bank if financial data was exposed. Scan all devices for lingering malware.' },
            'malware-types': { title: 'Malware Types', text: 'Ransomware locks your files; spyware steals data; trojans disguise themselves as legit software; worms spread across networks. Knowing the enemy is half the battle.' },
            'avoiding-scams': { title: 'Avoiding Scams', text: 'If it sounds too good to be true, it probably is. Never click suspicious links in emails or texts. Verify the sender\'s identity before providing any information.' },
            'safe-shopping': { title: 'Safe Shopping', text: 'Only shop on HTTPS websites. Use credit cards rather than debit cards for better fraud protection. Beware of deals that are significantly below market value.' },
            'social-media': { title: 'Social Media', text: 'Set your profiles to private. Be wary of accepting requests from strangers. Think before you post—what goes online, stays online.' },
            'backing-up': { title: 'Backing Up', text: 'Follow the 3-2-1 rule: 3 copies of your data, on 2 different media, with 1 offsite backup (like cloud storage). Automate backups so you don\'t forget.' },
            'kids-internet': { title: 'Kids on the Internet', text: 'Set up parental controls on devices and routers. Teach children about online predators and cyberbullying. Keep computers in common areas of the house.' }
        };

        const cards = document.querySelectorAll('.card[data-info]');
        const expandedContent = document.getElementById('expanded-content');
        const expandedTitle = document.getElementById('expanded-title');
        const expandedText = document.getElementById('expanded-text');
        const closeBtn = document.getElementById('close-expanded');

        if (!expandedContent) return;

        cards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                const infoKey = card.getAttribute('data-info');
                const data = infoData[infoKey];
                
                if (data) {
                    expandedTitle.textContent = data.title;
                    expandedText.innerHTML = `<p class="text-lg leading-relaxed">${data.text}</p>`;
                    expandedContent.classList.remove('hidden');
                    // Scroll to it
                    expandedContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                expandedContent.classList.add('hidden');
            });
        }
    }

    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        
        // Load saved theme from localStorage, default to 'light'
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const isLight = document.body.classList.contains('light-theme');
                const nextTheme = isLight ? 'dark' : 'light';
                
                this.setTheme(nextTheme);
                localStorage.setItem('theme', nextTheme);
            });
        }
    }

    setTheme(theme) {
        const themeIcon = document.getElementById('theme-icon');
        const moonPath = 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z';
        const sunPath = 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z';

        if (theme === 'light') {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark');
            if (themeIcon) {
                themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${moonPath}" />`;
            }
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark');
            if (themeIcon) {
                themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${sunPath}" />`;
            }
        }
    }

    cleanup() {
        if (this.carouselInterval) {
            clearInterval(this.carouselInterval);
        }
    }
} 