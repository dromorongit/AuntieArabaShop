// Enhanced fetch products function with better debugging
async function fetchProductsEnhanced() {
    console.log('🔄 Starting enhanced product fetch...');
    console.log('API Base URL:', API_BASE);

    try {
        // Test connectivity first
        console.log('🌐 Testing basic connectivity...');
        const connectivityTest = await fetch(`${API_BASE}/products`, {
            method: 'HEAD',
            mode: 'cors'
        });
        console.log('✅ Connectivity test passed:', connectivityTest.status);

        // Fetch products with timeout
        console.log('📡 Fetching products from:', `${API_BASE}/products`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

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
        console.log('📊 Response received:', {
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
            firstItemKeys: data?.[0] ? Object.keys(data[0]) : 'No items'
        });

        if (!Array.isArray(data)) {
            throw new Error('API did not return an array of products. Got: ' + typeof data);
        }

        if (data.length === 0) {
            console.warn('⚠️ API returned empty array');
            throw new Error('API returned no products');
        }

        // Enhanced product mapping with extensive debugging
        const mappedProducts = data.map((product, index) => {
            console.log(`🔍 Mapping product ${index + 1}:`, {
                original_id: product._id,
                name: product.product_name,
                price: product.price_ghc,
                sections: product.sections,
                categories: product.categories,
                image_fields: {
                    cover_image: product.cover_image,
                    has_cover_image: !!product.cover_image
                }
            });
            
            const mappedProduct = {
                id: String(product._id || product.id || index + 1),
                name: product.product_name || product.name || `Product ${index + 1}`,
                price: product.promo && product.promo_price ? 
                    parseFloat(product.promo_price) : 
                    parseFloat(product.price_ghc || product.price || 0),
                originalPrice: product.promo ? parseFloat(product.price_ghc || product.price || 0) : null,
                image: product.cover_image || product.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
                categories: Array.isArray(product.categories) ? product.categories : 
                           (product.category ? [product.category] : []),
                category: product.categories ? 
                         (Array.isArray(product.categories) ? product.categories[0] : product.categories) : 
                         (product.category || 'general'),
                sections: Array.isArray(product.sections) ? product.sections : 
                         (product.section ? [product.section] : []),
                stock_status: product.stock_status || 'In Stock',
                short_description: product.short_description || product.description || ''
            };
            
            console.log(`✅ Mapped product ${index + 1}:`, mappedProduct);
            return mappedProduct;
        });

        console.log('📋 All mapped products:', mappedProducts);

        // Enhanced section filtering with debugging
        const newArrivals = mappedProducts.filter(p => {
            const hasNewArrivals = p.sections && p.sections.includes('New Arrivals');
            console.log(`🆕 Product "${p.name}" in New Arrivals:`, hasNewArrivals, 'Sections:', p.sections);
            return hasNewArrivals;
        });
        
        const topDeals = mappedProducts.filter(p => {
            const hasTopDeals = p.sections && p.sections.includes('Top Deals');
            console.log(`🏷️ Product "${p.name}" in Top Deals:`, hasTopDeals, 'Sections:', p.sections);
            return hasTopDeals;
        });
        
        const fastSelling = mappedProducts.filter(p => {
            const hasFastSelling = p.sections && p.sections.includes('Fast Selling Products');
            console.log(`⚡ Product "${p.name}" in Fast Selling:`, hasFastSelling, 'Sections:', p.sections);
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

        // Show success notification
        showNotification(`Successfully loaded ${mappedProducts.length} products!`, 'success');

        return true;

    } catch (error) {
        console.error('❌ Error fetching products:', error);
        
        let errorMessage = `Failed to load products: ${error.message}`;
        
        if (error.name === 'AbortError') {
            errorMessage = 'Request timed out. Please check your connection.';
        } else if (error.message.includes('CORS')) {
            errorMessage = 'CORS error. The API might not allow cross-origin requests.';
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
            errorMessage = 'Network error. Please check your internet connection.';
        }
        
        showNotification(errorMessage, 'error');
        
        // Fallback to demo products with notification
        console.log('🔄 Falling back to demo products...');
        products = {
            'new-arrivals': [
                {
                    id: 'demo-1',
                    name: 'Demo: Elegant Pink Crop Top',
                    price: 85.00,
                    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
                    category: 'crop-tops',
                    sections: ['New Arrivals']
                },
                {
                    id: 'demo-2',
                    name: 'Demo: Classic White Blouse',
                    price: 75.00,
                    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
                    category: 'ladies-tops',
                    sections: ['New Arrivals']
                }
            ],
            'top-deals': [
                {
                    id: 'demo-3',
                    name: 'Demo: Summer Crop Top - 20% OFF',
                    price: 60.00,
                    originalPrice: 75.00,
                    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
                    category: 'crop-tops',
                    sections: ['Top Deals']
                }
            ],
            'fast-selling': [
                {
                    id: 'demo-4',
                    name: 'Demo: Bestseller Night Wear',
                    price: 90.00,
                    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
                    category: 'night-wear',
                    sections: ['Fast Selling Products']
                }
            ]
        };
        
        showNotification('Using demo products. Check console for details.', 'warning');
        return false;
    }
}