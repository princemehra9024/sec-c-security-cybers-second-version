/*
################################################################################
#                                                                              #
#    GAMING ZONE | INTERACTIVE JAVASCRIPT ENGINE                              #
#    CODENAME: "TITAN CORE"                                                   #
#    VERSION: 1.0.0                                                           #
#    AUTHOR: PERPLEXITY AI                                                    #
#    BUILD: PRODUCTION                                                        #
#                                                                              #
################################################################################
*/

// =============================================================================
// TABLE OF CONTENTS
// =============================================================================
// 01. GLOBAL STATE & CONFIGURATION
// 02. LOADING SCREEN SYSTEM
// 03. HEADER & NAVIGATION
// 04. MOBILE MENU CONTROLS
// 05. SEARCH OVERLAY FUNCTIONALITY
// 06. HERO SECTION ANIMATIONS
// 07. CATEGORY FILTERING
// 08. SORT & VIEW CONTROLS
// 09. GAME GRID MANAGEMENT
// 10. WISHLIST SYSTEM
// 11. SCROLL ANIMATIONS
// 12. CUSTOM CURSOR (DESKTOP)
// 13. BACK TO TOP BUTTON
// 14. NEWSLETTER FORM
// 15. UTILITY FUNCTIONS
// 16. INITIALIZATION
// =============================================================================


// =============================================================================
// 01. GLOBAL STATE & CONFIGURATION
// =============================================================================

const APP_STATE = {
    currentCategory: 'all',
    currentSort: 'popular',
    currentView: 'grid',
    wishlist: [],
    cart: [],
    searchQuery: '',
    isLoading: false
};

const CONFIG = {
    loadingDuration: 2000,
    scrollThreshold: 100,
    animationDuration: 300
};


// =============================================================================
// 02. LOADING SCREEN SYSTEM
// =============================================================================

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const loadingProgress = document.getElementById('loadingProgress');
    const loadingStatus = document.getElementById('loadingStatus');
    
    if (!loadingScreen) return;

    const loadingSteps = [
        { progress: 20, status: 'Loading game database...' },
        { progress: 40, status: 'Initializing graphics engine...' },
        { progress: 60, status: 'Loading user preferences...' },
        { progress: 80, status: 'Preparing interface...' },
        { progress: 100, status: 'Launch complete!' }
    ];

    let currentStep = 0;

    const loadingInterval = setInterval(() => {
        if (currentStep < loadingSteps.length) {
            const step = loadingSteps[currentStep];
            loadingProgress.style.width = `${step.progress}%`;
            loadingStatus.textContent = step.progress;
            currentStep++;
        } else {
            clearInterval(loadingInterval);
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 500);
        }
    }, CONFIG.loadingDuration / loadingSteps.length);
}


// =============================================================================
// 03. HEADER & NAVIGATION
// =============================================================================

function initHeader() {
    const header = document.getElementById('mainHeader');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > CONFIG.scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 500) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}


// =============================================================================
// 04. MOBILE MENU CONTROLS
// =============================================================================

function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileClose = document.getElementById('mobileClose');

    if (!mobileToggle || !mobileOverlay) return;

    function openMobileMenu() {
        mobileOverlay.classList.add('active');
        mobileToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileOverlay.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    mobileToggle.addEventListener('click', openMobileMenu);
    mobileClose?.addEventListener('click', closeMobileMenu);

    // Close on link click
    const mobileLinks = mobileOverlay.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close on overlay click
    mobileOverlay.addEventListener('click', (e) => {
        if (e.target === mobileOverlay) {
            closeMobileMenu();
        }
    });
}


// =============================================================================
// 05. SEARCH OVERLAY FUNCTIONALITY
// =============================================================================

function initSearchOverlay() {
    const searchTrigger = document.getElementById('searchTrigger');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');

    if (!searchTrigger || !searchOverlay) return;

    function openSearch() {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput?.focus(), 300);
    }

    function closeSearch() {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    searchTrigger.addEventListener('click', openSearch);
    searchClose?.addEventListener('click', closeSearch);
    searchClear?.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });

    // Search functionality
    searchInput?.addEventListener('input', (e) => {
        APP_STATE.searchQuery = e.target.value.toLowerCase();
        filterGames();
    });

    // Suggestion tags
    const suggestionTags = searchOverlay.querySelectorAll('.suggestion-tag');
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            searchInput.value = tag.textContent;
            APP_STATE.searchQuery = tag.textContent.toLowerCase();
            filterGames();
            closeSearch();
        });
    });
}


