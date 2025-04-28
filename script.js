// Use environment variable with fallback for local development
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '+254743149316';

document.addEventListener('DOMContentLoaded', () => {
    new Typed('#typing-text', {
        strings: ['Cyber Hacker', 'Security Guru', 'Kali Master', 'Network Ninja'],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });

    // Carousel logic
    const carouselItems = document.getElementById('carousel-items');
    const items = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    function slideCarousel() {
        currentIndex = (currentIndex + 1) % items.length;
        carouselItems.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    setInterval(slideCarousel, 5000);

    // Main tab switching
    const mainTabButtons = document.querySelectorAll('.main-tab-button');
    const mainTabContents = document.querySelectorAll('.main-tab-content');

    mainTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            mainTabButtons.forEach(btn => btn.classList.remove('active', 'bg-neon-green', 'text-white'));
            mainTabButtons.forEach(btn => btn.classList.add('bg-gray-600', 'text-gray-200'));
            mainTabContents.forEach(content => content.classList.add('hidden'));

            // Add active class to clicked button and show its content
            button.classList.add('active', 'bg-neon-green', 'text-white');
            button.classList.remove('bg-gray-600', 'text-gray-200');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.remove('hidden');
        });
    });

    // Service tab switching and dynamic sorting
    const serviceTabButtons = document.querySelectorAll('.tab-button');
    const serviceTabContents = document.querySelectorAll('.tab-content');
    const serviceList = document.getElementById('service-list');

    function sortServices(category) {
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
    }

    serviceTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            serviceTabButtons.forEach(btn => btn.classList.remove('active', 'bg-neon-green', 'text-white'));
            serviceTabButtons.forEach(btn => btn.classList.add('bg-gray-600', 'text-gray-200'));
            serviceTabContents.forEach(content => content.classList.add('hidden'));

            // Add active class to clicked button and show its content
            button.classList.add('active', 'bg-neon-green', 'text-white');
            button.classList.remove('bg-gray-600', 'text-gray-200');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.remove('hidden');

            // Sort services based on category
            const categoryMap = {
                'service-printing': 'printing-binding',
                'service-device': 'device',
                'service-media': 'media',
                'service-documents': 'documents',
                'service-ecitizen': 'ecitizen',
                'service-training': 'training'
            };
            sortServices(categoryMap[tabId]);
        });
    });

    // Calculator logic
    const form = document.getElementById('service-form');
    const totalPriceSpan = document.getElementById('total-price');

    form.addEventListener('change', () => {
        let total = 0;
        const checkboxes = form.querySelectorAll('input[name="service"]:checked');
        checkboxes.forEach(checkbox => {
            total += parseFloat(checkbox.getAttribute('data-price'));
        });
        totalPriceSpan.textContent = total.toFixed(2);
    });

    // Form submission to WhatsApp
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedServices = Array.from(form.querySelectorAll('input[name="service"]:checked'))
            .map(checkbox => checkbox.value)
            .join(', ');
        const total = totalPriceSpan.textContent;
        const message = `Selected Services: ${selectedServices}\nTotal: KSh ${total}`;
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        if (document.body.classList.contains('dark')) {
            themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
        } else {
            themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
        }
    });

    // Card expansion logic
    const cards = document.querySelectorAll('.card');
    const expandedContent = document.getElementById('expanded-content');
    const expandedTitle = document.getElementById('expanded-title');
    const expandedText = document.getElementById('expanded-text');
    const closeButton = document.getElementById('close-expanded');

    const contentMap = {
        'internet-safety': {
            title: 'Internet Safety',
            text: `
                <ul class="list-disc pl-5">
                    <li>Use strong passwords (like a mix of letters, numbers, and symbols).</li>
                    <li>Add two-step login (like a code sent to your phone) for email and banking.</li>
                    <li>Don’t click weird links in emails—check where they go first.</li>
                    <li>Keep your phone and computer updated.</li>
                    <li>Only visit websites with a lock icon (HTTPS).</li>
                    <li>Need help staying safe? Text <a href="https://wa.me/${WHATSAPP_NUMBER}" class="text-neon-green hover:underline">${WHATSAPP_NUMBER}</a>.</li>
                </ul>
            `
        },
        'malware-detection': {
            title: 'Malware Detection',
            text: `
                <ul class="list-disc pl-5">
                    <li>Notice your device slowing down or showing pop-ups? Could be malware.</li>
                    <li>Check what’s running on your computer (Task Manager on Windows).</li>
                    <li>Use a free scanner like Malwarebytes to find bad stuff.</li>
                    <li>Watch for strange internet use with tools like Wireshark.</li>
                    <li>Think you’ve got malware? Text <a href="https://wa.me/${WHATSAPP_NUMBER}" class="text-neon-green hover:underline">${WHATSAPP_NUMBER}</a>.</li>
                </ul>
            `
        },
        'malware-removal': {
            title: 'Malware Removal',
            text: `
                <ul class="list-disc pl-5">
                    <li>Turn off your internet to stop malware spreading.</li>
                    <li>Start your computer in Safe Mode to limit bad programs.</li>
                    <li>Use a tool like Malwarebytes to delete malware.</li>
                    <li>Delete strange files in your Downloads folder.</li>
                    <li>Change passwords after cleaning. Need help? Text <a href="https://wa.me/${WHATSAPP_NUMBER}" class="text-neon-green hover:underline">${WHATSAPP_NUMBER}</a>.</li>
                </ul>
            `
        },
        'privacy': {
            title: 'Privacy Protection',
            text: `
                <ul class="list-disc pl-5">
                    <li>Use a VPN to hide where you are online.</li>
                    <li>Clear your browser’s history and cookies often.</li>
                    <li>Turn off location tracking on your phone.</li>
                    <li>Use a browser like Firefox that cares about privacy.</li>
                    <li>Don’t share too much on social media—check your settings.</li>
                    <li>Want a privacy check? Text <a href="https://wa.me/${WHATSAPP_NUMBER}" class="text-neon-green hover:underline">${WHATSAPP_NUMBER}</a>.</li>
                </ul>
            `
        },
        'ad-blocking': {
            title: 'Ad Blocking Without Apps',
            text: `
                <ul class="list-disc pl-5">
                    <li>Block ad websites by editing your computer’s hosts file.</li>
                    <li>Add an ad-blocker like uBlock Origin to your browser.</li>
                    <li>Use an ad-blocking DNS like AdGuard (change in Wi-Fi settings).</li>
                    <li>Turn off JavaScript on sketchy websites.</li>
                    <li>Need help with ads? Text <a href="https://wa.me/${WHATSAPP_NUMBER}" class="text-neon-green hover:underline">${WHATSAPP_NUMBER}</a>.</li>
                </ul>
            `
        },
        'device-config': {
            title: 'Device Configuration',
            text: `
                <ul class="list-disc pl-5">
                    <li>Turn off features you don’t use, like Bluetooth.</li>
                    <li>Turn on your firewall to block bad connections.</li>
                    <li>Update your phone and computer regularly.</li>
                    <li>Use a strong password and lock your device.</li>
                    <li>Need a secure setup? Text <a href="https://wa.me/${WHATSAPP_NUMBER}" class="text-neon-green hover:underline">${WHATSAPP_NUMBER}</a>.</li>
                </ul>
            `
        },
        'public-wifi': {
            title: 'Public Wi-Fi Safety',
            text: `
                <ul class="list-disc pl-5">
                    <li>Use a VPN to keep your data safe on public Wi-Fi.</li>
                    <li>Don’t log into banking or email on public networks.</li>
                    <li>Make sure the Wi-Fi name is legit—ask the cafe staff.</li>
                    <li>Only visit websites with a lock icon (HTTPS).</li>
                    <li>Risks: Hackers can steal your info or trick you with fake Wi-Fi.</li>
                    <li>Need Wi-Fi safety help? Text <a href="https://wa.me/${WHATSAPP_NUMBER}" class="text-neon-green hover:underline">${WHATSAPP_NUMBER}</a>.</li>
                </ul>
            `
        },
        'surviving-hacks': {
            title: 'Surviving Hacks',
            text: `
                <ul class="list-disc pl-5">
                    <li>Turn off your internet right away.</li>
                    <li>Change all your passwords from a safe device.</li>
                    <li>Scan your device for malware.</li>
                    <li>Check your bank for weird payments.</li>
                    <li>Add two-step login to your accounts.</li>
                    <li>Been hacked? Text <a href="https://wa.me/${WHATSAPP_NUMBER}" class="text-neon-green hover:underline">${WHATSAPP_NUMBER}</a>.</li>
                </ul>
            `
        },
        'malware-types': {
            title: 'Malware Types & Spread',
            text: `
                <ul class="list-disc pl-5">
                    <li><strong>Viruses</strong>: Hide in files you download.</li>
                    <li><strong>Ransomware</strong>: Locks your files and asks for money.</li>
                    <li><strong>Spyware</strong>: Watches what you do online.</li>
                    <li><strong>Trojans</strong>: Pretend to be good apps but cause harm.</li>
                    <li><strong>Worms</strong>: Spread through networks on their own.</li>
                    <li>Spread by fake emails, bad downloads, or USB sticks.</li>
                    <li>Worried about malware? Text <a href="https://wa.me/${WHATSAPP_NUMBER}" class="text-neon-green hover:underline">${WHATSAPP_NUMBER}</a>.</li>
                </ul>
            `
        },
        'avoiding-scams': {
            title: 'Avoiding Online Scams',
            text: `
                <ul class="list-disc pl-5">
                    <li>Don’t trust emails asking for your password or money.</li>
                    <li>Check website addresses—scams use fake ones like “g00gle.com”.</li>
                    <li>Hang up on calls saying your computer has a virus.</li>
                    <li>Don’t send money to strangers online, even if they seem nice.</li>
                    <li>Got a weird email or call? Text <a href="https://wa.me/${WHATSAPP_NUMBER}" class="text-neon-green hover:underline">${WHATSAPP_NUMBER}</a>.</li>
                </ul>
            `
        },
        'safe-shopping': {
            title: 'Safe Online Shopping',
            text: `
                <ul class="list-disc pl-5">
                    <li>Shop on websites with a lock icon (HTTPS).</li>
                    <li>Use a credit card, not a debit card, for online buys.</li>
                    <li>Check reviews before buying from new stores.</li>
                    <li>Don’t save your card info on shopping sites.</li>
                    <li>Got a fishy shopping site? Text <a href="https://wa.me/${WHATSAPP_NUMBER}" class="text-neon-green hover:underline">${WHATSAPP_NUMBER}</a>.</li>
                </ul>
            `
        },
        'social-media': {
            title: 'Protecting Social Media',
            text: `
                <ul class="list-disc pl-5">
                    <li>Use a strong password for WhatsApp, Facebook, and Instagram.</li>
                    <li>Turn on two-step login (like a code sent to your phone).</li>
                    <li>Don’t accept friend requests from strangers.</li>
                    <li>Make your posts private so only friends see them.</li>
                    <li>Account acting weird? Text <a href="https://wa.me/${WHATSAPP_NUMBER}" class="text-neon-green hover:underline">${WHATSAPP_NUMBER}</a>.</li>
                </ul>
            `
        },
        'backing-up': {
            title: 'Backing Up Your Stuff',
            text: `
                <ul class="list-disc pl-5">
                    <li>Copy photos and documents to a USB drive or external hard drive.</li>
                    <li>Use a free cloud service like Google Drive or Dropbox.</li>
                    <li>Back up your stuff every month.</li>
                    <li>Keep your backups in a safe place, not just on your computer.</li>
                    <li>Need help backing up? Text <a href="https://wa.me/${WHATSAPP_NUMBER}" class="text-neon-green hover:underline">${WHATSAPP_NUMBER}</a>.</li>
                </ul>
            `
        },
        'kids-internet': {
            title: 'Kids and the Internet',
            text: `
                <ul class="list-disc pl-5">
                    <li>Talk to your kids about not sharing personal info online.</li>
                    <li>Set up parental controls on their phone or computer.</li>
                    <li>Check what apps and games they’re using.</li>
                    <li>Teach them to tell you about weird messages.</li>
                    <li>Need help keeping kids safe? Text <a href="https://wa.me/${WHATSAPP_NUMBER}" class="text-neon-green hover:underline">${WHATSAPP_NUMBER}</a>.</li>
                </ul>
            `
        }
    };

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const info = card.getAttribute('data-info');
            expandedTitle.textContent = contentMap[info].title;
            expandedText.innerHTML = contentMap[info].text;
            expandedContent.classList.remove('hidden');
        });
    });

    closeButton.addEventListener('click', () => {
        expandedContent.classList.add('hidden');
    });
});
