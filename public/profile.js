/*
================================================================================
SEC-C | USER PROFILE DASHBOARD - COMPLETE JAVASCRIPT WITH DATA PERSISTENCE
DEVELOPER: TEAM SEC-C
VERSION: 3.0 - NO PAGE RELOAD, DATA SAVES AUTOMATICALLY
FEATURES: LocalStorage Auto-Save, Real-time Updates, No Page Refresh Needed
================================================================================
*/

// ============================================================================
// 1. GLOBAL CONFIGURATION
// ============================================================================
const CONFIG = {
    SCROLL_OFFSET: 70,
    ANIMATION_DURATION: 300,
    NOTIFICATION_DURATION: 5000,
    AUTO_SAVE_DELAY: 1000,
    STORAGE_KEY: 'sec_c_profile_data',
    THEMES: {
        green: { primary: '#00ff88', secondary: '#005533' },
        cyan: { primary: '#00f3ff', secondary: '#006677' },
        purple: { primary: '#a855f7', secondary: '#5b21b6' },
        pink: { primary: '#ec4899', secondary: '#831843' },
        orange: { primary: '#f97316', secondary: '#9a3412' },
        yellow: { primary: '#fcee0a', secondary: '#854d0e' },
        blue: { primary: '#3b82f6', secondary: '#1e40af' },
        red: { primary: '#ef4444', secondary: '#991b1b' }
    }
};

// Global State - ALL DATA SAVES HERE
let state = {
    currentTab: 'overview',
    isMenuOpen: false,
    isNotificationPanelOpen: false,
    isEditMode: false,
    selectedAvatar: null,
    currentTheme: 'green',
    notifications: [],
    userData: {
        username: 'OPERATOR_001',
        fullName: 'John Operator',
        email: 'operator@sec-c.com',
        phone: '+1 (555) 123-4567',
        bio: 'Elite Cybersecurity Agent specializing in threat analysis and digital forensics.',
        location: 'Cyber City, Matrix',
        occupation: 'Security Analyst',
        website: 'https://sec-c.com',
        dob: '1995-06-15',
        gender: 'male',
        twitter: '@operator001',
        github: 'operator001',
        linkedin: 'operator001',
        discord: 'operator#0001',
        avatarUrl: 'https://i.pravatar.cc/200?img=12'
    },
    settings: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        weeklyDigest: true,
        autoSave: true,
        twoFactorAuth: false,
        sessionTimeout: true,
        activityLog: true,
        dndEnabled: false
    },
    sessions: []
};

// ============================================================================
// 2. AUTO-SAVE SYSTEM - SAVES DATA EVERY TIME YOU EDIT
// ============================================================================
function saveAllData() {
    try {
        const dataToSave = {
            userData: state.userData,
            settings: state.settings,
            currentTheme: state.currentTheme,
            lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(dataToSave));
        console.log('%c💾 Data Saved Successfully!', 'color: #00ff88; font-weight: bold;');
        return true;
    } catch (error) {
        console.error('Failed to save data:', error);
        showNotification('Error', 'Failed to save data', 'error');
        return false;
    }
}

function loadAllData() {
    try {
        const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
        
        if (savedData) {
            const parsed = JSON.parse(savedData);
            
            state.userData = { ...state.userData, ...parsed.userData };
            state.settings = { ...state.settings, ...parsed.settings };
            state.currentTheme = parsed.currentTheme || 'green';
            
            console.log('%c📂 Data Loaded from Storage!', 'color: #00f3ff; font-weight: bold;');
            console.log('Last saved:', parsed.lastSaved);
            
            return true;
        } else {
            console.log('%c📝 No saved data found, using defaults', 'color: #fcee0a;');
            return false;
        }
    } catch (error) {
        console.error('Failed to load data:', error);
        return false;
    }
}

// Auto-save whenever state changes
let saveTimeout;
function triggerAutoSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveAllData();
        showNotification('Auto-Saved', 'Your changes have been saved', 'success', 2000);
    }, CONFIG.AUTO_SAVE_DELAY);
}

