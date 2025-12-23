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

// Enhanced Fetch products from API with comprehensive debugging
async function fetchProducts(showNotification = false) {
    console.log('🔄 Starting product fetch from Railway API...');
    console.log('🌐 API Base URL:', API_BASE);
    console.log('📡 Full API Endpoint:', `${API_BASE}/products`);

    try {
        // Add timeout and CORS handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

        console.log('📡 Making API request with CORS...');
        const response = await fetch(`${API_BASE}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache',
            },
            mode: 'cors',
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log('📊 API Response received:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            url: response.url
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('📦 Raw API data received:', data);
        console.log('📈 Data analysis:', {
            isArray: Array.isArray(data),
            length: data?.length,
            type: typeof data,
            firstItem: data?.[0] ? Object.keys(data[0]) : 'No items'
        });

        if (!Array.isArray(data)) {
            throw new Error(`API did not return an array. Got: ${typeof data}`);
        }

        if (data.length === 0) {
            throw new Error('API returned empty product array');
        }

        // Enhanced product mapping with detailed debugging
        const mappedProducts = data.map((product, index) => {
            console.log(`🔍 Mapping product ${index + 1}:`, {
                original_id: product._id,
                name: product.product_name,
                price: product.price_ghc,
                promo: product.promo,
                promo_price: product.promo_price,
                sections: product.sections,
                categories: product.categories,
                stock_status: product.stock_status
            });
            
            const mappedProduct = {
                id: String(product._id || product.id || index + 1),
                name: product.product_name || product.name || `Product ${index + 1}`,
                price: product.promo && product.promo_price ? 
                    parseFloat(product.promo_price) : 
                    parseFloat(product.price_ghc || product.price || 0),
                originalPrice: product.promo ? parseFloat(product.price_ghc || product.price || 0) : null,
                image: product.cover_image || 
                      (product.other_images && product.other_images[0]) || 
                      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
                categories: Array.isArray(product.categories) ? product.categories : 
                           (product.category ? [product.category] : []),
                category: product.categories ? 
                         (Array.isArray(product.categories) ? product.categories[0] : product.categories) : 
                         (product.category || 'general'),
                sections: Array.isArray(product.sections) ? product.sections : 
                         (product.section ? [product.section] : []),
                stock_status: product.stock_status || 'In Stock',
                short_description: product.short_description || product.description || '',
                sizes: product.sizes || [],
                colors: product.colors || [],
                fabric_type: product.fabric_type || ''
            };
            
            console.log(`✅ Mapped product ${index + 1}:`, mappedProduct);
            return mappedProduct;
        });

        console.log('📋 All mapped products:', mappedProducts);

        // Enhanced section filtering with debugging
        const newArrivals = mappedProducts.filter(p => {
            const hasNewArrivals = p.sections && p.sections.includes('New Arrivals');
            console.log(`🆕 "${p.name}" in New Arrivals:`, hasNewArrivals, 'Sections:', p.sections);
            return hasNewArrivals;
        });
        
        const topDeals = mappedProducts.filter(p => {
            const hasTopDeals = p.sections && p.sections.includes('Top Deals');
            console.log(`🏷️ "${p.name}" in Top Deals:`, hasTopDeals, 'Sections:', p.sections);
            return hasTopDeals;
        });
        
        const fastSelling = mappedProducts.filter(p => {
            const hasFastSelling = p.sections && p.sections.includes('Fast Selling Products');
            console.log(`⚡ "${p.name}" in Fast Selling:`, hasFastSelling, 'Sections:', p.sections);
            return hasFastSelling;
        });

        // Update global products object
        products = {
            'new-arrivals': newArrivals,
            'top-deals': topDeals,
            'fast-selling': fastSelling
        };

        console.log('📊 Final products distribution:', {
            'new-arrivals': newArrivals.length,
            'top-deals': topDeals.length,
            'fast-selling': fastSelling.length,
            total: mappedProducts.length
        });

        // Success notification (only show on homepage)
        if (showNotification) {
            showNotification(`✅ Successfully loaded ${mappedProducts.length} products!`, 'success');
        }

    } catch (error) {
        console.error('❌ Error fetching products from Railway API:', error);
        
        let errorMessage = `Failed to load products: ${error.message}`;
        
        if (error.name === 'AbortError') {
            errorMessage = 'Request timed out. Please check your connection.';
        } else if (error.message.includes('CORS')) {
            errorMessage = 'CORS error. Check browser console for details.';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage = 'Network error. Please check your internet connection.';
        }
        
        showNotification(`❌ ${errorMessage} Using demo products.`, 'error');
        console.log('🔄 Falling back to demo products...');

        // Enhanced fallback products based on actual API data structure
        products = {
            'new-arrivals': [
                {
                    id: 'demo-1',
                    name: 'Christmas Night Wear',
                    price: 85.00,
                    image: 'https://res.cloudinary.com/dzngjsqpe/image/upload/v1766282340/auntie-araba-shop-uploads/1766282339892-IMG_2053.jpg',
                    category: 'night-wear',
                    sections: ['New Arrivals'],
                    sizes: ['S', 'L', 'XL'],
                    colors: ['Green'],
                    fabric_type: 'Silk'
                },
                {
                    id: 'demo-2',
                    name: 'Unisex Ash Hoodie Set',
                    price: 130.00,
                    originalPrice: 150.00,
                    image: 'https://res.cloudinary.com/dzngjsqpe/image/upload/v1766296830/auntie-araba-shop-uploads/1766296829560-IMG_2055.jpg',
                    category: '2-in-1-tops',
                    sections: ['New Arrivals', 'Top Deals'],
                    sizes: ['S', 'L'],
                    colors: ['Ash'],
                    fabric_type: 'Cotton-Silk Fabric'
                }
            ],
            'top-deals': [
                {
                    id: 'demo-3',
                    name: 'Unisex Ash Hoodie Set - Special Price',
                    price: 130.00,
                    originalPrice: 150.00,
                    image: 'https://res.cloudinary.com/dzngjsqpe/image/upload/v1766296830/auntie-araba-shop-uploads/1766296829560-IMG_2055.jpg',
                    category: '2-in-1-tops',
                    sections: ['Top Deals']
                }
            ],
            'fast-selling': [
                {
                    id: 'demo-4',
                    name: 'Christmas Night Wear - Best Seller',
                    price: 85.00,
                    image: 'https://res.cloudinary.com/dzngjsqpe/image/upload/v1766282340/auntie-araba-shop-uploads/1766282339892-IMG_2053.jpg',
                    category: 'night-wear',
                    sections: ['Fast Selling Products']
                }
            ]
        };
        
        showNotification('⚠️ Using demo products. Check console for troubleshooting.', 'warning');
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

// Simplified and reliable dropdown functionality
function initializeMobileDropdowns() {
    console.log('Initializing dropdowns...');
    
    const dropdownTriggers = document.querySelectorAll('.dropdown > .nav-link');
    console.log('Found dropdown triggers:', dropdownTriggers.length);

    dropdownTriggers.forEach((trigger, index) => {
        console.log(`Setting up dropdown ${index + 1}:`, trigger.textContent.trim());
        
        // Remove any existing event listeners to prevent duplicates
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);
        
        newTrigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Dropdown clicked:', this.textContent.trim());
            
            const dropdown = this.parentElement;
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!menu) {
                console.error('Dropdown menu not found!');
                return;
            }
            
            // Check current state
            const isOpen = menu.style.display === 'block' || 
                          menu.classList.contains('dropdown-open') ||
                          menu.getAttribute('data-visible') === 'true';

            console.log('Current state - isOpen:', isOpen);

            // Close all other dropdowns first
            document.querySelectorAll('.dropdown-menu').forEach(otherMenu => {
                if (otherMenu !== menu) {
                    closeDropdown(otherMenu);
                }
            });

            // Toggle current dropdown
            if (isOpen) {
                closeDropdown(menu);
                this.setAttribute('aria-expanded', 'false');
            } else {
                openDropdown(menu);
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            console.log('Clicking outside dropdown, closing all');
            closeAllDropdowns();
        }
    });

    // Close dropdowns with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            console.log('Escape key pressed, closing all dropdowns');
            closeAllDropdowns();
        }
    });
    
    console.log('Dropdown initialization complete');
}

// Simplified helper function to open a dropdown
function openDropdown(menu) {
    console.log('Opening dropdown:', menu);
    
    // Show immediately first
    menu.style.display = 'block';
    
    // Then animate in
    setTimeout(() => {
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
        menu.style.transform = 'translateY(0) scale(1)';
        menu.setAttribute('data-visible', 'true');
        
        // Add animation class for smooth transition
        menu.classList.add('dropdown-open');
    }, 10); // Small delay to ensure display change takes effect
    
    console.log('Dropdown opened successfully');
}

// Simplified helper function to close a dropdown
function closeDropdown(menu) {
    console.log('Closing dropdown:', menu);
    
    // Hide using CSS classes and inline styles
    menu.classList.remove('dropdown-open');
    menu.style.opacity = '0';
    menu.style.visibility = 'hidden';
    menu.style.transform = 'translateY(-10px)';
    menu.setAttribute('data-visible', 'false');
    
    // Use a timeout to fully hide after animation
    setTimeout(() => {
        if (!menu.classList.contains('dropdown-open')) {
            menu.style.display = 'none';
        }
    }, 400); // Match CSS transition duration
    
    console.log('Dropdown closed successfully');
}

// Helper function to close all dropdowns
function closeAllDropdowns() {
    console.log('Closing all dropdowns...');
    
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        closeDropdown(menu);
    });
    
    // Reset all aria-expanded attributes
    document.querySelectorAll('.dropdown > .nav-link').forEach(trigger => {
        trigger.setAttribute('aria-expanded', 'false');
    });
    
    console.log('All dropdowns closed');
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
            ${product.originalPrice ?
                `<p class="original-price">GHS ${product.originalPrice.toFixed(2)}</p>` :
                ''}
            <div class="quantity-controls">
                <button class="quantity-btn minus-btn">-</button>
                <span class="quantity-display">1</span>
                <button class="quantity-btn plus-btn">+</button>
            </div>
            <div class="product-buttons">
                <button class="btn btn-primary" onclick="viewProduct('${product.id}')">View More</button>
                <button class="btn btn-secondary">Add to Cart</button>
            </div>
        </div>
    `;

    // Add event listeners for quantity controls
    const minusBtn = card.querySelector('.minus-btn');
    const plusBtn = card.querySelector('.plus-btn');
    const quantityDisplay = card.querySelector('.quantity-display');
    const addToCartBtn = card.querySelector('.btn-secondary');

    minusBtn.addEventListener('click', () => {
        let qty = parseInt(quantityDisplay.textContent);
        if (qty > 1) {
            qty--;
            quantityDisplay.textContent = qty;
        }
    });

    plusBtn.addEventListener('click', () => {
        let qty = parseInt(quantityDisplay.textContent);
        qty++;
        quantityDisplay.textContent = qty;
    });

    addToCartBtn.addEventListener('click', () => {
        const qty = parseInt(quantityDisplay.textContent);
        addToCart(product.id, qty);
    });

    return card;
}

// Add to Cart
function addToCart(productId, quantity = 1) {
    // Find product in all categories
    let product = null;
    for (const category in products) {
        product = products[category].find(p => p.id === productId);
        if (product) break;
    }

    if (product) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({...product, quantity: quantity});
        }

        saveCart();
        updateCartCount();
        showNotification(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`);
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
    await fetchProducts(false); // Ensure products are loaded without notification

    // Map URL slugs to database category names
    const categoryMapping = {
        'ladies-tops': 'Ladies Basic Tops',
        'crop-tops': 'Crop Tops',
        'ladies-hoodies': 'Ladies Hoodies',
        'unisex-hoodies': 'Unisex Hoodies',
        'cropped-hoodies': 'Cropped Hoodies',
        'night-wear': 'Night Wear',
        'bum-shorts': 'Bum Shorts',
        'two-in-one-night': '2-in-1 Night Wears',
        'two-in-one-tops': '2-in-1 Tops and Downs',
        'jalabiyas': 'Jalabiyas',
        'abayas': 'Abayas',
        'modest-long-dresses': 'Modest Long Dresses',
        'elegant-dresses': 'Elegant Dresses',
        'stylish-dresses': 'Stylish Dresses',
        'office-dresses': 'Office Dresses',
        'casual-dresses': 'Casual Dresses',
        'bodycon-dresses': 'Bodycon Dresses',
        'maxi-dresses': 'Maxi Dresses',
        'two-piece-casual-sets': 'Two-Piece Casual Sets',
        'lounge-sets': 'Lounge Sets',
        'top-trouser-sets': 'Top & Trouser Sets',
        'leggings': 'Leggings',
        'trousers': 'Trousers',
        'palazzo-pants': 'Palazzo Pants',
        'skirts': 'Skirts',
        'panties': 'Panties',
        'scarves-headwraps': 'Scarves/Headwraps',
        'sleep-caps': 'Sleep Caps',
        'nfl-jerseys': 'Unisex NFL Jerseys',
        'other-ladies': 'Other Ladies Fashion Items'
    };

    const targetCategory = categoryMapping[categorySlug];

    if (!targetCategory) {
        console.warn('Unknown category slug:', categorySlug);
        return [];
    }

    console.log('Loading products for category:', categorySlug, '->', targetCategory);

    // Filter products from all sections that have this category
    // Use a Set to track unique product IDs and prevent duplicates
    const uniqueProductIds = new Set();
    const categoryProducts = [];
    
    Object.values(products).forEach(sectionProducts => {
        sectionProducts.forEach(product => {
            if (product.categories && product.categories.includes(targetCategory)) {
                // Only add if we haven't seen this product ID before
                if (!uniqueProductIds.has(product.id)) {
                    uniqueProductIds.add(product.id);
                    categoryProducts.push(product);
                }
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
                'ladies-hoodies': 'Ladies Hoodies',
                'unisex-hoodies': 'Unisex Hoodies',
                'cropped-hoodies': 'Cropped Hoodies',
                'night-wear': 'Night Wear',
                'bum-shorts': 'Bum Shorts',
                'two-in-one-night': '2-in-1 Night Wears',
                'two-in-one-tops': '2-in-1 Tops and Downs',
                'jalabiyas': 'Jalabiyas',
                'abayas': 'Abayas',
                'modest-long-dresses': 'Modest Long Dresses',
                'elegant-dresses': 'Elegant Dresses',
                'stylish-dresses': 'Stylish Dresses',
                'office-dresses': 'Office Dresses',
                'casual-dresses': 'Casual Dresses',
                'bodycon-dresses': 'Bodycon Dresses',
                'maxi-dresses': 'Maxi Dresses',
                'two-piece-casual-sets': 'Two-Piece Casual Sets',
                'lounge-sets': 'Lounge Sets',
                'top-trouser-sets': 'Top & Trouser Sets',
                'leggings': 'Leggings',
                'trousers': 'Trousers',
                'palazzo-pants': 'Palazzo Pants',
                'skirts': 'Skirts',
                'panties': 'Panties',
                'scarves-headwraps': 'Scarves/Headwraps',
                'sleep-caps': 'Sleep Caps',
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
    // Debug logging for image fields in product details
    console.log('Product details image fields:', {
        cover_image: product.cover_image,
        image: product.image,
        images: product.images,
        all_fields: Object.keys(product)
    });
    
    document.getElementById('product-name').textContent = product.product_name;
    document.getElementById('product-price').textContent = `GHS ${product.price_ghc.toFixed(2)}`;
    if (product.promo && product.promo_price) {
        document.getElementById('product-price').innerHTML = `<span class="original-price">GHS ${product.price_ghc.toFixed(2)}</span> <span class="promo-price">GHS ${product.promo_price.toFixed(2)}</span>`;
    }
    document.getElementById('product-image').src = product.cover_image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop';
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

    // Video
    const videoContainer = document.getElementById('product-video');
    if (product.video || product.cover_video) {
        const videoSrc = product.video || product.cover_video;
        videoContainer.innerHTML = `<video controls style="max-width: 100%; height: auto; border-radius: 10px;"><source src="${videoSrc}" type="video/mp4">Your browser does not support the video tag.</video>`;
        videoContainer.style.display = 'block';
    } else {
        videoContainer.style.display = 'none';
    }

    // Additional Images Gallery
    const galleryContainer = document.getElementById('product-gallery');
    const mainImage = document.getElementById('product-image');
    if (product.images && product.images.length > 0) {
        const allImages = [product.cover_image, ...product.images].filter(img => img);
        galleryContainer.innerHTML = allImages.map((img, index) => `
            <div class="gallery-thumb ${index === 0 ? 'active' : ''}" data-src="${img}">
                <img src="${img}" alt="Product image ${index + 1}">
            </div>
        `).join('');
        galleryContainer.style.display = 'flex';

        // Add click handlers to thumbnails
        galleryContainer.querySelectorAll('.gallery-thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
                const src = thumb.dataset.src;
                mainImage.src = src;
                // Update active class
                galleryContainer.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    } else {
        galleryContainer.style.display = 'none';
    }

    // Add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    addToCartBtn.onclick = () => {
        const quantity = parseInt(document.getElementById('quantity-display').textContent);
        addToCart(product._id, quantity);
    };

    // Quantity controls
    const minusBtn = document.getElementById('quantity-minus');
    const plusBtn = document.getElementById('quantity-plus');
    const quantityDisplay = document.getElementById('quantity-display');

    minusBtn.addEventListener('click', () => {
        let qty = parseInt(quantityDisplay.textContent);
        if (qty > 1) {
            qty--;
            quantityDisplay.textContent = qty;
        }
    });

    plusBtn.addEventListener('click', () => {
        let qty = parseInt(quantityDisplay.textContent);
        qty++;
        quantityDisplay.textContent = qty;
    });
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
            <div class="whatsapp-badge">1</div>
            <span class="whatsapp-tooltip">💬 Chat with us on WhatsApp</span>
        </a>
    `;

    // Add CSS for the floating icon
    const style = document.createElement('style');
    style.innerHTML = `
        #whatsapp-float {
            position: fixed;
            width: 70px;
            height: 70px;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
            color: #FFF;
            border-radius: 50%;
            text-align: center;
            font-size: 32px;
            box-shadow: 0 8px 32px rgba(37, 211, 102, 0.4);
            z-index: 1000;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            border: 3px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            animation: pulse 2s infinite;
        }

        #whatsapp-float:hover {
            transform: scale(1.15) translateY(-5px);
            box-shadow: 0 15px 40px rgba(37, 211, 102, 0.6);
            background: linear-gradient(135deg, #20b858 0%, #0e7a6f 100%);
        }

        #whatsapp-float i {
            margin-top: 18px;
            display: block;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        @keyframes pulse {
            0% {
                box-shadow: 0 8px 32px rgba(37, 211, 102, 0.4);
            }
            50% {
                box-shadow: 0 8px 32px rgba(37, 211, 102, 0.7), 0 0 0 10px rgba(37, 211, 102, 0.1);
            }
            100% {
                box-shadow: 0 8px 32px rgba(37, 211, 102, 0.4);
            }
        }

        .whatsapp-tooltip {
            position: absolute;
            left: -180px;
            top: 50%;
            transform: translateY(-50%);
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: #fff;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        }

        .whatsapp-tooltip:before {
            content: '';
            position: absolute;
            right: -8px;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-left: 10px solid #2c3e50;
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
        }

        #whatsapp-float:hover .whatsapp-tooltip {
            opacity: 1;
            visibility: visible;
            transform: translateY(-50%) translateX(-10px);
        }

        /* Make it draggable */
        #whatsapp-float.dragging {
            cursor: grabbing;
            opacity: 0.8;
            animation: none;
        }

        /* Floating animation */
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
        }

        #whatsapp-float {
            animation: float 3s ease-in-out infinite;
        }

        /* Notification badge */
        .whatsapp-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ff4757;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            border: 2px solid white;
            animation: bounce 1s infinite;
        }

        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-5px);
            }
            60% {
                transform: translateY(-3px);
            }
        }

        /* Ripple effect */
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        /* Typing indicator animation */
        .whatsapp-typing {
            position: absolute;
            bottom: 80px;
            right: 30px;
            background: #fff;
            padding: 10px 15px;
            border-radius: 20px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            font-size: 12px;
            color: #333;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        }

        .whatsapp-typing.show {
            opacity: 1;
            transform: translateY(0);
        }

        .typing-dots {
            display: inline-flex;
            align-items: center;
        }

        .typing-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #25d366;
            margin: 0 1px;
            animation: typing 1.4s infinite ease-in-out;
        }

        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
            0%, 80%, 100% {
                transform: scale(0.8);
                opacity: 0.5;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }

        /* Enhanced responsiveness */
        @media (max-width: 768px) {
            #whatsapp-float {
                width: 60px;
                height: 60px;
                font-size: 28px;
                bottom: 20px;
                right: 20px;
            }
            
            #whatsapp-float i {
                margin-top: 16px;
            }
        }
    `;

    // Add elements to the body
    document.body.appendChild(style);
    document.body.appendChild(whatsappIcon);

    // Add interactive effects
    addInteractiveEffects(whatsappIcon);

    // Make it draggable
    makeDraggable(whatsappIcon);
}

function addInteractiveEffects(element) {
    let hoverTimeout;
    let typingIndicator;
    
    // Add click ripple effect
    element.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = (e.offsetX - 10) + 'px';
        ripple.style.top = (e.offsetY - 10) + 'px';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.pointerEvents = 'none';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
    
    // Add typing indicator on hover
    element.addEventListener('mouseenter', function() {
        hoverTimeout = setTimeout(() => {
            showTypingIndicator(element);
        }, 2000);
    });
    
    element.addEventListener('mouseleave', function() {
        clearTimeout(hoverTimeout);
        hideTypingIndicator();
    });
}

function showTypingIndicator(element) {
    if (document.querySelector('.whatsapp-typing')) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'whatsapp-typing';
    typingDiv.innerHTML = `
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
        <span style="margin-left: 8px;">Customer service is typing...</span>
    `;
    
    document.body.appendChild(typingDiv);
    
    setTimeout(() => {
        typingDiv.classList.add('show');
    }, 100);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        hideTypingIndicator();
    }, 3000);
}

