/* ============================================================
   MARTIMAS — Main JavaScript
   script.js
   ============================================================ */

'use strict';

/* ======================================================
   1. LOADER
   ====================================================== */
(function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    // Hide loader after page has loaded (min 1.9s for brand feel)
    const minDelay = new Promise(resolve => setTimeout(resolve, 1900));
    const pageReady = new Promise(resolve => {
        if (document.readyState === 'complete') { resolve(); return; }
        window.addEventListener('load', resolve, { once: true });
    });

    Promise.all([minDelay, pageReady]).then(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = ''; // Re-enable scroll
    });

    // Lock scroll during load
    document.body.style.overflow = 'hidden';
})();


/* ======================================================
   2. STICKY HEADER
   ====================================================== */
(function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on init
})();


/* ======================================================
   3. MOBILE NAV (hamburger toggle)
   ====================================================== */
(function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const overlay = document.getElementById('mobile-overlay');
    if (!hamburger || !nav) return;

    function openNav() {
        nav.classList.add('open');
        overlay && overlay.classList.add('active');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        nav.classList.remove('open');
        overlay && overlay.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        nav.classList.contains('open') ? closeNav() : openNav();
    });

    overlay && overlay.addEventListener('click', closeNav);

    // Close nav on nav-link click (non-dropdown)
    nav.querySelectorAll('.nav-link:not(.dropdown-trigger)').forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Mobile dropdown toggles
    nav.querySelectorAll('.dropdown-trigger').forEach(trigger => {
        trigger.addEventListener('click', e => {
            // Only intercept on mobile (nav is in its mobile-fixed state)
            if (window.innerWidth > 900) return;
            e.preventDefault();
            const dropdown = trigger.closest('.has-dropdown')?.querySelector('.dropdown');
            if (!dropdown) return;
            const isOpen = dropdown.classList.contains('open');
            // Close all dropdowns first
            nav.querySelectorAll('.dropdown.open').forEach(d => {
                d.classList.remove('open');
                d.previousElementSibling?.setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                dropdown.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) closeNav();
    });
})();


/* ======================================================
   4. ACTIVE NAV LINK (scroll spy)
   ====================================================== */
(function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    link.classList.toggle('active', href === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(sec => observer.observe(sec));
})();


/* ======================================================
   5. SCROLL REVEAL
   ====================================================== */
(function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    // Stagger siblings inside the same parent
    function applyStagger(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find sibling reveals in same grid/container
                const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
                const idx = siblings.indexOf(entry.target);
                entry.target.style.transitionDelay = `${idx * 80}ms`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }

    const observer = new IntersectionObserver(applyStagger, {
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1,
    });

    items.forEach(item => observer.observe(item));
})();


/* ======================================================
   6. SMOOTH SCROLL (for all anchor links)
   ====================================================== */
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const headerH = document.getElementById('header')?.offsetHeight || 72;
            const top = target.getBoundingClientRect().top + window.scrollY - headerH;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });
})();


/* ======================================================
   7. SEARCH BAR
   ====================================================== */
(function initSearch() {
    const input = document.getElementById('search-input');
    const btn = document.getElementById('search-btn');
    if (!input || !btn) return;

    // Section data for search
    const searchIndex = [
        { label: "Women's Clothing", id: '#womens-clothing', keywords: ['women', 'female', 'dress', 'clothing'] },
        { label: "Men's Clothing", id: '#mens-clothing', keywords: ['men', 'male', 'suit', 'clothing'] },
        { label: "Handmade Clothing", id: '#handmade-clothing', keywords: ['handmade', 'artisan', 'hand', 'crafted'] },
        { label: "Office Bags", id: '#office-bags', keywords: ['office', 'work', 'briefcase', 'bag'] },
        { label: "Travel Bags", id: '#travel-bags', keywords: ['travel', 'trip', 'luggage', 'bag'] },
        { label: "Messenger Bags", id: '#messenger-bags', keywords: ['messenger', 'shoulder', 'bag'] },
        { label: "Wallets", id: '#wallets', keywords: ['wallet', 'purse', 'card', 'leather'] },
        { label: "Handbags", id: '#handbags', keywords: ['handbag', 'clutch', 'women', 'bag'] },
        { label: "Tote Bags", id: '#tote-bags', keywords: ['tote', 'canvas', 'bag', 'shopping'] },
        { label: "Crossbody Bags", id: '#crossbody-bags', keywords: ['crossbody', 'cross', 'body', 'bag'] },
        { label: "Luxury Bags", id: '#luxury-bags', keywords: ['luxury', 'premium', 'exclusive', 'bag'] },
        { label: "Statement Necklaces", id: '#necklaces', keywords: ['necklace', 'jewel', 'chain', 'gold'] },
        { label: "Statement Rings", id: '#rings', keywords: ['ring', 'jewel', 'gold', 'silver'] },
        { label: "Home Decor", id: '#home-decor', keywords: ['home', 'decor', 'decoration', 'interior'] },
        { label: "About Martimas", id: '#about', keywords: ['about', 'story', 'brand', 'martimas'] },
        { label: "Contact", id: '#contact', keywords: ['contact', 'email', 'reach', 'message'] },
    ];

    function doSearch() {
        const query = input.value.trim().toLowerCase();
        if (!query) return;

        const results = searchIndex.filter(item =>
            item.label.toLowerCase().includes(query) ||
            item.keywords.some(k => k.includes(query) || query.includes(k))
        );

        if (results.length > 0) {
            const target = document.querySelector(results[0].id);
            if (target) {
                const headerH = document.getElementById('header')?.offsetHeight || 72;
                const top = target.getBoundingClientRect().top + window.scrollY - headerH;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        } else {
            input.style.boxShadow = '0 0 0 2px #e74c3c';
            setTimeout(() => { input.style.boxShadow = ''; }, 1200);
        }
    }

    btn.addEventListener('click', doSearch);
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') doSearch();
    });
})();


