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
            
            // Clear any active search filters first (if on products page)
            const searchInput = document.getElementById('productSearch');
            if (searchInput && window.clearProductSearch) {
                searchInput.value = '';
                window.clearProductSearch();
            }
            
            // Hide dropdown menu immediately (for mobile)
            var dropdownMenu = document.querySelector('.nav-dropdown .dropdown-menu');
            if (dropdownMenu && window.innerWidth < 800) {
                dropdownMenu.style.display = 'none';
            }
            
            // Close mobile nav menu if open
            const navLinks = document.getElementById("navLinks");
            if (navLinks && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
            }
            
            // Wait for layout changes then scroll
            setTimeout(function() {
                scrollWithOffset(href, 100); // 100px = header height
            }, 150);
        } else if (href && !href.startsWith('#')) {
            // For external links (like products.html#cheese-title), let them navigate normally
            // but close mobile menu first
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
    
    // Initialize product tabs functionality
    initializeProductTabs();
    
    // Initialize recipe functionality
    initializeRecipeFilters();
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
    
    // Expose clear function globally for dropdown navigation
    window.clearProductSearch = clearSearch;
    
    // Event listeners
    searchInput.addEventListener('input', function() {
        filterBySearch(this.value.trim());
    });
    
    clearFiltersBtn.addEventListener('click', clearSearch);
    
    // Initialize display
    clearFiltersBtn.style.display = 'none';
}

// =============================
// Product Sidebar Functionality
// =============================
function initializeProductTabs() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    if (sidebarLinks.length === 0) return; // Not on products page
    
    // Add click handlers to sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(sidebarLink => sidebarLink.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                // Clear search if active
                const searchInput = document.getElementById('productSearch');
                if (searchInput && searchInput.value) {
                    searchInput.value = '';
                    if (window.clearProductSearch) {
                        window.clearProductSearch();
                    }
                }
                
                // Scroll to section with offset for header
                setTimeout(function() {
                    scrollWithOffset(href, 120); // 120px for header
                }, 100);
            }
        });
    });
    
    // Set active link based on current hash
    if (window.location.hash) {
        const currentLink = document.querySelector(`.sidebar-link[href="${window.location.hash}"]`);
        if (currentLink) {
            sidebarLinks.forEach(link => link.classList.remove('active'));
            currentLink.classList.add('active');
        }
    }
    
    // Update active link on scroll
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        if (isScrolling) return;
        
        isScrolling = true;
        requestAnimationFrame(function() {
            updateActiveSidebarOnScroll();
            isScrolling = false;
        });
    });
}

// Helper function to update active sidebar link based on scroll position
function updateActiveSidebarOnScroll() {
    const sections = document.querySelectorAll('.product-group');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    if (sections.length === 0 || sidebarLinks.length === 0) return;
    
    let currentSection = '';
    const scrollPosition = window.scrollY + 200; // Offset for header
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = '#' + section.querySelector('.product-group-title').id;
        }
    });
    
    if (currentSection) {
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    }
}

// =============================
// Recipe Filtering Functionality
// =============================
function initializeRecipeFilters() {
    const searchInput = document.getElementById('recipeSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearFiltersBtn = document.getElementById('clearRecipeFilters');
    
    // Only initialize if we're on the recipes page
    if (!searchInput || !filterButtons.length) return;
    
    const recipeCards = document.querySelectorAll('.recipe-card');
    const recipeCategories = document.querySelectorAll('.recipe-category');
    
    let currentFilter = 'all';
    let currentSearch = '';
    
    // Filter recipes by category
    function filterByCategory(category) {
        currentFilter = category;
        
        // Update button states
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            }
        });
        
        // Show/hide recipe cards and categories
        if (category === 'all') {
            recipeCategories.forEach(cat => cat.classList.remove('hidden'));
            recipeCards.forEach(card => card.classList.remove('hidden'));
        } else {
            recipeCategories.forEach(cat => {
                const categoryCards = cat.querySelectorAll(`[data-category="${category}"]`);
                if (categoryCards.length > 0) {
                    cat.classList.remove('hidden');
                } else {
                    cat.classList.add('hidden');
                }
            });
            
            recipeCards.forEach(card => {
                if (card.dataset.category === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        }
        
        // Apply search filter if active
        if (currentSearch) {
            filterBySearch(currentSearch);
        }
        
        updateClearButton();
    }
    
    // Filter recipes by search term
    function filterBySearch(searchTerm) {
        currentSearch = searchTerm;
        const searchLower = searchTerm.toLowerCase();
        
        recipeCards.forEach(card => {
            // Skip if already hidden by category filter
            if (currentFilter !== 'all' && card.dataset.category !== currentFilter) {
                return;
            }
            
            const cardText = card.textContent.toLowerCase();
            const isVisible = searchTerm.length === 0 || cardText.includes(searchLower);
            
            // Remove existing highlights
            const textElements = card.querySelectorAll('h3, li, p');
            textElements.forEach(el => {
                if (el.innerHTML !== el.textContent) {
                    el.innerHTML = el.textContent;
                }
            });
            
            if (isVisible && (currentFilter === 'all' || card.dataset.category === currentFilter)) {
                card.classList.remove('hidden');
                
                // Highlight matching text if there's a search term
                if (searchTerm.length > 0) {
                    const regex = new RegExp(`(${searchTerm})`, 'gi');
                    textElements.forEach(el => {
                        if (el.textContent.toLowerCase().includes(searchLower)) {
                            el.innerHTML = el.textContent.replace(regex, '<span class="highlight">$1</span>');
                        }
                    });
                }
            } else {
                card.classList.add('hidden');
            }
        });
        
        // Update category visibility based on search results
        recipeCategories.forEach(cat => {
            const visibleCards = cat.querySelectorAll('.recipe-card:not(.hidden)');
            if (visibleCards.length > 0) {
                cat.classList.remove('hidden');
            } else {
                cat.classList.add('hidden');
            }
        });
        
        updateClearButton();
    }
    
    // Clear all filters
    function clearAllFilters() {
        currentFilter = 'all';
        currentSearch = '';
        searchInput.value = '';
        
        // Reset category filter
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === 'all') {
                btn.classList.add('active');
            }
        });
        
        // Show all cards and categories
        recipeCards.forEach(card => {
            card.classList.remove('hidden');
            // Remove highlights
            const textElements = card.querySelectorAll('h3, li, p');
            textElements.forEach(el => {
                if (el.innerHTML !== el.textContent) {
                    el.innerHTML = el.textContent;
                }
            });
        });
        
        recipeCategories.forEach(cat => {
            cat.classList.remove('hidden');
        });
        
        updateClearButton();
        searchInput.focus();
    }
    
    // Update clear button visibility
    function updateClearButton() {
        const shouldShow = currentFilter !== 'all' || currentSearch.length > 0;
        clearFiltersBtn.style.display = shouldShow ? 'inline-block' : 'none';
    }
    
    // Event listeners
    searchInput.addEventListener('input', function() {
        filterBySearch(this.value.trim());
    });
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterByCategory(this.dataset.category);
        });
    });
    
    clearFiltersBtn.addEventListener('click', clearAllFilters);
    
    // Initialize display
    updateClearButton();
}