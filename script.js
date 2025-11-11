// Product Data
const products = {
    'new-arrivals': [
        {
            id: 1,
            name: 'Elegant Pink Crop Top',
            price: 85.00,
            image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
            category: 'crop-tops'
        },
        {
            id: 2,
            name: 'Stylish Purple Dress',
            price: 150.00,
            image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop',
            category: 'stylish-dresses'
        },
        {
            id: 3,
            name: 'Premium Night Wear Set',
            price: 95.00,
            image: 'https://images.unsplash.com/photo-1544875707-687723820b25?w=400&h=400&fit=crop',
            category: 'night-wear'
        },
        {
            id: 4,
            name: 'Office Professional Dress',
            price: 120.00,
            image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
            category: 'office-dresses'
        }
    ],
    'top-deals': [
        {
            id: 5,
            name: 'Basic Ladies Top - Buy 2 Get 1',
            price: 65.00,
            originalPrice: 85.00,
            image: 'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=400&h=400&fit=crop',
            category: 'ladies-tops'
        },
        {
            id: 6,
            name: '2-in-1 Night Wear Special',
            price: 110.00,
            originalPrice: 140.00,
            image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop',
            category: 'two-in-one-night'
        },
        {
            id: 7,
            name: 'Bum Shorts Bundle',
            price: 45.00,
            originalPrice: 60.00,
            image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=400&fit=crop',
            category: 'bum-shorts'
        }
    ],
    'fast-selling': [
        {
            id: 8,
            name: 'Unisex NFL Jersey',
            price: 75.00,
            image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
            category: 'nfl-jerseys'
        },
        {
            id: 9,
            name: 'Luxury Panties Set',
            price: 35.00,
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
            category: 'panties'
        },
        {
            id: 10,
            name: 'Elegant Evening Dress',
            price: 180.00,
            image: 'https://images.unsplash.com/photo-1566479179817-c4ad2a6d7b0b?w=400&h=400&fit=crop',
            category: 'elegant-dresses'
        }
    ]
};

// Shopping Cart
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    loadProducts();
    loadCart();
    updateCartCount();
});

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
                <button class="btn btn-primary" onclick="viewProduct(${product.id})">View More</button>
                <button class="btn btn-secondary" onclick="addToCart(${product.id})">Add to Cart</button>
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

// View Product (placeholder for now)
function viewProduct(productId) {
    showNotification('Product details coming soon!');
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

// Category Page Functions
function loadCategoryProducts(category) {
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
    document.addEventListener('DOMContentLoaded', function() {
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
            
            const categoryProducts = loadCategoryProducts(category);
            categoryProducts.forEach(product => {
                productsContainer.appendChild(createProductCard(product));
            });
        }
    });
}

// Cart page functions
if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        renderCart();
        updateCartSummary();
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
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-total">
                GHS ${itemTotal.toFixed(2)}
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartContainer.appendChild(cartItem);
    });
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
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
    const cartTax = document.getElementById('cart-tax');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartSubtotal && cartTax && cartTotal) {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = subtotal * 0.12; // 12% tax
        const total = subtotal + tax + 15; // +15 shipping
        
        cartSubtotal.textContent = `GHS ${subtotal.toFixed(2)}`;
        cartTax.textContent = `GHS ${tax.toFixed(2)}`;
        cartTotal.textContent = `GHS ${total.toFixed(2)}`;
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    showNotification('Checkout functionality will be implemented soon!');
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