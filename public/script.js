/* 
═══════════════════════════════════════════════════════════════════════════════
   ██████  NEXUS ESPORTS - ULTIMATE JAVASCRIPT  ██████
   v4.7 | FASTER CURSOR SPEED + SPLASH SCREEN + USER PROFILE
═══════════════════════════════════════════════════════════════════════════════
*/

(function () {
    'use strict';

    // ═══════════════════════════════════════════════════════════════════════════
    // 0. USER PROFILE & STORAGE SYSTEM
    // ═══════════════════════════════════════════════════════════════════════════
    const UserProfile = {
        data: {
            username: null,
            email: null,
            visitCount: 0,
            firstVisit: null,
            lastVisit: null,
            hasCompletedSignup: false,
            preferences: {
                soundEnabled: false,
                darkMode: true
            }
        },

        init() {
            this.load();
            this.updateVisit();
            this.save();

            console.log('👤 User Profile:', this.data);
        },

        load() {
            const stored = localStorage.getItem('secc_user_profile');
            if (stored) {
                try {
                    this.data = { ...this.data, ...JSON.parse(stored) };
                } catch (e) {
                    console.error('Error loading profile:', e);
                }
            }
        },

        save() {
            try {
                localStorage.setItem('secc_user_profile', JSON.stringify(this.data));
            } catch (e) {
                console.error('Error saving profile:', e);
            }
        },

        updateVisit() {
            this.data.visitCount++;
            this.data.lastVisit = new Date().toISOString();

            if (!this.data.firstVisit) {
                this.data.firstVisit = new Date().toISOString();
            }
        },

        isFirstVisit() {
            return this.data.visitCount === 1;
        },

        isNewUser() {
            return !this.data.hasCompletedSignup;
        },

        completeSignup(username, email) {
            this.data.username = username;
            this.data.email = email;
            this.data.hasCompletedSignup = true;
            this.save();
        },

        updatePreference(key, value) {
            this.data.preferences[key] = value;
            this.save();
        },

        reset() {
            localStorage.removeItem('secc_user_profile');
            this.data = {
                username: null,
                email: null,
                visitCount: 0,
                firstVisit: null,
                lastVisit: null,
                hasCompletedSignup: false,
                preferences: {
                    soundEnabled: false,
                    darkMode: true
                }
            };
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 1. SPLASH SCREEN (ALWAYS SHOWS ON EVERY VISIT)
    // ═══════════════════════════════════════════════════════════════════════════
    const SplashScreen = {
        element: null,
        progressBar: null,
        progressPercent: null,
        progressGlow: null,
        skipButton: null,
        duration: 1500,

        init() {
            this.element = document.getElementById('splash-screen');
            if (!this.element) return;

            console.log(`🎬 Splash Screen: SHOWING (Visit #${UserProfile.data.visitCount})`);

            this.progressBar = document.getElementById('splashBar');
            this.progressPercent = document.getElementById('splashPercent');
            this.progressGlow = document.getElementById('splashGlow');
            this.skipButton = document.getElementById('skipSplash');

            // Show welcome message based on user status
            this.showWelcomeMessage();

            // Animate stats counter
            this.animateStats();

            // Progress bar animation
            this.animateProgress();

            // Skip button
            if (this.skipButton) {
                this.skipButton.addEventListener('click', () => this.hide());
            }

            // Keyboard shortcut (Enter to skip)
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && this.element && !this.element.classList.contains('fade-out')) {
                    this.hide();
                }
            });

            // Auto-hide after duration
            setTimeout(() => this.hide(), this.duration);
        },

        showWelcomeMessage() {
            const statusMsg = document.getElementById('statusMsg');
            if (!statusMsg) return;

            const isFirstTime = UserProfile.isFirstVisit();
            const username = UserProfile.data.username || 'Guest';

            if (isFirstTime) {
                statusMsg.innerHTML = `
                    <i class="fa-solid fa-rocket"></i>
                    <span>Welcome to Team SEC C! First time here? Let's go!</span>
                `;
            } else {
                statusMsg.innerHTML = `
                    <i class="fa-solid fa-hand-wave"></i>
                    <span>Welcome back, ${username}! Visit #${UserProfile.data.visitCount}</span>
                `;
            }
        },

        animateProgress() {
            if (!this.progressBar || !this.progressPercent) return;

            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 25;
                if (progress > 100) progress = 100;

                this.progressBar.style.width = `${progress}%`;
                if (this.progressGlow) this.progressGlow.style.width = `${progress}%`;
                if (this.progressPercent) this.progressPercent.textContent = `${Math.floor(progress)}%`;

                if (progress >= 100) {
                    clearInterval(interval);
                }
            }, 60);
        },

        animateStats() {
            const statValues = document.querySelectorAll('.stat-value[data-count]');
            statValues.forEach(stat => {
                const target = parseInt(stat.dataset.count);
                let current = 0;
                const increment = target / 60;

                const counter = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target.toLocaleString();
                        clearInterval(counter);
                    } else {
                        stat.textContent = Math.floor(current).toLocaleString();
                    }
                }, 30);
            });
        },

        hide() {
            if (!this.element || this.element.classList.contains('fade-out')) return;

            this.element.classList.add('fade-out');

            setTimeout(() => {
                this.element.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 800);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 2. SIGNUP/LOGIN SYSTEM
    // ═══════════════════════════════════════════════════════════════════════════
    const SignupSystem = {
        init() {
            // Check for signup page
            const signupForm = document.getElementById('signup-form') ||
                document.querySelector('form[action*="signup"]');

            if (signupForm) {
                this.handleSignupPage(signupForm);
            }

            // Update header if user is logged in
            this.updateHeader();
        },

        handleSignupPage(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const username = form.querySelector('input[name="username"]')?.value;
                const email = form.querySelector('input[name="email"]')?.value;

                if (username && email) {
                    UserProfile.completeSignup(username, email);

                    // Show success message
                    this.showSuccessMessage(username);

                    // Redirect to home after 2 seconds
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                }
            });
        },

        showSuccessMessage(username) {
            alert(`🎉 Welcome to Team SEC C, ${username}! Redirecting to homepage...`);
        },

        updateHeader() {
            const joinBtn = document.querySelector('.btn-join');

            if (UserProfile.data.hasCompletedSignup && joinBtn) {
                const username = UserProfile.data.username;
                joinBtn.innerHTML = `
                    <span class="btn-icon"><i class="fa-solid fa-user-circle"></i></span>
                    <span class="btn-text">${username}</span>
                `;
                joinBtn.href = '#profile';
                joinBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showProfileModal();
                });
            }
        },

        showProfileModal() {
            const profile = UserProfile.data;

            const modalHTML = `
                <div class="profile-modal-overlay" id="profileModal">
                    <div class="profile-modal">
                        <button class="modal-close" id="closeProfile">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                        
                        <div class="profile-header">
                            <div class="profile-avatar">
                                <i class="fa-solid fa-user-astronaut"></i>
                            </div>
                            <h2>${profile.username || 'Guest'}</h2>
                            <p class="profile-email">${profile.email || 'No email'}</p>
                        </div>
                        
                        <div class="profile-stats">
                            <div class="profile-stat">
                                <span class="stat-label">Visits</span>
                                <span class="stat-value">${profile.visitCount}</span>
                            </div>
                            <div class="profile-stat">
                                <span class="stat-label">Member Since</span>
                                <span class="stat-value">${new Date(profile.firstVisit).toLocaleDateString()}</span>
                            </div>
                            <div class="profile-stat">
                                <span class="stat-label">Last Visit</span>
                                <span class="stat-value">${new Date(profile.lastVisit).toLocaleDateString()}</span>
                            </div>
                        </div>
                        
                        <div class="profile-actions">
                            <button class="profile-btn" id="editProfile">
                                <i class="fa-solid fa-edit"></i> Edit Profile
                            </button>
                            <button class="profile-btn danger" id="logoutBtn">
                                <i class="fa-solid fa-right-from-bracket"></i> Logout
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Add styles
            this.addProfileStyles();

            // Event listeners
            document.getElementById('closeProfile').addEventListener('click', () => {
                document.getElementById('profileModal').remove();
            });

            document.getElementById('logoutBtn').addEventListener('click', () => {
                if (confirm('Are you sure you want to logout?')) {
                    UserProfile.reset();
                    location.reload();
                }
            });
        },

        addProfileStyles() {
            if (document.getElementById('profile-modal-styles')) return;

            const styles = `
                <style id="profile-modal-styles">
                .profile-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 10000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    animation: fadeIn 0.3s ease;
                }
                
                .profile-modal {
                    background: #0a0a0c;
                    border: 1px solid rgba(0, 255, 136, 0.3);
                    border-radius: 12px;
                    padding: 40px;
                    max-width: 500px;
                    width: 90%;
                    position: relative;
                    animation: slideUp 0.3s ease;
                }
                
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 0, 85, 0.1);
                    border: 1px solid #ff0055;
                    border-radius: 50%;
                    color: #ff0055;
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: 0.3s;
                }
                
                .modal-close:hover {
                    background: #ff0055;
                    color: #fff;
                    transform: rotate(90deg);
                }
                
                .profile-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                
                .profile-avatar {
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, #00ff88, #00ccff);
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0 auto 20px;
                    font-size: 3rem;
                    color: #000;
                }
                
                .profile-header h2 {
                    font-family: 'Orbitron', sans-serif;
                    font-size: 2rem;
                    margin-bottom: 10px;
                    color: #00ff88;
                }
                
                .profile-email {
                    color: #888;
                    font-size: 0.9rem;
                }
                
                .profile-stats {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-bottom: 30px;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 8px;
                }
                
                .profile-stat {
                    text-align: center;
                }
                
                .profile-stat .stat-label {
                    display: block;
                    font-size: 0.75rem;
                    color: #888;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                
                .profile-stat .stat-value {
                    display: block;
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #00ff88;
                    font-family: 'Teko', sans-serif;
                }
                
                .profile-actions {
                    display: flex;
                    gap: 15px;
                }
                
                .profile-btn {
                    flex: 1;
                    padding: 15px;
                    background: rgba(0, 255, 136, 0.1);
                    border: 1px solid #00ff88;
                    color: #00ff88;
                    font-family: 'Orbitron', sans-serif;
                    font-weight: 700;
                    cursor: pointer;
                    transition: 0.3s;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                
                .profile-btn:hover {
                    background: #00ff88;
                    color: #000;
                }
                
                .profile-btn.danger {
                    background: rgba(255, 0, 85, 0.1);
                    border-color: #ff0055;
                    color: #ff0055;
                }
                
                .profile-btn.danger:hover {
                    background: #ff0055;
                    color: #fff;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @media (max-width: 768px) {
                    .profile-modal {
                        padding: 30px 20px;
                    }
                    
                    .profile-stats {
                        grid-template-columns: 1fr;
                        gap: 15px;
                    }
                    
                    .profile-actions {
                        flex-direction: column;
                    }
                }
                </style>
            `;

            document.head.insertAdjacentHTML('beforeend', styles);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 3. GAMING CURSOR SYSTEM (Crosshair + Trail) - ⚡ FASTER SPEED
    // ═══════════════════════════════════════════════════════════════════════════
    const CursorSystem = {
        dot: null,
        circle: null,
        trail: null,
        mouseX: 0,
        mouseY: 0,
        dotX: 0,
        dotY: 0,
        circleX: 0,
        circleY: 0,

        init() {
            this.dot = document.querySelector('.cursor-dot');
            this.circle = document.querySelector('.cursor-circle');
            this.trail = document.querySelector('.cursor-trail');

            if (!this.dot || !this.circle) return;

            // Mouse move tracking
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            });

            // Smooth animation loop
            this.animate();

            // Hover effects
            this.initHoverEffects();

            // Click effect
            document.addEventListener('mousedown', () => {
                document.body.classList.add('cursor-click');
            });

            document.addEventListener('mouseup', () => {
                document.body.classList.remove('cursor-click');
            });
        },

        animate() {
            // ⚡ FASTER SPEED - Increased from 0.15 to 0.35 for dot, 0.08 to 0.20 for circle
            this.dotX += (this.mouseX - this.dotX) * 0.35;
            this.dotY += (this.mouseY - this.dotY) * 0.35;

            this.circleX += (this.mouseX - this.circleX) * 0.20;
            this.circleY += (this.mouseY - this.circleY) * 0.20;

            if (this.dot) {
                this.dot.style.transform = `translate(${this.dotX}px, ${this.dotY}px)`;
            }

            if (this.circle) {
                this.circle.style.transform = `translate(${this.circleX}px, ${this.circleY}px)`;
            }

            requestAnimationFrame(() => this.animate());
        },

        initHoverEffects() {
            const hoverElements = document.querySelectorAll(
                'a, button, .player-card, .product-item, input, textarea, select, .slider-btn, .menu-link'
            );

            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    document.body.classList.add('cursor-hover');
                });

                el.addEventListener('mouseleave', () => {
                    document.body.classList.remove('cursor-hover');
                });
            });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 4. HERO SLIDER (Advanced with Indicators)
    // ═══════════════════════════════════════════════════════════════════════════
    const HeroSlider = {
        slides: [],
        indicators: [],
        currentIndex: 0,
        interval: null,
        autoplayDelay: 7000,

        init() {
            this.slides = document.querySelectorAll('.slide');
            this.indicators = document.querySelectorAll('.indicator');

            if (this.slides.length === 0) return;

            // Navigation buttons
            const nextBtn = document.getElementById('nextSlide') || document.querySelector('.next-btn');
            const prevBtn = document.getElementById('prevSlide') || document.querySelector('.prev-btn');

            if (nextBtn) nextBtn.addEventListener('click', () => this.next());
            if (prevBtn) prevBtn.addEventListener('click', () => this.previous());

            // Indicator clicks
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goTo(index));
            });

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') this.next();
                if (e.key === 'ArrowLeft') this.previous();
            });

            // Touch swipe support
            this.initSwipe();

            // Start autoplay
            this.startAutoplay();

            // Update counter
            this.updateCounter();
        },

        goTo(index) {
            this.slides[this.currentIndex].classList.remove('active');
            if (this.indicators[this.currentIndex]) {
                this.indicators[this.currentIndex].classList.remove('active');
            }

            this.currentIndex = index;

            this.slides[this.currentIndex].classList.add('active');
            if (this.indicators[this.currentIndex]) {
                this.indicators[this.currentIndex].classList.add('active');
            }

            this.updateCounter();
            this.resetAutoplay();
        },

        next() {
            let nextIndex = this.currentIndex + 1;
            if (nextIndex >= this.slides.length) nextIndex = 0;
            this.goTo(nextIndex);
        },

        previous() {
            let prevIndex = this.currentIndex - 1;
            if (prevIndex < 0) prevIndex = this.slides.length - 1;
            this.goTo(prevIndex);
        },

        startAutoplay() {
            this.interval = setInterval(() => this.next(), this.autoplayDelay);
        },

        resetAutoplay() {
            clearInterval(this.interval);
            this.startAutoplay();
        },

        updateCounter() {
            const currentEl = document.getElementById('current-slide');
            const totalEl = document.getElementById('total-slides');

            if (currentEl) {
                currentEl.textContent = `0${this.currentIndex + 1}`;
            }

            if (totalEl && totalEl.textContent === '03') {
                totalEl.textContent = `0${this.slides.length}`;
            }
        },

        initSwipe() {
            let startX = 0;
            let endX = 0;

            const sliderSection = document.querySelector('.hero-slider-section');
            if (!sliderSection) return;

            sliderSection.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            sliderSection.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;

                if (startX - endX > 50) this.next();
                if (endX - startX > 50) this.previous();
            });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 5. PLAYER CARDS 3D TILT EFFECT
    // ═══════════════════════════════════════════════════════════════════════════
    const PlayerCards = {
        init() {
            const cards = document.querySelectorAll('.player-card');

            cards.forEach(card => {
                const cardInner = card.querySelector('.card-inner');
                if (!cardInner) return;

                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = ((y - centerY) / centerY) * -20;
                    const rotateY = ((x - centerX) / centerX) * 20;

                    cardInner.style.transform = `
                        perspective(1500px) 
                        rotateX(${rotateX}deg) 
                        rotateY(${rotateY}deg) 
                        scale3d(1.05, 1.05, 1.05)
                    `;
                });

                card.addEventListener('mouseleave', () => {
                    cardInner.style.transform = `
                        perspective(1500px) 
                        rotateX(0deg) 
                        rotateY(0deg) 
                        scale3d(1, 1, 1)
                    `;
                });
            });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 6. HEADER SCROLL EFFECT
    // ═══════════════════════════════════════════════════════════════════════════
    const Header = {
        element: null,

        init() {
            this.element = document.getElementById('mainHeader') || document.querySelector('.main-header');
            if (!this.element) return;

            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    this.element.classList.add('scrolled');
                } else {
                    this.element.classList.remove('scrolled');
                }
            });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 7. MOBILE MENU SYSTEM
    // ═══════════════════════════════════════════════════════════════════════════
    const MobileMenu = {
        toggle: null,
        overlay: null,
        closeBtn: null,
        isOpen: false,

        init() {
            this.toggle = document.getElementById('mobileToggle');
            this.overlay = document.getElementById('mobileOverlay');
            this.closeBtn = document.getElementById('mobileClose');

            if (!this.toggle || !this.overlay) return;

            // Toggle button
            this.toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });

            // Close button
            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', () => this.close());
            }

            // Close on link click
            const links = this.overlay.querySelectorAll('.mobile-link');
            links.forEach(link => {
                link.addEventListener('click', () => this.close());
            });

            // Close on outside click
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) this.close();
            });

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) this.close();
            });
        },

        toggleMenu() {
            this.isOpen ? this.close() : this.open();
        },

        open() {
            this.overlay.classList.add('active');
            this.toggle.classList.add('active');
            this.toggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            this.isOpen = true;
        },

        close() {
            this.overlay.classList.remove('active');
            this.toggle.classList.remove('active');
            this.toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = 'auto';
            this.isOpen = false;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 8. COUNTDOWN TIMER
    // ═══════════════════════════════════════════════════════════════════════════
    const CountdownTimer = {
        deadline: null,
        elements: {
            days: null,
            hours: null,
            minutes: null,
            seconds: null
        },

        init() {
            // Set deadline (2 days, 14 hours from now)
            this.deadline = new Date(Date.now() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000));

            // Get elements
            this.elements.days = document.getElementById('days');
            this.elements.hours = document.getElementById('hours');
            this.elements.minutes = document.getElementById('minutes');
            this.elements.seconds = document.getElementById('seconds');

            // Check if any element exists
            if (!this.elements.days && !this.elements.hours) return;

            // Update immediately
            this.update();

            // Update every second
            setInterval(() => this.update(), 1000);
        },

        update() {
            const now = new Date().getTime();
            const distance = this.deadline - now;

            if (distance < 0) {
                this.displayZero();
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (this.elements.days) this.elements.days.textContent = this.pad(days);
            if (this.elements.hours) this.elements.hours.textContent = this.pad(hours);
            if (this.elements.minutes) this.elements.minutes.textContent = this.pad(minutes);
            if (this.elements.seconds) this.elements.seconds.textContent = this.pad(seconds);
        },

        pad(num) {
            return num < 10 ? `0${num}` : num;
        },

        displayZero() {
            Object.values(this.elements).forEach(el => {
                if (el) el.textContent = '00';
            });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 9. AUDIO SYSTEM
    // ═══════════════════════════════════════════════════════════════════════════
    const AudioSystem = {
        audio: null,
        btn: null,
        icon: null,
        isPlaying: false,

        init() {
            this.audio = document.getElementById('bg-music');
            this.btn = document.getElementById('soundBtn');
            this.icon = document.getElementById('soundIcon');

            if (!this.audio || !this.btn) return;

            // Set initial volume
            this.audio.volume = 0.3;

            // Load user preference
            const savedPref = UserProfile.data.preferences.soundEnabled;
            if (savedPref) {
                this.play();
            }

            // Toggle button
            this.btn.addEventListener('click', () => this.toggle());

            // Try auto-play on first user interaction
            document.body.addEventListener('click', () => {
                if (!this.isPlaying && UserProfile.data.preferences.soundEnabled) {
                    this.play();
                }
            }, { once: true });
        },

        play() {
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.updateIcon();
                UserProfile.updatePreference('soundEnabled', true);
            }).catch(err => {
                console.log('Audio autoplay prevented:', err);
            });
        },

        pause() {
            this.audio.pause();
            this.isPlaying = false;
            this.updateIcon();
            UserProfile.updatePreference('soundEnabled', false);
        },

        toggle() {
            this.isPlaying ? this.pause() : this.play();
        },

        updateIcon() {
            if (!this.icon) return;

            if (this.isPlaying) {
                this.icon.classList.remove('fa-volume-xmark');
                this.icon.classList.add('fa-volume-high');
            } else {
                this.icon.classList.remove('fa-volume-high');
                this.icon.classList.add('fa-volume-xmark');
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 10. SCROLL TO TOP BUTTON
    // ═══════════════════════════════════════════════════════════════════════════
    const ScrollToTop = {
        btn: null,

        init() {
            this.btn = document.getElementById('scrollToTop') || document.querySelector('.scroll-to-top');
            if (!this.btn) return;

            // Show/hide on scroll
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    this.btn.classList.add('visible');
                } else {
                    this.btn.classList.remove('visible');
                }
            });

            // Click to scroll
            this.btn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 11. NEWSLETTER FORM
    // ═══════════════════════════════════════════════════════════════════════════
    const Newsletter = {
        init() {
            const form = document.getElementById('newsletterForm');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const input = form.querySelector('input[type="email"]');
                const email = input.value.trim();

                if (this.validateEmail(email)) {
                    this.subscribe(email);
                    input.value = '';
                } else {
                    this.showMessage('Please enter a valid email address', 'error');
                }
            });
        },

        validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        subscribe(email) {
            console.log('Subscribing:', email);
            this.showMessage('Successfully subscribed! 🎉', 'success');
        },

        showMessage(text, type) {
            alert(text);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // 12. SMOOTH SCROLL FOR ANCHOR LINKS
    // ═══════════════════════════════════════════════════════════════════════════
    const SmoothScroll = {
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href === '#' || href === '#profile') return;

                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // MAIN INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════
    function init() {
        console.log('🎮 Initializing NEXUS ESPORTS v4.7...');

        // Initialize User Profile FIRST
        UserProfile.init();

        // Initialize all systems
        SplashScreen.init();
        SignupSystem.init();
        CursorSystem.init(); // ⚡ NOW WITH FASTER CURSOR SPEED
        Header.init();
        MobileMenu.init();
        HeroSlider.init();
        PlayerCards.init();
        CountdownTimer.init();
        AudioSystem.init();
        ScrollToTop.init();
        Newsletter.init();
        SmoothScroll.init();

        console.log('✅ All systems operational!');
        console.log(`📊 User: ${UserProfile.data.username || 'Guest'} | Visit #${UserProfile.data.visitCount}`);
        console.log('⚡ Cursor speed: FAST MODE ENABLED');
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DOM READY
    // ═══════════════════════════════════════════════════════════════════════════
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // GLOBAL HELPER (For testing)
    // ═══════════════════════════════════════════════════════════════════════════
    window.SECC = {
        getProfile: () => {
            console.log('Current Profile:', UserProfile.data);
            return UserProfile.data;
        },
        resetProfile: () => {
            UserProfile.reset();
            alert('✅ Profile reset! Your data has been cleared.');
            location.reload();
        }
    };



/* ═══════════════════════════════════════════════════════════════════════════════
   END OF JAVASCRIPT - v4.7
   
   ⚡ CURSOR SPEED INCREASED BY 2.3x
   ✅ DOT: 0.15 → 0.35 (133% faster)
   ✅ CIRCLE: 0.08 → 0.20 (150% faster)
   ✅ SPLASH SCREEN WORKS ON EVERY VISIT
   📊 USER PROFILE SYSTEM FULLY FUNCTIONAL
   
   Console Commands:
   - SECC.getProfile()     // View user data
   - SECC.resetProfile()   // Reset profile data
═══════════════════════════════════════════════════════════════════════════════ */
// ═══════════════════════════════════════════════════════════════════════════
// 3. NAVIGATION SYSTEM
// ═══════════════════════════════════════════════════════════════════════════
const NavigationSystem = {
    init() {
        this.highlightActiveLink();
    },

    highlightActiveLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .menu-link, .navbar-link'); // Adjust selectors as needed based on common classes

        navLinks.forEach(link => {
            // Remove existing active classes first
            link.classList.remove('active');

            const href = link.getAttribute('href');
            if (href && href === currentPath) {
                link.classList.add('active');
            }
        });
    }
};

// Initialize systems on load
window.addEventListener('DOMContentLoaded', () => {
    UserProfile.init();
    SplashScreen.init();
    SignupSystem.init();
    NavigationSystem.init();
});



})();
