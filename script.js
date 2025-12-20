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

// Authentication removed - no user accounts

// Performance optimizations
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Loading states management
const loadingStates = new Map();
const originalContent = new Map();

function setLoading(element, isLoading) {
    if (!element) return;

    const elementId = element.id || element.className || 'unknown';
    loadingStates.set(elementId, isLoading);

    if (isLoading) {
        // Store original content
        if (!originalContent.has(elementId)) {
            originalContent.set(elementId, element.innerHTML);
        }
        element.style.opacity = '0.6';
        element.style.pointerEvents = 'none';
        element.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i><p>Loading products...</p></div>';
    } else {
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';
        // Restore original content
        const original = originalContent.get(elementId);
        if (original) {
            element.innerHTML = original;
        }
    }
}

// Micro-interactions
function addRippleEffect(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', addRippleEffect);
    });
});

// Fetch products from API
async function fetchProducts() {
    console.log('Fetching products from API:', `${API_BASE}/products`);

    try {
        const response = await fetch(`${API_BASE}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add any required headers for your backend
                // 'Authorization': 'Bearer YOUR_TOKEN_HERE', // Uncomment if needed
            }
        });

        console.log('API Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response data:', data);

        if (!Array.isArray(data)) {
            throw new Error('API did not return an array of products');
        }

        // Map API data to shop format
        const mappedProducts = data.map((product, index) => ({
            id: String(product._id || product.id || index + 1),
            name: product.product_name || product.name || 'Unknown Product',
            price: product.promo && product.promo_price ? parseFloat(product.promo_price) : parseFloat(product.price_ghc || product.price || 0),
            originalPrice: product.promo ? parseFloat(product.price_ghc || product.price || 0) : null,
            image: product.cover_image ? `${API_BASE}/${product.cover_image}` : (product.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'),
            categories: Array.isArray(product.categories) ? product.categories : (product.category ? [product.category] : []),
            category: product.categories ? (Array.isArray(product.categories) ? product.categories[0] : product.categories) : (product.category || 'general'),
            sections: Array.isArray(product.sections) ? product.sections : (product.section ? [product.section] : []),
            stock_status: product.stock_status || 'In Stock',
            short_description: product.short_description || product.description || ''
        }));

        console.log('Mapped products:', mappedProducts);

        // Assign to sections based on product's sections field
        products['new-arrivals'] = mappedProducts.filter(p => p.sections && p.sections.includes('New Arrivals'));
        products['top-deals'] = mappedProducts.filter(p => p.sections && p.sections.includes('Top Deals'));
        products['fast-selling'] = mappedProducts.filter(p => p.sections && p.sections.includes('Fast Selling Products'));

        console.log('Products by section:', {
            'new-arrivals': products['new-arrivals'].length,
            'top-deals': products['top-deals'].length,
            'fast-selling': products['fast-selling'].length
        });

        showNotification(`Loaded ${mappedProducts.length} products from your backend!`, 'success');

    } catch (error) {
        console.error('Error fetching products from backend:', error);
        showNotification(`Failed to load products: ${error.message}. Using demo products.`, 'error');

        // Fallback to hardcoded products if API fails
        products = {
            'new-arrivals': [
                {
                    id: '1',
                    name: 'Elegant Pink Crop Top',
                    price: 85.00,
                    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
                    category: 'crop-tops',
                    sections: ['New Arrivals']
                },
                {
                    id: '2',
                    name: 'Classic White Blouse',
                    price: 75.00,
                    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
                    category: 'ladies-tops',
                    sections: ['New Arrivals']
                },
                {
                    id: '3',
                    name: 'Stylish Denim Jacket',
                    price: 120.00,
                    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400&h=400&fit=crop',
                    category: 'other-ladies',
                    sections: ['New Arrivals']
                }
            ],
            'top-deals': [
                {
                    id: '4',
                    name: 'Summer Crop Top - 20% OFF',
                    price: 60.00,
                    originalPrice: 75.00,
                    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
                    category: 'crop-tops',
                    sections: ['Top Deals']
                }
            ],
            'fast-selling': [
                {
                    id: '5',
                    name: 'Bestseller Night Wear',
                    price: 90.00,
                    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
                    category: 'night-wear',
                    sections: ['Fast Selling Products']
                }
            ]
        };
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async function() {
    await fetchProducts();
    initializeCarousel();
    loadProducts();
    loadCart();
    updateCartCount();
    initializeMobileDropdowns();
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
        setLoading(newArrivalsContainer, false); // Clear any loading state
        if (products['new-arrivals'].length > 0) {
            products['new-arrivals'].forEach(product => {
                newArrivalsContainer.appendChild(createProductCard(product));
            });
        } else {
            newArrivalsContainer.innerHTML = '<p class="no-products">No new arrivals available at the moment.</p>';
        }
    }

    // Load top deals
    const topDealsContainer = document.getElementById('top-deals');
    if (topDealsContainer) {
        setLoading(topDealsContainer, false); // Clear any loading state
        if (products['top-deals'].length > 0) {
            products['top-deals'].forEach(product => {
                topDealsContainer.appendChild(createProductCard(product, true));
            });
        } else {
            topDealsContainer.innerHTML = '<p class="no-products">No deals available at the moment.</p>';
        }
    }

    // Load fast selling
    const fastSellingContainer = document.getElementById('fast-selling');
    if (fastSellingContainer) {
        setLoading(fastSellingContainer, false); // Clear any loading state
        if (products['fast-selling'].length > 0) {
            products['fast-selling'].forEach(product => {
                fastSellingContainer.appendChild(createProductCard(product));
            });
        } else {
            fastSellingContainer.innerHTML = '<p class="no-products">No fast selling products at the moment.</p>';
        }
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

// Navigation update removed - no authentication

// View Product
function viewProduct(productId) {
    window.location.href = `product.html?id=${productId}`;
}

// Show Notification
function showNotification(message, type = 'success') {
    const notificationTypes = {
        success: { icon: 'fa-check-circle', color: 'var(--gradient-primary)' },
        error: { icon: 'fa-exclamation-circle', color: 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)' },
        info: { icon: 'fa-info-circle', color: 'linear-gradient(135deg, #2196F3 0%, #0D47A1 100%)' },
        warning: { icon: 'fa-exclamation-triangle', color: 'linear-gradient(135deg, #FF9800 0%, #E65100 100%)' }
    };

    const config = notificationTypes[type] || notificationTypes.success;

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas ${config.icon}"></i>
        <span>${message}</span>
    `;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: config.color,
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '15px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontWeight: '500',
        transform: 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 4000);
}

// Login/Register forms removed - no authentication

// Category Page Functions
async function loadCategoryProducts(categorySlug) {
    await fetchProducts(); // Ensure products are loaded
    const categoryProducts = [];

    // Map URL slugs to database category names
    const categoryMapping = {
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

    const targetCategory = categoryMapping[categorySlug];

    if (!targetCategory) {
        console.warn('Unknown category slug:', categorySlug);
        return categoryProducts;
    }

    console.log('Loading products for category:', categorySlug, '->', targetCategory);

    // Filter products from all sections that have this category
    Object.values(products).forEach(sectionProducts => {
        sectionProducts.forEach(product => {
            if (product.categories && product.categories.includes(targetCategory)) {
                categoryProducts.push(product);
            }
        });
    });

    console.log('Found', categoryProducts.length, 'products for category:', targetCategory);
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
        const total = subtotal; // No shipping fee, no tax

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
    console.log('Loading product details for ID:', productId);

    fetch(`${API_BASE}/products/${productId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Add any required headers for your backend
            // 'Authorization': 'Bearer YOUR_TOKEN_HERE', // Uncomment if needed
        }
    })
        .then(response => {
            console.log('Product details response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(product => {
            console.log('Product details:', product);
            displayProductDetails(product);
        })
        .catch(error => {
            console.error('Error loading product details:', error);
            showNotification(`Error loading product details: ${error.message}`, 'error');
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

// Profile page functions removed - no authentication

// Contact form handling
if (window.location.pathname.includes('contact.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form values
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const subject = document.getElementById('subject').value;
                const message = document.getElementById('message').value;
                
                // Create WhatsApp message
                const whatsappMessage = encodeURIComponent(
                    `New Contact Message:\n\n` +
                    `Name: ${name}\n` +
                    `Email: ${email}\n` +
                    `${phone ? `Phone: ${phone}\n` : ''}` +
                    `Subject: ${subject}\n\n` +
                    `Message: ${message}`
                );
                
                // Redirect to WhatsApp
                window.location.href = `https://wa.me/233244152807?text=${whatsappMessage}`;
                
                // Show notification and reset form
                showNotification('Redirecting to WhatsApp to send your message...');
                setTimeout(() => {
                    contactForm.reset();
                }, 1000);
            });
        }
    });
}

