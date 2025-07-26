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
      item.addEventListener('mouseenter', () => {
        item.classList.remove('resetting');
      });

      item.addEventListener('mousemove', (e) => {
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
        
        // Apply 3D transformation to the entire item
        item.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg) 
          translateZ(20px)
        `;
        
        // More intense dynamic shadow based on tilt
        const shadowX = -rotateY * 2;
        const shadowY = rotateX * 2;
        const shadowBlur = 20 + Math.abs(rotateX) + Math.abs(rotateY);
        const shadowSpread = 5;
        
        // Use requestAnimationFrame for smoother shadow updates
        requestAnimationFrame(() => {
          item.style.boxShadow = `
            ${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 0, 0.3),
            0 10px 30px rgba(0, 0, 0, 0.2)
          `;
        });
      });

      item.addEventListener('mouseleave', () => {
        // Add class for smooth reset transition
        item.classList.add('resetting');
        
        // Reset transformation smoothly
        item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        item.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      });

      // Prevent tilt effect when clicking
      item.addEventListener('mousedown', () => {
        item.style.transition = 'transform 0.05s ease-out';
        item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(0.98)';
      });

      item.addEventListener('mouseup', () => {
        item.style.transition = 'transform 0.1s ease-out';
        item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
  }

  hideProject(projectIndex) {
    const project = this.projects[projectIndex];
    if (project && project.div) {
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
    
    // Add expanding animation to clicked project with GSAP
    if (project.div) {
      gsap.to(project.div, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          gsap.set(project.div, { scale: 1 });
        }
      });
    }
    
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
    
    if (project.title) {
      gsap.to(project.title, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
    
    if (project.img) {
      gsap.to(project.img, {
        opacity: 0,
        scale: 0.95,
        duration: 0.2,
        ease: 'power2.out'
      });
    }

    this.hideAllProjects(projectIndex);
  }

  showProject(projectIndex) {
    const project = this.projects[projectIndex];
    if (!project) return;

    if (project.description) {
      $(project.description).collapse('hide');
    }
    
    if (project.div) {
      gsap.set(project.div, { display: 'block' });
      gsap.fromTo(project.div,
        { opacity: 0, scale: 0.9, y: 20 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          duration: 0.4,
          ease: 'back.out(1.4)'
        }
      );
    }
    
    if (project.title) {
      gsap.to(project.title, {
        opacity: 1,
        duration: 0.3,
        delay: 0.1,
        ease: 'power2.out'
      });
    }
    
    if (project.img) {
      gsap.to(project.img, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        delay: 0.1,
        ease: 'power2.out'
      });
    }
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
    
    // Hide the project details container with animation
    $('.project-details').removeClass('active');
    
    // Stagger the projects appearing with GSAP
    this.projects.forEach((project, i) => {
      gsap.delayedCall(i * 0.05, () => {
        this.showProject(i);
      });
    });
    
    // Smooth scroll back to projects section
    gsap.delayedCall(0.3, () => {
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