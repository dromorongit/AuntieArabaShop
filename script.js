console.log('Script loaded');

// API Base URL
const API_BASE = 'https://auntiearabashoppms-production.up.railway.app';

// Product Data - will be populated from API
let products = {
    'new-arrivals': [],
    'top-deals': [],
    'fast-selling': []
};

// Shopping Cart
let cart = [];

// Authentication
let currentUser = null;
let authToken = null;
let refreshToken = null;

// Fetch products from API
async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();

        // Map API data to shop format
        const mappedProducts = data.map((product, index) => ({
            id: String(product._id || index + 1),
            name: product.product_name,
            price: product.promo && product.promo_price ? product.promo_price : product.price_ghc,
            originalPrice: product.promo ? product.price_ghc : null,
            image: product.cover_image ? `${API_BASE}/${product.cover_image}` : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
            category: product.categories ? product.categories[0] : 'general',
            sections: product.sections || [],
            stock_status: product.stock_status,
            short_description: product.short_description
        }));

        // Assign to sections based on product's sections field
        products['new-arrivals'] = mappedProducts.filter(p => p.sections.includes('New Arrivals'));
        products['top-deals'] = mappedProducts.filter(p => p.sections.includes('Top Deals'));
        products['fast-selling'] = mappedProducts.filter(p => p.sections.includes('Fast Selling Products'));

    } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to hardcoded products if API fails
        products = {
            'new-arrivals': [
                {
                    id: '1',
                    name: 'Elegant Pink Crop Top',
                    price: 85.00,
                    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
                    category: 'crop-tops'
                },
                // ... rest of hardcoded
            ],
            'top-deals': [],
            'fast-selling': []
        };
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async function() {
    loadAuthState();
    checkTokenExpiration();
    await fetchProducts();
    initializeCarousel();
    loadProducts();
    loadCart();
    updateCartCount();
    initializeMobileDropdowns();
    updateNavigation();
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
        updateCartSummary();
    }
});

// Mobile dropdown functionality
function initializeMobileDropdowns() {
    const dropdownTriggers = document.querySelectorAll('.dropdown > .nav-link');

    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.parentElement;
            const menu = dropdown.querySelector('.dropdown-menu');
            const isVisible = menu.getAttribute('data-visible') === 'true';

            // Close any other open dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
                if (otherMenu !== menu) {
                    otherMenu.style.opacity = '0';
                    otherMenu.style.visibility = 'hidden';
                    otherMenu.style.transform = 'translateY(-10px)';
                    otherMenu.setAttribute('data-visible', 'false');
                }
            });

            // Toggle current dropdown
            if (isVisible) {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
                menu.setAttribute('data-visible', 'false');
            } else {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0)';
                menu.setAttribute('data-visible', 'true');
            }
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
                menu.setAttribute('data-visible', 'false');
            });
        }
    });
}

// Carousel Functionality
function initializeCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;

    // Auto-play carousel
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');

        currentSlide = (currentSlide + 1) % slides.length;

        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }, 5000);

    // Manual slide navigation
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');

            currentSlide = index;

            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
        });
    });
}

// Load Products
function loadProducts() {
    // Load new arrivals
    const newArrivalsContainer = document.getElementById('new-arrivals');
    if (newArrivalsContainer) {
        products['new-arrivals'].forEach(product => {
            newArrivalsContainer.appendChild(createProductCard(product));
        });
    }

    // Load top deals
    const topDealsContainer = document.getElementById('top-deals');
    if (topDealsContainer) {
        products['top-deals'].forEach(product => {
            topDealsContainer.appendChild(createProductCard(product, true));
        });
    }

    // Load fast selling
    const fastSellingContainer = document.getElementById('fast-selling');
    if (fastSellingContainer) {
        products['fast-selling'].forEach(product => {
            fastSellingContainer.appendChild(createProductCard(product));
        });
    }
}

