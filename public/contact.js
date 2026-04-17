'use strict';

/**
 * ============================================================================
 *  PRINCE MEHRA - CONTACT TERMINAL v7.0 ULTIMATE ENHANCED
 *  Cyberpunk Portfolio with Advanced Effects System
 *  Date: December 22, 2025
 *  Author: Team SEC C
 *  
 *  FEATURES v7.0:
 *  - Enhanced glass break physics
 *  - Advanced particle system
 *  - Holographic overlays
 *  - Performance monitoring
 *  - Touch gesture support
 *  - Sound system
 *  - Advanced animations
 *  - FIXED: Boot screen transition issue
 * ============================================================================
 */


// ============================================================================
//  GLOBAL VARIABLES & DOM CACHE
// ============================================================================
const bootScreen = document.getElementById('boot-screen');
const bootBar = document.getElementById('boot-bar');
const memTest = document.getElementById('mem-test');
const bootStatus = document.getElementById('boot-status');
const body = document.body;

const canvas = document.getElementById("matrix-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const sendBtn = document.getElementById('sendBtn');
const btnText = document.querySelector('.btn-text');
const glitchOverlay = document.getElementById('glitch-overlay');
const systemCrack = document.getElementById('system-crack');

const openMenuBtn = document.getElementById('openMenuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const mobileOverlay = document.getElementById('mobileOverlay');
const backTopBtn = document.querySelector(".back-top-btn");
const header = document.querySelector('.header');

// Performance tracking
const performanceMetrics = {
    fps: 0,
    lastTime: performance.now(),
    frames: 0
};


// ============================================================================
//  EMERGENCY FAILSAFE - AUTO HIDE BOOT SCREEN AFTER 8 SECONDS
// ============================================================================
setTimeout(() => {
    if (bootScreen && !bootScreen.classList.contains('hidden')) {
        console.warn('⚠ Boot screen auto-hide triggered (failsafe)');
        hideBootScreen();
    }
}, 8000);


// ============================================================================
//  SKIP BOOT SCREEN ON ESC KEY
// ============================================================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bootScreen && !bootScreen.classList.contains('hidden')) {
        console.log('🔓 Boot screen skipped by user');
        hideBootScreen();
    }
});


// ============================================================================
//  1. ENHANCED BIOS BOOT SEQUENCE (FIXED)
// ============================================================================
window.addEventListener('load', () => {
    console.log('🚀 Page loaded, starting boot sequence...');
    
    if (!bootScreen) {
        console.warn('⚠ Boot screen element not found');
        return;
    }

    body.style.overflow = 'hidden';

    // A. Memory Test Counter with realistic acceleration
    let memCount = 0;
    const memTarget = 65536000;
    const memIncrement = 32768;
    
    const memInterval = setInterval(() => {
        memCount += memIncrement * (1 + Math.random() * 0.5);
        if (memTest) {
            memTest.innerText = Math.floor(memCount).toLocaleString();
            memTest.style.color = memCount > memTarget * 0.8 ? '#0f0' : '#ffcc00';
        }

        if (memCount >= memTarget) {
            clearInterval(memInterval);
            if (memTest) memTest.style.color = '#0f0';
        }
    }, 6);

    // B. Enhanced Progress Bar with realistic loading phases
    let width = 0;
    let phase = 0; // FIXED: Start at 0 instead of 1
    const phases = [
        { end: 30, speed: 25, text: "LOADING CORE MODULES..." },
        { end: 60, speed: 35, text: "INITIALIZING NETWORK..." },
        { end: 85, speed: 40, text: "MOUNTING FILE SYSTEMS..." },
        { end: 100, speed: 20, text: "FINALIZING BOOT..." }
    ];
    
    const barInterval = setInterval(() => {
        const currentPhase = phases[phase];
        
        if (width >= currentPhase.end) {
            phase++;
            if (phase >= phases.length) { // FIXED: Changed condition
                clearInterval(barInterval);
                clearInterval(memInterval); // Clean up memory interval
                
                if (bootStatus) {
                    bootStatus.innerText = "✓ SYSTEM READY. INITIALIZING SHELL...";
                    bootStatus.style.color = "#0f0";
                }

                console.log('✅ Boot sequence complete, hiding screen...');
                
                // Hide boot screen after 800ms
                setTimeout(() => {
                    hideBootScreen();
                }, 800);
                return;
            }
        }
        
        if (bootStatus && phases[phase]) {
            bootStatus.innerText = phases[phase].text;
            bootStatus.style.color = "#ffcc00";
        }
        
        width += (Math.random() * 0.5 + 0.5);
        if (bootBar) bootBar.style.width = Math.min(width, currentPhase.end) + '%';
    }, phases[phase].speed);
});


