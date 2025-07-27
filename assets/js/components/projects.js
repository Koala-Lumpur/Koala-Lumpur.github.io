// Project Gallery Management
class ProjectGallery {
  constructor() {
    this.projects = [];
    this.currentProject = null;
    this.init();
  }

  init() {
    this.loadProjects();
    this.setupEventListeners();
  }

  async loadProjects() {
    // Check if we're running locally (file:// protocol)
    const isLocal = window.location.protocol === 'file:';
    
    // Skip fetch entirely for local files and use existing HTML
    if (isLocal) {
      this.setupExistingProjects();
      return;
    }
    
    try {
      const response = await fetch('/assets/data/projects.json');
      const data = await response.json();
      this.projects = data.projects;
      this.renderProjects();
    } catch (error) {
      console.error('Error loading projects:', error);
      // Fallback to render projects from existing HTML if JSON fails
      this.setupExistingProjects();
    }
  }

  renderProjects() {
    const projectGrid = document.querySelector('.project-grid');
    if (!projectGrid) return;

    projectGrid.innerHTML = this.projects.map((project, index) => `
      <div class="project-item" data-project-id="${index}">
        <img src="${project.thumbnail}" alt="${project.title}" class="project-image">
        <div class="project-overlay">
          <h3 class="project-title">${project.title}</h3>
        </div>
      </div>
    `).join('');
  }

  setupExistingProjects() {
    // Setup for existing HTML structure
    const projectDivs = document.querySelectorAll('[name="projectDiv"]');
    const projectImgs = document.querySelectorAll('[name="projectImg"]');
    const projectTitles = document.querySelectorAll('[name="projectTitle"]');
    const projectDescriptions = document.querySelectorAll('[name="projDesc"]');

    for (let i = 0; i < projectDivs.length; i++) {
      this.projects.push({
        div: projectDivs[i],
        img: projectImgs[i],
        title: projectTitles[i],
        description: projectDescriptions[i]
      });
    }

    // Setup 3D tilt effect after projects are loaded
    setTimeout(() => {
      this.setup3DTiltEffect();
    }, 100);
  }