// ============================================================================
// 3. DOM CONTENT LOADED - INITIALIZE EVERYTHING
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🛡️ SEC-C PROFILE SYSTEM V3.0 INITIALIZING... 🛡️', 
        'background: linear-gradient(135deg, #00ff88, #00f3ff); color: #000; padding: 10px 20px; font-size: 14px; font-weight: bold; border-radius: 5px;');
    
    // Initialize loading screen
    simulateLoading();
    
    // Load saved data
    loadAllData();
    
    // Initialize all systems
    initMobileMenu();
    initTabSystem();
    initFormHandlers();
    initNotifications();
    initScrollHeader();
    initAvatarSystem();
    initThemeSwitcher();
    initLogout();
    initModals();
    initPasswordStrength();
    initProfileEdit();
    initSessionManagement();
    initDNDScheduler();
    initSearchBar();
    initUserDropdown();
    initQuickActions();
    initAchievementFilters();
    updateProgressBars();
    initMatrixEffect();
    
    // Apply loaded theme
    applyTheme(state.currentTheme);
    
    // Update ALL UI with saved data
    updateAllUI();
    
    console.log('%c✅ All Systems Online!', 'color: #00ff88; font-weight: bold;');
    
    // Welcome notification
    setTimeout(() => {
        showNotification('Welcome Back!', `Last saved: ${getLastSavedTime()}`, 'success');
    }, 2000);
});

// ============================================================================
// 4. LOADING SCREEN SIMULATION
// ============================================================================
function simulateLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingBar = document.getElementById('loadingBar');
    const loadingStatus = document.getElementById('loadingStatus');
    
    if (!loadingScreen || !loadingBar || !loadingStatus) return;
    
    const steps = [
        { progress: 20, text: 'Loading modules...', delay: 300 },
        { progress: 40, text: 'Initializing systems...', delay: 400 },
        { progress: 60, text: 'Connecting to network...', delay: 350 },
        { progress: 80, text: 'Loading user data...', delay: 300 },
        { progress: 100, text: 'Complete!', delay: 200 }
    ];
    
    let currentStep = 0;
    
    function nextStep() {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            loadingBar.style.width = step.progress + '%';
            loadingStatus.textContent = step.text;
            currentStep++;
            setTimeout(nextStep, step.delay);
        } else {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 300);
        }
    }
    
    setTimeout(nextStep, 200);
}

// ============================================================================
// 5. UPDATE ALL UI WITH SAVED DATA
// ============================================================================
function updateAllUI() {
    // Update Profile Banner
    const displayName = document.getElementById('userDisplayName');
    const tagline = document.getElementById('userTagline');
    const locationEl = document.getElementById('userLocation');
    
    if (displayName) displayName.textContent = state.userData.fullName;
    if (tagline) tagline.textContent = state.userData.bio;
    if (locationEl) locationEl.textContent = state.userData.location;
    
    // Update Avatar
    updateAvatarImages(state.userData.avatarUrl);
    
    // Update ALL form fields
    updateFormField('firstName', state.userData.fullName.split(' ')[0]);
    updateFormField('lastName', state.userData.fullName.split(' ').slice(1).join(' '));
    updateFormField('email', state.userData.email);
    updateFormField('phone', state.userData.phone);
    updateFormField('bio', state.userData.bio);
    updateFormField('location', state.userData.location);
    updateFormField('occupation', state.userData.occupation);
    updateFormField('website', state.userData.website);
    updateFormField('birthdate', state.userData.dob);
    
    // Update Social Links
    updateFormField('twitter', state.userData.twitter);
    updateFormField('github', state.userData.github);
    updateFormField('linkedin', state.userData.linkedin);
    updateFormField('discord', state.userData.discord);
    
    // Update Settings Toggles
    Object.keys(state.settings).forEach(key => {
        const toggle = document.getElementById(key);
        if (toggle && toggle.type === 'checkbox') {
            toggle.checked = state.settings[key];
        }
    });
    
    // Update character count for bio
    const bioField = document.getElementById('bio');
    const charCount = document.querySelector('.char-count');
    if (bioField && charCount) {
        charCount.textContent = `${bioField.value.length} / 500 characters`;
    }
    
    console.log('%c🔄 UI Updated with Saved Data', 'color: #00f3ff;');
}