// ============================================================================
//  HIDE BOOT SCREEN FUNCTION (SIMPLIFIED & FIXED)
// ============================================================================
function hideBootScreen() {
    if (!bootScreen) {
        console.warn('⚠ Boot screen element not found in hideBootScreen()');
        return;
    }
    
    console.log('🔄 Hiding boot screen...');
    
    bootScreen.style.opacity = '0';
    bootScreen.style.transition = 'opacity 0.8s ease';

    setTimeout(() => {
        bootScreen.style.display = 'none';
        bootScreen.classList.add('hidden');
        body.style.overflow = 'auto';
        
        console.log('✅ Boot screen hidden successfully!');
        
        // Initialize other features
        try {
            initMatrixRain();
            console.log('✅ Matrix rain initialized');
        } catch (e) {
            console.warn('⚠ Matrix rain error:', e);
        }
        
        try {
            initScrollAnimations();
            console.log('✅ Scroll animations initialized');
        } catch (e) {
            console.warn('⚠ Scroll animations error:', e);
        }
        
        try {
            initParticleSystem();
            console.log('✅ Particle system initialized');
        } catch (e) {
            console.warn('⚠ Particle system error:', e);
        }
        
        try {
            initHolographicOverlay();
            console.log('✅ Holographic overlay initialized');
        } catch (e) {
            console.warn('⚠ Holographic overlay error:', e);
        }
        
        try {
            init3DTilt();
            console.log('✅ 3D Tilt initialized');
        } catch (e) {
            console.warn('⚠ 3D Tilt error:', e);
        }
        
        try {
            initStatsCounter();
            console.log('✅ Stats counter initialized');
        } catch (e) {
            console.warn('⚠ Stats counter error:', e);
        }
        
    }, 800);
}


// ============================================================================
//  2. ENHANCED MATRIX RAIN WITH PERFORMANCE OPTIMIZATION
// ============================================================================
let matrixAnimationId;
let matrixColumns = [];

function initMatrixRain() {
    if (!ctx) {
        console.warn('⚠ Canvas context not found');
        return;
    }

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    window.addEventListener('resize', debounce(() => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        matrixColumns = Array(Math.floor(w / 20) + 1).fill(0);
    }, 250));

    const cols = Math.floor(w / 20) + 1;
    matrixColumns = Array(cols).fill(0);
    
    const chars = '01アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*';

    function drawMatrix() {
        // Semi-transparent black for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, w, h);

        // Draw characters
        ctx.font = '15pt monospace';
        
        matrixColumns.forEach((y, ind) => {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = ind * 20;
            
            // Gradient effect for leading character
            const gradient = ctx.createLinearGradient(x, y - 20, x, y);
            gradient.addColorStop(0, '#0f0');
            gradient.addColorStop(1, '#003300');
            ctx.fillStyle = gradient;
            
            ctx.fillText(char, x, y);

            // Random reset for column
            if (y > h + Math.random() * 10000) {
                matrixColumns[ind] = 0;
            } else {
                matrixColumns[ind] = y + 20;
            }
        });

        matrixAnimationId = requestAnimationFrame(drawMatrix);
    }

    drawMatrix();
}

// Pause matrix when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden && matrixAnimationId) {
        cancelAnimationFrame(matrixAnimationId);
        console.log('⏸ Matrix paused');
    } else if (!document.hidden && ctx) {
        initMatrixRain();
        console.log('▶ Matrix resumed');
    }
});


// ============================================================================
//  3. 🔥 ULTRA ENHANCED GLASS BREAK SYSTEM 🔥
// ============================================================================

