// GSAP Animations for Portfolio Site
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function() {
  // Set initial states for animations
  gsap.set('.hero-title', { opacity: 0, y: 50 });
  gsap.set('.hero-subtitle', { opacity: 0, y: 30 });
  gsap.set('.navbar', { opacity: 0, y: -100 });
  
  // Hero Section Animations
  const heroTimeline = gsap.timeline({
    defaults: { ease: 'power3.out' }
  });

  heroTimeline
    .to('.hero-title', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay: 0.5
    })
    .to('.hero-subtitle', {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: -0.6
    })
    .to('.navbar', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: -0.4
    });

  // About Section Animations
  ScrollTrigger.create({
    trigger: '#about',
    start: 'top 80%',
    onEnter: () => {
      gsap.fromTo('#about h2', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      );
      
      gsap.fromTo('#about .col-lg',
        { opacity: 0, x: -50 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 1,
          stagger: 0.3,
          ease: 'power2.out',
          delay: 0.3
        }
      );

      // Animate skills list items
      gsap.fromTo('.skills-list li',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.8
        }
      );
    },
    once: true
  });

  // Projects Section Animations
  ScrollTrigger.create({
    trigger: '#projects',
    start: 'top 80%',
    onEnter: () => {
      gsap.fromTo('#projects h2',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      );

      // Stagger project items animation
      gsap.fromTo('.project-item',
        { 
          opacity: 0,
          scale: 0.8,
          y: 50
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: {
            amount: 0.8,
            from: 'start'
          },
          ease: 'back.out(1.7)',
          delay: 0.3
        }
      );
    },
    once: true
  });

  // Contact Section Animations
  ScrollTrigger.create({
    trigger: '#contact',
    start: 'top 80%',
    onEnter: () => {
      gsap.fromTo('#contact h2',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      );

      gsap.fromTo('.contact-info',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          delay: 0.3
        }
      );

      gsap.fromTo('.social-buttons a',
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          delay: 0.8
        }
      );
    },
    once: true
  });

  // Parallax effect for hero background
  gsap.to('#canvas', {
    yPercent: 50,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-container',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Navigation hover animations
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    link.addEventListener('mouseleave', () => {
      gsap.to(link, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });

  // Smooth scroll animations for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        gsap.to(window, {
          duration: 1,
          scrollTo: {
            y: target,
            offsetY: 80
          },
          ease: 'power2.inOut'
        });
      }
    });
  });

  // Floating animation for hero title
  gsap.to('.hero-title', {
    y: -10,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  });

  // Dynamic text color animation on scroll
  ScrollTrigger.create({
    trigger: '.hero-container',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: self => {
      const progress = self.progress;
      gsap.to('.hero-content', {
        opacity: 1 - progress * 0.5,
        scale: 1 - progress * 0.1,
        duration: 0
      });
    }
  });

  // Project hover enhancement with GSAP
  const projectItems = document.querySelectorAll('.project-item');
  projectItems.forEach(item => {
    const overlay = item.querySelector('.project-overlay');
    const image = item.querySelector('.project-image');
    
    item.addEventListener('mouseenter', () => {
      gsap.to(image, {
        scale: 1.1,
        duration: 0.4,
        ease: 'power2.out'
      });
      
      gsap.to(overlay, {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        duration: 0.3
      });
    });

    item.addEventListener('mouseleave', () => {
      gsap.to(image, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out'
      });
      
      gsap.to(overlay, {
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        duration: 0.3
      });
    });
  });

  // Reveal animation for project details
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.classList.contains('show')) {
        const carousel = mutation.target.querySelector('.project-carousel');
        const content = mutation.target.querySelectorAll('h6, p, ul, a');
        
        gsap.fromTo(carousel,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        );
        
        gsap.fromTo(content,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.3
          }
        );
      }
    });
  });

  // Observe all project descriptions
  document.querySelectorAll('[name="projDesc"]').forEach(desc => {
    observer.observe(desc, {
      attributes: true,
      attributeFilter: ['class']
    });
  });
});

// Magnetic effect for social buttons
document.addEventListener('DOMContentLoaded', () => {
  const magneticElements = document.querySelectorAll('.btn-social-icon');
  
  magneticElements.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(elem, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    elem.addEventListener('mouseleave', () => {
      gsap.to(elem, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });
});