function updateFormField(fieldId, value) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.value = value || '';
    }
}

function getLastSavedTime() {
    try {
        const saved = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY));
        if (saved && saved.lastSaved) {
            const date = new Date(saved.lastSaved);
            return date.toLocaleString();
        }
    } catch (e) {}
    return 'Never';
}

// ============================================================================
// 6. MOBILE MENU
// ============================================================================
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (state.isMenuOpen && window.innerWidth <= 768) {
                toggleMobileMenu();
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (state.isMenuOpen && 
            !navMenu.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    function toggleMobileMenu() {
        state.isMenuOpen = !state.isMenuOpen;
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');

        const spans = mobileToggle.querySelectorAll('span');
        if (state.isMenuOpen) {
            spans[0].style.transform = 'rotate(45deg) translateY(10px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }

        document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
    }
}

// ============================================================================
// 7. TAB SYSTEM
// ============================================================================
function initTabSystem() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            switchTab(targetTab, navItems, tabContents);
        });
    });
}

function switchTab(tabName, navItems, tabContents) {
    navItems.forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
    });
    tabContents.forEach(content => content.classList.remove('active'));

    const targetNav = Array.from(navItems).find(item => item.getAttribute('data-tab') === tabName);
    const targetContent = document.getElementById(`tab-${tabName}`);

    if (targetNav) {
        targetNav.classList.add('active');
        targetNav.setAttribute('aria-selected', 'true');
    }
    if (targetContent) {
        targetContent.classList.add('active');
        
        // Re-trigger AOS animations for the active tab
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    state.currentTab = tabName;
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log(`%c📑 Tab: ${tabName}`, 'color: #00ff88; font-weight: bold;');
}

// ============================================================================
// 8. SCROLL HEADER & PROGRESS BAR
// ============================================================================
function initScrollHeader() {
    const header = document.querySelector('.header');
    const progressBar = document.getElementById('headerProgressBar');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Update progress bar
        if (progressBar) {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (currentScroll / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        }

        lastScroll = currentScroll;
    });
}

// ============================================================================
// 9. PROFILE EDIT - SAVES DATA IMMEDIATELY
// ============================================================================
function initProfileEdit() {
    const profileForm = document.getElementById('profileForm');
    if (!profileForm) return;

    // Character counter for bio
    const bioField = document.getElementById('bio');
    const charCount = document.querySelector('.char-count');
    
    if (bioField && charCount) {
        bioField.addEventListener('input', () => {
            const length = bioField.value.length;
            charCount.textContent = `${length} / 500 characters`;
            
            if (length > 500) {
                charCount.style.color = 'var(--c-accent-red)';
                bioField.value = bioField.value.substring(0, 500);
            } else {
                charCount.style.color = 'var(--text-tertiary)';
            }
        });
    }

    // Real-time auto-save on input change
    const inputs = profileForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            handleFieldChange(input);
        });
        
        // Also save on blur for text inputs
        if (input.type === 'text' || input.tagName === 'TEXTAREA') {
            input.addEventListener('blur', () => {
                handleFieldChange(input);
            });
        }
    });

    profileForm.addEventListener('submit', handleProfileFormSubmit);
}

function handleFieldChange(input) {
    const fieldName = input.id;
    const value = input.value;
    
    // Update firstName and lastName to fullName
    if (fieldName === 'firstName' || fieldName === 'lastName') {
        const firstName = document.getElementById('firstName')?.value || '';
        const lastName = document.getElementById('lastName')?.value || '';
        state.userData.fullName = `${firstName} ${lastName}`.trim();
        
        // Update display name
        const displayName = document.getElementById('userDisplayName');
        if (displayName) displayName.textContent = state.userData.fullName;
    }
    // Update other userData fields
    else if (state.userData.hasOwnProperty(fieldName)) {
        state.userData[fieldName] = value;
        
        // Update display if it's bio or location
        if (fieldName === 'bio') {
            const tagline = document.getElementById('userTagline');
            if (tagline) tagline.textContent = value;
        }
        if (fieldName === 'location') {
            const locationEl = document.getElementById('userLocation');
            if (locationEl) locationEl.textContent = value;
        }
    }
    
    triggerAutoSave();
}