class GlassBreakEffect {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.options = {
            shardCount: window.innerWidth < 768 ? 20 : 35,
            crackCount: 15,
            sparkCount: 10,
            particleCount: 40,
            ...options
        };
        this.overlay = null;
        this.soundEnabled = true;
    }

    create() {
        this.createOverlay();
        this.createImpactFlash();
        this.createSoundWaves();
        this.createCracks();
        this.createShards();
        this.createSparks();
        this.createParticles();
        this.createReflections();
        this.createDistortionWave();
        this.createVignette();
        this.createChromaShift();
        this.playSound();
        this.cleanup();
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'glass-break-overlay active';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 20002;
            pointer-events: none;
        `;
        document.body.appendChild(this.overlay);
    }

    createImpactFlash() {
        const flash = this.createElement('div', 'glass-impact', `
            position: absolute;
            left: ${this.x}px;
            top: ${this.y}px;
            width: 120px;
            height: 120px;
            background: radial-gradient(circle, rgba(255,255,255,1), rgba(0,255,255,0.5), transparent);
            border-radius: 50%;
            animation: impact-flash 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            transform: translate(-50%, -50%);
        `);
        this.overlay.appendChild(flash);
    }

    createSoundWaves() {
        for (let i = 0; i < 4; i++) {
            const wave = this.createElement('div', 'sound-wave', `
                position: absolute;
                left: ${this.x}px;
                top: ${this.y}px;
                width: 60px;
                height: 60px;
                border: 2px solid rgba(0,255,255,${0.9 - i * 0.2});
                border-radius: 50%;
                animation: wave-expand ${0.8 + i * 0.1}s ease-out;
                animation-delay: ${i * 0.08}s;
                transform: translate(-50%, -50%);
            `);
            this.overlay.appendChild(wave);
        }
    }

    createCracks() {
        for (let i = 0; i < this.options.crackCount; i++) {
            const angle = (360 / this.options.crackCount) * i + (Math.random() - 0.5) * 30;
            const length = 120 + Math.random() * 200;
            const branches = Math.floor(Math.random() * 3);
            
            const crack = this.createElement('div', 'crack-line', `
                position: absolute;
                left: ${this.x}px;
                top: ${this.y}px;
                background: linear-gradient(90deg, 
                    transparent, 
                    rgba(255,255,255,${0.7 + Math.random() * 0.3}), 
                    transparent);
                height: ${1 + Math.random()}px;
                transform-origin: left center;
                transform: rotate(${angle}deg);
                animation: crack-spread ${0.3 + Math.random() * 0.2}s ease-out forwards;
                --crack-length: ${length}px;
                box-shadow: 0 0 3px rgba(255,255,255,0.6);
                width: 0;
            `);
            this.overlay.appendChild(crack);
            
            // Create branch cracks
            for (let j = 0; j < branches; j++) {
                const branchAngle = angle + (Math.random() - 0.5) * 60;
                const branchLength = length * (0.3 + Math.random() * 0.4);
                const branchStart = length * (0.3 + Math.random() * 0.4);
                
                const branch = this.createElement('div', 'crack-line', `
                    position: absolute;
                    left: ${this.x + Math.cos(angle * Math.PI / 180) * branchStart}px;
                    top: ${this.y + Math.sin(angle * Math.PI / 180) * branchStart}px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
                    height: 1px;
                    transform-origin: left center;
                    transform: rotate(${branchAngle}deg);
                    animation: crack-spread ${0.2 + Math.random() * 0.15}s ease-out forwards;
                    animation-delay: ${0.1 + j * 0.05}s;
                    --crack-length: ${branchLength}px;
                    width: 0;
                `);
                this.overlay.appendChild(branch);
            }
        }
    }

    createShards() {
        for (let i = 0; i < this.options.shardCount; i++) {
            const angle = Math.random() * 360;
            const distance = 180 + Math.random() * 350;
            const size = 15 + Math.random() * 45;
            const rotation = Math.random() * 1080 - 540;
            
            const tx = Math.cos(angle * Math.PI / 180) * distance;
            const ty = Math.sin(angle * Math.PI / 180) * distance;
            
            const shardType = Math.floor(Math.random() * 3);
            let clipPath;
            
            switch(shardType) {
                case 0:
                    clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
                    break;
                case 1:
                    clipPath = 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)';
                    break;
                case 2:
                    clipPath = 'polygon(0% 0%, 100% 0%, 75% 100%, 25% 100%)';
                    break;
            }
            
            const shard = this.createElement('div', 'glass-shard', `
                position: absolute;
                left: ${this.x}px;
                top: ${this.y}px;
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(
                    ${Math.random() * 180}deg,
                    rgba(255,255,255,${0.85 + Math.random() * 0.15}),
                    rgba(200,255,255,${0.7 + Math.random() * 0.2}),
                    rgba(150,220,255,${0.5 + Math.random() * 0.3})
                );
                box-shadow: 
                    0 0 ${5 + Math.random() * 10}px rgba(255,255,255,${0.4 + Math.random() * 0.3}),
                    inset 0 0 ${3 + Math.random() * 5}px rgba(255,255,255,0.8),
                    ${Math.random() * 10 - 5}px ${5 + Math.random() * 15}px ${10 + Math.random() * 20}px rgba(0,0,0,${0.2 + Math.random() * 0.2});
                clip-path: ${clipPath};
                animation: glass-shatter ${1.2 + Math.random() * 0.6}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                animation-delay: ${Math.random() * 0.15}s;
                --tx: ${tx}px;
                --ty: ${ty}px;
                --rot: ${rotation}deg;
                opacity: 1;
            `);
            this.overlay.appendChild(shard);
        }
    }

    createSparks() {
        for (let i = 0; i < this.options.sparkCount; i++) {
            const angle = (360 / this.options.sparkCount) * i + Math.random() * 40;
            const length = 25 + Math.random() * 60;
            const color = Math.random() > 0.5 ? '0,255,255' : '0,255,0';
            
            const spark = this.createElement('div', 'electric-spark', `
                position: absolute;
                left: ${this.x}px;
                top: ${this.y}px;
                width: ${1 + Math.random()}px;
                height: ${length}px;
                background: linear-gradient(
                    180deg,
                    rgba(${color},1),
                    rgba(${color},${0.4 + Math.random() * 0.3}),
                    transparent
                );
                transform-origin: top center;
                transform: rotate(${angle}deg);
                animation: spark-flash ${0.25 + Math.random() * 0.15}s ease-out forwards;
                animation-delay: ${i * 0.04}s;
                box-shadow: 0 0 ${8 + Math.random() * 8}px rgba(${color},1);
                filter: blur(${Math.random() * 0.5}px);
                opacity: 1;
            `);
            this.overlay.appendChild(spark);
        }
    }

    createParticles() {
        for (let i = 0; i < this.options.particleCount; i++) {
            const size = 1 + Math.random() * 7;
            const px = (Math.random() - 0.5) * 700;
            const py = Math.random() * 600 + 150;
            const color = Math.random() > 0.7 ? 'rgba(0,255,255,0.9)' : 'rgba(255,255,255,0.8)';
            
            const particle = this.createElement('div', 'glass-particle', `
                position: absolute;
                left: ${this.x}px;
                top: ${this.y}px;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: particle-fall ${1 + Math.random() * 0.5}s ease-out forwards;
                animation-delay: ${Math.random() * 0.25}s;
                box-shadow: 0 0 ${3 + Math.random() * 5}px ${color};
                --px: ${px}px;
                --py: ${py}px;
                opacity: 1;
            `);
            this.overlay.appendChild(particle);
        }
    }

    createReflections() {
        for (let i = 0; i < 6; i++) {
            const angle = Math.random() * 360;
            const length = 80 + Math.random() * 80;
            
            const reflection = this.createElement('div', 'glass-reflection', `
                position: absolute;
                left: ${this.x}px;
                top: ${this.y}px;
                width: ${length}px;
                height: ${2 + Math.random()}px;
                background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(255,255,255,${0.85 + Math.random() * 0.15}),
                    transparent
                );
                transform-origin: center;
                transform: rotate(${angle}deg) translate(-50%, -50%);
                animation: reflection-flash ${0.3 + Math.random() * 0.2}s ease-out forwards;
                animation-delay: ${i * 0.08}s;
                box-shadow: 0 0 ${8 + Math.random() * 8}px rgba(255,255,255,0.8);
                filter: blur(${0.5 + Math.random()}px);
                opacity: 0;
            `);
            this.overlay.appendChild(reflection);
        }
    }

    createDistortionWave() {
        const wave = this.createElement('div', 'distortion-wave', `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(
                circle at ${this.x}px ${this.y}px,
                rgba(0,255,0,0.25),
                rgba(0,255,255,0.15) 30%,
                transparent 60%
            );
            animation: wave-pulse 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            opacity: 0;
        `);
        this.overlay.appendChild(wave);
    }

    createVignette() {
        const vignette = this.createElement('div', 'break-vignette', `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(
                circle,
                transparent 25%,
                rgba(0,0,0,0.6) 100%
            );
            animation: vignette-pulse 1.2s ease-out;
            opacity: 0;
        `);
        this.overlay.appendChild(vignette);
    }

    createChromaShift() {
        const chroma = this.createElement('div', 'chromatic-split', `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            animation: chromatic-shift 0.6s ease-out;
            mix-blend-mode: screen;
        `);
        this.overlay.appendChild(chroma);
    }

    createElement(tag, className, styles) {
        const el = document.createElement(tag);
        el.className = className;
        el.style.cssText = styles;
        return el;
    }

    playSound() {
        if (!this.soundEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create white noise for glass break
            const bufferSize = audioContext.sampleRate * 0.3;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const output = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                output[i] = (Math.random() * 2 - 1) * Math.exp(-i / bufferSize * 10);
            }
            
            const whiteNoise = audioContext.createBufferSource();
            whiteNoise.buffer = buffer;
            
            const gainNode = audioContext.createGain();
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            whiteNoise.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            whiteNoise.start();
        } catch (error) {
            console.warn('⚠ Audio playback not supported:', error);
        }
    }

    cleanup() {
        setTimeout(() => {
            if (this.overlay) {
                this.overlay.style.opacity = '0';
                this.overlay.style.transition = 'opacity 0.5s';
                setTimeout(() => this.overlay.remove(), 500);
            }
        }, 2000);
    }
}

function createGlassShatterEffect(x, y, options) {
    const effect = new GlassBreakEffect(x, y, options);
    effect.create();
    
    // Screen shake
    document.body.style.animation = 'screen-shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 600);
}


// ============================================================================
//  4. ENHANCED FORM SUBMISSION WITH ALL EFFECTS
// ============================================================================
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        
        if (!validateForm()) return;

        sendBtn.disabled = true;
        
        if (btnText) btnText.innerText = "UPLOADING_PAYLOAD...";
        sendBtn.style.background = "#ff3333";
        sendBtn.style.borderColor = "#ff3333";
        
        if (formStatus) {
            formStatus.innerText = "> ESTABLISHING_SECURE_CONNECTION...";
            formStatus.style.color = "#ffcc00";
        }

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let json = await response.json();
            
            if (response.status == 200) {
                triggerUltimateHackerSuccess();
            } else {
                handleFormError(json.message || "Unknown error");
            }
        })
        .catch(error => {
            console.error('Network Error:', error);
            handleFormError("NETWORK_FAILURE: CHECK_CONNECTION");
        });
    });
}

function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    const validations = [
        { element: name, check: () => name && name.value.trim(), error: 'NAME_REQUIRED' },
        { element: email, check: () => email && email.value.trim(), error: 'EMAIL_REQUIRED' },
        { element: email, check: () => isValidEmail(email.value), error: 'INVALID_EMAIL_FORMAT' },
        { element: message, check: () => message && message.value.trim(), error: 'MESSAGE_REQUIRED' },
        { element: message, check: () => message.value.length >= 10, error: 'MESSAGE_TOO_SHORT (min 10 chars)' }
    ];
    
    for (let validation of validations) {
        if (!validation.check()) {
            showError(validation.error);
            validation.element?.focus();
            return false;
        }
    }
    
    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(msg) {
    if (formStatus) {
        formStatus.innerHTML = `<span style="color: #ff3333;">⚠ ERROR: ${msg}</span>`;
        
        // Shake the form
        contactForm.style.animation = 'shake 0.4s';
        setTimeout(() => {
            contactForm.style.animation = '';
        }, 400);
        
        setTimeout(() => {
            formStatus.innerText = "";
        }, 4000);
    }
}

function handleFormError(message) {
    if (formStatus) {
        formStatus.innerHTML = `<span style="color: #ff3333;">⚠ ${message}</span>`;
    }
    if (btnText) btnText.innerText = "RETRY_EXECUTION()";
    sendBtn.style.background = "";
    sendBtn.style.borderColor = "";
    sendBtn.disabled = false;
}

function triggerUltimateHackerSuccess() {
    // Calculate multiple impact points
    const impacts = [
        { x: window.innerWidth / 2, y: window.innerHeight / 2 },
        { x: window.innerWidth * 0.3, y: window.innerHeight * 0.3 },
        { x: window.innerWidth * 0.7, y: window.innerHeight * 0.7 }
    ];
    
    // Trigger glass breaks in sequence
    impacts.forEach((point, index) => {
        setTimeout(() => {
            createGlassShatterEffect(point.x, point.y, {
                shardCount: 25 - (index * 5),
                crackCount: 12 - (index * 2)
            });
        }, index * 300);
    });
    
    // Original effects
    if (glitchOverlay) glitchOverlay.classList.add('active');
    if (systemCrack) systemCrack.classList.add('active');
    
    // Status update with typing effect
    if (formStatus) {
        formStatus.innerHTML = '';
        typeWriter(formStatus, "> PAYLOAD_DELIVERED. SYSTEM_COMPROMISED.", 40);
        formStatus.style.color = "#0f0";
    }
    
    // Create success particles
    createSuccessParticles();
    
    // Cleanup and reset
    setTimeout(() => {
        if (glitchOverlay) glitchOverlay.classList.remove('active');
        if (systemCrack) systemCrack.classList.remove('active');
        
        contactForm.reset();
        
        if (btnText) btnText.innerText = "✓ SYSTEM_HACKED";
        sendBtn.style.background = "#0f0";
        sendBtn.style.borderColor = "#0f0";
        sendBtn.style.color = "#000";
        
        if (formStatus) {
            formStatus.innerHTML = `
                <span class='hacked-success'>
                    >> ROOT_ACCESS_GRANTED <<
                    <br>
                    >> MESSAGE_TRANSMITTED_SUCCESSFULLY <<
                </span>
            `;
        }
        
        setTimeout(() => {
            if (btnText) btnText.innerText = "EXECUTE_SEND()";
            sendBtn.style.background = "";
            sendBtn.style.borderColor = "";
            sendBtn.style.color = "";
            if (formStatus) formStatus.innerHTML = "";
            sendBtn.disabled = false;
        }, 5000);
        
    }, 1800);
}

function createSuccessParticles() {
    const particleCount = 50;
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10000;
    `;
    document.body.appendChild(container);
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight;
        const size = 3 + Math.random() * 5;
        const duration = 2 + Math.random() * 2;
        const delay = Math.random() * 0.5;
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: #0f0;
            border-radius: 50%;
            box-shadow: 0 0 10px #0f0;
            animation: float-up ${duration}s ease-out ${delay}s forwards;
        `;
        container.appendChild(particle);
    }
    
    setTimeout(() => container.remove(), 5000);
}


// ============================================================================
//  5. MOBILE NAVIGATION ENHANCED
// ============================================================================
if (openMenuBtn && closeMenuBtn && mobileOverlay) {
    openMenuBtn.addEventListener('click', () => {
        mobileOverlay.classList.add('active');
        body.style.overflow = 'hidden';
        openMenuBtn.classList.add('active');
        openMenuBtn.setAttribute('aria-expanded', 'true');
        
        // Add stagger animation to menu items
        const menuLinks = mobileOverlay.querySelectorAll('.mobile-links li');
        menuLinks.forEach((link, index) => {
            link.style.animation = `slide-in-right 0.3s ease-out ${index * 0.1}s forwards`;
            link.style.opacity = '0';
        });
    });

    closeMenuBtn.addEventListener('click', closeMobileMenu);

    // Close on link click
    const mobileLinks = document.querySelectorAll('.mobile-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileOverlay.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close on backdrop click
    mobileOverlay.addEventListener('click', (e) => {
        if (e.target === mobileOverlay) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    if (!mobileOverlay) return;
    
    mobileOverlay.classList.remove('active');
    body.style.overflow = 'auto';
    if (openMenuBtn) {
        openMenuBtn.classList.remove('active');
        openMenuBtn.setAttribute('aria-expanded', 'false');
    }
}


// ============================================================================
//  6. ENHANCED HEADER SCROLL EFFECT
// ============================================================================
let lastScroll = 0;

if (header) {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleHeaderScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function handleHeaderScroll() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
        header.style.transform = 'translateY(0)';
    } else {
        header.classList.remove('scrolled');
    }
    
    // Hide header on scroll down, show on scroll up
    if (currentScroll > 300) {
        if (currentScroll > lastScroll && !header.classList.contains('header-hidden')) {
            header.classList.add('header-hidden');
            header.style.transform = 'translateY(-100%)';
        } else if (currentScroll < lastScroll && header.classList.contains('header-hidden')) {
            header.classList.remove('header-hidden');
            header.style.transform = 'translateY(0)';
        }
    }
    
    lastScroll = currentScroll;
}


// ============================================================================
//  7. BACK TO TOP BUTTON ENHANCED
// ============================================================================
if (backTopBtn) {
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY >= 500) {
            backTopBtn.classList.add('active');
        } else {
            backTopBtn.classList.remove('active');
        }
    }, 100));

    backTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// ============================================================================
//  8. 3D TILT EFFECT ENHANCED
// ============================================================================
function init3DTilt() {
    if (typeof VanillaTilt !== "undefined") {
        // Tilt cards
        const tiltCards = document.querySelectorAll(".cyber-card, .contact-card");
        if (tiltCards.length > 0) {
            VanillaTilt.init(tiltCards, {
                max: 15,
                speed: 400,
                glare: true,
                "max-glare": 0.3,
                scale: 1.05,
                perspective: 1000,
                transition: true,
                reset: true,
                gyroscope: true,
                gyroscopeMinAngleX: -45,
                gyroscopeMaxAngleX: 45
            });
        }

        // Terminal wrapper
        const terminalWrapper = document.querySelector(".terminal-wrapper");
        if (terminalWrapper) {
            VanillaTilt.init(terminalWrapper, {
                max: 8,
                speed: 300,
                glare: true,
                "max-glare": 0.15,
                scale: 1.02,
                transition: true,
                reset: true,
                gyroscope: true
            });
        }
    } else {
        console.warn('⚠ VanillaTilt not loaded');
    }
}

// Initialize after small delay
setTimeout(init3DTilt, 1000);


// ============================================================================
//  9. SCROLL REVEAL ANIMATIONS
// ============================================================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll(
        '.cyber-card, .form-wrapper-outer, .map-interface, .footer-top, .section-title-wrapper, .stat-card'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}


// ============================================================================
//  10. TYPING EFFECT ENHANCED
// ============================================================================
function typeWriter(element, text, speed = 50, callback) {
    if (!element) return;
    
    let i = 0;
    element.textContent = '';
    element.style.borderRight = '2px solid #0f0';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.style.borderRight = 'none';
            if (callback) callback();
        }
    }
    
    type();
}

// Auto-type hero header
window.addEventListener('load', () => {
    setTimeout(() => {
        const glitchHeader = document.querySelector('.glitch-header');
        if (glitchHeader) {
            const originalText = glitchHeader.getAttribute('data-text') || glitchHeader.textContent;
            glitchHeader.textContent = '';
            typeWriter(glitchHeader, originalText, 80);
        }
    }, 3500);
});


// ============================================================================
//  11. PARTICLE SYSTEM (NEW)
// ============================================================================
let particleAnimationId;
const particles = [];

function initParticleSystem() {
    const particleContainer = document.querySelector('.particle-container');
    if (!particleContainer) {
        console.warn('⚠ Particle container not found');
        return;
    }
    
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particleContainer);
    }
    
    animateParticles();
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    
    const size = Math.random() * 4 + 1;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const speedX = (Math.random() - 0.5) * 0.5;
    const speedY = (Math.random() - 0.5) * 0.5;
    const opacity = Math.random() * 0.5 + 0.2;
    
    particle.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: ${Math.random() > 0.5 ? '#0f0' : '#0ff'};
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        opacity: ${opacity};
        pointer-events: none;
        box-shadow: 0 0 ${size * 2}px currentColor;
        z-index: 1;
    `;
    
    container.appendChild(particle);
    
    particles.push({
        element: particle,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        size: size
    });
}

