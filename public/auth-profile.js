/*
████████████████████████████████████████████████████████████████████████████████
█ SEC C | AUTH + PROFILE LOGIC v10.0                                           █
█ AUTO-PROFILE MATCHING SYSTEM                                                 █
████████████████████████████████████████████████████████████████████████████████
*/

// ==================== USER DATABASE (LocalStorage) ====================
const USERS_KEY = 'secc_users_db';
const CURRENT_USER_KEY = 'secc_current_user';

// Get all users from localStorage
function getAllUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

// Save user to database
function saveUser(userData) {
    const users = getAllUsers();
    users.push(userData);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Find user by username
function findUser(username) {
    const users = getAllUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
}

// Set current logged-in user
function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Get current logged-in user
function getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Clear current user (logout)
function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🚀 SEC C PROFILE SYSTEM v10.0 INITIALIZED', 
        'background: linear-gradient(90deg, #00ff88, #00ccff); color: #000; font-weight: bold; padding: 10px 20px; font-size: 14px;');
    
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        showProfileScreen(currentUser);
    } else {
        showAuthScreen();
    }
    
    // Setup password strength checker
    const signupPassword = document.getElementById('signupPassword');
    if (signupPassword) {
        signupPassword.addEventListener('input', checkPasswordStrength);
    }
});

