// Main JavaScript file for InnovateTech Landing Page
// Author: Elite Tech Intern Project

'use strict';

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    // Initialize all components
    initSmoothScrolling();
    initHeaderScrollEffect();
    initScrollAnimations();
    initMobileMenu();
    initFormHandling();
    initButtonEffects();
    initParallaxEffect();
    initLoadingAnimation();
    initPerformanceOptimizations();
    
    console.log('🚀 InnovateTech Landing Page initialized successfully!');
}

// =====================================
// SMOOTH SCROLLING
// =====================================
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// =====================================
// HEADER SCROLL EFFECT
// =====================================
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header when scrolling down, show when scrolling up
        if (scrollY > lastScrollY && scrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// =====================================
// SCROLL ANIMATIONS
// =====================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.add('animate');
                
                // Animate feature cards with stagger effect
                if (entry.target.classList.contains('feature-card')) {
                    const cards = document.querySelectorAll('.feature-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.fade-in, .feature-card');
    animatedElements.forEach(el => observer.observe(el));
    
    // Counter animation for hero stats
    animateCounters();
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat h3');
    const speed = 200;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = counter.innerText;
                const isPercentage = target.includes('%');
                const isPlus = target.includes('+');
                const numericValue = parseInt(target.replace(/\D/g, ''));
                
                animateCounter(counter, 0, numericValue, speed, isPercentage, isPlus);
                observer.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, start, end, duration, isPercentage, isPlus) {
    let startTime = null;
    
    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        
        let displayValue = current;
        if (isPercentage) displayValue += '.9%';
        else if (isPlus) displayValue += 'k+';
        else if (current === 24) displayValue = '24/7';
        
        element.textContent = displayValue;
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

// =====================================
// MOBILE MENU
// =====================================
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav')) {
                closeMobileMenu();
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('mobile-open');
}

function closeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle && navLinks) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('mobile-open');
    }
}

// =====================================
// FORM HANDLING
// =====================================
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Add input validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', clearValidationError);
        });
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate form
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        form.reset();
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateInput({ target: input })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    const type = input.type;
    
    clearValidationError(input);
    
    if (input.required && !value) {
        showValidationError(input, 'This field is required');
        return false;
    }
    
    if (type === 'email' && value && !isValidEmail(value)) {
        showValidationError(input, 'Please enter a valid email address');
        return false;
    }
    
    if (type === 'tel' && value && !isValidPhone(value)) {
        showValidationError(input, 'Please enter a valid phone number');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function showValidationError(input, message) {
    const errorElement = document.createElement('span');
    errorElement.className = 'validation-error';
    errorElement.textContent = message;
    errorElement.style.color = '#e53e3e';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.style.display = 'block';
    
    input.style.borderColor = '#e53e3e';
    input.parentNode.appendChild(errorElement);
}

function clearValidationError(inputOrEvent) {
    const input = inputOrEvent.target || inputOrEvent;
    const errorElement = input.parentNode.querySelector('.validation-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    input.style.borderColor = '';
}

// =====================================
// BUTTON EFFECTS
// =====================================
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .cta-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', createRippleEffect);
        
        // Add hover sound effect (optional)
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function createRippleEffect(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    // Ensure button has relative positioning
    const originalPosition = getComputedStyle(button).position;
    if (originalPosition === 'static') {
        button.style.position = 'relative';
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

// =====================================
// PARALLAX EFFECT
// =====================================
function initParallaxEffect() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const ctaSection = document.querySelector('.cta-section');
        
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
        
        if (ctaSection) {
            const rect = ctaSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const rate = (window.innerHeight - rect.top) * 0.1;
                ctaSection.style.backgroundPosition = `center ${rate}px`;
            }
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking && window.innerWidth > 768) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// =====================================
// LOADING ANIMATION
// =====================================
function initLoadingAnimation() {
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger initial animations
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero h1, .hero p, .hero-cta, .hero-stats');
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 200);
            });
        }, 100);
    });
}

// =====================================
// NOTIFICATION SYSTEM
// =====================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#e53e3e' : '#4299e1'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 350px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// =====================================
// PERFORMANCE OPTIMIZATIONS
// =====================================
function initPerformanceOptimizations() {
    // Lazy load images
    lazyLoadImages();
    
    // Preload critical resources
    preloadCriticalResources();
    
    // Optimize scroll performance
    optimizeScrollPerformance();
}

function lazyLoadImages() {
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

function preloadCriticalResources() {
    // Preload hero image
    const heroImg = new Image();
    heroImg.src = 'images/hero-bg.jpg';
    
    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
}

function optimizeScrollPerformance() {
    // Throttle scroll events
    let scrollTimeout;
    let scrollEndTimeout;
    
    window.addEventListener('scroll', function() {
        // Clear existing timeouts
        clearTimeout(scrollTimeout);
        clearTimeout(scrollEndTimeout);
        
        // Add scrolling class for potential styling
        document.body.classList.add('scrolling');
        
        // Set timeout to remove scrolling class
        scrollEndTimeout = setTimeout(() => {
            document.body.classList.remove('scrolling');
        }, 100);
        
    }, { passive: true });
}

// =====================================
// UTILITY FUNCTIONS
// =====================================

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get scroll percentage
function getScrollPercentage() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return (scrollTop / scrollHeight) * 100;
}