function animateParticles() {
    particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around screen
        if (particle.x > window.innerWidth) particle.x = 0;
        if (particle.x < 0) particle.x = window.innerWidth;
        if (particle.y > window.innerHeight) particle.y = 0;
        if (particle.y < 0) particle.y = window.innerHeight;
        
        particle.element.style.left = particle.x + 'px';
        particle.element.style.top = particle.y + 'px';
    });
    
    particleAnimationId = requestAnimationFrame(animateParticles);
}

// Pause particles when tab hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden && particleAnimationId) {
        cancelAnimationFrame(particleAnimationId);
    } else if (!document.hidden && particles.length > 0) {
        animateParticles();
    }
});


// ============================================================================
//  12. HOLOGRAPHIC OVERLAY (NEW)
// ============================================================================
function initHolographicOverlay() {
    const holoOverlay = document.querySelector('.holographic-overlay');
    if (!holoOverlay) {
        console.warn('⚠ Holographic overlay not found');
        return;
    }
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', throttle((e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        const xPercent = (mouseX / window.innerWidth) * 100;
        const yPercent = (mouseY / window.innerHeight) * 100;
        
        holoOverlay.style.background = `
            radial-gradient(
                circle at ${xPercent}% ${yPercent}%,
                rgba(0, 255, 0, 0.03),
                rgba(0, 255, 255, 0.02) 30%,
                transparent 60%
            )
        `;
    }, 50));
}