async function handleProfileFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

    try {
        // Collect all form data
        const firstName = document.getElementById('firstName')?.value || '';
        const lastName = document.getElementById('lastName')?.value || '';
        
        state.userData.fullName = `${firstName} ${lastName}`.trim();
        state.userData.email = document.getElementById('email')?.value || state.userData.email;
        state.userData.phone = document.getElementById('phone')?.value || state.userData.phone;
        state.userData.bio = document.getElementById('bio')?.value || state.userData.bio;
        state.userData.location = document.getElementById('location')?.value || state.userData.location;
        state.userData.occupation = document.getElementById('occupation')?.value || state.userData.occupation;
        state.userData.website = document.getElementById('website')?.value || state.userData.website;
        state.userData.dob = document.getElementById('birthdate')?.value || state.userData.dob;

        // Save to localStorage
        const saved = saveAllData();
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (saved) {
            updateAllUI();
            
            showNotification('Success!', 'Profile saved successfully!', 'success');
            submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!';
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1500);
        }

    } catch (error) {
        showNotification('Error!', 'Failed to save profile', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ============================================================================
// 10. AVATAR SYSTEM - SAVES IMMEDIATELY
// ============================================================================
function initAvatarSystem() {
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const applyAvatarBtn = document.getElementById('applyAvatarBtn');
    const avatarUploadBtn = document.getElementById('avatarUploadBtn');

    avatarOptions.forEach(option => {
        option.addEventListener('click', () => {
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            state.selectedAvatar = option.getAttribute('data-avatar');
        });
    });

    if (applyAvatarBtn) {
        applyAvatarBtn.addEventListener('click', () => {
            if (state.selectedAvatar) {
                state.userData.avatarUrl = state.selectedAvatar;
                updateAvatarImages(state.selectedAvatar);
                saveAllData();
                
                showNotification('Success!', 'Avatar updated and saved!', 'success');
                
                const modal = document.getElementById('avatarModal');
                if (modal) modal.classList.remove('active');
            }
        });
    }

    if (avatarUploadBtn) {
        avatarUploadBtn.addEventListener('click', () => {
            const modal = document.getElementById('avatarModal');
            if (modal) modal.classList.add('active');
        });
    }
}

function updateAvatarImages(avatarUrl) {
    const avatarImgs = document.querySelectorAll('#currentAvatar, .user-mini-avatar, .dropdown-avatar');
    avatarImgs.forEach(img => {
        img.src = avatarUrl;
    });
}

// ============================================================================
// 11. THEME SWITCHER - SAVES IMMEDIATELY
// ============================================================================
function initThemeSwitcher() {
    const themeButtons = document.querySelectorAll('.theme-btn');

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            themeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const theme = btn.getAttribute('data-theme');
            applyTheme(theme);
            
            state.currentTheme = theme;
            saveAllData();
        });
    });
}

function applyTheme(themeName) {
    const theme = CONFIG.THEMES[themeName];
    if (!theme) return;

    const root = document.documentElement;
    root.style.setProperty('--c-prim-500', theme.primary);
    root.style.setProperty('--primary-color', theme.primary);
    
    // Update theme buttons
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        if (btn.getAttribute('data-theme') === themeName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    showNotification('Theme Changed', `${themeName.charAt(0).toUpperCase() + themeName.slice(1)} theme applied`, 'info', 2000);
}

// ============================================================================
// 12. FORM HANDLERS
// ============================================================================
function initFormHandlers() {
    // Social links form
    const socialForm = document.querySelector('.social-links-form');
    if (socialForm) {
        socialForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

            state.userData.twitter = document.getElementById('twitter')?.value || '';
            state.userData.github = document.getElementById('github')?.value || '';
            state.userData.linkedin = document.getElementById('linkedin')?.value || '';
            state.userData.discord = document.getElementById('discord')?.value || '';
            
            saveAllData();
            
            await new Promise(resolve => setTimeout(resolve, 800));

            showNotification('Success!', 'Social links saved!', 'success');
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Saved!';
            
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }, 1500);
        });
    }

    // Password form
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordFormSubmit);
    }

    // Settings toggles
    const toggles = document.querySelectorAll('input[type="checkbox"]');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            const settingName = toggle.id;
            if (state.settings.hasOwnProperty(settingName)) {
                state.settings[settingName] = toggle.checked;
                saveAllData();
                
                showNotification(
                    'Setting Updated',
                    `${settingName.replace(/([A-Z])/g, ' $1').trim()} is now ${toggle.checked ? 'enabled' : 'disabled'}`,
                    'info',
                    2000
                );
            }
        });
    });
}

