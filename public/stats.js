/* 
====================================================================
   TEAM SEC C - TITAN CORE JAVASCRIPT
   v9.0 | UI LOGIC & ADVANCED ANIMATIONS
==================================================================== 
*/

document.addEventListener('DOMContentLoaded', () => {

    /* 
    ========================================
    1. MOBILE NAVIGATION & AUTO ACTIVE LINK
    ========================================
    */
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (hamburger && navMenu) {
        // Toggle menu
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Auto-highlight active page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    /* 
    ========================================
    2. SMOOTH SCROLL FOR ANCHOR LINKS
    ========================================
    */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    /* 
    ========================================
    3. HEADER SCROLL EFFECT
    ========================================
    */
    const header = document.querySelector('.main-header');
    let lastScroll = 0;

    if (header) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.style.boxShadow = '0 5px 30px rgba(0,0,0,0.8)';
                header.style.background = 'rgba(5, 5, 5, 0.98)';
            } else {
                header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
                header.style.background = 'rgba(5, 5, 5, 0.95)';
            }

            // Hide/show header on scroll (optional)
            if (currentScroll > lastScroll && currentScroll > 300) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        });
    }

    /* 
    ========================================
    4. ANIMATED STAT COUNTERS (ENHANCED)
    ========================================
    */
    const counters = document.querySelectorAll('.g-number');

    function animateCounter(el, target, duration = 1500) {
        const start = 0;
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;

        function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            
            let value;
            if (isDecimal) {
                value = (start + (target - start) * eased).toFixed(2);
            } else {
                value = Math.floor(start + (target - start) * eased);
            }
            
            el.textContent = value.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString();
            }
        }
        requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const raw = el.textContent.replace(/,/g, '');
            const target = parseFloat(raw);
            
            if (!isNaN(target)) {
                el.textContent = '0';
                // Add slight delay for stagger effect
                const delay = Array.from(counters).indexOf(el) * 100;
                setTimeout(() => animateCounter(el, target), delay);
            }
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    /* 
    ========================================
    5. WEAPON BARS (STAGGER + EASING)
    ========================================
    */
    const weaponBars = document.querySelectorAll('.w-bar-fill');

    const barObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (!entry.isIntersecting) return;
            const bar = entry.target;
            const targetWidth = bar.style.width || '0%';

            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.transition = 'width 1.6s cubic-bezier(0.25, 1, 0.5, 1)';
                bar.style.width = targetWidth;
                
                // Add pulse effect on completion
                setTimeout(() => {
                    bar.style.animation = 'none';
                    setTimeout(() => {
                        bar.style.animation = '';
                    }, 10);
                }, 1600);
            }, 150 * index);

            observer.unobserve(bar);
        });
    }, { threshold: 0.2 });

    weaponBars.forEach(bar => barObserver.observe(bar));

    /* 
    ========================================
    6. HACKER TEXT EFFECT (ENHANCED)
    ========================================
    */
    const hackerTexts = document.querySelectorAll('.hacker-text');
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*';

    hackerTexts.forEach(el => {
        const original = el.dataset.value || el.textContent;
        el.dataset.value = original;
        let intervalId = null;

        el.addEventListener('mouseenter', () => {
            let iteration = 0;
            const targetText = el.dataset.value;

            if (intervalId) clearInterval(intervalId);

            intervalId = setInterval(() => {
                el.textContent = targetText
                    .split('')
                    .map((char, i) => {
                        if (char === ' ') return ' ';
                        if (i < iteration) return targetText[i];
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join('');

                iteration += 1 / 3;
                
                if (iteration >= targetText.length) {
                    clearInterval(intervalId);
                    el.textContent = targetText;
                }
            }, 30);
        });
    });

    /* 
    ========================================
    7. CUSTOM CURSOR (ENHANCED)
    ========================================
    */
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);

    const cursorCircle = document.createElement('div');
    cursorCircle.classList.add('cursor-circle');
    document.body.appendChild(cursorCircle);

    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;
    let cursorVisible = true;

    document.addEventListener('mousemove', (e) => {
        cursorVisible = true;
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
        cursorDot.style.opacity = '1';
        cursorCircle.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursorVisible = false;
        cursorDot.style.opacity = '0';
        cursorCircle.style.opacity = '0';
    });

    // Cursor expand on hover
    const hoverElements = document.querySelectorAll('a, button, .player-card, .weapon-card, .btn, input, textarea');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
            cursorCircle.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorCircle.style.borderColor = 'var(--primary)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorCircle.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorCircle.style.borderColor = 'rgba(255,255,255,0.5)';
        });
    });

    function animateCursor() {
        if (cursorVisible) {
            circleX += (mouseX - circleX) * 0.15;
            circleY += (mouseY - circleY) * 0.15;

            cursorCircle.style.left = circleX + 'px';
            cursorCircle.style.top = circleY + 'px';
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    /* 
    ========================================
    8. CARD PARALLAX & 3D TILT EFFECT
    ========================================
    */
    const cards = document.querySelectorAll('.player-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateY = ((x - centerX) / centerX) * 10;
            const rotateX = ((centerY - y) / centerY) * 10;

            card.style.transform = `
                translateY(-10px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                scale3d(1.02, 1.02, 1.02)
            `;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
        });
    });

    /* 
    ========================================
    9. SCROLL REVEAL ANIMATIONS
    ========================================
    */
    const revealElements = document.querySelectorAll('.section-header, .g-stat-box, .weapon-card, .map-card, .ach-box');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    /* 
    ========================================
    10. TABLE ROW HOVER EFFECT
    ========================================
    */
    const tableRows = document.querySelectorAll('.cyber-table tbody tr');
    
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    /* 
    ========================================
    11. LAZY LOAD IMAGES
    ========================================
    */
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    /* 
    ========================================
    12. BUTTON RIPPLE EFFECT
    ========================================
    */
    const buttons = document.querySelectorAll('.btn, button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .btn, button {
            position: relative;
            overflow: hidden;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    /* 
    ========================================
    13. TYPEWRITER EFFECT
    ========================================
    */
    const typewriterElements = document.querySelectorAll('.typewriter');
    
    typewriterElements.forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        let i = 0;

        const typeInterval = setInterval(() => {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    });

    /* 
    ========================================
    14. COPY TO CLIPBOARD
    ========================================
    */
    const copyButtons = document.querySelectorAll('[data-copy]');
    
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.copy;
            navigator.clipboard.writeText(text).then(() => {
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                btn.style.background = 'var(--success)';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 2000);
            });
        });
    });

    /* 
    ========================================
    15. BACK TO TOP BUTTON
    ========================================
    */
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    backToTop.classList.add('back-to-top');
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary);
        color: #000;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0, 255, 136, 0.4);
        font-size: 1.2rem;
    `;
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    backToTop.addEventListener('mouseenter', () => {
        backToTop.style.transform = 'translateY(-5px) scale(1.1)';
    });

    backToTop.addEventListener('mouseleave', () => {
        backToTop.style.transform = 'translateY(0) scale(1)';
    });

    /* 
    ========================================
    16. FORM VALIDATION
    ========================================
    */
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--accent)';
                    input.classList.add('shake');
                    
                    setTimeout(() => {
                        input.classList.remove('shake');
                        input.style.borderColor = '';
                    }, 500);
                }
            });

            if (!isValid) {
                e.preventDefault();
            }
        });
    });

    /* 
    ========================================
    17. PERFORMANCE OPTIMIZATION
    ========================================
    */
    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Apply to scroll events
    window.addEventListener('scroll', throttle(() => {
        // Your scroll logic here
    }, 100));

    /* 
    ========================================
    18. CONSOLE EASTER EGG
    ========================================
    */
    console.log(
        '%c🎮 TEAM SEC C 🎮',
        'color: #00ff88; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00ff88;'
    );
    console.log(
        '%cWelcome to the TITAN System v9.0',
        'color: #00ccff; font-size: 14px;'
    );
    console.log(
        '%c⚠️ WARNING: Unauthorized access detected. All activity is being monitored.',
        'color: #ff0055; font-size: 12px; font-weight: bold;'
    );

    /* 
    ========================================
    19. PRELOADER (OPTIONAL)
    ========================================
    */
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 300);
            }, 500);
        });
    }

    /* 
    ========================================
    20. SOUND SYSTEM (OPTIONAL)
    ========================================
    */
    // Uncomment to enable sound effects
    /*
    const sounds = {
        hover: new Audio('assets/sounds/hover.mp3'),
        click: new Audio('assets/sounds/click.mp3'),
        success: new Audio('assets/sounds/success.mp3')
    };

    // Set volume
    Object.values(sounds).forEach(sound => sound.volume = 0.2);

    // Hover sound
    document.querySelectorAll('a, button, .player-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            sounds.hover.currentTime = 0;
            sounds.hover.play().catch(() => {});
        });
    });

    // Click sound
    document.querySelectorAll('button, .btn').forEach(el => {
        el.addEventListener('click', () => {
            sounds.click.currentTime = 0;
            sounds.click.play().catch(() => {});
        });
    });
    */

    console.log('%c✅ All systems operational', 'color: #00ff88; font-weight: bold;');
});

/* 
====================================================================
   END OF TITAN CORE JAVASCRIPT
==================================================================== 
*/