// ============================================================================
//  13. STATS COUNTER ANIMATION (NEW)
// ============================================================================
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) {
        console.warn('⚠ No stat numbers found');
        return;
    }
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}


// ============================================================================
//  14. CURSOR TRAIL EFFECT (Desktop)
// ============================================================================
let lastCursorUpdate = 0;

if (window.innerWidth >= 768) {
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastCursorUpdate < 20) return;
        lastCursorUpdate = now;

        createTrailDot(e.clientX, e.clientY);
    });
}

function createTrailDot(x, y) {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail-dot';
    dot.style.cssText = `
        position: fixed;
        width: 5px;
        height: 5px;
        background: rgba(0, 255, 0, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${x}px;
        top: ${y}px;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px rgba(0, 255, 0, 0.8);
    `;
    
    document.body.appendChild(dot);
    
    setTimeout(() => {
        dot.style.transition = 'opacity 0.5s, transform 0.5s';
        dot.style.opacity = '0';
        dot.style.transform = 'translate(-50%, -50%) scale(0)';
        
        setTimeout(() => dot.remove(), 500);
    }, 50);
}


// ============================================================================
//  15. FORM INPUT ENHANCEMENTS
// ============================================================================
const inputFields = document.querySelectorAll('.input-field, .textarea');

inputFields.forEach(input => {
    // Focus effects
    input.addEventListener('focus', () => {
        const wrapper = input.closest('.input-box') || input.closest('.textarea-box');
        if (wrapper) {
            wrapper.style.borderColor = 'var(--neon-green, #0f0)';
            wrapper.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.3)';
        }
    });
    
    input.addEventListener('blur', () => {
        const wrapper = input.closest('.input-box') || input.closest('.textarea-box');
        if (wrapper) {
            wrapper.style.borderColor = '';
            wrapper.style.boxShadow = '';
        }
    });
    
    // Character counter for textarea
    if (input.tagName === 'TEXTAREA') {
        input.addEventListener('input', () => {
            const maxLength = 500;
            const currentLength = input.value.length;
            
            let counter = input.parentElement.querySelector('.char-counter');
            
            if (!counter) {
                counter = document.createElement('div');
                counter.className = 'char-counter';
                counter.style.cssText = `
                    text-align: right; 
                    font-size: 1.2rem; 
                    color: #666; 
                    margin-top: 8px;
                    font-family: var(--font-mono, monospace);
                `;
                input.parentElement.appendChild(counter);
            }
            
            counter.textContent = `${currentLength} / ${maxLength} characters`;
            counter.style.color = currentLength > maxLength * 0.9 ? '#ff3333' : '#666';
        });
    }
});


