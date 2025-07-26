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
  let lastMousePoint = null;
  const floatingSkills = [];

  // Create floating skill texts
  for (let i = 0; i < skillCount; i++) {
    // Pick a random skill
    const skillText = skills[Math.floor(Math.random() * skills.length)];
    
    // Random properties
    const fontSize = minFontSize + Math.random() * (maxFontSize - minFontSize);
    const opacity = minOpacity + Math.random() * (maxOpacity - minOpacity);
    const speed = baseSpeed + Math.random() * (maxSpeed - baseSpeed);
    
    // Create color variation (subtle hue shift around blue)
    const hueVariation = Math.random() * 0.06 - 0.03; // -0.03 to +0.03 (reduced from 0.15)
    const baseColor = new paper.Color({
      hue: 210 + (hueVariation * 360), // Base blue (210°) with subtle variation
      saturation: 0.75 + Math.random() * 0.15, // 75-90% saturation (narrower range)
      brightness: 0.85 + Math.random() * 0.1   // 85-95% brightness (narrower range)
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
      baseColor: baseColor,
      velocity: new paper.Point(0, 0),
      shakeAmount: 0,
      attractionStrength: 0
    });
  }

  // Animation frame handler
  paper.view.onFrame = function(event) {
    floatingSkills.forEach(skill => {
      // Apply continuous attraction when mouse is held down
      if (click && lastMousePoint) {
        const distance = skill.text.position.getDistance(lastMousePoint);
        if (distance < 200) {
          // Pull text toward mouse
          const d = skill.text.position.subtract(lastMousePoint);
          skill.text.position = skill.text.position.subtract(d.multiply(0.05));
          
          // Track how strongly this skill is being attracted
          const attractionIntensity = 1 - (distance / 200);
          skill.attractionStrength = Math.max(skill.attractionStrength, attractionIntensity);
          
          // Increase glow effect based on proximity
          skill.text.fillColor.alpha = Math.min(skill.originalOpacity + (0.4 * attractionIntensity), 1);
          skill.text.shadowBlur = 8 + (12 * attractionIntensity);
        }
      }
      
      // Apply velocity from explosion effect
      if (skill.velocity.length > 0.1) {
        skill.text.position = skill.text.position.add(skill.velocity);
        skill.velocity = skill.velocity.multiply(0.95); // Damping
      }
      
      // Apply shake effect
      if (skill.shakeAmount > 0.1) {
        const shakeX = (Math.random() - 0.5) * skill.shakeAmount;
        const shakeY = (Math.random() - 0.5) * skill.shakeAmount;
        skill.text.position.x += shakeX;
        skill.text.position.y += shakeY;
        skill.shakeAmount *= 0.9; // Decay shake
      }
      
      // Move skill down (normal gravity)
      skill.text.position.y += skill.speed;
      
      // Wrap around screen edges horizontally
      if (skill.text.bounds.right < 0) {
        skill.text.position.x = paper.view.size.width + skill.text.bounds.width;
      } else if (skill.text.bounds.left > paper.view.size.width) {
        skill.text.position.x = -skill.text.bounds.width;
      }
      
      // Reset position if it goes below viewport
      if (skill.text.bounds.top > paper.view.size.height) {
        skill.text.position.y = -50;
        skill.text.position.x = Math.random() * paper.view.size.width;
        skill.velocity = new paper.Point(0, 0);
        skill.shakeAmount = 0;
        
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
    lastMousePoint = event.point;
    
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

  paper.view.onMouseDrag = function(event) {
    click = true;
    lastMousePoint = event.point;
    
    // Attract skills to cursor while dragging
    floatingSkills.forEach(skill => {
      const distance = skill.text.position.getDistance(event.point);
      if (distance < 200) {
        // Pull text toward mouse
        const d = skill.text.position.subtract(event.point);
        skill.text.position = skill.text.position.subtract(d.multiply(0.05));
        
        // Track how strongly this skill is being attracted
        const attractionIntensity = 1 - (distance / 200);
        skill.attractionStrength = Math.max(skill.attractionStrength, attractionIntensity);
        
        // Increase glow effect based on proximity
        skill.text.fillColor.alpha = Math.min(skill.originalOpacity + (0.4 * attractionIntensity), 1);
        skill.text.shadowBlur = 8 + (12 * attractionIntensity);
      }
    });
  };

  paper.view.onMouseUp = function(event) {
    click = false;
    
    // Apply explosion effect to attracted skills
    floatingSkills.forEach(skill => {
      if (skill.attractionStrength > 0.1) {
        // Calculate explosion direction (away from cursor)
        const direction = skill.text.position.subtract(lastMousePoint || event.point);
        const distance = direction.length;
        
        // Normalize direction and add some randomness
        let explosionDir;
        if (distance > 0) {
          explosionDir = direction.normalize();
        } else {
          // If skill is exactly at cursor, use random direction
          const angle = Math.random() * Math.PI * 2;
          explosionDir = new paper.Point(Math.cos(angle), Math.sin(angle));
        }
        
        // Add random perpendicular component for more natural scatter
        const perpAngle = Math.atan2(explosionDir.y, explosionDir.x) + Math.PI / 2;
        const perpComponent = new paper.Point(
          Math.cos(perpAngle) * (Math.random() - 0.5) * 0.5,
          Math.sin(perpAngle) * (Math.random() - 0.5) * 0.5
        );
        explosionDir = explosionDir.add(perpComponent).normalize();
        
        // Calculate explosion force based on how strongly it was attracted
        const baseForce = 15;
        const force = baseForce * skill.attractionStrength * (0.8 + Math.random() * 0.4);
        
        // Apply velocity
        skill.velocity = explosionDir.multiply(force);
        
        // Apply shake based on attraction strength
        skill.shakeAmount = skill.attractionStrength * 10;
      }
      
      // Reset visual properties
      skill.text.fillColor = new paper.Color(skill.baseColor.red, skill.baseColor.green, skill.baseColor.blue, skill.originalOpacity);
      skill.text.shadowColor = new paper.Color(skill.baseColor.red, skill.baseColor.green, skill.baseColor.blue, skill.originalOpacity * 0.8);
      skill.text.shadowBlur = 8;
      
      // Reset attraction strength for next interaction
      skill.attractionStrength = 0;
    });
  };
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackgroundAnimation);
} else {
  initBackgroundAnimation();
}