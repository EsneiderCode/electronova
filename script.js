// ============================================
// CANVAS CIRCUIT BACKGROUND ANIMATION
// ============================================
class CircuitAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connections = [];
        this.nodes = [];
        this.mousePosition = { x: 0, y: 0 };

        this.init();
        this.createNodes();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createNodes() {
        const nodeCount = 40;
        this.nodes = [];

        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                glow: Math.random()
            });
        }

        // Create particles
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }

    drawNodes() {
        this.nodes.forEach(node => {
            // Update position
            node.x += node.vx;
            node.y += node.vy;

            // Boundary check
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;

            // Glow animation
            node.glow = (Math.sin(Date.now() * 0.001 + node.x) + 1) / 2;

            // Draw node
            const gradient = this.ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.radius * 3
            );
            gradient.addColorStop(0, `rgba(255, 215, 0, ${node.glow * 0.8})`);
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
            this.ctx.fill();

            // Draw core
            this.ctx.fillStyle = `rgba(255, 215, 0, ${node.glow})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawConnections() {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.3;
                    this.ctx.strokeStyle = `rgba(255, 215, 0, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.stroke();

                    // Draw electric pulse
                    if (Math.random() > 0.98) {
                        const pulseX = this.nodes[i].x + dx * Math.random();
                        const pulseY = this.nodes[i].y + dy * Math.random();

                        const gradient = this.ctx.createRadialGradient(
                            pulseX, pulseY, 0,
                            pulseX, pulseY, 5
                        );
                        gradient.addColorStop(0, 'rgba(255, 215, 0, 1)');
                        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

                        this.ctx.fillStyle = gradient;
                        this.ctx.beginPath();
                        this.ctx.arc(pulseX, pulseY, 5, 0, Math.PI * 2);
                        this.ctx.fill();
                    }
                }
            }
        }
    }

    drawParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            this.ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawConnections();
        this.drawNodes();
        this.drawParticles();

        requestAnimationFrame(() => this.animate());
    }

    addEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            this.mousePosition = {
                x: e.clientX,
                y: e.clientY
            };

            // Add attraction effect
            this.nodes.forEach(node => {
                const dx = this.mousePosition.x - node.x;
                const dy = this.mousePosition.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    node.vx += dx * 0.00001;
                    node.vy += dy * 0.00001;
                }
            });
        });
    }
}

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================
class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;

        this.inputs = {
            nombre: this.form.querySelector('#nombre'),
            email: this.form.querySelector('#email'),
            telefono: this.form.querySelector('#telefono'),
            mensaje: this.form.querySelector('#mensaje')
        };

        this.submitButton = this.form.querySelector('.submit-button');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        Object.values(this.inputs).forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(input) {
        const value = input.value.trim();
        const fieldName = input.name;
        let errorMessage = '';

        switch(fieldName) {
            case 'nombre':
                if (value.length < 3) {
                    errorMessage = 'El nombre debe tener al menos 3 caracteres';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = 'Por favor ingrese un correo válido';
                }
                break;
            case 'telefono':
                const phoneRegex = /^[\d\s\+\-\(\)]{7,}$/;
                if (value && !phoneRegex.test(value)) {
                    errorMessage = 'Por favor ingrese un teléfono válido';
                }
                break;
            case 'mensaje':
                if (value.length < 10) {
                    errorMessage = 'El mensaje debe tener al menos 10 caracteres';
                }
                break;
        }

        if (errorMessage) {
            this.showError(input, errorMessage);
            return false;
        }

        return true;
    }

    showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        errorElement.textContent = message;
        input.style.borderColor = '#ef4444';
    }

    clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        errorElement.textContent = '';
        input.style.borderColor = 'rgba(255, 215, 0, 0.2)';
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        Object.values(this.inputs).forEach(input => {
            if (input.hasAttribute('required')) {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            }
        });

        if (!isValid) return;

        // Simulate form submission
        this.submitButton.classList.add('loading');
        this.submitButton.disabled = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Show success message
        this.showSuccessMessage();

        // Reset form
        this.form.reset();
        this.submitButton.classList.remove('loading');
        this.submitButton.disabled = false;
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
            z-index: 10000;
            font-family: 'Rajdhani', sans-serif;
            font-weight: 600;
            animation: slideIn 0.5s ease;
        `;
        message.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"/>
                </svg>
                <div>
                    <div style="font-size: 1.1rem;">¡Mensaje enviado!</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">Nos pondremos en contacto pronto</div>
                </div>
            </div>
        `;

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => message.remove(), 500);
        }, 4000);
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));

                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
