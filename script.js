// Function to toggle the navigation menu on mobile
function toggleMenu() {
    const navLinks = document.getElementById("navLinks"); // Get the nav links element
    navLinks.classList.toggle("active"); // Add or remove the 'active' class to show/hide
}

// Offset anchor scroll for sticky header on dropdown menu links
function scrollWithOffset(href, offset) {
    const target = document.querySelector(href);
    if (target) {
        const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
}
document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            // Hide dropdown menu immediately (for mobile)
            var dropdownMenu = document.querySelector('.nav-dropdown .dropdown-menu');
            if (dropdownMenu && window.innerWidth < 800) {
                dropdownMenu.style.display = 'none';
            }
            // Wait longer for reflow/layout before scrolling
            setTimeout(function() {
                scrollWithOffset(href, 100); // 32px = header height
            }, 100);
            // Close mobile nav menu if open
            const navLinks = document.getElementById("navLinks");
            if (navLinks && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
            }
        }
    });
});

// On page load, scroll to anchor with offset if hash is present
window.addEventListener('DOMContentLoaded', function() {
    if (window.location.hash) {
        setTimeout(function() {
            scrollWithOffset(window.location.hash, 100); // 100px = header height
        }, 100);
    }
    
    // Initialize product search and filter functionality
    initializeProductFilters();
});

// =============================
// Product Search Functionality
// =============================
function initializeProductFilters() {
    const searchInput = document.getElementById('productSearch');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    // Only initialize if we're on the products page
    if (!searchInput) return;
    
    const productGroups = document.querySelectorAll('.product-group');
    
    // Filter products by search term
    function filterBySearch(searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        let hasVisibleProducts = false;
        
        productGroups.forEach(group => {
            const products = group.querySelectorAll('.product-card');
            let groupHasVisible = false;
            
            products.forEach(product => {
                const productText = product.textContent.toLowerCase();
                const isVisible = searchTerm.length === 0 || productText.includes(searchLower);
                
                // Remove existing highlights
                const span = product.querySelector('span');
                span.innerHTML = span.textContent;
                
                if (isVisible) {
                    product.classList.remove('hidden');
                    groupHasVisible = true;
                    hasVisibleProducts = true;
                    
                    // Highlight matching text if there's a search term
                    if (searchTerm.length > 0) {
                        const regex = new RegExp(`(${searchTerm})`, 'gi');
                        span.innerHTML = span.textContent.replace(regex, '<span class="highlight">$1</span>');
                    }
                } else {
                    product.classList.add('hidden');
                }
            });
            
            // Show/hide group based on whether it has visible products
            if (groupHasVisible) {
                group.classList.remove('hidden');
            } else {
                group.classList.add('hidden');
            }
        });
        
        // Show/hide clear button
        clearFiltersBtn.style.display = searchTerm.length > 0 ? 'inline-block' : 'none';
        
        return hasVisibleProducts;
    }
    
    // Clear search
    function clearSearch() {
        searchInput.value = '';
        
        // Remove all hidden classes and highlights
        productGroups.forEach(group => {
            group.classList.remove('hidden');
            const products = group.querySelectorAll('.product-card');
            products.forEach(product => {
                product.classList.remove('hidden');
                const span = product.querySelector('span');
                span.innerHTML = span.textContent; // Remove highlights
            });
        });
        
        clearFiltersBtn.style.display = 'none';
        searchInput.focus(); // Focus back on search input
    }
    
    // Event listeners
    searchInput.addEventListener('input', function() {
        filterBySearch(this.value.trim());
    });
    
    clearFiltersBtn.addEventListener('click', clearSearch);
    
    // Initialize display
    clearFiltersBtn.style.display = 'none';
}