function hideTypingIndicator() {
    const typingDiv = document.querySelector('.whatsapp-typing');
    if (typingDiv) {
        typingDiv.classList.remove('show');
        setTimeout(() => {
            typingDiv.remove();
        }, 300);
    }
    
    // Add entrance animation
    element.style.opacity = '0';
    element.style.transform = 'scale(0) translateY(20px)';
    
    setTimeout(() => {
        element.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        element.style.opacity = '1';
        element.style.transform = 'scale(1) translateY(0)';
    }, 500);
    
    // Add hover sound effect simulation with visual feedback
    element.addEventListener('mouseenter', function() {
        this.style.animation = 'float 3s ease-in-out infinite, pulse 2s infinite';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.animation = 'float 3s ease-in-out infinite';
    });
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

// Enhanced Category Routing System
class CategoryRouter {
    constructor() {
        this.routes = {
            'category': this.handleCategoryRoute.bind(this)
        };
        this.init();
    }

    init() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Handle initial load
        this.handleRoute();
    }

    handleRoute() {
        const hash = window.location.hash.substring(1); // Remove #
        const pathParts = hash.split('/');
        
        if (pathParts.length >= 2 && pathParts[0] === 'category') {
            const categorySlug = pathParts[1];
            this.routes['category'](categorySlug);
        } else {
            // Handle legacy URL format (category.html?cat=...)
            this.handleLegacyUrl();
        }
    }

    handleLegacyUrl() {
        const category = getUrlParameter('cat');
        if (category && window.location.pathname.includes('category.html')) {
            // Convert legacy URL to new format and redirect
            const newUrl = `#/category/${category}`;
            window.history.replaceState(null, null, newUrl);
            this.routes['category'](category);
        }
    }

    async handleCategoryRoute(categorySlug) {
        const categoryTitle = document.getElementById('category-title');
        const productsContainer = document.getElementById('category-products');

        if (!categoryTitle || !productsContainer) {
            console.warn('Category page elements not found');
            return;
        }

        // Clear existing products
        productsContainer.innerHTML = '';
        
        // Show loading state
        setLoading(productsContainer, true);

        try {
            // Update page title and breadcrumb
            const categoryNames = {
                'ladies-tops': 'Ladies Basic Tops',
                'crop-tops': 'Crop Tops',
                'ladies-hoodies': 'Ladies Hoodies',
                'unisex-hoodies': 'Unisex Hoodies',
                'cropped-hoodies': 'Cropped Hoodies',
                'night-wear': 'Night Wear',
                'bum-shorts': 'Bum Shorts',
                'two-in-one-night': '2-in-1 Night Wears',
                'two-in-one-tops': '2-in-1 Tops and Downs',
                'jalabiyas': 'Jalabiyas',
                'abayas': 'Abayas',
                'modest-long-dresses': 'Modest Long Dresses',
                'elegant-dresses': 'Elegant Dresses',
                'stylish-dresses': 'Stylish Dresses',
                'office-dresses': 'Office Dresses',
                'casual-dresses': 'Casual Dresses',
                'bodycon-dresses': 'Bodycon Dresses',
                'maxi-dresses': 'Maxi Dresses',
                'two-piece-casual-sets': 'Two-Piece Casual Sets',
                'lounge-sets': 'Lounge Sets',
                'top-trouser-sets': 'Top & Trouser Sets',
                'leggings': 'Leggings',
                'trousers': 'Trousers',
                'palazzo-pants': 'Palazzo Pants',
                'skirts': 'Skirts',
                'panties': 'Panties',
                'scarves-headwraps': 'Scarves/Headwraps',
                'sleep-caps': 'Sleep Caps',
                'nfl-jerseys': 'Unisex NFL Jerseys',
                'other-ladies': 'Other Ladies Fashion Items'
            };

            const categoryName = categoryNames[categorySlug] || 'Products';
            categoryTitle.textContent = categoryName;
            
            // Update page title
            document.title = `${categoryName} - Shop with Auntie Araba`;
            
            // Update breadcrumb
            this.updateBreadcrumb(categoryName);

            // Load and display products
            const categoryProducts = await loadCategoryProducts(categorySlug);
            
            setLoading(productsContainer, false);
            
            if (categoryProducts.length > 0) {
                categoryProducts.forEach(product => {
                    productsContainer.appendChild(createProductCard(product));
                });
            } else {
                productsContainer.innerHTML = `
                    <div class="no-products" style="text-align: center; padding: 3rem; color: #666;">
                        <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 1rem; color: #ddd;"></i>
                        <h3>No products found in ${categoryName}</h3>
                        <p>We're constantly updating our inventory. Check back soon!</p>
                        <a href="categories.html" class="btn btn-primary" style="margin-top: 1rem;">Browse All Categories</a>
                    </div>
                `;
            }
            
        } catch (error) {
            console.error('Error loading category products:', error);
            setLoading(productsContainer, false);
            productsContainer.innerHTML = `
                <div class="error-message" style="text-align: center; padding: 3rem; color: #ff4444;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h3>Error loading products</h3>
                    <p>Please try again later.</p>
                </div>
            `;
        }
    }

    updateBreadcrumb(categoryName) {
        const breadcrumb = document.querySelector('.breadcrumb .container');
        if (breadcrumb) {
            breadcrumb.innerHTML = `
                <a href="index.html">Home</a>
                <i class="fas fa-chevron-right"></i>
                <a href="categories.html">Categories</a>
                <i class="fas fa-chevron-right"></i>
                <span>${categoryName}</span>
            `;
        }
    }

    navigateToCategoryPage(categorySlug) {
        // For navigation links that should go to category page
        if (window.location.pathname.includes('category.html')) {
            window.location.hash = `#/category/${categorySlug}`;
        } else {
            // Redirect to category page with hash routing
            window.location.href = `category.html#category/${categorySlug}`;
        }
    }
}

// Initialize router globally
let router;
document.addEventListener('DOMContentLoaded', function() {
    router = new CategoryRouter();
});

// Navigation function for category links
function navigateToCategory(categorySlug) {
    if (router) {
        router.navigateToCategoryPage(categorySlug);
    } else {
        // Fallback to direct navigation
        window.location.href = `category.html#category/${categorySlug}`;
    }
}