// =============================================================================
// 06. HERO SECTION ANIMATIONS
// =============================================================================

function initHeroAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const counter = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    };

    // Intersection Observer for stat animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));

    // Smooth scroll for hero CTA
    const ctaButtons = document.querySelectorAll('.hero-cta a[href^="#"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}


// =============================================================================
// 07. CATEGORY FILTERING
// =============================================================================

function initCategoryFilters() {
    const categoryChips = document.querySelectorAll('.category-chip');

    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // Remove active class from all chips
            categoryChips.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked chip
            chip.classList.add('active');
            
            // Update state and filter
            APP_STATE.currentCategory = chip.getAttribute('data-category');
            filterGames();
        });
    });
}


// =============================================================================
// 08. SORT & VIEW CONTROLS
// =============================================================================

function initSortControls() {
    const sortToggle = document.getElementById('sortToggle');
    const sortMenu = document.getElementById('sortMenu');
    const sortItems = sortMenu?.querySelectorAll('.dropdown-item');

    sortToggle?.addEventListener('click', () => {
        sortMenu.classList.toggle('active');
    });

    sortItems?.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all
            sortItems.forEach(i => i.classList.remove('active'));
            
            // Add active to clicked
            item.classList.add('active');
            
            // Update sort type
            APP_STATE.currentSort = item.getAttribute('data-sort');
            sortGames();
            
            // Close menu
            sortMenu.classList.remove('active');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!sortToggle?.contains(e.target) && !sortMenu?.contains(e.target)) {
            sortMenu?.classList.remove('active');
        }
    });
}

function initViewControls() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const gameGrid = document.getElementById('gameGrid');

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active to clicked
            button.classList.add('active');
            
            // Update view
            const view = button.getAttribute('data-view');
            APP_STATE.currentView = view;
            
            // Toggle grid class
            if (view === 'list') {
                gameGrid?.classList.add('list-view');
            } else {
                gameGrid?.classList.remove('list-view');
            }
        });
    });
}


// =============================================================================
// 09. GAME GRID MANAGEMENT
// =============================================================================

function filterGames() {
    const gameCards = document.querySelectorAll('.game-card');
    const resultCount = document.getElementById('resultCount');
    let visibleCount = 0;

    gameCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const title = card.querySelector('.game-title')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('.game-desc')?.textContent.toLowerCase() || '';
        
        const matchesCategory = APP_STATE.currentCategory === 'all' || 
                               category.includes(APP_STATE.currentCategory);
        
        const matchesSearch = !APP_STATE.searchQuery || 
                             title.includes(APP_STATE.searchQuery) || 
                             desc.includes(APP_STATE.searchQuery);

        if (matchesCategory && matchesSearch) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (resultCount) {
        resultCount.textContent = `Showing ${visibleCount} games`;
    }
}

function sortGames() {
    const gameGrid = document.getElementById('gameGrid');
    if (!gameGrid) return;

    const gameCards = Array.from(gameGrid.querySelectorAll('.game-card'));

    gameCards.sort((a, b) => {
        switch (APP_STATE.currentSort) {
            case 'popular':
                return parseInt(b.getAttribute('data-downloads')) - 
                       parseInt(a.getAttribute('data-downloads'));
            
            case 'rating':
                return parseFloat(b.getAttribute('data-rating')) - 
                       parseFloat(a.getAttribute('data-rating'));
            
            case 'downloads':
                return parseInt(b.getAttribute('data-downloads')) - 
                       parseInt(a.getAttribute('data-downloads'));
            
            case 'az':
                const titleA = a.querySelector('.game-title').textContent;
                const titleB = b.querySelector('.game-title').textContent;
                return titleA.localeCompare(titleB);
            
            case 'za':
                const titleA2 = a.querySelector('.game-title').textContent;
                const titleB2 = b.querySelector('.game-title').textContent;
                return titleB2.localeCompare(titleA2);
            
            case 'newest':
                // For demo purposes, using game ID
                return parseInt(b.getAttribute('data-id').replace('game-', '')) - 
                       parseInt(a.getAttribute('data-id').replace('game-', ''));
            
            default:
                return 0;
        }
    });

    // Reorder in DOM
    gameCards.forEach(card => gameGrid.appendChild(card));
}


