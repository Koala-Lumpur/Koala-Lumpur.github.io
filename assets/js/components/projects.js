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

  hideProject(projectIndex) {
    const project = this.projects[projectIndex];
    if (project && project.div) {
      // Add hiding animation class
      $(project.div).addClass('hiding');
      // Remove element after animation completes
      setTimeout(() => {
        $(project.div).hide();
        $(project.div).removeClass('hiding');
      }, 300);
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
    
    // Add expanding animation to clicked project
    if (project.div) {
      $(project.div).addClass('expanding');
      setTimeout(() => {
        $(project.div).removeClass('expanding');
      }, 500);
    }
    
    // Smooth transitions
    $('.close-button, .close-item').fadeIn(300);
    
    // Show the project details container with animation
    setTimeout(() => {
      $('.project-details').addClass('active');
    }, 200);

    if (project.description) {
      setTimeout(() => {
        $(project.description).collapse('show');
        // Smooth scroll to top of project details container after animation
        setTimeout(() => {
          $('html, body').animate({
            scrollTop: $('.project-details').offset().top - 80
          }, 500);
        }, 400);
      }, 300);
    }
    
    if (project.title) {
      $(project.title).fadeOut(200);
    }
    
    if (project.img) {
      $(project.img).fadeOut(200);
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
      $(project.div).show();
      $(project.div).css({opacity: 0, transform: 'scale(0.95)'});
      $(project.div).animate({opacity: 1}, 300);
      $(project.div).css({transform: 'scale(1)'});
    }
    
    if (project.title) {
      $(project.title).fadeIn(200);
    }
    
    if (project.img) {
      $(project.img).fadeIn(200);
    }
  }

  showAllProjects() {
    $('.close-button, .close-item').fadeOut(200);
    
    // Hide the project details container with animation
    $('.project-details').removeClass('active');
    
    // Stagger the projects appearing
    for (let i = 0; i < this.projects.length; i++) {
      setTimeout(() => {
        this.showProject(i);
      }, i * 50); // 50ms delay between each project
    }
  }
}

// Initialize project gallery
const projectGallery = new ProjectGallery();