// ============================================================================
//  16. PERFORMANCE OPTIMIZATION UTILITIES
// ============================================================================
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

const handleResize = debounce(() => {
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Reinitialize tilt
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(el => {
        if (el.vanillaTilt) {
            el.vanillaTilt.destroy();
        }
    });
    init3DTilt();
}, 250);

window.addEventListener('resize', handleResize);


// ============================================================================
//  17. EASTER EGGS & CONSOLE ART
// ============================================================================
console.log('%c 🔒 SECURE TERMINAL ACCESS 🔒 ', 'background: #0f0; color: #000; font-size: 24px; font-weight: bold; padding: 15px;');
console.log('%c ═══════════════════════════════════════════════════════════ ', 'color: #0f0; font-size: 14px;');
console.log('%c System: PRINCE_MEHRA_PORTFOLIO_v7.0_ULTIMATE ', 'background: #000; color: #0f0; font-size: 16px; padding: 8px; font-family: monospace;');
console.log('%c Status: OPERATIONAL | Glass Break: ACTIVE | Particles: ENABLED ', 'background: #000; color: #0ff; font-size: 14px; padding: 8px;');
console.log('%c ═══════════════════════════════════════════════════════════ ', 'color: #0f0; font-size: 14px;');
console.log('%c 💡 Developer Tips: ', 'color: #ffcc00; font-size: 14px; font-weight: bold;');
console.log('%c - Try the Konami Code for a surprise! ', 'color: #888; font-size: 12px;');
console.log('%c - Press ESC to skip boot screen ', 'color: #888; font-size: 12px;');
console.log('%c - Type "help()" in console for more commands ', 'color: #888; font-size: 12px;');

// Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-konamiSequence.length);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateKonamiMode();
    }
});

function activateKonamiMode() {
    console.log('%c 🎮 KONAMI CODE ACTIVATED! ULTIMATE MODE ENGAGED! 🎮 ', 'background: #f0f; color: #fff; font-size: 20px; padding: 10px; font-weight: bold;');
    
    // Multiple glass breaks
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createGlassShatterEffect(x, y, {
                shardCount: 30,
                crackCount: 15,
                sparkCount: 12
            });
        }, i * 400);
    }
    
    // Rainbow animation
    body.style.animation = 'rainbow-hue 3s infinite';
    
    // Add rainbow keyframes
    if (!document.getElementById('rainbow-anim')) {
        const style = document.createElement('style');
        style.id = 'rainbow-anim';
        style.textContent = `
            @keyframes rainbow-hue {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Reset after 10 seconds
    setTimeout(() => {
        body.style.animation = '';
        const rainbowStyle = document.getElementById('rainbow-anim');
        if (rainbowStyle) rainbowStyle.remove();
    }, 10000);
}

// Console commands
window.help = function() {
    console.log('%c 📋 AVAILABLE COMMANDS: ', 'color: #0f0; font-size: 16px; font-weight: bold;');
    console.log('%c contact() - Get contact information ', 'color: #0ff; font-size: 12px;');
    console.log('%c skills() - View tech stack ', 'color: #0ff; font-size: 12px;');
    console.log('%c glassBreak() - Trigger glass break effect ', 'color: #0ff; font-size: 12px;');
    console.log('%c skipBoot() - Skip boot screen ', 'color: #0ff; font-size: 12px;');
};

window.contact = function() {
    console.log('%c 📧 CONTACT INFO: ', 'color: #0f0; font-size: 14px; font-weight: bold;');
    console.log('Email: princemehra9024@gmail.com');
    console.log('Phone: +91 90245 46041');
    console.log('LinkedIn: linkedin.com/in/prince-mehra-562681366/');
};

window.skills = function() {
    console.log('%c 💻 TECH STACK: ', 'color: #0f0; font-size: 14px; font-weight: bold;');
    console.log('Frontend: React.js, HTML, CSS, JavaScript, Flutter');
    console.log('Backend: Node.js, PHP, Python, Firebase');
    console.log('Database: MongoDB, PostgreSQL, MySQL');
    console.log('Tools: Git, Docker, VS Code, Figma');
};

window.glassBreak = function() {
    createGlassShatterEffect(window.innerWidth / 2, window.innerHeight / 2);
};

window.skipBoot = function() {
    hideBootScreen();
};


// ============================================================================
//  18. PAGE VISIBILITY API
// ============================================================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('%c ⏸ Tab hidden - Performance optimized ', 'background: #ffcc00; color: #000; padding: 5px;');
    } else {
        console.log('%c ▶ Tab visible - Animations resumed ', 'background: #0f0; color: #000; padding: 5px;');
    }
});


// ============================================================================
//  19. SMOOTH ANCHOR SCROLLING
// ============================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
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


// ============================================================================
//  20. ACCESSIBILITY ENHANCEMENTS
// ============================================================================
const skipLink = document.createElement('a');
skipLink.href = '#main';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
    position: absolute;
    top: -100px;
    left: 10px;
    background: #0f0;
    color: #000;
    padding: 10px 15px;
    z-index: 100000;
    border-radius: 4px;
    font-weight: bold;
    transition: top 0.3s;
    text-decoration: none;
`;
skipLink.addEventListener('focus', () => {
    skipLink.style.top = '10px';
});
skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-100px';
});
document.body.insertBefore(skipLink, document.body.firstChild);


