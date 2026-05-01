/* ============================================
   VANSH JINDAL - ADVANCED PORTFOLIO JS
   Particles | Typing | Scroll Reveals | Tilt
   ============================================ */

// ===== LOADING SCREEN =====
(function() {
    const loader = document.createElement('div');
    loader.className = 'loader-wrapper';
    loader.innerHTML = `
        <div class="loader">
            <div class="loader-ring"></div>
            <div class="loader-ring"></div>
            <div class="loader-ring"></div>
        </div>
    `;
    document.body.prepend(loader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('loaded');
            setTimeout(() => loader.remove(), 600);
        }, 800);
    });
})();

// ===== CUSTOM CURSOR =====
(function() {
    if (window.matchMedia('(pointer: fine)').matches) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        document.body.append(cursor, dot);

        let cursorX = 0, cursorY = 0;
        let dotX = 0, dotY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            dot.style.left = cursorX - 3 + 'px';
            dot.style.top = cursorY - 3 + 'px';
        });

        function animateCursor() {
            dotX += (cursorX - dotX) * 0.15;
            dotY += (cursorY - dotY) * 0.15;
            cursor.style.left = dotX - 10 + 'px';
            cursor.style.top = dotY - 10 + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Cursor hover effects
        const interactiveEls = document.querySelectorAll('a, button, .project-card, .about-card, .skill-item, .contact-card');
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    }
})();

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor(container) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'absolute';
        this.canvas.style.inset = '0';
    }

    init() {
        this.particles = [];
        const numParticles = Math.min(80, Math.floor((this.canvas.width * this.canvas.height) / 15000));
        for (let i = 0; i < numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1,
                color: ['108, 99, 255', '0, 212, 255', '255, 101, 132', '0, 255, 136'][Math.floor(Math.random() * 4)]
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Mouse interaction
            if (this.mouse.x !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.x += dx * force * 0.02;
                    p.y += dy * force * 0.02;
                }
            }

            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
            this.ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(${p.color}, ${0.08 * (1 - dist / 120)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
    new ParticleSystem(particlesContainer);
}

// ===== TYPING EFFECT =====
class TypeWriter {
    constructor(el, words, wait = 2000) {
        this.el = el;
        this.words = words;
        this.wait = wait;
        this.wordIndex = 0;
        this.txt = '';
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        this.txt = this.isDeleting
            ? fullTxt.substring(0, this.txt.length - 1)
            : fullTxt.substring(0, this.txt.length + 1);

        this.el.textContent = this.txt;

        let typeSpeed = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 400;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

const typedEl = document.getElementById('typed');
if (typedEl) {
    new TypeWriter(typedEl, ['Developer', 'Engineer', 'Problem Solver', 'MERN Stack Dev'], 2000);
}

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');
const backToTop = document.getElementById('backToTop');
const sections = document.querySelectorAll('section');
const allNavLinks = document.querySelectorAll('.nav-links a');

// Hamburger toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });
}

// Close mobile nav on link click
allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// Scroll events
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;

            // Navbar scroll effect
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Back to top button
            if (scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }

            // Active nav link
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            allNavLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });

            ticking = false;
        });
        ticking = true;
    }
});

// ===== COUNT-UP ANIMATION =====
function animateCountUp(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    function update() {
        current += step;
        if (current >= target) {
            el.textContent = target;
            return;
        }
        el.textContent = Math.floor(current);
        requestAnimationFrame(update);
    }
    update();
}

// ===== SCROLL REVEAL (Intersection Observer) =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

// Reveal elements
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add reveal classes to elements
function initScrollReveal() {
    // Section headers
    document.querySelectorAll('.section-header').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // About section
    const aboutImgContainer = document.querySelector('.about-image-container');
    if (aboutImgContainer) {
        aboutImgContainer.classList.add('reveal-left');
        revealObserver.observe(aboutImgContainer);
    }
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        aboutContent.classList.add('reveal-right');
        revealObserver.observe(aboutContent);
    }

    // About cards stagger
    const aboutCards = document.querySelector('.about-cards');
    if (aboutCards) {
        aboutCards.classList.add('stagger-children');
        revealObserver.observe(aboutCards);
    }

    // Skills categories
    document.querySelectorAll('.skill-category').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.15}s`;
        revealObserver.observe(el);
    });

    // Project cards
    document.querySelectorAll('.project-card').forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.15}s`;
        revealObserver.observe(el);
    });

    // Contact grid
    const contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        contactInfo.classList.add('reveal-left');
        revealObserver.observe(contactInfo);
    }
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.classList.add('reveal-right');
        revealObserver.observe(contactForm);
    }

    // Contact cards stagger
    const contactCards = document.querySelector('.contact-cards');
    if (contactCards) {
        contactCards.classList.add('stagger-children');
        revealObserver.observe(contactCards);
    }
}

initScrollReveal();

// ===== SKILL BAR ANIMATION =====
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-progress').forEach((bar, i) => {
                setTimeout(() => {
                    bar.classList.add('animate');
                }, i * 200);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(cat => {
    skillObserver.observe(cat);
});

// ===== STATS COUNT-UP =====
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-number').forEach(num => {
                animateCountUp(num);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ===== 3D TILT EFFECT ON PROJECT CARDS =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== MAGNETIC BUTTON EFFECT =====
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ===== CONTACT FORM =====
const contactFormEl = document.getElementById('contactForm');
if (contactFormEl) {
    contactFormEl.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = contactFormEl.querySelector('button');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        // Simulate send
        setTimeout(() => {
            btn.innerHTML = '<span>Sent Successfully!</span><i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
                contactFormEl.reset();
            }, 2500);
        }, 1500);
    });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== PARALLAX ON HERO BADGES =====
window.addEventListener('mousemove', (e) => {
    const badges = document.querySelectorAll('.floating-badge');
    const x = (window.innerWidth / 2 - e.clientX) / 30;
    const y = (window.innerHeight / 2 - e.clientY) / 30;

    badges.forEach((badge, i) => {
        const speed = (i + 1) * 0.5;
        badge.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// ===== NAVBAR HIDE ON SCROLL DOWN, SHOW ON SCROLL UP =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > lastScroll && currentScroll > 200) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
});

// ===== INITIALIZE EVERYTHING =====
console.log('%c Vansh Jindal Portfolio ', 'background: linear-gradient(135deg, #6c63ff, #00d4ff); color: white; font-size: 16px; padding: 8px 16px; border-radius: 8px; font-weight: bold;');
