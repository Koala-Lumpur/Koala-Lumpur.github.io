// GSAP Animations for Portfolio Site
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener('DOMContentLoaded', function() {
  // Initial states are now set in CSS to prevent flash of content
  
  // Hero Section Animations with enhanced effects
  const heroTimeline = gsap.timeline({
    defaults: { ease: 'power3.out' }
  });

  // Simple fade animation for hero title (no split text)
  heroTimeline
    .fromTo('.hero-title', 
      { 
        opacity: 0, 
        y: 50,
        scale: 0.9
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'expo.out'
      }
    )
    .fromTo('.hero-subtitle', 
      { 
        opacity: 0, 
        y: 30,
        scale: 0.9,
        filter: 'blur(10px)'
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1,
        ease: 'power3.out'
      }, '-=0.5'
    );
    
  // Enhanced navbar animation with elastic bounce
  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top-=50',
    onEnter: () => {
      gsap.fromTo('.navbar', 
        {
          x: -100,
          opacity: 0,
          visibility: 'visible'
        },
        {
          x: 0,
          opacity: 1,
          visibility: 'visible',
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)'
        }
      );
      
      // Stagger nav items
      gsap.fromTo('.nav-item',
        {
          y: -20,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          delay: 0.3
        }
      );
    },
    once: true
  });

  // Enhanced navigation hover animations with morphing underline
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    // Create underline element
    const underline = document.createElement('span');
    underline.classList.add('nav-underline');
    underline.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 3px;
      background: var(--accent-primary);
      border-radius: 2px;
      transform-origin: left center;
    `;
    link.style.position = 'relative';
    link.appendChild(underline);
    
    link.addEventListener('mouseenter', () => {
      gsap.to(underline, {
        width: '100%',
        duration: 0.4,
        ease: 'power3.out'
      });
      
      gsap.to(link, {
        color: 'var(--accent-primary)',
        y: -2,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    link.addEventListener('mouseleave', () => {
      gsap.to(underline, {
        width: '0%',
        duration: 0.4,
        ease: 'power3.in'
      });
      
      gsap.to(link, {
        color: 'var(--text-primary)',
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });

  // About Section Animations with wave effect
  ScrollTrigger.create({
    trigger: '#about',
    start: 'top 80%',
    onEnter: () => {
      // Title with elastic effect
      gsap.fromTo('#about h2', 
        { 
          opacity: 0, 
          y: 50,
          scale: 0.8
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'elastic.out(1, 0.5)'
        }
      );
      
      // Content columns with wave effect
      gsap.fromTo('#about .col-lg',
        { 
          opacity: 0, 
          x: (index) => index % 2 === 0 ? -50 : 50,
          rotationY: (index) => index % 2 === 0 ? -15 : 15
        },
        { 
          opacity: 1, 
          x: 0,
          rotationY: 0,
          duration: 1,
          stagger: 0.3,
          ease: 'power3.out',
          delay: 0.3
        }
      );

      // Interactive skills badges with physics
      const skillsTimeline = gsap.timeline({ delay: 0.8 });
      
      skillsTimeline.fromTo('.skills-list li',
        {
          opacity: 0,
          scale: 0,
          rotation: () => gsap.utils.random(-180, 180)
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: {
            each: 0.1,
            from: 'random'
          },
          ease: 'back.out(1.7)'
        }
      );
      
      // Add hover effects to skills
      document.querySelectorAll('.skills-list li').forEach((skill, index) => {
        skill.addEventListener('mouseenter', () => {
          gsap.to(skill, {
            scale: 1.2,
            rotation: 5,
            y: -10,
            boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)',
            duration: 0.3,
            ease: 'power2.out'
          });
        });
        
        skill.addEventListener('mouseleave', () => {
          gsap.to(skill, {
            scale: 1,
            rotation: 0,
            y: 0,
            boxShadow: '0 5px 15px rgba(139, 92, 246, 0.3)',
            duration: 0.3,
            ease: 'elastic.out(1, 0.3)'
          });
        });
      });
    },
    once: true
  });

  // Advanced 3D Project Cards with Mouse Tracking
  ScrollTrigger.create({
    trigger: '#projects',
    start: 'top 80%',
    onEnter: () => {
      // Title animation with split text
      gsap.fromTo('#projects h2',
        { 
          opacity: 0, 
          y: 50,
          letterSpacing: '20px'
        },
        { 
          opacity: 1, 
          y: 0,
          letterSpacing: '0px',
          duration: 1,
          ease: 'power3.out'
        }
      );

      const runProjectAnimations = () => {
        gsap.set('.project-grid', { perspective: 1200 });
        
        // Enhanced 3D entrance animation
        gsap.fromTo('.project-item',
          {
            opacity: 0,
            scale: 0.5,
            rotationY: () => gsap.utils.random(-180, 180),
            rotationX: () => gsap.utils.random(-30, 30),
            z: -300,
            transformOrigin: '50% 50%',
            filter: 'blur(20px)'
          },
          {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            rotationX: 0,
            z: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            stagger: {
              each: 0.1,
              from: 'center',
              grid: 'auto'
            },
            ease: 'expo.out',
            delay: 0.3,
            onComplete: function() {
              this.targets().forEach(item => {
                item.dataset.animationComplete = 'true';
                setupProjectMouseTracking(item);
              });
            }
          }
        );
      };

      // Check if images are already loaded
      if (document.body.classList.contains('images-loaded')) {
        runProjectAnimations();
      } else {
        let checkCount = 0;
        const checkImages = setInterval(() => {
          if (document.body.classList.contains('images-loaded') || checkCount > 20) {
            clearInterval(checkImages);
            runProjectAnimations();
          }
          checkCount++;
        }, 50);
      }
    },
    once: true
  });

  // 3D Mouse tracking for project cards
  function setupProjectMouseTracking(card) {
    const container = card.parentElement;
    
    container.addEventListener('mousemove', (e) => {
      if (card.dataset.animationComplete !== 'true') return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;
      
      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        transformPerspective: 1000,
        scale: 1.05,
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        duration: 0.3,
        ease: 'power2.out'
      });
      
      // Move image opposite direction for parallax
      const image = card.querySelector('.project-image');
      if (image) {
        gsap.to(image, {
          x: -rotateY * 0.5,
          y: -rotateX * 0.5,
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
    
    container.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        boxShadow: '0 4px 6px var(--shadow-sm)',
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
      
      const image = card.querySelector('.project-image');
      if (image) {
        gsap.to(image, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      }
    });
  }

  // Enhanced Contact Section Animations
  ScrollTrigger.create({
    trigger: '#contact',
    start: 'top 80%',
    onEnter: () => {
      // Title with wave effect
      gsap.fromTo('#contact h2',
        { 
          opacity: 0, 
          y: 50,
          scaleY: 0.5
        },
        { 
          opacity: 1, 
          y: 0,
          scaleY: 1,
          duration: 1,
          ease: 'elastic.out(1, 0.5)'
        }
      );

      // Contact info with slide and fade
      gsap.fromTo('.contact-info',
        {
          opacity: 0,
          x: (index) => index % 2 === 0 ? -100 : 100,
          blur: 10
        },
        {
          opacity: 1,
          x: 0,
          blur: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          delay: 0.3
        }
      );

      // Social buttons with bounce effect
      gsap.fromTo('.social-buttons a',
        {
          opacity: 0,
          scale: 0,
          rotation: -180
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(2)',
          delay: 0.8
        }
      );
    },
    once: true
  });

  // Enhanced parallax effect for hero
  gsap.to('#canvas', {
    yPercent: 50,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-container',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  // Smooth scroll with easing
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        gsap.to(window, {
          duration: 1.2,
          scrollTo: {
            y: target,
            offsetY: 80
          },
          ease: 'power3.inOut'
        });
      }
    });
  });

  // Enhanced floating animation for hero content
  gsap.to('.hero-content', {
    y: -15,
    rotation: 1,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  });

  // Dynamic scroll effects
  ScrollTrigger.create({
    trigger: '.hero-container',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: self => {
      const progress = self.progress;
      gsap.to('.hero-content', {
        opacity: 1 - progress * 0.5,
        scale: 1 - progress * 0.15,
        filter: `blur(${progress * 5}px)`,
        duration: 0
      });
    }
  });

  // Magnetic effect for all buttons and links
  const magneticElements = document.querySelectorAll('.btn, a');
  
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
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });

  // Add elastic and magnetic effects to carousel and close buttons
  const addButtonEffects = (button) => {
    if (!button || button.dataset.effectsAdded) return;
    
    button.dataset.effectsAdded = 'true';
    
    // Hover effects
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        scale: 1.1,
        rotation: 5,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });
    });
    
    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        scale: 1,
        rotation: 0,
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    });
    
    // Magnetic cursor effect
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(button, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    // Click effect
    button.addEventListener('click', () => {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    });
  };
  
  // Use mutation observer to add effects to buttons when they appear
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          if (node.matches && (node.matches('.carousel-control-prev, .carousel-control-next, .close-button'))) {
            addButtonEffects(node);
          }
          // Check children too
          const buttons = node.querySelectorAll('.carousel-control-prev, .carousel-control-next, .close-button');
          buttons.forEach(addButtonEffects);
        }
      });
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Add effects to existing buttons
  document.querySelectorAll('.carousel-control-prev, .carousel-control-next, .close-button').forEach(addButtonEffects);

  // Removed text scramble effect for headings
  
  // Export setupProjectMouseTracking for use in other files
  window.setupProjectMouseTracking = setupProjectMouseTracking;
});

// Enhanced project detail animations
function animateProjectDetails(show, projectId) {
  const details = document.querySelector('.project-details');
  const allProjects = document.querySelectorAll('.project-item');
  const targetProject = document.getElementById(projectId);
  
  if (show) {
    // Hide other projects with stagger
    gsap.to(allProjects, {
      opacity: 0,
      scale: 0.8,
      filter: 'blur(10px)',
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.in',
      onComplete: () => {
        allProjects.forEach(p => {
          if (p.id !== projectId) {
            p.parentElement.style.display = 'none';
          }
        });
      }
    });
    
    // Animate selected project
    gsap.to(targetProject, {
      scale: 1.1,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(details, {
          opacity: 1,
          maxHeight: '2000px',
          duration: 0.8,
          ease: 'power3.inOut'
        });
      }
    });
  } else {
    // Reverse animation
    gsap.to(details, {
      opacity: 0,
      maxHeight: 0,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        allProjects.forEach(p => {
          p.parentElement.style.display = 'block';
        });
        
        gsap.to(allProjects, {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out'
        });
      }
    });
  }
}