// WhatsApp Floating Icon
function createWhatsAppFloatingIcon() {
    // Create the floating icon element
    const whatsappIcon = document.createElement('div');
    whatsappIcon.id = 'whatsapp-float';
    whatsappIcon.innerHTML = `
        <a href="https://wa.me/233244152807" target="_blank" class="whatsapp-link">
            <i class="fab fa-whatsapp"></i>
            <span class="whatsapp-tooltip">Chat with us on WhatsApp</span>
        </a>
    `;

    // Add CSS for the floating icon
    const style = document.createElement('style');
    style.innerHTML = `
        #whatsapp-float {
            position: fixed;
            width: 60px;
            height: 60px;
            bottom: 40px;
            right: 40px;
            background-color: #25d366;
            color: #FFF;
            border-radius: 50px;
            text-align: center;
            font-size: 30px;
            box-shadow: 2px 2px 3px #999;
            z-index: 1000;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        #whatsapp-float:hover {
            transform: scale(1.1);
            box-shadow: 2px 2px 5px #888;
        }

        #whatsapp-float i {
            margin-top: 16px;
            display: block;
        }

        .whatsapp-tooltip {
            position: absolute;
            left: -160px;
            top: 50%;
            transform: translateY(-50%);
            background: #333;
            color: #fff;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
        }

        .whatsapp-tooltip:after {
            content: '';
            position: absolute;
            right: -8px;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid #333;
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
        }

        #whatsapp-float:hover .whatsapp-tooltip {
            opacity: 1;
            visibility: visible;
        }

        /* Make it draggable */
        #whatsapp-float.dragging {
            cursor: grabbing;
            opacity: 0.8;
        }
    `;

    // Add elements to the body
    document.body.appendChild(style);
    document.body.appendChild(whatsappIcon);

    // Make it draggable
    makeDraggable(whatsappIcon);
}

function makeDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves
        document.onmousemove = elementDrag;
        element.classList.add('dragging');
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.right = (element.offsetRight - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released
        document.onmouseup = null;
        document.onmousemove = null;
        element.classList.remove('dragging');
    }
}

// Initialize WhatsApp icon on all pages
document.addEventListener('DOMContentLoaded', function() {
    createWhatsAppFloatingIcon();
});