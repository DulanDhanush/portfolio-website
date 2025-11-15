// script.js

// Mobile menu functionality
const menuIcon = document.getElementById('menu-icon');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');

// Toggle mobile menu with proper scroll handling
const toggleMenu = () => {
    const isMenuActive = navbar.classList.contains('active');
    
    // Toggle menu icon
    menuIcon.classList.toggle('bx-x');
    
    // Toggle menu visibility
    navbar.classList.toggle('active');
    
    // Handle body scroll only on mobile devices
    if (window.innerWidth <= 1285) {
        if (!isMenuActive) {
            // Menu is opening - prevent body scroll
            document.body.style.overflow = 'hidden';
        } else {
            // Menu is closing - restore body scroll
            document.body.style.overflow = '';
        }
    }
};

// Menu icon click event
menuIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
});

// Close menu when clicking on navigation links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Only close if menu is active (mobile view)
        if (window.innerWidth <= 1285 && navbar.classList.contains('active')) {
            menuIcon.classList.remove('bx-x');
            navbar.classList.remove('active');
            // Restore body scroll
            document.body.style.overflow = '';
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navbar.classList.contains('active') && 
        !navbar.contains(e.target) && 
        !menuIcon.contains(e.target)) {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbar.classList.contains('active')) {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close menu on window resize (if resizing to desktop)
window.addEventListener('resize', () => {
    if (window.innerWidth > 1285 && navbar.classList.contains('active')) {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Active navigation on scroll
const sections = document.querySelectorAll('section');
const header = document.querySelector('.header');

const updateActiveNav = () => {
    const scrollY = window.pageYOffset;
    
    // Add shadow to header on scroll
    if (scrollY > 100) {
        header.style.background = 'rgba(0,0,0,0.95)';
        header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
    } else {
        header.style.background = 'rgba(0,0,0,0.85)';
        header.style.boxShadow = 'none';
    }

    // Update active navigation link
    sections.forEach(sec => {
        const offset = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (scrollY >= offset && scrollY < offset + height) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.navbar a[href*="${id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });

    // Close mobile menu on scroll (only on mobile)
    if (window.innerWidth <= 1285 && navbar.classList.contains('active')) {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.addEventListener('scroll', updateActiveNav);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Don't prevent default if it's a navigation link in mobile menu
        if (window.innerWidth > 1285 || !this.classList.contains('navbar-link')) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Typing animation
const initTypingAnimation = () => {
    const typedTextSpan = document.querySelector('.typed-text');
    if (!typedTextSpan) return;
    
    const textArray = ['Software Developer', 'Full-Stack Developer', 'Problem Solver', 'Tech Enthusiast'];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const type = () => {
        const currentText = textArray[textArrayIndex];
        
        if (isDeleting) {
            typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, newTextDelay);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textArrayIndex = (textArrayIndex + 1) % textArray.length;
            setTimeout(type, typingDelay + 1100);
        } else {
            setTimeout(type, isDeleting ? erasingDelay : typingDelay);
        }
    };
    
    // Start the typing animation
    setTimeout(type, newTextDelay + 250);
};

// Form submission handling using Formspree
const initContactForm = () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const showMessage = (message, type) => {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) existingMessage.remove();

        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.setAttribute('role', 'alert');
        messageDiv.setAttribute('aria-live', 'polite');

        contactForm.insertBefore(messageDiv, contactForm.firstChild);

        setTimeout(() => {
            if (messageDiv.parentNode) messageDiv.remove();
        }, 5000);
    };

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector('input[type="submit"]');
        const originalText = submitBtn.value;

        submitBtn.value = 'Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(this);

        try {
            const response = await fetch(this.action, {
                method: this.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showMessage('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
            } else {
                showMessage('Oops! Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            showMessage('Oops! Could not send message. Please check your connection and try again.', 'error');
        }

        submitBtn.value = originalText;
        submitBtn.disabled = false;
    });
};

// Set current year in footer
const setCurrentYear = () => {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
};

// Intersection Observer for animations
const initAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.services-box, .projects-card, .about-img, .about-content, .skill-tags');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
};

// Add loading animation to page
const initPageLoader = () => {
    // Simple loading state
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
    
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
};

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setCurrentYear();
    initTypingAnimation();
    initContactForm();
    initAnimations();
    initPageLoader();
    updateActiveNav(); // Initialize header state
    
    // Add navbar-link class to navigation links for smooth scrolling
    navLinks.forEach(link => {
        link.classList.add('navbar-link');
    });
});

// Handle page load and resize
window.addEventListener('load', () => {
    updateActiveNav();
    document.body.style.opacity = '1';
});

// Performance optimization: Throttle scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
            updateActiveNav();
        }, 10);
    }
});
