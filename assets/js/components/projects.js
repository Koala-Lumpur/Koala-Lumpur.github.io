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
    const projectCarousels = document.querySelectorAll('[name="projectCarousel"]');
    const projectDescriptions = document.querySelectorAll('[name="projDesc"]');

    for (let i = 0; i < projectDivs.length; i++) {
      this.projects.push({
        div: projectDivs[i],
        img: projectImgs[i],
        title: projectTitles[i],
        carousel: projectCarousels[i],
        description: projectDescriptions[i]
      });
    }

    this.hideAllCarousels();
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
      $(project.div).hide(300);
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
    for (let i = 0; i < this.projects.length; i++) {
      const project = this.projects[i];
      if (project.carousel) {
        $(project.carousel).hide(0);
      }
    }
    $('.close-button, .close-item').hide(0);
  }

  expandProject(projectIndex) {
    const project = this.projects[projectIndex];
    if (!project) return;

    this.currentProject = projectIndex;
    $('.close-button, .close-item').show(300);
    
    // Show the project details container
    $('.project-details').addClass('active');

    if (project.description) {
      $(project.description).collapse('show');
    }
    if (project.title) {
      $(project.title).hide(0);
    }
    if (project.carousel) {
      $(project.carousel).show(0);
    }
    if (project.img) {
      $(project.img).hide(0);
    }

    this.hideAllProjects(projectIndex);
  }

  showProject(projectIndex) {
    const project = this.projects[projectIndex];
    if (!project) return;

    if (project.description) {
      $(project.description).collapse('hide');
    }
    if (project.title) {
      $(project.title).show(0);
    }
    if (project.carousel) {
      $(project.carousel).hide(0);
    }
    if (project.img) {
      $(project.img).show(0);
    }
    if (project.div) {
      $(project.div).show(300);
    }
  }

  showAllProjects() {
    $('.close-button, .close-item').hide(0);
    
    // Hide the project details container
    $('.project-details').removeClass('active');
    
    for (let i = 0; i < this.projects.length; i++) {
      this.showProject(i);
    }
  }
}

// Initialize project gallery
const projectGallery = new ProjectGallery();