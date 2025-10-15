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
});