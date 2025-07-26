// Lightweight CSS-based Background Animation
function initBackgroundAnimation() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  // Replace canvas with a div container
  const container = document.createElement('div');
  container.id = 'particle-container';
  container.className = 'particle-container';
  canvas.parentNode.replaceChild(container, canvas);

  const skills = [
    'C#', 'C++', 'Java', 'Python', 'JavaScript', 
    'HTML', 'CSS', 'PHP', 'MATLAB', 
    'Unity', 'Unreal Engine', 'Git', 
    'React', 'Node.js', 'SQL',
    'Game Development', 'AI/ML', 'VR/AR'
  ];

  const skillCount = 30; // Reduced for better performance
  const particles = [];

  // Create particles
  for (let i = 0; i < skillCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'skill-particle';
    particle.textContent = skills[Math.floor(Math.random() * skills.length)];
    
    // Random properties
    const fontSize = 14 + Math.random() * 10;
    const duration = 20 + Math.random() * 20;
    const delay = Math.random() * duration;
    const startX = Math.random() * 100;
    
    particle.style.cssText = `
      font-size: ${fontSize}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      left: ${startX}%;
      opacity: ${0.4 + Math.random() * 0.4};
    `;
    
    container.appendChild(particle);
    particles.push({
      element: particle,
      originalOpacity: particle.style.opacity
    });
  }

  // Add CSS styles
  const style = document.createElement('style');
  style.textContent = `
    .particle-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      background: #0a0a0a;
      pointer-events: none;
    }
    
    .skill-particle {
      position: absolute;
      color: #4a9eff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-weight: 500;
      text-shadow: 0 0 10px currentColor;
      pointer-events: auto;
      cursor: default;
      animation: fall linear infinite;
      will-change: transform;
      transform: translateZ(0);
    }
    
    @keyframes fall {
      from {
        transform: translateY(-100px);
      }
      to {
        transform: translateY(calc(100vh + 100px));
      }
    }
    
    .skill-particle:hover {
      animation-play-state: paused;
      transform: scale(1.2);
      filter: brightness(1.5);
      transition: all 0.3s ease;
    }
    
    .skill-particle.attracted {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .skill-particle.exploding {
      animation: explode 0.6s ease-out forwards;
    }
    
    @keyframes explode {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.5);
        opacity: 1;
      }
      100% {
        transform: scale(0.5) translateY(200px);
        opacity: 0;
      }
    }
    
    /* Spark effect using CSS */
    .spark {
      position: absolute;
      width: 4px;
      height: 4px;
      background: #6bb2ff;
      border-radius: 50%;
      pointer-events: none;
      animation: spark-fly 1s ease-out forwards;
      box-shadow: 0 0 6px #6bb2ff;
    }
    
    @keyframes spark-fly {
      0% {
        opacity: 1;
        transform: translate(0, 0) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(var(--dx), var(--dy)) scale(0.2);
      }
    }
  `;
  document.head.appendChild(style);

  // Mouse interaction
  let mouseDown = false;
  let mouseX = 0;
  let mouseY = 0;

  container.addEventListener('mousedown', (e) => {
    mouseDown = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Attract nearby particles
    particles.forEach(({ element }) => {
      const rect = element.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - mouseX;
      const dy = rect.top + rect.height / 2 - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200) {
        element.classList.add('attracted');
        element.style.transform = `translate(${-dx * 0.3}px, ${-dy * 0.3}px)`;
      }
    });
  });

  container.addEventListener('mouseup', (e) => {
    mouseDown = false;
    
    // Create explosion effect
    particles.forEach(({ element }) => {
      if (element.classList.contains('attracted')) {
        element.classList.remove('attracted');
        element.classList.add('exploding');
        
        // Create sparks
        const rect = element.getBoundingClientRect();
        for (let i = 0; i < 3; i++) {
          createSpark(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
        
        // Reset after animation
        setTimeout(() => {
          element.classList.remove('exploding');
          element.style.transform = '';
          // Change text
          element.textContent = skills[Math.floor(Math.random() * skills.length)];
        }, 600);
      }
    });
  });

  function createSpark(x, y) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    
    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100;
    spark.style.setProperty('--dx', Math.cos(angle) * distance + 'px');
    spark.style.setProperty('--dy', Math.sin(angle) * distance + 'px');
    
    container.appendChild(spark);
    setTimeout(() => spark.remove(), 1000);
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackgroundAnimation);
} else {
  initBackgroundAnimation();
}