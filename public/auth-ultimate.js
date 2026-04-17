// API Configuration
const API_URL = 'http://localhost:3000/api/auth';

// ============================================================================
// REGISTRATION HANDLER
// ============================================================================
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('regUsername').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('p-reg').value;
    const region = document.getElementById('regRegion').value;
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> GENERATING DOSSIER...';
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password,
                region
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Save token to localStorage
            localStorage.setItem('sec_c_token', data.token);
            localStorage.setItem('sec_c_user', JSON.stringify(data.user));
            
            // Show success message
            showNotification('SUCCESS!', 'Account created! Redirecting to profile...', 'success');
            
            // Redirect to profile page after 1.5 seconds
            setTimeout(() => {
                window.location.href = '/profile';
            }, 1500);
            
        } else {
            showNotification('ERROR!', data.message || 'Registration failed', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
        
    } catch (error) {
        console.error('Registration Error:', error);
        showNotification('ERROR!', 'Network error. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ============================================================================
// LOGIN HANDLER
// ============================================================================
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('p-login').value;
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ESTABLISHING UPLINK...';
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Save token to localStorage
            localStorage.setItem('sec_c_token', data.token);
            localStorage.setItem('sec_c_user', JSON.stringify(data.user));
            
            // Show success message
            showNotification('ACCESS GRANTED!', 'Login successful! Redirecting...', 'success');
            
            // Redirect to profile page
            setTimeout(() => {
                window.location.href = '/profile';
            }, 1500);
            
        } else {
            showNotification('ACCESS DENIED!', data.message || 'Invalid credentials', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
        
    } catch (error) {
        console.error('Login Error:', error);
        showNotification('ERROR!', 'Network error. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================
function showNotification(title, message, type = 'info') {
    // Create notification container if it doesn't exist
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `cyber-notification ${type}`;
    
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
        border: 1px solid ${colors[type]};
        border-left: 4px solid ${colors[type]};
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        gap: 12px;
        animation: slideInRight 0.3s ease-out;
        min-width: 320px;
        color: #fff;
        font-family: 'Rajdhani', sans-serif;
    `;
    
    notification.innerHTML = `
        <i class="fa-solid ${icons[type]}" style="color: ${colors[type]}; font-size: 20px;"></i>
        <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${title}</div>
            <div style="color: #a8b2d1; font-size: 13px;">${message}</div>
        </div>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: #6b7689; cursor: pointer; font-size: 18px;">
            <i class="fa-solid fa-times"></i>
        </button>
    `;
    
    // Add animation styles
    if (!document.getElementById('notif-anims')) {
        const style = document.createElement('style');
        style.id = 'notif-anims';
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
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}