// Create Product Card
function createProductCard(product, isDeal = false) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">GHS ${product.price.toFixed(2)}</p>
            ${isDeal && product.originalPrice ?
                `<p class="original-price">GHS ${product.originalPrice.toFixed(2)}</p>` :
                ''}
            <div class="product-buttons">
                <button class="btn btn-primary" onclick="viewProduct('${product.id}')">View More</button>
                <button class="btn btn-secondary" onclick="addToCart('${product.id}')">Add to Cart</button>
            </div>
        </div>
    `;
    return card;
}

// Add to Cart
function addToCart(productId) {
    // Find product in all categories
    let product = null;
    for (const category in products) {
        product = products[category].find(p => p.id === productId);
        if (product) break;
    }

    if (product) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({...product, quantity: 1});
        }

        saveCart();
        updateCartCount();
        showNotification('Product added to cart!');
    }
}

// Remove from Cart
function removeFromCart(productId) {
    console.log('removeFromCart called with', productId);
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
    showNotification('Product removed from cart');
}

// Update Cart Count
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
    }
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('auntieArabaCart', JSON.stringify(cart));
}

// Load Cart from LocalStorage
function loadCart() {
    const savedCart = localStorage.getItem('auntieArabaCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Authentication Functions
function loadAuthState() {
    const savedAuth = localStorage.getItem('auntieArabaAuth');
    if (savedAuth) {
        const auth = JSON.parse(savedAuth);
        currentUser = auth.user;
        authToken = auth.token;
        refreshToken = auth.refreshToken;
    }
}

function saveAuthState() {
    if (currentUser && authToken) {
        const auth = {
            user: currentUser,
            token: authToken,
            refreshToken: refreshToken
        };
        localStorage.setItem('auntieArabaAuth', JSON.stringify(auth));
        localStorage.setItem('tokenTimestamp', Date.now());
    } else {
        localStorage.removeItem('auntieArabaAuth');
        localStorage.removeItem('tokenTimestamp');
    }
}

function isAuthenticated() {
    return currentUser && authToken;
}

function getAuthHeaders() {
    if (authToken) {
        return {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        };
    }
    return {
        'Content-Type': 'application/json'
    };
}

async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            authToken = data.token;
            refreshToken = data.refreshToken;
            saveAuthState();
            return { success: true };
        } else {
            return { success: false, error: data.message || 'Login failed' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

async function register(name, email, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            authToken = data.token;
            refreshToken = data.refreshToken;
            saveAuthState();
            return { success: true };
        } else {
            return { success: false, error: data.message || 'Registration failed' };
        }
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

function logout() {
    currentUser = null;
    authToken = null;
    refreshToken = null;
    localStorage.removeItem('auntieArabaAuth');
    window.location.href = 'index.html';
}

async function refreshAuthToken() {
    if (!refreshToken) return false;

    try {
        const response = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            saveAuthState();
            return true;
        } else {
            logout(); // Refresh failed, logout user
            return false;
        }
    } catch (error) {
        console.error('Token refresh error:', error);
        logout();
        return false;
    }
}

function checkTokenExpiration() {
    if (!authToken) return;

    // Simple check - if token is older than 55 minutes, refresh it
    // In production, you'd decode the JWT to check expiration
    const tokenAge = Date.now() - (localStorage.getItem('tokenTimestamp') || 0);
    const fiftyFiveMinutes = 55 * 60 * 1000;

    if (tokenAge > fiftyFiveMinutes) {
        refreshAuthToken();
    }
}

function updateNavigation() {
    const navMenus = document.querySelectorAll('.nav-menu');

    navMenus.forEach(navMenu => {
        // Remove existing auth-related items
        const existingAuthItems = navMenu.querySelectorAll('.auth-item');
        existingAuthItems.forEach(item => item.remove());

        if (isAuthenticated()) {
            // User is logged in - show profile and logout
            const profileLi = document.createElement('li');
            profileLi.className = 'auth-item';
            profileLi.innerHTML = `<a href="profile.html" class="nav-link">Profile</a>`;

            const logoutLi = document.createElement('li');
            logoutLi.className = 'auth-item';
            logoutLi.innerHTML = `<a href="#" onclick="logout()" class="nav-link">Logout</a>`;

            navMenu.appendChild(profileLi);
            navMenu.appendChild(logoutLi);
        } else {
            // User is not logged in - show login and register
            const loginLi = document.createElement('li');
            loginLi.className = 'auth-item';
            loginLi.innerHTML = `<a href="login.html" class="nav-link">Login</a>`;

            const registerLi = document.createElement('li');
            registerLi.className = 'auth-item';
            registerLi.innerHTML = `<a href="register.html" class="nav-link">Register</a>`;

            navMenu.appendChild(loginLi);
            navMenu.appendChild(registerLi);
        }
    });
}

// View Product
function viewProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #e91e63 0%, #9c27b0 100%)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(233, 30, 99, 0.3)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: '500',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Login/Register Form Handling
if (window.location.pathname.includes('login.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('login-form');
        const errorMessage = document.getElementById('error-message');

        if (loginForm) {
            loginForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                errorMessage.style.display = 'none';
                errorMessage.textContent = '';

                const result = await login(email, password);

                if (result.success) {
                    showNotification('Login successful! Redirecting...');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    errorMessage.textContent = result.error;
                    errorMessage.style.display = 'block';
                }
            });
        }
    });
}

if (window.location.pathname.includes('register.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const registerForm = document.getElementById('register-form');
        const errorMessage = document.getElementById('error-message');

        if (registerForm) {
            registerForm.addEventListener('submit', async function(e) {
                e.preventDefault();

                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm-password').value;

                errorMessage.style.display = 'none';
                errorMessage.textContent = '';

                if (password !== confirmPassword) {
                    errorMessage.textContent = 'Passwords do not match';
                    errorMessage.style.display = 'block';
                    return;
                }

                const result = await register(name, email, password);

                if (result.success) {
                    showNotification('Registration successful! Redirecting...');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    errorMessage.textContent = result.error;
                    errorMessage.style.display = 'block';
                }
            });
        }
    });
}

// Category Page Functions
async function loadCategoryProducts(category) {
    await fetchProducts(); // Ensure products are loaded
    const categoryProducts = [];

    for (const cat in products) {
        products[cat].forEach(product => {
            if (product.category === category) {
                categoryProducts.push(product);
            }
        });
    }

    return categoryProducts;
}

// Get URL Parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Initialize category page if on category page
if (window.location.pathname.includes('category.html')) {
    document.addEventListener('DOMContentLoaded', async function() {
        const category = getUrlParameter('cat');
        const categoryTitle = document.getElementById('category-title');
        const productsContainer = document.getElementById('category-products');

        if (categoryTitle && productsContainer) {
            const categoryNames = {
                'ladies-tops': 'Ladies Basic Tops',
                'crop-tops': 'Crop Tops',
                'night-wear': 'Night Wear',
                'bum-shorts': 'Bum Shorts',
                'two-in-one-night': '2-in-1 Night Wears',
                'two-in-one-tops': '2-in-1 Tops and Downs',
                'elegant-dresses': 'Elegant Dresses',
                'stylish-dresses': 'Stylish Dresses',
                'office-dresses': 'Office Dresses',
                'panties': 'Panties',
                'nfl-jerseys': 'Unisex NFL Jerseys',
                'other-ladies': 'Other Ladies Fashion Items'
            };

            categoryTitle.textContent = categoryNames[category] || 'Products';

            const categoryProducts = await loadCategoryProducts(category);
            categoryProducts.forEach(product => {
                productsContainer.appendChild(createProductCard(product));
            });
        }
    });
}


function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Start shopping to add items to your cart</p>
                <a href="index.html" class="btn btn-primary">Continue Shopping</a>
            </div>
        `;
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>GHS ${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus-btn" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus-btn" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="cart-item-total">
                GHS ${itemTotal.toFixed(2)}
            </div>
            <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;

        cartContainer.appendChild(cartItem);
    });

    // Add event listeners for quantity buttons
    document.querySelectorAll('.minus-btn').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(btn.dataset.id, -1));
    });
    document.querySelectorAll('.plus-btn').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(btn.dataset.id, 1));
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
    });
}