  setupEventListeners() {
    // Click handler for project containers
    document.addEventListener('click', (e) => {
      // Check if clicked on a project item or its children
      const projectItem = e.target.closest('.project-item');
      if (projectItem && projectItem.dataset.animationComplete === 'true') {
        // Find which project was clicked by checking the parent container
        const container = projectItem.closest('.project-item-container');
        if (container) {
          const allContainers = Array.from(document.querySelectorAll('.project-item-container'));
          const projectIndex = allContainers.indexOf(container);
          if (projectIndex !== -1) {
            console.log('Clicked project:', projectIndex);
            this.expandProject(projectIndex);
          }
        }
      }
    });

    // Close button handler - handle multiple selectors properly
    const closeButton = document.querySelector('.close-button') || document.querySelector('.close-item');
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showAllProjects();
      });
    }
  }

  setup3DTiltEffect() {
    const containers = document.querySelectorAll('.project-item-container');
    const projectItems = document.querySelectorAll('.project-item');
    
    // Initialize card states
    projectItems.forEach(item => {
      item.dataset.animationComplete = 'false';
    });
    
    // Set up hover for each container
    containers.forEach((container, index) => {
      const card = container.querySelector('.project-item');
      if (!card) return;
      
      container.addEventListener('mousemove', (e) => {
        // Only apply effect if card animation is complete
        if (card.dataset.animationComplete !== 'true') return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate rotation values based on mouse position
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Maximum rotation angle (in degrees)
        const maxRotation = 12;
        
        // Calculate rotation based on mouse position relative to center
        const rotateY = ((x - centerX) / centerX) * maxRotation;
        const rotateX = -((y - centerY) / centerY) * maxRotation;
        
        // More intense dynamic shadow based on tilt
        const shadowX = -rotateY * 2;
        const shadowY = rotateX * 2;
        const shadowBlur = 20 + Math.abs(rotateX) + Math.abs(rotateY);
        const shadowSpread = 5;
        
        // Use GSAP for all transformations with force3D
        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          z: 20,
          boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)`,
          duration: 0.1,
          ease: 'power2.out',
          overwrite: 'auto',
          force3D: true
        });
      });
      
      container.addEventListener('mouseleave', () => {
        // Only reset if card animation is complete
        if (card.dataset.animationComplete !== 'true') return;
        
        this.resetCard(card);
      });
      
      // Click handlers
      card.addEventListener('mousedown', () => {
        if (card.dataset.animationComplete !== 'true') return;
        
        gsap.to(card, {
          scale: 0.98,
          duration: 0.05,
          ease: 'power2.out'
        });
      });

      card.addEventListener('mouseup', () => {
        if (card.dataset.animationComplete !== 'true') return;
        
        gsap.to(card, {
          scale: 1,
          duration: 0.1,
          ease: 'power2.out'
        });
      });
    });
  }
  
  // Helper method to reset a card
  resetCard(card) {
    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      z: 0,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
      onUpdate: function() {
        // Get current rotation values during animation
        const currentRotationX = gsap.getProperty(card, 'rotationX');
        const currentRotationY = gsap.getProperty(card, 'rotationY');
        
        // Calculate shadow based on current rotation
        const shadowX = -currentRotationY * 2;
        const shadowY = currentRotationX * 2;
        const shadowBlur = 20 + Math.abs(currentRotationX) + Math.abs(currentRotationY);
        const shadowSpread = 5;
        
        // Calculate opacity based on rotation (fade out as it approaches 0)
        const maxRotation = 12;
        const rotationProgress = Math.max(Math.abs(currentRotationX), Math.abs(currentRotationY)) / maxRotation;
        const shadowOpacity = rotationProgress * 0.3;
        
        // Apply dynamic shadow
        gsap.set(card, {
          boxShadow: rotationProgress > 0.01 
            ? `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 0, ${shadowOpacity}), 0 10px 30px rgba(0, 0, 0, ${shadowOpacity * 0.67})`
            : 'none'
        });
      },
      onComplete: () => {
        gsap.set(card, { 
          clearProps: 'transform',
          boxShadow: 'none'
        });
      }
    });
  }

  hideProject(projectIndex) {
    const project = this.projects[projectIndex];
    if (project && project.div) {
      // Disable hover while hiding
      project.div.dataset.animationComplete = 'false';
      
      // GSAP animation for hiding projects
      gsap.to(project.div, {
        opacity: 0,
        scale: 0.9,
        y: 20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(project.div, { display: 'none' });
        }
      });
    }
  }

  hideAllProjects(exceptIndex) {
    for (let i = 0; i < this.projects.length; i++) {
      if (i !== exceptIndex) {
        this.hideProject(i);
      }
    }
  }

  hideAllCarousels() {
    $('.close-button, .close-item').hide();
  }

  expandProject(projectIndex) {
    const project = this.projects[projectIndex];
    if (!project) return;

    // Hide all project descriptions first
    $('[name="projDesc"]').collapse('hide');
    
    this.currentProject = projectIndex;
    
    // Smooth transitions with GSAP
    gsap.to('.close-button, .close-item', {
      opacity: 1,
      display: 'block',
      duration: 0.3,
      ease: 'power2.out'
    });
    
    // Hide all projects first with animation
    const hideTimeline = gsap.timeline();
    
    this.projects.forEach((proj, i) => {
      if (proj.div) {
        // Disable hover during transition
        proj.div.dataset.animationComplete = 'false';
        
        hideTimeline.to(proj.div, {
          opacity: 0,
          scale: 0.9,
          y: 20,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            gsap.set(proj.div, { display: 'none' });
          }
        }, i * 0.05); // Stagger the hiding
      }
    });
    
    // After all projects are hidden, show the details
    hideTimeline.call(() => {
      // Show the project details container with GSAP
      const details = document.querySelector('.project-details');
      
      // First make it active to get proper height
      details.classList.add('active');
      
      // Animate it appearing
      gsap.fromTo(details, 
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }
      );
      
      if (project.description) {
        // Use the correct project description ID
        const descId = `#proj${projectIndex + 1}Desc`;
        console.log('Showing description:', descId);
        $(descId).collapse('show');
        
        // Smooth scroll after details are shown
        gsap.delayedCall(0.6, () => {
          const detailsOffset = $('.project-details').offset();
          if (detailsOffset) {
            gsap.to(window, {
              duration: 0.8,
              scrollTo: {
                y: detailsOffset.top - 80,
                autoKill: false
              },
              ease: 'power2.inOut'
            });
          }
        });
      }
    });
  }

  showProject(projectIndex) {
    // REMOVED - No longer needed since we handle animations in the timeline
    return;
  }

  showAllProjects() {
    // Hide all project descriptions
    $('[name="projDesc"]').collapse('hide');
    
    gsap.to('.close-button, .close-item', {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        gsap.set('.close-button, .close-item', { display: 'none' });
      }
    });
    
    // Hide the project details container first
    gsap.to('.project-details', {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        $('.project-details').removeClass('active');
        
        // Reset all projects for animation
        this.projects.forEach((project) => {
          if (project.div) {
            // Reset animation complete flag
            project.div.dataset.animationComplete = 'false';
            
            // Clear any existing transforms first
            gsap.set(project.div, { clearProps: 'all' });
            
            // Then set up for animation
            gsap.set(project.div, {
              display: 'block',
              visibility: 'hidden',
              opacity: 0,
              scale: 0.5,
              rotationY: -90,
              rotationX: 45,
              z: -200,
              transformOrigin: '50% 50%'
            });
          }
        });
        
        // Create timeline for showing projects
        const tl = gsap.timeline({ delay: 0.2 });
        
        this.projects.forEach((project, i) => {
          if (project.div) {
            // Add each animation to the timeline with proper timing
            tl.to(project.div, {
              visibility: 'visible',
              opacity: 1,
              scale: 1,
              rotationY: 0,
              rotationX: 0,
              z: 0,
              duration: 0.8,
              ease: 'expo.out',
              onComplete: function() {
                // Clear only transform props, keep display and opacity
                const target = this.targets()[0];
                gsap.set(target, { 
                  clearProps: 'transform,transformOrigin,visibility'
                });
                target.dataset.animationComplete = 'true';
                // Re-setup mouse tracking after animation
                if (window.setupProjectMouseTracking) {
                  window.setupProjectMouseTracking(target);
                }
              }
            }, i * 0.15); // Absolute position in timeline
            
            // Animate title and image
            if (project.title) {
              tl.to(project.title, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
              }, i * 0.15 + 0.1);
            }
            
            if (project.img) {
              tl.to(project.img, {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
              }, i * 0.15 + 0.1);
            }
          }
        });
      }
    });
    
    // Smooth scroll back to projects section
    gsap.delayedCall(0.5, () => {
      gsap.to(window, {
        duration: 0.8,
        scrollTo: {
          y: '#projects',
          offsetY: 80
        },
        ease: 'power2.inOut'
      });
    });
  }
}

// Initialize project gallery
const projectGallery = new ProjectGallery();