/* ======================================================
   8. CONTACT FORM
   ====================================================== */
(function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = form.querySelector('#cf-name').value.trim();
        const email = form.querySelector('#cf-email').value.trim();
        const message = form.querySelector('#cf-message').value.trim();

        if (!name || !email || !message) {
            showStatus('Please fill in all fields.', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            showStatus('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate send (replace with actual backend/API call)
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;

        setTimeout(() => {
            showStatus('✓ Message sent. We\'ll get back to you soon.', 'success');
            form.reset();
            submitBtn.textContent = 'Send Message';
            submitBtn.disabled = false;
        }, 1400);
    });

    function showStatus(msg, type) {
        if (!status) return;
        status.textContent = msg;
        status.style.color = type === 'error' ? '#e74c3c' : '#D4AF37';
    }
})();


/* ======================================================
   9. LOGIN FORM
   ====================================================== */
(function initLoginForm() {
    const form = document.getElementById('login-form');
    const togglePass = document.getElementById('toggle-pass');
    const passInput = document.getElementById('l-password');
    if (!form) return;

    // Password visibility toggle
    if (togglePass && passInput) {
        togglePass.addEventListener('click', () => {
            const isText = passInput.type === 'text';
            passInput.type = isText ? 'password' : 'text';
            togglePass.setAttribute('aria-label', isText ? 'Show password' : 'Hide password');
        });
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('l-email')?.value.trim();
        const password = passInput?.value.trim();

        if (!email || !password) {
            alert('Please fill in your email and password.');
            return;
        }
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        // Replace this with actual authentication logic
        console.log('Login attempt:', { email, password: '***' });
        alert('Login functionality coming soon. Please connect a backend.');
    });
})();


/* ======================================================
   10. DROPDOWN ARIA ACCESSIBILITY (keyboard nav)
   ====================================================== */
(function initDropdownA11y() {
    document.querySelectorAll('.has-dropdown').forEach(item => {
        const trigger = item.querySelector('.dropdown-trigger');
        const dropdown = item.querySelector('.dropdown');
        if (!trigger || !dropdown) return;

        // Keyboard: Enter/Space opens; Escape closes
        trigger.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const isOpen = dropdown.style.display === 'block';
                if (isOpen) {
                    dropdown.style.display = '';
                    trigger.setAttribute('aria-expanded', 'false');
                } else {
                    dropdown.style.display = 'block';
                    trigger.setAttribute('aria-expanded', 'true');
                }
            }
            if (e.key === 'Escape') {
                dropdown.style.display = '';
                trigger.setAttribute('aria-expanded', 'false');
                trigger.focus();
            }
        });

        // Click outside closes
        document.addEventListener('click', e => {
            if (!item.contains(e.target)) {
                dropdown.style.display = '';
                trigger.setAttribute('aria-expanded', 'false');
            }
        });
    });
})();


/* ======================================================
   11. PARALLAX — subtle on hero bg
   ====================================================== */
(function initParallax() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;
    // Only if not reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
            ticking = false;
        });
        ticking = true;
    }, { passive: true });
})();


/* ======================================================
   12. CARD HOVER — 3D tilt effect on product cards
   ====================================================== */
(function initCardTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return; // skip on touch devices

    document.querySelectorAll('.product-card, .testi-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotY = ((x - cx) / cx) * 4;  // max ±4deg
            const rotX = -((y - cy) / cy) * 4;
            card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
        });
    });
})();


/* ======================================================
   UTILITIES
   ====================================================== */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}