async function handlePasswordFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const currentPassword = document.getElementById('currentPassword')?.value;
    const newPassword = document.getElementById('newPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('Error!', 'All fields are required', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showNotification('Error!', 'Passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 8) {
        showNotification('Error!', 'Password must be at least 8 characters', 'warning');
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Updating...';

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    showNotification('Success!', 'Password updated successfully', 'success');
    form.reset();
    
    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Updated!';
    
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }, 1500);
}

// ============================================================================
// 13. NOTIFICATION SYSTEM
// ============================================================================
function initNotifications() {
    // Create notification container if it doesn't exist
    if (!document.querySelector('.notification-container')) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }

    const notifBtn = document.getElementById('notifBtn');
    const notifPanel = document.getElementById('notificationPanel');
    const closeNotif = document.getElementById('closeNotif');

    if (notifBtn && notifPanel) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleNotificationPanel();
        });
    }

    if (closeNotif) {
        closeNotif.addEventListener('click', () => {
            toggleNotificationPanel();
        });
    }

    document.addEventListener('click', (e) => {
        if (state.isNotificationPanelOpen && 
            notifPanel && 
            !notifPanel.contains(e.target) && 
            notifBtn && 
            !notifBtn.contains(e.target)) {
            toggleNotificationPanel();
        }
    });
    
    // Initialize notification item actions
    initNotificationActions();
}

function initNotificationActions() {
    const notifItems = document.querySelectorAll('.notification-item');
    
    notifItems.forEach(item => {
        const removeBtn = item.querySelector('.notif-remove');
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                item.style.animation = 'slideOutRight 0.3s ease-out forwards';
                setTimeout(() => item.remove(), 300);
            });
        }
    });
}

function toggleNotificationPanel() {
    const panel = document.getElementById('notificationPanel');
    if (!panel) return;

    state.isNotificationPanelOpen = !state.isNotificationPanelOpen;
    panel.classList.toggle('active');
    panel.setAttribute('aria-hidden', !state.isNotificationPanelOpen);
}

function showNotification(title, message, type = 'info', duration = CONFIG.NOTIFICATION_DURATION) {
    const container = document.querySelector('.notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `profile-notification ${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const colors = {
        success: '#00ff88',
        error: '#ff003c',
        warning: '#fcee0a',
        info: '#00f3ff'
    };

    notification.style.cssText = `
        background: rgba(26, 31, 46, 0.98);
        backdrop-filter: blur(20px);
        border: 1px solid var(--border-primary);
        border-left: 4px solid ${colors[type]};
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: start;
        gap: 12px;
        animation: slideInRight 0.3s ease-out;
        min-width: 320px;
        pointer-events: all;
    `;

    notification.innerHTML = `
        <i class="fa-solid ${icons[type]}" style="color: ${colors[type]}; font-size: 20px; margin-top: 2px;"></i>
        <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: var(--text-primary);">${title}</div>
            <div style="color: var(--text-secondary); font-size: 13px; line-height: 1.5;">${message}</div>
        </div>
        <button class="notif-close" style="background: none; border: none; color: var(--text-tertiary); cursor: pointer; font-size: 18px; padding: 0; line-height: 1; transition: color 0.2s;">
            <i class="fa-solid fa-times"></i>
        </button>
    `;

    // Add animation styles if not present
    if (!document.getElementById('notif-animations')) {
        const style = document.createElement('style');
        style.id = 'notif-animations';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    container.appendChild(notification);

    const closeBtn = notification.querySelector('.notif-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.color = colors[type];
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.color = 'var(--text-tertiary)';
    });

    setTimeout(() => {
        removeNotification(notification);
    }, duration);
}

function removeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// ============================================================================
// 14. MODAL SYSTEM
// ============================================================================
function initModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        const closeButtons = modal.querySelectorAll('.close-modal, .btn-secondary');
        
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Avatar modal file upload
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const previewArea = document.getElementById('previewArea');
    const previewImage = document.getElementById('previewImage');
    const confirmUpload = document.getElementById('confirmUpload');
    
    if (fileInput && uploadArea) {
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--c-prim-500)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--border-primary)';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border-primary)';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleImageUpload(file);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                handleImageUpload(file);
            }
        });
    }
    
    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (previewImage) previewImage.src = e.target.result;
            if (uploadArea) uploadArea.style.display = 'none';
            if (previewArea) previewArea.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
    
    if (confirmUpload) {
        confirmUpload.addEventListener('click', () => {
            const newAvatarUrl = previewImage.src;
            
            state.userData.avatarUrl = newAvatarUrl;
            updateAvatarImages(newAvatarUrl);
            saveAllData();
            
            showNotification('Success!', 'Avatar uploaded and saved!', 'success');
            
            const modal = document.getElementById('avatarModal');
            if (modal) modal.classList.remove('active');
            if (uploadArea) uploadArea.style.display = 'flex';
            if (previewArea) previewArea.style.display = 'none';
        });
    }
}

// Make openDeleteModal global
window.openDeleteModal = function() {
    const modal = document.getElementById('deleteAccountModal');
    if (modal) modal.classList.add('active');
};

// ============================================================================
// 15. PASSWORD STRENGTH
// ============================================================================
function initPasswordStrength() {
    const newPasswordInput = document.getElementById('newPassword');
    if (!newPasswordInput) return;

    newPasswordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthUI(strength);
        updatePasswordRequirements(password);
    });

    // Toggle password visibility
    const toggleButtons = document.querySelectorAll('.password-toggle');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const icon = btn.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

function calculatePasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return Math.min(strength, 4);
}

function updatePasswordStrengthUI(strength) {
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text strong');
    
    if (!strengthBar || !strengthText) return;

    const colors = ['#ff003c', '#fcee0a', '#00f3ff', '#00ff88'];
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];
    const widths = [25, 50, 75, 100];

    if (strength > 0) {
        strengthBar.style.width = widths[strength - 1] + '%';
        strengthBar.style.background = colors[strength - 1];
        strengthText.textContent = labels[strength - 1];
        strengthText.style.color = colors[strength - 1];
    } else {
        strengthBar.style.width = '0%';
        strengthText.textContent = 'None';
        strengthText.style.color = 'var(--text-tertiary)';
    }
}

function updatePasswordRequirements(password) {
    const requirements = document.querySelectorAll('.password-requirements li');
    
    if (!requirements.length) return;
    
    const checks = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[a-z]/.test(password),
        /\d/.test(password),
        /[^a-zA-Z\d]/.test(password)
    ];
    
    requirements.forEach((req, index) => {
        const icon = req.querySelector('i');
        if (checks[index]) {
            icon.classList.remove('fa-circle');
            icon.classList.add('fa-check-circle');
            icon.style.color = 'var(--c-prim-500)';
            req.style.color = 'var(--c-prim-500)';
        } else {
            icon.classList.remove('fa-check-circle');
            icon.classList.add('fa-circle');
            icon.style.color = 'var(--text-tertiary)';
            req.style.color = 'var(--text-secondary)';
        }
    });
}

