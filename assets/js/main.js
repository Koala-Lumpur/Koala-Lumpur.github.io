// Main JavaScript Entry Point
document.addEventListener('DOMContentLoaded', function() {
  // Initialize fitText for project titles
  const fitTextElements = document.querySelectorAll('[id^="fittext"]');
  fitTextElements.forEach((element, index) => {
    if (window.fitText) {
      window.fitText(element, 1.2);
    }
  });

  // Initialize Bootstrap tooltips and popovers if needed
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    if (window.bootstrap && window.bootstrap.Tooltip) {
      new bootstrap.Tooltip(tooltipTriggerEl);
    }
  });
});

// Navbar scroll behavior
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.main-nav');
  if (navbar) {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});