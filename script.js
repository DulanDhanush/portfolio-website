// Menu toggle functionality
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');

const toggleMenu = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
    document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
};

menuIcon.addEventListener('click', toggleMenu);

// Close menu when clicking on links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !menuIcon.contains(e.target)) {
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

    // Close mobile menu on scroll
    if (navbar.classList.contains('active')) {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.addEventListener('scroll', updateActiveNav);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
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

// Form submission handling
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

        contactForm.appendChild(messageDiv);

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
                showMessage('Thank you! Your message has been sent.', 'success');
                contactForm.reset();
            } else {
                showMessage('Oops! Something went wrong. Please try again.', 'error');
            }
        } catch (error) {
            showMessage('Oops! Could not send message. Try again later.', 'error');
        }

        submitBtn.value = originalText;
        submitBtn.disabled = false;
    });
};


    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('input[type="submit"]');
        const originalText = submitBtn.value;
        
        // Show loading state
        submitBtn.value = 'Sending...';
        submitBtn.disabled = true;
        
        // Formspree will handle the submission
        // You can add additional validation here if needed
        
        // Simulate success for demo (remove this in production)
        setTimeout(() => {
            showMessage('Thank you for your message! I will get back to you soon.', 'success');
            contactForm.reset();
            submitBtn.value = originalText;
            submitBtn.disabled = false;
        }, 1500);
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

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTypingAnimation();
    setCurrentYear();
    initContactForm();
    initAnimations();
    updateActiveNav(); // Initialize header state
});

// Handle page load and resize
window.addEventListener('load', updateActiveNav);
window.addEventListener('resize', () => {
    if (window.innerWidth > 1285) {
        navbar.classList.remove('active');
        menuIcon.classList.remove('bx-x');
        document.body.style.overflow = '';
    }
});