// ==================== TAB SWITCHING ====================
function switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${tab}Form`).classList.add('active');
}

// ==================== PASSWORD TOGGLE ====================
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.target.closest('.eye-toggle').querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ==================== PASSWORD STRENGTH ====================
function checkPasswordStrength() {
    const password = this.value;
    const bars = document.querySelectorAll('.strength-bars .bar');
    const text = document.querySelector('.strength-text');
    
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    // Reset bars
    bars.forEach(bar => bar.style.background = 'rgba(255, 255, 255, 0.1)');
    
    // Update bars based on strength
    const colors = ['#ff0044', '#ffaa00', '#ffd700', '#00ff88'];
    const labels = ['WEAK', 'FAIR', 'GOOD', 'STRONG'];
    
    for (let i = 0; i < strength; i++) {
        bars[i].style.background = colors[strength - 1];
    }
    
    text.textContent = `STRENGTH: ${strength > 0 ? labels[strength - 1] : 'WAITING'}`;
    text.style.color = strength > 0 ? colors[strength - 1] : 'var(--text-muted)';
}

// ==================== LOGIN HANDLER ====================
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Find user in database
    const user = findUser(username);
    
    if (!user) {
        showToast('error', 'OPERATOR NOT FOUND');
        return;
    }
    
    if (user.password !== password) {
        showToast('error', 'INVALID ACCESS CODE');
        return;
    }
    
    // Update last login
    user.lastLogin = new Date().toLocaleString();
    setCurrentUser(user);
    
    showToast('success', `WELCOME BACK, ${user.username.toUpperCase()}!`);
    
    setTimeout(() => {
        showProfileScreen(user);
    }, 1500);
}

// ==================== SIGNUP HANDLER ====================
function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById('signupUsername').value.trim();
    const realname = document.getElementById('signupRealname').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const region = document.getElementById('signupRegion').value;
    const rank = document.getElementById('signupRank').value;
    const password = document.getElementById('signupPassword').value;
    
    // Check if username already exists
    if (findUser(username)) {
        showToast('error', 'CALLSIGN ALREADY EXISTS');
        return;
    }
    
    // Create user object with auto-generated profile data
    const newUser = {
        username,
        realname,
        email,
        region,
        rank,
        password,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toLocaleString(),
        
        // Auto-generated profile data
        level: Math.floor(Math.random() * 50) + 1,
        missionsCompleted: Math.floor(Math.random() * 500),
        winRate: (Math.random() * 40 + 50).toFixed(0),
        kdRatio: (Math.random() * 3 + 1).toFixed(2),
        playtime: Math.floor(Math.random() * 2000) + 100,
        totalKills: Math.floor(Math.random() * 20000) + 1000,
        totalWins: Math.floor(Math.random() * 5000) + 500,
        totalXP: Math.floor(Math.random() * 500000) + 50000,
        totalCredits: Math.floor(Math.random() * 100000) + 10000
    };
    
    // Save to database
    saveUser(newUser);
    setCurrentUser(newUser);
    
    showToast('success', 'DOSSIER CREATED SUCCESSFULLY!');
    
    setTimeout(() => {
        showProfileScreen(newUser);
    }, 1500);
}

// ==================== SCREEN SWITCHING ====================
function showAuthScreen() {
    document.getElementById('authScreen').classList.add('active');
    document.getElementById('profileScreen').classList.remove('active');
    document.getElementById('navLinks').style.display = 'none';
    document.getElementById('navUser').style.display = 'none';
}

function showProfileScreen(user) {
    document.getElementById('authScreen').classList.remove('active');
    document.getElementById('profileScreen').classList.add('active');
    document.getElementById('navLinks').style.display = 'flex';
    document.getElementById('navUser').style.display = 'flex';
    
    // Populate profile data
    loadProfileData(user);
}

// ==================== LOAD PROFILE DATA ====================
function loadProfileData(user) {
    // Navigation
    document.getElementById('navUsername').textContent = user.username.toUpperCase();
    document.getElementById('navAvatar').src = `https://ui-avatars.com/api/?name=${user.username}&background=00ff88&color=000&size=150`;
    
    // Sidebar
    document.getElementById('profileAvatar').src = `https://ui-avatars.com/api/?name=${user.username}&background=00ff88&color=000&size=150`;
    document.getElementById('profileUsername').textContent = user.username.toUpperCase();
    document.getElementById('profileRealname').textContent = user.realname;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileLevel').textContent = user.level;
    document.getElementById('profileRank').textContent = user.rank;
    document.getElementById('profileRegion').textContent = user.region;
    
    // Quick Stats
    document.getElementById('missionsCompleted').textContent = user.missionsCompleted.toLocaleString();
    document.getElementById('winRate').textContent = user.winRate + '%';
    document.getElementById('kdRatio').textContent = user.kdRatio;
    document.getElementById('playtime').textContent = user.playtime.toLocaleString() + 'H';
    
    // Welcome Banner
    document.getElementById('welcomeUsername').textContent = user.username.toUpperCase();
    document.getElementById('lastLogin').textContent = user.lastLogin;
    
    // Stats Grid
    document.getElementById('totalKills').textContent = user.totalKills.toLocaleString();
    document.getElementById('totalWins').textContent = user.totalWins.toLocaleString();
    document.getElementById('totalXP').textContent = user.totalXP.toLocaleString();
    document.getElementById('totalCredits').textContent = user.totalCredits.toLocaleString();
}

// ==================== LOGOUT ====================
function logout() {
    if (confirm('ARE YOU SURE YOU WANT TO SIGN OUT?')) {
        clearCurrentUser();
        showToast('info', 'DISCONNECTED SUCCESSFULLY');
        
        setTimeout(() => {
            showAuthScreen();
            
            // Reset forms
            document.getElementById('loginForm').reset();
            document.getElementById('signupForm').reset();
        }, 1000);
    }
}

// ==================== TOAST NOTIFICATION ====================
function showToast(type, message) {
    const toast = document.getElementById('toast');
    const icon = toast.querySelector('.toast-icon');
    const text = toast.querySelector('.toast-message');
    
    // Set icon based on type
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-circle'
    };
    
    const colors = {
        success: 'linear-gradient(135deg, #00ff88, #00cc6a)',
        error: 'linear-gradient(135deg, #ff0044, #cc0033)',
        info: 'linear-gradient(135deg, #00ccff, #0099cc)',
        warning: 'linear-gradient(135deg, #ffaa00, #cc8800)'
    };
    
    icon.className = `toast-icon fa-solid ${icons[type]}`;
    text.textContent = message;
    toast.style.background = colors[type];
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== UTILITY FUNCTIONS ====================
// Add smooth animations on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});