class HeaderScroll {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.header.style.background = 'rgba(10, 14, 26, 0.98)';
                this.header.style.boxShadow = '0 5px 30px rgba(0, 0, 0, 0.5)';
            } else {
                this.header.style.background = 'rgba(10, 14, 26, 0.95)';
                this.header.style.boxShadow = 'none';
            }
        });
    }
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements
        const elementsToAnimate = document.querySelectorAll(`
            .servicio-card,
            .nosotros-content,
            .contacto-grid,
            .section-header
        `);

        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    }
}

// ============================================
// ELECTRIC SPARK EFFECT ON HOVER
// ============================================
class SparkEffect {
    constructor() {
        this.init();
    }

    init() {
        const servicioCards = document.querySelectorAll('.servicio-card');

        servicioCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.createSparks(card);
            });
        });
    }

    createSparks(element) {
        const sparks = element.querySelectorAll('.spark');

        sparks.forEach((spark, index) => {
            const angle = (index * 120) * Math.PI / 180;
            const distance = 30;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            spark.style.setProperty('--tx', `${tx}px`);
            spark.style.setProperty('--ty', `${ty}px`);
        });
    }
}

// ============================================
// COUNTER ANIMATION
// ============================================
class CounterAnimation {
    constructor() {
        this.init();
    }

    init() {
        const counters = document.querySelectorAll('.stat-number');
        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = element.textContent;
        const isPercentage = target.includes('%');
        const isPlus = target.includes('+');
        const number = parseInt(target.replace(/\D/g, ''));
        const duration = 2000;
        const steps = 60;
        const increment = number / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }

            let displayValue = Math.floor(current).toString();
            if (isPlus) displayValue += '+';
            if (isPercentage) displayValue += '%';

            element.textContent = displayValue;
        }, duration / steps);
    }
}

// ============================================
// CURSOR GLOW EFFECT
// ============================================
class CursorGlow {
    constructor() {
        this.cursor = this.createCursor();
        this.init();
    }

    createCursor() {
        const cursor = document.createElement('div');
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: width 0.3s, height 0.3s;
            display: none;
        `;
        document.body.appendChild(cursor);
        return cursor;
    }

    init() {
        // Only show on desktop
        if (window.innerWidth > 968) {
            this.cursor.style.display = 'block';

            document.addEventListener('mousemove', (e) => {
                this.cursor.style.left = e.clientX + 'px';
                this.cursor.style.top = e.clientY + 'px';
            });

            // Expand on interactive elements
            const interactiveElements = document.querySelectorAll('a, button, .servicio-card, .stat-item');

            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.cursor.style.width = '60px';
                    this.cursor.style.height = '60px';
                });

                el.addEventListener('mouseleave', () => {
                    this.cursor.style.width = '20px';
                    this.cursor.style.height = '20px';
                });
            });
        }
    }
}

// ============================================
// INITIALIZE ALL MODULES
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations and effects
    new CircuitAnimation('circuitCanvas');
    new ContactForm('contactForm');
    new SmoothScroll();
    new HeaderScroll();
    new ScrollAnimations();
    new SparkEffect();
    new CounterAnimation();
    new CursorGlow();

    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Lazy load images when implemented
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
