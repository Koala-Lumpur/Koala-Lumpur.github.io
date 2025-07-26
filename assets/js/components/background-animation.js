// Background Animation using Paper.js
function initBackgroundAnimation() {
  // Get the canvas element
  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  // Setup Paper.js
  paper.setup(canvas);

  // Skills array - ADD YOUR NEW SKILLS HERE
  const skills = [
    'C#', 'C++', 'Java', 'Python', 'JavaScript', 
    'HTML', 'CSS', 'PHP', 'MATLAB', 
    'Unity', 'Unreal Engine', 'Git', 
    'React', 'Node.js', 'SQL',
    'Game Development', 'AI/ML', 'VR/AR'
  ];

  // Configuration
  const skillCount = 60; // Total number of floating skills (increased by 1.5x)
  const minFontSize = 14;
  const maxFontSize = 24;
  const minOpacity = 0.4;
  const maxOpacity = 0.8;
  const baseSpeed = 0.5;
  const maxSpeed = 2;

  let click = false;
  const floatingSkills = [];

  // Create floating skill texts
  for (let i = 0; i < skillCount; i++) {
    // Pick a random skill
    const skillText = skills[Math.floor(Math.random() * skills.length)];
    
    // Random properties
    const fontSize = minFontSize + Math.random() * (maxFontSize - minFontSize);
    const opacity = minOpacity + Math.random() * (maxOpacity - minOpacity);
    const speed = baseSpeed + Math.random() * (maxSpeed - baseSpeed);
    
    // Create color variation (hue shift between blue and purple)
    const hueVariation = Math.random() * 0.15 - 0.075; // -0.075 to +0.075
    const baseColor = new paper.Color({
      hue: 210 + (hueVariation * 360), // Base blue (210°) with variation
      saturation: 0.7 + Math.random() * 0.3,
      brightness: 0.8 + Math.random() * 0.2
    });
    
    // Create text item with glow
    const text = new paper.PointText({
      point: [
        Math.random() * paper.view.size.width,
        -50 - Math.random() * paper.view.size.height // Start above viewport
      ],
      content: skillText,
      fillColor: new paper.Color(baseColor.red, baseColor.green, baseColor.blue, opacity),
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: fontSize,
      fontWeight: '500',
      shadowColor: new paper.Color(baseColor.red, baseColor.green, baseColor.blue, opacity * 0.8),
      shadowBlur: 8,
      shadowOffset: new paper.Point(0, 0)
    });
    
    // Store text with its properties
    floatingSkills.push({
      text: text,
      speed: speed,
      originalOpacity: opacity,
      baseColor: baseColor
    });
  }

  // Animation frame handler
  paper.view.onFrame = function(event) {
    floatingSkills.forEach(skill => {
      // Move skill down
      skill.text.position.y += skill.speed;
      
      // Reset position if it goes below viewport
      if (skill.text.bounds.top > paper.view.size.height) {
        skill.text.position.y = -50;
        skill.text.position.x = Math.random() * paper.view.size.width;
        
        // Randomly pick a new skill text
        skill.text.content = skills[Math.floor(Math.random() * skills.length)];
      }
    });
  };

  // Mouse interaction handlers
  paper.view.onMouseMove = function(event) {
    if (!click) {
      floatingSkills.forEach(skill => {
        const distance = skill.text.position.getDistance(event.point);
        if (distance < 150) {
          // Push text away from mouse
          const d = skill.text.position.subtract(event.point);
          skill.text.position = skill.text.position.add(d.normalize(5));
          
          // Increase opacity and glow when near mouse
          skill.text.fillColor.alpha = Math.min(skill.originalOpacity + 0.3, 1);
          skill.text.shadowBlur = 15;
        } else {
          // Restore original opacity and glow
          skill.text.fillColor.alpha = skill.originalOpacity;
          skill.text.shadowBlur = 8;
        }
      });
    }
  };

  paper.view.onMouseDown = function(event) {
    click = true;
    // On click, make nearby skills glow brighter
    floatingSkills.forEach(skill => {
      const distance = skill.text.position.getDistance(event.point);
      if (distance < 100) {
        skill.text.fillColor = new paper.Color(107/255, 178/255, 255/255, 0.9);
        skill.text.shadowColor = new paper.Color(74/255, 158/255, 255/255);
        skill.text.shadowBlur = 10;
      }
    });
  };

  paper.view.onMouseUp = function(event) {
    click = false;
    // Reset glow effect
    floatingSkills.forEach(skill => {
      skill.text.fillColor = new paper.Color(74/255, 158/255, 255/255, skill.originalOpacity);
      skill.text.shadowColor = null;
      skill.text.shadowBlur = 0;
    });
  };
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackgroundAnimation);
} else {
  initBackgroundAnimation();
}