function updateQuantity(productId, change) {
    console.log('updateQuantity called with', productId, change);
    const item = cart.find(item => item.id === productId);
    console.log('found item:', item);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartCount();
            renderCart();
            updateCartSummary();
        }
    }
}

function updateCartSummary() {
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');

    if (cartSubtotal && cartTotal) {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = 35; // 35 cedis shipping
        const total = subtotal + shipping; // No tax

        cartSubtotal.textContent = `GHS ${subtotal.toFixed(2)}`;
        cartTotal.textContent = `GHS ${total.toFixed(2)}`;
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Product page functions
if (window.location.pathname.includes('product.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const productId = getUrlParameter('id');
        if (productId) {
            loadProductDetails(productId);
        }
    });
}

function loadProductDetails(productId) {
    fetch(`${API_BASE}/products/${productId}`, {
        headers: getAuthHeaders()
    })
        .then(response => response.json())
        .then(product => {
            displayProductDetails(product);
        })
        .catch(error => {
            console.error('Error loading product details:', error);
            showNotification('Error loading product details');
        });
}

function displayProductDetails(product) {
    document.getElementById('product-name').textContent = product.product_name;
    document.getElementById('product-price').textContent = `GHS ${product.price_ghc.toFixed(2)}`;
    if (product.promo && product.promo_price) {
        document.getElementById('product-price').innerHTML = `<span class="original-price">GHS ${product.price_ghc.toFixed(2)}</span> <span class="promo-price">GHS ${product.promo_price.toFixed(2)}</span>`;
    }
    document.getElementById('product-image').src = product.cover_image ? `${API_BASE}/${product.cover_image}` : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
    document.getElementById('short-description').textContent = product.short_description || '';
    document.getElementById('long-description').textContent = product.long_description || '';
    document.getElementById('fabric-type').textContent = product.fabric_type || 'N/A';
    document.getElementById('stock-status').textContent = product.stock_status || 'In Stock';

    // Sizes
    const sizesContainer = document.getElementById('product-sizes');
    if (product.sizes && product.sizes.length > 0) {
        sizesContainer.innerHTML = product.sizes.map(size => `<span class="size-tag">${size}</span>`).join('');
    } else {
        sizesContainer.textContent = 'N/A';
    }

    // Colors
    const colorsContainer = document.getElementById('product-colors');
    if (product.colors && product.colors.length > 0) {
        colorsContainer.innerHTML = product.colors.map(color => `<span class="color-tag">${color}</span>`).join('');
    } else {
        colorsContainer.textContent = 'N/A';
    }

    // Categories
    const categoriesContainer = document.getElementById('product-categories');
    if (product.categories && product.categories.length > 0) {
        categoriesContainer.textContent = product.categories.join(', ');
    } else {
        categoriesContainer.textContent = 'N/A';
    }

    // Add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    addToCartBtn.onclick = () => addToCart(product._id);
}

// Profile page functions
if (window.location.pathname.includes('profile.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        if (!isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        loadUserProfile();
        setupProfileForm();
    });
}