// ============================================================================
// 16. SESSION MANAGEMENT
// ============================================================================
function initSessionManagement() {
    const sessionItems = document.querySelectorAll('.session-item');
    
    sessionItems.forEach(item => {
        const removeBtn = item.querySelector('.btn-icon-danger');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                if (confirm('End this session?')) {
                    item.style.animation = 'fadeOut 0.3s ease-out forwards';
                    setTimeout(() => item.remove(), 300);
                    showNotification('Session Ended', 'Device logged out successfully', 'success');
                }
            });
        }
    });
    
    // Logout all sessions
    const logoutAllBtn = document.querySelector('.card-header .btn-danger-outline');
    if (logoutAllBtn) {
        logoutAllBtn.addEventListener('click', () => {
            if (confirm('Logout from all devices except this one?')) {
                const sessions = document.querySelectorAll('.session-item:not(.current)');
                sessions.forEach(session => {
                    session.style.animation = 'fadeOut 0.3s ease-out forwards';
                    setTimeout(() => session.remove(), 300);
                });
                showNotification('Success!', 'Logged out from all other devices', 'success');
            }
        });
    }
}

// ============================================================================
// 17. DND SCHEDULER
// ============================================================================
function initDNDScheduler() {
    const dndToggle = document.getElementById('dndToggle');
    const dndSchedule = document.getElementById('dndSchedule');

    if (dndToggle && dndSchedule) {
        dndToggle.checked = state.settings.dndEnabled || false;
        dndSchedule.style.display = dndToggle.checked ? 'block' : 'none';
        
        dndToggle.addEventListener('change', () => {
            state.settings.dndEnabled = dndToggle.checked;
            dndSchedule.style.display = dndToggle.checked ? 'block' : 'none';
            
            saveAllData();
            
            showNotification(
                'Do Not Disturb',
                `DND mode ${dndToggle.checked ? 'enabled' : 'disabled'}`,
                'info',
                2000
            );
        });
    }
}

// ============================================================================
// 18. SEARCH BAR
// ============================================================================
function initSearchBar() {
    const searchToggle = document.getElementById('searchToggle');
    const searchInputWrapper = document.querySelector('.search-input-wrapper');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    
    if (!searchToggle || !searchInputWrapper) return;
    
    searchToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        searchInputWrapper.style.display = 'block';
        if (searchInput) searchInput.focus();
    });
    
    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchInputWrapper.style.display = 'none';
            if (searchInput) searchInput.value = '';
        });
    }
    
    document.addEventListener('click', (e) => {
        if (!searchInputWrapper.contains(e.target) && !searchToggle.contains(e.target)) {
            searchInputWrapper.style.display = 'none';
        }
    });
}

// ============================================================================
// 19. USER DROPDOWN
// ============================================================================
function initUserDropdown() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    
    if (!userMenuBtn || !userDropdownMenu) return;
    
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = userDropdownMenu.style.display === 'block';
        userDropdownMenu.style.display = isOpen ? 'none' : 'block';
        userMenuBtn.setAttribute('aria-expanded', !isOpen);
    });
    
    document.addEventListener('click', () => {
        userDropdownMenu.style.display = 'none';
        userMenuBtn.setAttribute('aria-expanded', 'false');
    });
}

// ============================================================================
// 20. QUICK ACTIONS
// ============================================================================
function initQuickActions() {
    const exportBtn = document.getElementById('exportDataBtn');
    const shareBtn = document.getElementById('shareProfileBtn');
    const printBtn = document.getElementById('printProfileBtn');
    const deleteBtn = document.getElementById('deleteAccountBtn');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataStr = JSON.stringify(state.userData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'sec-c-profile-data.json';
            link.click();
            URL.revokeObjectURL(url);
            
            showNotification('Success!', 'Profile data exported', 'success');
        });
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Copied!', 'Profile link copied to clipboard', 'success');
            });
        });
    }
    
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            window.openDeleteModal();
        });
    }
}

// ============================================================================
// 21. ACHIEVEMENT FILTERS
// ============================================================================
function initAchievementFilters() {
    const filterBtns = document.querySelectorAll('.achievement-filters .filter-btn');
    const achievementCards = document.querySelectorAll('.achievement-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            achievementCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'flex';
                } else if (filter === 'earned') {
                    card.style.display = card.classList.contains('earned') ? 'flex' : 'none';
                } else if (filter === 'locked') {
                    card.style.display = card.classList.contains('locked') ? 'flex' : 'none';
                }
            });
        });
    });
}

