// Smooth Scrolling for Navigation Links
function initSmoothScroll() {
  // Select all links with hashes
  const links = document.querySelectorAll('a[href*="#"]:not(.carousel-control-prev):not(.carousel-control-next)');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      // Check if link is to same page
      if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && 
          location.hostname === this.hostname) {
        
        // Find target element
        let target = document.querySelector(this.hash);
        target = target || document.querySelector('[name=' + this.hash.slice(1) + ']');
        
        if (target) {
          e.preventDefault();
          
          // Smooth scroll to target
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, this.hash);
          }
        }
      }
    });
  });
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSmoothScroll);
} else {
  initSmoothScroll();
}