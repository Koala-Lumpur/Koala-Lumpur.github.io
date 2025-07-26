# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Rasmus Nielsen's personal portfolio website showcasing work as a programmer and game developer. It's a static website designed to work with GitHub Pages.

## Architecture & Structure

The site is built with:
- **Frontend Framework**: Bootstrap 4 with custom CSS components
- **Animation Libraries**: Paper.js for particle background, GSAP for scroll animations
- **Data Management**: Projects loaded from `assets/data/projects.json`
- **JavaScript**: ES6 modules with component-based architecture
- **No Build Process**: Direct HTML/CSS/JS files served statically

### Key Components

1. **Background Animation** (`assets/js/components/background-animation.js`): Paper.js particle system with mouse interaction
2. **Project Gallery** (`assets/js/components/projects.js`): Dynamic project loading with 3D tilt effects and carousels
3. **GSAP Animations** (`assets/js/components/gsap-animations.js`): Scroll-triggered animations using ScrollTrigger
4. **Smooth Scrolling** (`assets/js/components/smooth-scroll.js`): Enhanced navigation scrolling

## Development Commands

Since this is a static site without a build process:

```bash
# Serve locally (Python 3)
python -m http.server 8000

# Or with Python 2
python -m SimpleHTTPServer 8000

# Or with Node.js http-server (if installed)
npx http-server
```

## Project Structure

```
assets/
├── css/
│   ├── main.css              # Main styles with CSS variables
│   ├── components/           # Component-specific styles
│   │   ├── hero.css
│   │   ├── navigation.css
│   │   ├── projects.css
│   │   └── contact.css
│   └── vendor/              # Third-party CSS
├── js/
│   ├── main.js              # Main entry point for JS
│   ├── components/          # Feature-specific modules
│   └── vendor/              # Third-party scripts
├── data/
│   └── projects.json        # Project data (5 projects)
└── img/
    └── projects/            # Project images organized by ID
```

## Adding/Modifying Projects

Projects are managed in `assets/data/projects.json`. Each project requires:
- `id`: Unique identifier matching image folder name
- `title`: Display title
- `thumbnail`: Path to thumbnail image
- `description`: Short description
- `fullDescription`: Detailed description
- `technologies`: Array of tech stack items
- `images`: Array of image filenames (relative to project folder)
- `video`: Optional YouTube embed URL or local video path
- `links`: Object with optional `github`, `itch` properties

## Key Implementation Details

- Paper.js animations run on canvas with id="canvas"
- Project gallery includes 3D tilt effects on hover
- GSAP ScrollTrigger animates elements on scroll
- Bootstrap 4 loaded from CDN
- jQuery used for DOM manipulation and Bootstrap components
- FitText.js for responsive project title sizing