async function loadUserProfile() {
    try {
        const response = await fetch(`${API_BASE}/auth/profile`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const user = await response.json();
            displayUserProfile(user);
            populateProfileForm(user);
        } else if (response.status === 401) {
            // Token expired, try refresh
            if (await refreshAuthToken()) {
                loadUserProfile(); // Retry
            } else {
                logout();
            }
        } else {
            showNotification('Error loading profile');
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        showNotification('Error loading profile');
    }
}

function displayUserProfile(user) {
    const profileInfo = document.getElementById('profile-info');
    if (profileInfo) {
        profileInfo.innerHTML = `
            <div class="info-item">
                <span class="info-label">Name:</span>
                <span class="info-value">${user.name || 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">${user.email || 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Phone:</span>
                <span class="info-value">${user.phone || 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Address:</span>
                <span class="info-value">${user.address || 'N/A'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Member Since:</span>
                <span class="info-value">${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
        `;
    }
}

function populateProfileForm(user) {
    document.getElementById('name').value = user.name || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('address').value = user.address || '';
}

function setupProfileForm() {
    const profileForm = document.getElementById('profile-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    if (profileForm) {
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value
            };

            errorMessage.style.display = 'none';
            successMessage.style.display = 'none';

            try {
                const response = await fetch(`${API_BASE}/auth/profile`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    const updatedUser = await response.json();
                    currentUser = updatedUser;
                    saveAuthState();
                    displayUserProfile(updatedUser);
                    successMessage.textContent = 'Profile updated successfully!';
                    successMessage.style.display = 'block';
                    showNotification('Profile updated successfully!');
                } else if (response.status === 401) {
                    if (await refreshAuthToken()) {
                        setupProfileForm(); // Retry
                    } else {
                        logout();
                    }
                } else {
                    const error = await response.json();
                    errorMessage.textContent = error.message || 'Error updating profile';
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                errorMessage.textContent = 'Network error. Please try again.';
                errorMessage.style.display = 'block';
            }
        });
    }
}

// Contact form handling
if (window.location.pathname.includes('contact.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                showNotification('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            });
        }
    });
}