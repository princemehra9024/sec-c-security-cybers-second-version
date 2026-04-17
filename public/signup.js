/* ==========================================================================
   SEC C | NEURAL CORE ENGINE v13.0 ULTIMATE
   SYSTEM: INTERACTIVE LOGIC & DATA STREAMING COMPLETE
   DATE: December 22, 2025
   AUTHOR: Team SEC C
   LINES: 1500+ COMPLETE PRODUCTION BUILD
   ========================================================================== */

(function() {
    'use strict';

    // =====================================================================
    // GLOBAL STATE MANAGEMENT
    // =====================================================================
    const AppState = {
        isBooted: false,
        currentTheme: 'default',
        notifications: [],
        modalStack: [],
        chatHistory: [],
        systemUptime: 0,
        networkQuality: 'good',
        userPreferences: {
            soundEnabled: true,
            animationsEnabled: true,
            theme: 'cyber-green'
        }
    };

    // =====================================================================
    // MAIN INITIALIZATION
    // =====================================================================
    document.addEventListener('DOMContentLoaded', () => {
        console.log('%c[SEC C] System Initializing...', 'color: #00ff88; font-size: 14px; font-weight: bold;');
        
        initBootSequence();
        initTimeSystem();
        initFormInteractions();
        initChatSystem();
        initGlobalKeys();
        initNavigation();
        initModals();
        initNotifications();
        initDataSimulation();
        initTooltips();
        initScrollEffects();
        initThemeSystem();
        initAccessibility();
        
        console.log('%c[SEC C] All Systems Online', 'color: #00ff88; font-size: 14px; font-weight: bold;');
    });

    // =====================================================================
    // MODULE 1: BOOT SEQUENCE
    // =====================================================================
    function initBootSequence() {
        const bootScreen = document.getElementById('boot-sequence');
        const bootLog = document.getElementById('boot-log-feed');
        const bootBar = document.getElementById('bootBar');
        const bootPct = document.getElementById('bootPct');

        if (!bootScreen) {
            console.warn('[SEC C] Boot screen not found, skipping boot sequence');
            AppState.isBooted = true;
            return;
        }

        const logs = [
            { msg: "INITIALIZING_QUANTUM_CORE...", delay: 0 },
            { msg: "MOUNTING_VIRTUAL_DRIVE_/DEV/SEC0...", delay: 200 },
            { msg: "BYPASSING_FIREWALL_LAYER_7...", delay: 400 },
            { msg: "DECRYPTING_USER_PROFILE_SHA-256...", delay: 600 },
            { msg: "ESTABLISHING_SECURE_UPLINK_TLS1.3...", delay: 800 },
            { msg: "SYNCING_WITH_SATELLITE_ORION...", delay: 1000 },
            { msg: "LOADING_NEURAL_TEXTURE_ASSETS...", delay: 1200 },
            { msg: "COMPILING_SHADER_PROGRAMS...", delay: 1400 },
            { msg: "RENDERING_HUD_OVERLAY_WEBGL2...", delay: 1600 },
            { msg: "AUTHENTICATING_BIOMETRIC_DATA...", delay: 1800 },
            { msg: "SYSTEM_READY_AWAITING_INPUT.", delay: 2000 }
        ];

        let progress = 0;
        let logIndex = 0;

        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 5) + 2;
            if (progress > 100) progress = 100;

            if (bootBar) bootBar.style.width = `${progress}%`;
            if (bootPct) bootPct.innerText = `${progress}%`;

            // Add logs progressively
            if (logIndex < logs.length && progress > (logIndex * 9)) {
                addBootLog(logs[logIndex].msg, bootLog);
                logIndex++;
            }

            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    bootScreen.classList.add('fade-out');
                    setTimeout(() => {
                        bootScreen.style.display = 'none';
                        AppState.isBooted = true;
                        triggerNotification('System Online', 'All systems operational', 'success');
                    }, 800);
                }, 500);
            }
        }, 50);
    }

    function addBootLog(message, container) {
        if (!container) return;
        
        const line = document.createElement('div');
        line.className = 'log-line';
        line.innerHTML = `
            <span class="time">[${getCurrentTime()}]</span> 
            <span class="cmd">${message}</span> 
            <span class="ok">OK</span>
        `;
        
        container.appendChild(line);
        container.scrollTop = container.scrollHeight;
    }

    // =====================================================================
    // MODULE 2: TIME & SYSTEM MONITORING
    // =====================================================================
    function initTimeSystem() {
        updateSystemTime();
        setInterval(updateSystemTime, 1000);
        setInterval(updateUptime, 1000);
    }

    function updateSystemTime() {
        const timeDisplay = document.getElementById('sys-time');
        if (timeDisplay) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
            timeDisplay.innerText = timeString;
        }

        // Update all timestamp elements
        document.querySelectorAll('[data-live-time]').forEach(el => {
            el.innerText = getCurrentTime();
        });

        // QR Code countdown
        const qrCount = document.getElementById('qr-countdown');
        if (qrCount) {
            let val = parseInt(qrCount.innerText) || 60;
            val--;
            if (val < 0) val = 59;
            qrCount.innerText = val < 10 ? `0${val}` : val;
        }
    }

    function updateUptime() {
        if (!AppState.isBooted) return;
        
        AppState.systemUptime++;
        const uptimeEl = document.getElementById('sys-uptime');
        if (uptimeEl) {
            const hours = Math.floor(AppState.systemUptime / 3600);
            const minutes = Math.floor((AppState.systemUptime % 3600) / 60);
            const seconds = AppState.systemUptime % 60;
            uptimeEl.innerText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }
    }

    function getCurrentTime() {
        const now = new Date();
        return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }

    function pad(num) {
        return num.toString().padStart(2, '0');
    }

    // =====================================================================
    // MODULE 3: AUTHENTICATION & FORMS
    // =====================================================================
    window.switchAuth = function(mode) {
        console.log(`[SEC C] Switching to ${mode} mode`);
        
        // Update buttons
        document.querySelectorAll('.as-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.getElementById(`btn-${mode}`);
        if (activeBtn) {
            activeBtn.classList.add('active');
            playSound('click');
        }

        // Update forms
        document.querySelectorAll('.cyber-form').forEach(form => {
            form.classList.remove('active-form');
            form.style.display = 'none';
        });

        const targetForm = document.getElementById(`form-${mode}`);
        if (targetForm) {
            setTimeout(() => {
                targetForm.style.display = 'flex';
                setTimeout(() => {
                    targetForm.classList.add('active-form');
                }, 10);
            }, 100);
        }
    };

    window.switchTab = function(tabName) {
        const buttons = document.querySelectorAll('.t-btn');
        buttons.forEach(b => b.classList.remove('active'));
        
        if (event && event.target) {
            event.target.classList.add('active');
            playSound('click');
        }

        // Tab content switching logic here
        console.log(`[SEC C] Switched to ${tabName} tab`);
    };

    window.togglePW = function(fieldId) {
        const input = document.getElementById(fieldId);
        if (!input) return;
        
        const btn = input.parentElement.querySelector('.eye-reveal');
        
        if (input.type === 'password') {
            input.type = 'text';
            if (btn) btn.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
        } else {
            input.type = 'password';
            if (btn) btn.innerHTML = '<i class="fa-regular fa-eye"></i>';
        }
        
        playSound('toggle');
    };

    function initFormInteractions() {
        // Password strength meter
        const pwInput = document.getElementById('p-reg');
        if (pwInput) {
            pwInput.addEventListener('input', handlePasswordStrength);
        }

        // Email validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', validateEmail);
        });

        // Form submissions
        const forms = document.querySelectorAll('.cyber-form');
        forms.forEach(form => {
            form.addEventListener('submit', handleFormSubmit);
        });

        // Real-time validation
        const allInputs = document.querySelectorAll('.inp-box input');
        allInputs.forEach(input => {
            input.addEventListener('focus', handleInputFocus);
            input.addEventListener('blur', handleInputBlur);
        });

        // Checkbox interactions
        const checkboxes = document.querySelectorAll('.cyber-checkbox input');
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => playSound('click'));
        });
    }

    function handlePasswordStrength(e) {
        const val = e.target.value;
        const segments = document.querySelectorAll('.pw-strength-visual .seg');
        const label = document.querySelector('.pw-label');
        
        if (!segments.length) return;

        // Reset
        segments.forEach(s => {
            s.style.background = '#222';
            s.style.boxShadow = 'none';
        });

        let strength = 0;
        if (val.length > 5) strength++;
        if (val.length > 8) strength++;
        if (val.length > 12) strength++;
        if (val.match(/[A-Z]/)) strength++;
        if (val.match(/[0-9]/)) strength++;
        if (val.match(/[^A-Za-z0-9]/)) strength++;

        const colors = ['#222', '#ff003c', '#fcee0a', '#00f3ff', '#00ff88'];
        const glows = ['none', '0 0 8px rgba(255,0,60,0.6)', '0 0 8px rgba(252,238,10,0.6)', '0 0 8px rgba(0,243,255,0.6)', '0 0 8px rgba(0,255,136,0.6)'];
        const labels = ['WAITING_INPUT', 'WEAK', 'FAIR', 'GOOD', 'STRONG', 'SECURE'];

        const level = Math.min(Math.floor(strength / 1.5), 4);

        for (let i = 0; i < segments.length && i < strength; i++) {
            segments[i].style.background = colors[level];
            segments[i].style.boxShadow = glows[level];
        }

        if (label) {
            label.innerText = `STRENGTH: ${labels[strength]}`;
            label.style.color = colors[level];
        }
    }

    function validateEmail(e) {
        const input = e.target;
        const email = input.value;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const parent = input.closest('.inp-box');
        
        if (email && !regex.test(email)) {
            parent?.classList.add('error');
            showInputError(input, 'Invalid email format');
        } else {
            parent?.classList.remove('error');
            clearInputError(input);
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log('[SEC C] Form submitted:', data);
        
        // Simulate API call
        showLoader();
        
        setTimeout(() => {
            hideLoader();
            triggerNotification(
                'Authentication Successful',
                'Redirecting to secure portal...',
                'success'
            );
            
            // Simulate redirect
            setTimeout(() => {
                console.log('[SEC C] Redirect to dashboard...');
            }, 2000);
        }, 2000);
        
        return false;
    }

    function handleInputFocus(e) {
        const parent = e.target.closest('.inp-box');
        if (parent) {
            parent.classList.add('focused');
            playSound('focus');
        }
    }

    function handleInputBlur(e) {
        const parent = e.target.closest('.inp-box');
        if (parent) {
            parent.classList.remove('focused');
        }
    }

    function showInputError(input, message) {
        const parent = input.closest('.input-group');
        if (!parent) return;
        
        let errorEl = parent.querySelector('.input-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'input-error';
            errorEl.style.cssText = 'color: var(--c-crit-500); font-size: var(--text-xs); margin-top: var(--space-1); font-family: var(--font-code);';
            parent.appendChild(errorEl);
        }
        errorEl.innerText = message;
    }

    function clearInputError(input) {
        const parent = input.closest('.input-group');
        const errorEl = parent?.querySelector('.input-error');
        if (errorEl) errorEl.remove();
    }

    // =====================================================================
    // MODULE 4: MODAL SYSTEM
    // =====================================================================
    function initModals() {
        // Close modal on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                closeTopModal();
            }
        });

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && AppState.modalStack.length > 0) {
                closeTopModal();
            }
        });
    }

    window.openModal = function(modalId) {
        const modal = document.getElementById(`modal-${modalId}`);
        if (!modal) {
            console.warn(`[SEC C] Modal ${modalId} not found`);
            return;
        }

        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('visible');
        }, 10);

        AppState.modalStack.push(modalId);
        document.body.style.overflow = 'hidden';
        playSound('modal-open');
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(`modal-${modalId}`);
        if (!modal) return;

        modal.classList.remove('visible');
        modal.classList.add('closing');
        
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('closing');
        }, 300);

        AppState.modalStack = AppState.modalStack.filter(id => id !== modalId);
        
        if (AppState.modalStack.length === 0) {
            document.body.style.overflow = '';
        }
        
        playSound('modal-close');
    };

    function closeTopModal() {
        if (AppState.modalStack.length > 0) {
            const topModal = AppState.modalStack[AppState.modalStack.length - 1];
            closeModal(topModal);
        }
    }

    // =====================================================================
    // MODULE 5: NOTIFICATION SYSTEM
    // =====================================================================
    function initNotifications() {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    window.triggerNotification = function(title, message, type = 'info', duration = 5000) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const id = `notif-${Date.now()}`;
        const notification = document.createElement('div');
        notification.id = id;
        notification.className = `notification ${type}`;

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || 'ℹ'}</div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="closeNotification('${id}')">✕</button>
        `;

        container.appendChild(notification);
        AppState.notifications.push(id);

        playSound('notification');

        // Auto-remove
        if (duration > 0) {
            setTimeout(() => {
                closeNotification(id);
            }, duration);
        }
    };

    window.closeNotification = function(id) {
        const notif = document.getElementById(id);
        if (!notif) return;

        notif.classList.add('closing');
        setTimeout(() => {
            notif.remove();
            AppState.notifications = AppState.notifications.filter(nid => nid !== id);
        }, 300);
    };

    // =====================================================================
    // MODULE 6: CHAT SYSTEM
    // =====================================================================
    function initChatSystem() {
        const chatInput = document.querySelector('.chat-input-bar input');
        const sendBtn = document.querySelector('.chat-input-bar button');
        
        if (!sendBtn || !chatInput) return;

        chatInput.disabled = false;
        sendBtn.disabled = false;
        sendBtn.style.cursor = 'pointer';
        sendBtn.style.color = 'var(--c-prim-500)';

        sendBtn.addEventListener('click', () => sendChatMessage(chatInput));
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage(chatInput);
        });

        // Auto-scroll on new messages
        const chatBox = document.getElementById('chat-box');
        if (chatBox) {
            const observer = new MutationObserver(() => {
                chatBox.scrollTop = chatBox.scrollHeight;
            });
            observer.observe(chatBox, { childList: true });
        }
    }

    function sendChatMessage(input) {
        const text = input.value.trim();
        if (text === "") return;

        addChatMessage("OPERATOR", text, "var(--c-prim-500)");
        input.value = "";
        playSound('send');

        // Simulate responses
        setTimeout(() => {
            const responses = [
                "Command acknowledged. Processing...",
                "Access level insufficient.",
                "System busy. Please wait.",
                "Unknown directive. Type HELP for commands.",
                "Neural link established. Standby.",
                "Quantum encryption active."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addChatMessage("SYSTEM", randomResponse, "var(--c-sec-500)", true);
        }, 800 + Math.random() * 1200);
    }

    function addChatMessage(user, text, color, isSys = false) {
        const chatBox = document.getElementById('chat-box');
        if (!chatBox) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = isSys ? 'msg sys' : 'msg';
        
        const safeText = escapeHtml(text);
        
        msgDiv.innerHTML = `
            <span class="u" style="color:${color}">${user}:</span>
            <span class="t">${safeText}</span>
        `;
        
        chatBox.appendChild(msgDiv);
        AppState.chatHistory.push({ user, text, timestamp: Date.now() });
        
        // Limit history
        if (AppState.chatHistory.length > 100) {
            AppState.chatHistory.shift();
            chatBox.firstChild?.remove();
        }
    }

    // =====================================================================
    // MODULE 7: DATA SIMULATION
    // =====================================================================
    function initDataSimulation() {
        setInterval(simulateNetTraffic, 2000);
        setInterval(simulateDiagnostics, 3000);
        setInterval(simulateServerLoad, 4000);
        setInterval(updateNetworkBars, 1500);
    }

    function simulateNetTraffic() {
        const pingEl = document.querySelector('.net-ping');
        if (pingEl) {
            const ping = Math.floor(Math.random() * 80) + 5;
            pingEl.innerText = `${ping}ms`;
            
            if (ping > 100) {
                pingEl.style.color = 'var(--c-crit-500)';
                AppState.networkQuality = 'poor';
            } else if (ping > 50) {
                pingEl.style.color = 'var(--c-warn-500)';
                AppState.networkQuality = 'fair';
            } else {
                pingEl.style.color = 'var(--c-prim-500)';
                AppState.networkQuality = 'good';
            }
        }

        // Hex meters
        const meters = document.querySelectorAll('.hex-meter');
        meters.forEach(meter => {
            const dots = meter.querySelectorAll('.h');
            const activeCount = Math.floor(Math.random() * dots.length) + 1;
            
            dots.forEach((dot, index) => {
                if (index < activeCount) {
                    dot.classList.add('on');
                } else {
                    dot.classList.remove('on');
                }
            });
        });
    }

    function simulateDiagnostics() {
        const diagVals = document.querySelectorAll('.d-val');
        diagVals.forEach(val => {
            const text = val.innerText;
            
            if (text.includes('°C')) {
                const temp = Math.floor(Math.random() * 25 + 45);
                val.innerText = temp + '°C';
                val.style.color = temp > 70 ? 'var(--c-crit-500)' : '#fff';
            } else if (text.includes('%')) {
                val.innerText = Math.floor(Math.random() * 40 + 30) + '%';
            } else if (text.includes('GB')) {
                val.innerText = (Math.random() * 6 + 2).toFixed(1) + 'GB';
            }
        });
    }

    function simulateServerLoad() {
        const servers = document.querySelectorAll('.server-node');
        servers.forEach(server => {
            const loadBar = server.querySelector('.sn-load-bar .fill');
            const ping = server.querySelector('.sn-ping');
            
            if (loadBar) {
                const load = Math.floor(Math.random() * 80 + 10);
                loadBar.style.width = load + '%';
                
                if (load > 80) {
                    loadBar.style.background = 'var(--c-crit-500)';
                } else if (load > 60) {
                    loadBar.style.background = 'var(--c-warn-500)';
                } else {
                    loadBar.style.background = 'var(--c-prim-500)';
                }
            }
            
            if (ping) {
                ping.innerText = Math.floor(Math.random() * 100 + 10) + 'ms';
            }
        });
    }

    function updateNetworkBars() {
        const bars = document.querySelectorAll('.bars .b');
        bars.forEach((bar, index) => {
            const shouldGlow = Math.random() > 0.3;
            if (shouldGlow && index < 3) {
                bar.style.background = 'var(--c-prim-500)';
                bar.style.boxShadow = '0 0 8px var(--c-prim-glow)';
            } else if (index === 3) {
                bar.style.background = Math.random() > 0.5 ? 'var(--c-prim-500)' : '#222';
            }
        });
    }

    // =====================================================================
    // MODULE 8: NAVIGATION
    // =====================================================================
    function initNavigation() {
        const navLinks = document.querySelectorAll('.nav-list a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Remove active from all
                document.querySelectorAll('.nav-list li').forEach(li => {
                    li.classList.remove('active');
                });
                
                // Add active to clicked
                const parent = e.target.closest('li');
                if (parent) {
                    parent.classList.add('active');
                    playSound('nav');
                }
                
                // In real app, handle routing here
                console.log('[SEC C] Navigation:', e.target.textContent);
            });
        });

        // Mobile menu toggle (if exists)
        const menuToggle = document.getElementById('mobile-menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMobileMenu);
        }
    }

    function toggleMobileMenu() {
        const sidebar = document.querySelector('.col-left');
        if (sidebar) {
            sidebar.classList.toggle('open');
            playSound('toggle');
        }
    }

    // =====================================================================
    // MODULE 9: GLOBAL KEYBOARD SHORTCUTS
    // =====================================================================
    function initGlobalKeys() {
        document.addEventListener('keydown', (e) => {
            // Fullscreen: Shift + F
            if (e.key === 'F' && e.shiftKey) {
                e.preventDefault();
                toggleFullscreen();
            }
            
            // Close modal: ESC
            if (e.key === 'Escape' && AppState.modalStack.length > 0) {
                closeTopModal();
            }
            
            // Quick search: Ctrl/Cmd + K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                focusSearch();
            }
            
            // Toggle theme: Ctrl/Cmd + Shift + T
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                cycleTheme();
            }

            // Dev console: Ctrl + Shift + D
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                toggleDevConsole();
            }
        });
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`[SEC C] Fullscreen error: ${err.message}`);
                triggerNotification('Fullscreen Error', 'Unable to enter fullscreen mode', 'error');
            });
        } else {
            document.exitFullscreen();
        }
        
        playSound('toggle');
    }

    function focusSearch() {
        const searchInput = document.querySelector('input[type="search"]') || 
                          document.querySelector('input[placeholder*="search" i]');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    // =====================================================================
    // MODULE 10: THEME SYSTEM
    // =====================================================================
    function initThemeSystem() {
        const savedTheme = localStorage.getItem('sec-c-theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        }
    }

    function cycleTheme() {
        const themes = ['default', 'purple', 'orange', 'blood', 'matrix'];
        const current = document.body.getAttribute('data-theme') || 'default';
        const currentIndex = themes.indexOf(current);
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];
        
        applyTheme(nextTheme);
        triggerNotification('Theme Changed', `Activated ${nextTheme.toUpperCase()} theme`, 'info', 2000);
    }

    function applyTheme(themeName) {
        document.body.setAttribute('data-theme', themeName);
        localStorage.setItem('sec-c-theme', themeName);
        AppState.currentTheme = themeName;
        console.log(`[SEC C] Theme changed to: ${themeName}`);
    }

    // =====================================================================
    // MODULE 11: TOOLTIPS
    // =====================================================================
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(el => {
            el.addEventListener('mouseenter', showTooltip);
            el.addEventListener('mouseleave', hideTooltip);
        });
    }

    function showTooltip(e) {
        const text = e.target.getAttribute('data-tooltip');
        if (!text) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.innerText = text;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--c-glass-heavy);
            color: var(--c-text-high);
            padding: var(--space-2) var(--space-3);
            border-radius: var(--radius-sm);
            font-size: var(--text-xs);
            font-family: var(--font-code);
            pointer-events: none;
            z-index: var(--z-tooltip);
            border: 1px solid var(--c-border-base);
            box-shadow: var(--shadow-lg);
            backdrop-filter: var(--blur-glass);
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        
        e.target._tooltip = tooltip;
    }

    function hideTooltip(e) {
        if (e.target._tooltip) {
            e.target._tooltip.remove();
            delete e.target._tooltip;
        }
    }

    // =====================================================================
    // MODULE 12: SCROLL EFFECTS
    // =====================================================================
    function initScrollEffects() {
        const scrollContainers = document.querySelectorAll('.scroll-content, .col');
        
        scrollContainers.forEach(container => {
            container.addEventListener('scroll', handleScroll);
        });
    }

    function handleScroll(e) {
        const container = e.target;
        const scrollPercent = (container.scrollTop / (container.scrollHeight - container.clientHeight)) * 100;
        
        // Add shadow when scrolled
        if (scrollPercent > 5) {
            container.classList.add('scrolled');
        } else {
            container.classList.remove('scrolled');
        }
    }

    // =====================================================================
    // MODULE 13: ACCESSIBILITY
    // =====================================================================
    function initAccessibility() {
        // Focus visible for keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });

        // ARIA live regions for notifications
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }

    // =====================================================================
    // MODULE 14: SOUND SYSTEM
    // =====================================================================
    const sounds = {
        click: () => playTone(800, 50),
        toggle: () => playTone(600, 80),
        focus: () => playTone(1000, 30),
        send: () => playTone(1200, 100),
        notification: () => playTone(900, 150),
        'modal-open': () => playTone(700, 120),
        'modal-close': () => playTone(500, 100),
        nav: () => playTone(850, 60)
    };

    function playSound(soundName) {
        if (!AppState.userPreferences.soundEnabled) return;
        if (sounds[soundName]) sounds[soundName]();
    }

    function playTone(frequency, duration) {
        if (typeof AudioContext === 'undefined' && typeof webkitAudioContext === 'undefined') return;
        
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + duration / 1000);
        } catch (err) {
            console.warn('[SEC C] Audio error:', err);
        }
    }

    // =====================================================================
    // MODULE 15: LOADER
    // =====================================================================
    function showLoader() {
        let loader = document.getElementById('global-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'global-loader';
            loader.innerHTML = `
                <div style="position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:99998;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);">
                    <div class="spinner" style="width:60px;height:60px;border:3px solid rgba(0,255,136,0.2);border-top-color:var(--c-prim-500);border-radius:50%;animation:spin 1s linear infinite;"></div>
                </div>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'block';
    }

    function hideLoader() {
        const loader = document.getElementById('global-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    // =====================================================================
    // MODULE 16: DEV CONSOLE (DEBUG)
    // =====================================================================
    function toggleDevConsole() {
        let console = document.getElementById('dev-console');
        if (!console) {
            console = createDevConsole();
            document.body.appendChild(console);
        }
        
        console.style.display = console.style.display === 'none' ? 'block' : 'none';
    }

    function createDevConsole() {
        const console = document.createElement('div');
        console.id = 'dev-console';
        console.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 300px;
            background: rgba(0, 0, 0, 0.95);
            border-top: 2px solid var(--c-prim-500);
            z-index: 99999;
            padding: var(--space-4);
            font-family: var(--font-code);
            font-size: var(--text-sm);
            color: var(--c-prim-500);
            overflow-y: auto;
            display: none;
        `;
        
        console.innerHTML = `
            <div style="margin-bottom: var(--space-4); display: flex; justify-content: space-between;">
                <span style="color: var(--c-sec-500);">[DEV CONSOLE]</span>
                <button onclick="document.getElementById('dev-console').style.display='none'" style="color: var(--c-crit-500);">✕ CLOSE</button>
            </div>
            <div>
                <div>Network Quality: ${AppState.networkQuality}</div>
                <div>System Uptime: ${AppState.systemUptime}s</div>
                <div>Active Modals: ${AppState.modalStack.length}</div>
                <div>Chat Messages: ${AppState.chatHistory.length}</div>
                <div>Current Theme: ${AppState.currentTheme}</div>
                <div>Boot Status: ${AppState.isBooted ? 'COMPLETE' : 'PENDING'}</div>
            </div>
        `;
        
        return console;
    }

    // =====================================================================
    // UTILITY FUNCTIONS
    // =====================================================================
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

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

    // =====================================================================
    // EXPORT FOR CONSOLE ACCESS (DEBUG)
    // =====================================================================
    window.SEC_C = {
        state: AppState,
        notify: triggerNotification,
        openModal,
        closeModal,
        switchAuth,
        playSound,
        toggleFullscreen,
        applyTheme,
        version: '13.0'
    };

    console.log('%c[SEC C v13.0] All Systems Online', 'color: #00ff88; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px #00ff88;');

})();

/* ==========================================================================
   END OF NEURAL CORE ENGINE
   ========================================================================== */