// =============================================================================
// 10. WISHLIST SYSTEM
// =============================================================================

function initWishlist() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistCount = document.getElementById('wishlistCount');
    const wishlistIcons = document.querySelectorAll('.btn-icon');

    wishlistIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const card = icon.closest('.game-card');
            const gameId = card?.getAttribute('data-id');
            const heartIcon = icon.querySelector('i');

            if (!gameId) return;

            if (APP_STATE.wishlist.includes(gameId)) {
                // Remove from wishlist
                APP_STATE.wishlist = APP_STATE.wishlist.filter(id => id !== gameId);
                heartIcon.classList.remove('fa-solid');
                heartIcon.classList.add('fa-regular');
            } else {
                // Add to wishlist
                APP_STATE.wishlist.push(gameId);
                heartIcon.classList.remove('fa-regular');
                heartIcon.classList.add('fa-solid');
                
                // Show notification
                showNotification('Added to wishlist!');
            }

            // Update count
            if (wishlistCount) {
                wishlistCount.textContent = APP_STATE.wishlist.length;
                wishlistCount.style.display = APP_STATE.wishlist.length > 0 ? 'flex' : 'none';
            }

            // Save to localStorage
            localStorage.setItem('wishlist', JSON.stringify(APP_STATE.wishlist));
        });
    });

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
        APP_STATE.wishlist = JSON.parse(savedWishlist);
        if (wishlistCount) {
            wishlistCount.textContent = APP_STATE.wishlist.length;
            wishlistCount.style.display = APP_STATE.wishlist.length > 0 ? 'flex' : 'none';
        }

        // Update heart icons
        APP_STATE.wishlist.forEach(gameId => {
            const card = document.querySelector(`[data-id="${gameId}"]`);
            const heartIcon = card?.querySelector('.btn-icon i');
            if (heartIcon) {
                heartIcon.classList.remove('fa-regular');
                heartIcon.classList.add('fa-solid');
            }
        });
    }
}


// =============================================================================
// 11. SCROLL ANIMATIONS
// =============================================================================

function initScrollAnimations() {
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

    const animatedElements = document.querySelectorAll('.game-card, .newsletter-section, .footer-column');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}


// =============================================================================
// 12. CUSTOM CURSOR (DESKTOP)
// =============================================================================

function initCustomCursor() {
    // Only on desktop
    if (window.innerWidth < 1024) return;

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');

    if (!cursorDot || !cursorCircle) return;

    document.body.classList.add('cursor-active');

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let circleX = 0, circleY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Dot follows mouse directly
        dotX = mouseX;
        dotY = mouseY;
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;

        // Circle follows with delay
        circleX += (mouseX - circleX) * 0.15;
        circleY += (mouseY - circleY) * 0.15;
        cursorCircle.style.left = `${circleX}px`;
        cursorCircle.style.top = `${circleY}px`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .game-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
}


// =============================================================================
// 13. BACK TO TOP BUTTON
// =============================================================================

function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// =============================================================================
// 14. NEWSLETTER FORM
// =============================================================================

function initNewsletter() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput?.value;

        if (email) {
            // Simulate API call
            setTimeout(() => {
                showNotification('Successfully subscribed to newsletter!', 'success');
                emailInput.value = '';
            }, 1000);
        }
    });
}


// =============================================================================
// 15. UTILITY FUNCTIONS
// =============================================================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00ff88' : '#0072ff'};
        color: #000;
        padding: 15px 25px;
        border-radius: 8px;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 700;
        font-size: 1rem;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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


// =============================================================================
// 16. INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🎮 GAMING ZONE INITIALIZED', 'color: #00ff88; font-size: 20px; font-weight: bold;');
    
    // Initialize all modules
    initLoadingScreen();
    initHeader();
    initMobileMenu();
    initSearchOverlay();
    initHeroAnimations();
    initCategoryFilters();
    initSortControls();
    initViewControls();
    initWishlist();
    initScrollAnimations();
    initCustomCursor();
    initBackToTop();
    initNewsletter();

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', debounce(() => {
        if (window.innerWidth > 1024) {
            document.querySelector('.mobile-overlay-menu')?.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }, 250));
});

// Add animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Prevent context menu on images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault());
});

console.log('%c✅ All systems operational', 'color: #00ff88; font-weight: bold;');