// ============================================================================
// 22. PROGRESS BARS & ANIMATIONS
// ============================================================================
function updateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill, .skill-progress');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });

    const progressRing = document.querySelector('.progress-ring-fill');
    if (progressRing) {
        const radius = 60;
        const circumference = 2 * Math.PI * radius;
        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        
        const percent = 80;
        const offset = circumference - (percent / 100 * circumference);
        progressRing.style.strokeDashoffset = offset;
    }
}

// ============================================================================
// 23. MATRIX CANVAS EFFECT
// ============================================================================
function initMatrixEffect() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(10, 14, 26, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff88';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrix[Math.floor(Math.random() * matrix.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ============================================================================
// 24. LOGOUT
// ============================================================================
function initLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout? (Your data will be saved)')) {
            showNotification('Logging Out', 'Data saved successfully...', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    });
}

// ============================================================================
// 25. KEYBOARD SHORTCUTS
// ============================================================================
document.addEventListener('keydown', (e) => {
    // ESC - Close everything
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => modal.classList.remove('active'));
        
        if (state.isMenuOpen) {
            document.getElementById('mobileToggle')?.click();
        }
        if (state.isNotificationPanelOpen) {
            toggleNotificationPanel();
        }
        
        const searchWrapper = document.querySelector('.search-input-wrapper');
        if (searchWrapper && searchWrapper.style.display === 'block') {
            searchWrapper.style.display = 'none';
        }
        
        const userDropdown = document.getElementById('userDropdownMenu');
        if (userDropdown && userDropdown.style.display === 'block') {
            userDropdown.style.display = 'none';
        }
    }

    // Ctrl/Cmd + S - Quick save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveAllData();
        showNotification('Saved!', 'All changes saved successfully', 'success', 2000);
    }
    
    // Ctrl/Cmd + K - Search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchToggle = document.getElementById('searchToggle');
        if (searchToggle) searchToggle.click();
    }
});

// ============================================================================
// 26. ADD FADE OUT ANIMATION
// ============================================================================
if (!document.getElementById('fade-animations')) {
    const style = document.createElement('style');
    style.id = 'fade-animations';
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.95); }
        }
    `;
    document.head.appendChild(style);
}

// ============================================================================
// 27. CONSOLE EASTER EGG
// ============================================================================
console.log(`
%c
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ███████╗███████╗ ██████╗      ██████╗                      ║
║   ██╔════╝██╔════╝██╔════╝     ██╔════╝                      ║
║   ███████╗█████╗  ██║     █████╗██║                          ║
║   ╚════██║██╔══╝  ██║     ╚════╝██║                          ║
║   ███████║███████╗╚██████╗      ╚██████╗                     ║
║   ╚══════╝╚══════╝ ╚═════╝       ╚═════╝                     ║
║                                                               ║
║   NEURAL GATEWAY - V3.0 WITH AUTO-SAVE                       ║
║   Status: OPERATIONAL | Data: PERSISTENT                     ║
║   No Page Refresh Needed - All Data Saves Automatically!     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`, 'color: #00ff88; font-family: monospace; font-weight: bold;');

console.log('%c💾 Auto-Save Enabled!', 'color: #00ff88; font-weight: bold; font-size: 14px;');
console.log('%c📝 Edit any field and it saves automatically', 'color: #00f3ff;');
console.log('%c🔄 Refresh the page - your data stays!', 'color: #a855f7;');
console.log('%c⌨️  Keyboard Shortcuts:', 'color: #fcee0a; font-weight: bold;');
console.log('%c  • Ctrl+S - Manual save', 'color: #fcee0a;');
console.log('%c  • Ctrl+K - Search', 'color: #fcee0a;');
console.log('%c  • ESC - Close modals', 'color: #fcee0a;');

// ============================================================================
// END OF JAVASCRIPT - TOTAL: 1800+ LINES
// All data saves to localStorage automatically!
// No page refresh needed - edit and see changes instantly!
// ============================================================================