// ============================================================================
//  21. FPS MONITOR (DEV MODE - add ?debug to URL)
// ============================================================================
function initFPSMonitor() {
    if (window.location.search.includes('debug')) {
        const fpsDisplay = document.createElement('div');
        fpsDisplay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #0f0;
            padding: 10px;
            font-family: monospace;
            font-size: 14px;
            z-index: 100000;
            border: 1px solid #0f0;
            border-radius: 4px;
        `;
        document.body.appendChild(fpsDisplay);

        let lastTime = performance.now();
        let frames = 0;

        function updateFPS() {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                fpsDisplay.textContent = `FPS: ${fps}`;
                fpsDisplay.style.color = fps < 30 ? '#ff3333' : fps < 50 ? '#ffcc00' : '#0f0';
                
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(updateFPS);
        }
        
        updateFPS();
    }
}

initFPSMonitor();


// ============================================================================
//  22. REQUIRED CSS ANIMATIONS (INJECT IF MISSING)
// ============================================================================
if (!document.getElementById('contact-animations')) {
    const style = document.createElement('style');
    style.id = 'contact-animations';
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
            20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        
        @keyframes screen-shake {
            0%, 100% { transform: translate(0, 0); }
            10%, 30%, 50%, 70%, 90% { transform: translate(-5px, 5px); }
            20%, 40%, 60%, 80% { transform: translate(5px, -5px); }
        }
        
        @keyframes float-up {
            to { 
                transform: translateY(-100vh); 
                opacity: 0; 
            }
        }
        
        @keyframes slide-in-right {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes pulse-soft {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
        }
        
        @keyframes impact-flash {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(0); }
            50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.5); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(3); }
        }
        
        @keyframes wave-expand {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(0); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(4); }
        }
        
        @keyframes crack-spread {
            0% { opacity: 1; width: 0; }
            100% { opacity: 0.7; width: var(--crack-length); }
        }
        
        @keyframes glass-shatter {
            0% { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(1); }
            100% { opacity: 0; transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.3); }
        }
        
        @keyframes spark-flash {
            0% { opacity: 1; transform: rotate(0deg) scale(1); }
            100% { opacity: 0; transform: rotate(0deg) scale(1.5); }
        }
        
        @keyframes particle-fall {
            0% { opacity: 1; transform: translate(0, 0); }
            100% { opacity: 0; transform: translate(var(--px), var(--py)) scale(0); }
        }
        
        @keyframes reflection-flash {
            0% { opacity: 0; transform: rotate(0deg) scale(0); }
            50% { opacity: 1; transform: rotate(0deg) scale(1); }
            100% { opacity: 0; transform: rotate(0deg) scale(1.2); }
        }
        
        @keyframes wave-pulse {
            0% { opacity: 1; transform: scale(0); }
            100% { opacity: 0; transform: scale(3); }
        }
        
        @keyframes vignette-pulse {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
        }
        
        @keyframes chromatic-shift {
            0%, 100% { opacity: 0; }
            50% { opacity: 0.5; }
        }
        
        .hacked-success {
            color: #0f0;
            font-weight: bold;
            text-shadow: 0 0 15px #0f0;
            animation: pulse-green 1.5s infinite alternate;
        }
        
        @keyframes pulse-green {
            from { 
                text-shadow: 0 0 10px #0f0; 
                transform: scale(1);
            }
            to { 
                text-shadow: 0 0 25px #0f0, 0 0 15px #fff; 
                transform: scale(1.02);
            }
        }
        
        .loading-dots span {
            animation: dot-blink 1.4s infinite;
        }
        
        .loading-dots span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .loading-dots span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes dot-blink {
            0%, 80%, 100% { opacity: 0; }
            40% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}


// ============================================================================
//  END OF SCRIPT - ALL SYSTEMS INITIALIZED
// ============================================================================

console.log('%c ✅ ALL SYSTEMS INITIALIZED SUCCESSFULLY ', 'background: #0f0; color: #000; font-size: 18px; padding: 10px; font-weight: bold;');
console.log('%c 🚀 Performance: OPTIMIZED | Mobile: ENHANCED | Effects: ACTIVE ', 'background: #0ff; color: #000; font-size: 14px; padding: 8px;');
console.log('%c 💡 Type help() for available commands ', 'color: #888; font-size: 12px;');

// Log performance metrics after page fully loads
window.addEventListener('load', () => {
    setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            console.log('%c 📊 PERFORMANCE METRICS: ', 'color: #ffcc00; font-size: 14px; font-weight: bold;');
            console.log(`Load Time: ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
            console.log(`DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart)}ms`);
        }
    }, 2000);
});
