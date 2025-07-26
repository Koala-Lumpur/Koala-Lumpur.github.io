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
    // Click handler for project items
    document.addEventListener('click', (e) => {
      const projectItem = e.target.closest('.project-item, .toggle-item');
      if (projectItem) {
        const projectId = projectItem.dataset.projectId || 
                         Array.from(document.querySelectorAll('.toggle-item')).indexOf(projectItem);
        if (projectId !== -1) {
          this.expandProject(projectId);
        }
      }
    });

    // Close button handler
    const closeButton = document.querySelector('.close-button, .close-item');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.showAllProjects());
    }
  }

  setup3DTiltEffect() {
    const projectItems = document.querySelectorAll('.project-item');
    
    projectItems.forEach(item => {
      // Add a data attribute to track if animation is complete
      item.dataset.animationComplete = 'false';
      
      item.addEventListener('mouseenter', (e) => {
        // Only allow hover if animation is complete
        if (item.dataset.animationComplete !== 'true') return;
        
        // Kill any ongoing animations
        gsap.killTweensOf(item);
      });

      item.addEventListener('mousemove', (e) => {
        // Only allow hover if animation is complete
        if (item.dataset.animationComplete !== 'true') return;
        
        // Don't apply tilt if project is expanding/hiding
        if (item.classList.contains('expanding') || item.classList.contains('hiding')) return;
        
        const rect = item.getBoundingClientRect();
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
        
        // Use GSAP for all transformations
        gsap.to(item, {
          rotationX: rotateX,
          rotationY: rotateY,
          z: 20,
          boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)`,
          duration: 0.1,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      item.addEventListener('mouseleave', () => {
        // Only reset if animation is complete
        if (item.dataset.animationComplete !== 'true') return;
        
        // Use GSAP for smooth reset with dynamic shadow that fades out
        gsap.to(item, {
          rotationX: 0,
          rotationY: 0,
          z: 0,
          scale: 1,
          duration: 0.4,
          ease: 'power2.out',
          onUpdate: function() {
            // Get current rotation values during animation
            const currentRotationX = gsap.getProperty(item, 'rotationX');
            const currentRotationY = gsap.getProperty(item, 'rotationY');
            
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
            gsap.set(item, {
              boxShadow: rotationProgress > 0.01 
                ? `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 0, ${shadowOpacity}), 0 10px 30px rgba(0, 0, 0, ${shadowOpacity * 0.67})`
                : 'none'
            });
          },
          onComplete: () => {
            gsap.set(item, { 
              clearProps: 'transform',
              boxShadow: 'none'  // Ensure shadow is completely removed
            });
          }
        });
      });

      // Prevent tilt effect when clicking
      item.addEventListener('mousedown', () => {
        if (item.dataset.animationComplete !== 'true') return;
        
        gsap.to(item, {
          scale: 0.98,
          duration: 0.05,
          ease: 'power2.out'
        });
      });

      item.addEventListener('mouseup', () => {
        if (item.dataset.animationComplete !== 'true') return;
        
        gsap.to(item, {
          scale: 1,
          duration: 0.1,
          ease: 'power2.out'
        });
      });
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

    this.currentProject = projectIndex;
    
    // Smooth transitions with GSAP
    gsap.to('.close-button, .close-item', {
      opacity: 1,
      display: 'block',
      duration: 0.3,
      ease: 'power2.out'
    });
    
    // Show the project details container with animation
    gsap.delayedCall(0.2, () => {
      $('.project-details').addClass('active');
    });

    if (project.description) {
      gsap.delayedCall(0.3, () => {
        $(project.description).collapse('show');
        // Smooth scroll using GSAP ScrollTo plugin
        gsap.delayedCall(0.4, () => {
          gsap.to(window, {
            duration: 0.8,
            scrollTo: {
              y: $('.project-details').offset().top - 80,
              autoKill: false
            },
            ease: 'power2.inOut'
          });
        });
      });
    }
    
    // Hide all projects including the clicked one
    for (let i = 0; i < this.projects.length; i++) {
      this.hideProject(i);
    }
  }

  showProject(projectIndex) {
    // REMOVED - No longer needed since we handle animations in the timeline
    return;
  }

  showAllProjects() {
    gsap.to('.close-button, .close-item', {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        gsap.set('.close-button, .close-item', { display: 'none' });
      }
    });
    
    // First, set all projects to block but invisible to maintain grid structure
    this.projects.forEach((project) => {
      if (project.div) {
        // Reset animation complete flag
        project.div.dataset.animationComplete = 'false';
        
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
    
    // Wait for details to start closing, then show projects
    gsap.delayedCall(0.2, () => {
      // Hide the project details container
      $('.project-details').removeClass('active');
      
      // After grid has stabilized, create a timeline for consistent stagger
      gsap.delayedCall(0.4, () => {
        const tl = gsap.timeline();
        
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
                // Clear props and enable hover for THIS card individually
                gsap.set(this.targets()[0], { 
                  clearProps: 'transform,transformOrigin,visibility'
                });
                this.targets()[0].dataset.animationComplete = 'true';
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
      });
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