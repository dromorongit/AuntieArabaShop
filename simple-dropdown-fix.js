// Simple Dropdown Fix - Minimal, Direct Implementation
// This will definitely work - no complex logic, just pure functionality

console.log('Simple dropdown fix script loaded');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready, setting up simple dropdown...');
    
    // Get the categories dropdown trigger and menu
    const categoriesTrigger = document.getElementById('categories-menu');
    const categoriesMenu = document.querySelector('.dropdown-menu');
    
    if (!categoriesTrigger || !categoriesMenu) {
        console.error('Dropdown elements not found!');
        return;
    }
    
    console.log('Found dropdown elements:', { trigger: !!categoriesTrigger, menu: !!categoriesMenu });
    
    // Simple click handler
    categoriesTrigger.addEventListener('click', function(e) {
        e.preventDefault(); // Stop the link from navigating
        console.log('Categories clicked!');
        
        // Check if menu is currently open
        const isOpen = categoriesMenu.classList.contains('dropdown-open');
        
        if (isOpen) {
            // Close menu
            categoriesMenu.classList.remove('dropdown-open');
            categoriesTrigger.setAttribute('aria-expanded', 'false');
            console.log('Menu closed');
        } else {
            // Close all other dropdowns first
            document.querySelectorAll('.dropdown-menu.dropdown-open').forEach(menu => {
                menu.classList.remove('dropdown-open');
            });
            document.querySelectorAll('.dropdown > .nav-link[aria-expanded="true"]').forEach(trigger => {
                trigger.setAttribute('aria-expanded', 'false');
            });
            
            // Open this menu
            categoriesMenu.classList.add('dropdown-open');
            categoriesTrigger.setAttribute('aria-expanded', 'true');
            console.log('Menu opened');
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            categoriesMenu.classList.remove('dropdown-open');
            categoriesTrigger.setAttribute('aria-expanded', 'false');
            console.log('Menu closed (outside click)');
        }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            categoriesMenu.classList.remove('dropdown-open');
            categoriesTrigger.setAttribute('aria-expanded', 'false');
            console.log('Menu closed (Escape key)');
        }
    });
    
    console.log('Simple dropdown setup complete!');
});