// =====================================
// ADVANCED FEATURES
// =====================================

// Initialize advanced features
function initAdvancedFeatures() {
    // Scroll progress indicator
    createScrollProgressIndicator();
    
    // Back to top button
    createBackToTopButton();
    
    // Keyboard navigation
    initKeyboardNavigation();
    
    // Dark mode toggle (optional)
    initDarkModeToggle();
    
    // Cookie consent (optional)
    // initCookieConsent();
}

// Scroll Progress Indicator
function createScrollProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    const updateProgress = throttle(() => {
        const percentage = getScrollPercentage();
        progressBar.style.width = percentage + '%';
    }, 16);
    
    window.addEventListener('scroll', updateProgress, { passive: true });
}

// Back to Top Button
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--gradient);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        transform: translateY(100px);
        transition: all 0.3s ease;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
    `;
    
    document.body.appendChild(backToTop);
    
    // Show/hide based on scroll position
    const toggleBackToTop = throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 300) {
            backToTop.style.transform = 'translateY(0)';
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.transform = 'translateY(100px)';
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    }, 100);
    
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    
    // Click handler
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Keyboard Navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC key to close mobile menu
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
        
        // Enter key to activate focused elements
        if (e.key === 'Enter' && document.activeElement) {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('nav-links') || 
                focusedElement.classList.contains('cta-button') ||
                focusedElement.classList.contains('btn-primary') ||
                focusedElement.classList.contains('btn-secondary')) {
                focusedElement.click();
            }
        }
    });
    
    // Add focus styles for keyboard navigation
    const style = document.createElement('style');
    style.textContent = `
        .nav-links a:focus,
        .cta-button:focus,
        .btn-primary:focus,
        .btn-secondary:focus,
        input:focus,
        textarea:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);
}

// Dark Mode Toggle (Optional)
function initDarkModeToggle() {
    // Check for saved preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Create toggle button
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.style.cssText = `
        position: fixed;
        top: 50%;
        right: 1rem;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--white);
        border: 2px solid var(--gray-200);
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: var(--shadow-md);
        transition: all 0.3s ease;
        z-index: 999;
        display: none; /* Hidden by default - enable if needed */
    `;
    
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

// =====================================
// ANALYTICS AND TRACKING
// =====================================
function initAnalytics() {
    // Track page views
    trackPageView();
    
    // Track button clicks
    trackButtonClicks();
    
    // Track form submissions
    trackFormSubmissions();
    
    // Track scroll depth
    trackScrollDepth();
}

function trackPageView() {
    // Google Analytics 4 example
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_TRACKING_ID', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
    
    // Custom analytics
    console.log('Page view tracked:', window.location.pathname);
}

function trackButtonClicks() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .cta-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonText = button.textContent.trim();
            const buttonClass = Array.from(button.classList).join(' ');
            
            // Track with Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    event_category: 'Button',
                    event_label: buttonText,
                    custom_parameter: buttonClass
                });
            }
            
            console.log('Button clicked:', buttonText);
        });
    });
}

function trackFormSubmissions() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const formId = form.id || form.className;
            
            // Track with Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'submit', {
                    event_category: 'Form',
                    event_label: formId
                });
            }
            
            console.log('Form submitted:', formId);
        });
    });
}

function trackScrollDepth() {
    const scrollPoints = [25, 50, 75, 100];
    const trackedPoints = new Set();
    
    const trackScroll = throttle(() => {
        const scrollPercentage = getScrollPercentage();
        
        scrollPoints.forEach(point => {
            if (scrollPercentage >= point && !trackedPoints.has(point)) {
                trackedPoints.add(point);
                
                // Track with Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll', {
                        event_category: 'Scroll Depth',
                        event_label: `${point}%`,
                        value: point
                    });
                }
                
                console.log(`Scroll depth reached: ${point}%`);
            }
        });
    }, 250);
    
    window.addEventListener('scroll', trackScroll, { passive: true });
}

// =====================================
// ERROR HANDLING AND FALLBACKS
// =====================================
function initErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
        
        // Track errors (optional)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: e.error?.message || 'Unknown error',
                fatal: false
            });
        }
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        
        // Track errors (optional)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: e.reason?.message || 'Promise rejection',
                fatal: false
            });
        }
    });
}

// =====================================
// INITIALIZATION
// =====================================

// Initialize advanced features after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add small delay to ensure all elements are rendered
    setTimeout(() => {
        initAdvancedFeatures();
        initAnalytics();
        initErrorHandling();
    }, 100);
});

// Initialize on window load for better performance
window.addEventListener('load', () => {
    // Performance monitoring
    if ('performance' in window) {
        const navTiming = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', navTiming.loadEventEnd - navTiming.loadEventStart, 'ms');
    }
});

// =====================================
// EXPORT FUNCTIONS (if using modules)
// =====================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        showNotification,
        debounce,
        throttle,
        isInViewport,
        getScrollPercentage
    };
}