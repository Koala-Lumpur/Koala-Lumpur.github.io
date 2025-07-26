// Background Animation using PixiJS - Optimized Performance Version
function initBackgroundAnimation() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  // Create PixiJS Application
  const app = new PIXI.Application({
    view: canvas,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x0a0a0a,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: true
  });

  // Skills array
  const skills = [
    'C#', 'C++', 'Java', 'Python', 'JavaScript', 
    'HTML', 'CSS', 'PHP', 'MATLAB', 
    'Unity', 'Unreal Engine', 'Git', 
    'React', 'Node.js', 'SQL',
    'Game Development', 'AI/ML', 'VR/AR'
  ];

  // Configuration
  const config = {
    skillCount: 60,
    minFontSize: 14,
    maxFontSize: 24,
    minOpacity: 0.4,
    maxOpacity: 0.8,
    baseSpeed: 0.5,
    maxSpeed: 2,
    baseColor: 0x4a9eff,
    glowStrength: 0.5
  };

  // Containers for better performance
  const skillsContainer = new PIXI.Container();
  const sparksContainer = new PIXI.ParticleContainer(1000, {
    scale: true,
    position: true,
    alpha: true,
    tint: true
  });
  
  app.stage.addChild(skillsContainer);
  app.stage.addChild(sparksContainer);

  // Create skill particles
  const floatingSkills = [];
  
  // Create blur filter for glow effect
  const blurFilter = new PIXI.filters.BlurFilter();
  blurFilter.blur = 8;
  blurFilter.quality = 1;
  
  // Text style template
  const baseTextStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: 500,
    fill: config.baseColor,
    dropShadow: true,
    dropShadowColor: config.baseColor,
    dropShadowBlur: 8, // Increased for more glow
    dropShadowAngle: 0,
    dropShadowDistance: 0,
    dropShadowAlpha: 0.6
  };

  // Create floating skills
  for (let i = 0; i < config.skillCount; i++) {
    const skillText = skills[Math.floor(Math.random() * skills.length)];
    const fontSize = config.minFontSize + Math.random() * (config.maxFontSize - config.minFontSize);
    const opacity = config.minOpacity + Math.random() * (config.maxOpacity - config.minOpacity);
    const speed = config.baseSpeed + Math.random() * (config.maxSpeed - config.baseSpeed);
    
    // Create PIXI Text with optimized style
    const text = new PIXI.Text(skillText, {
      ...baseTextStyle,
      fontSize: fontSize
    });
    
    text.x = Math.random() * app.screen.width;
    text.y = -50 - Math.random() * app.screen.height;
    text.alpha = opacity;
    text.anchor.set(0.5);
    
    skillsContainer.addChild(text);
    
    floatingSkills.push({
      text: text,
      glow: null, // Temporarily disable glow
      speed: speed,
      originalOpacity: opacity,
      velocity: { x: 0, y: 0 },
      attractionStrength: 0
    });
  }

  // Spark particles pool (reusable for performance)
  const sparkPool = [];
  const activeSparks = [];
  
  // Pre-create spark textures
  const sparkTexture = createSparkTexture();
  
  function createSparkTexture() {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawCircle(0, 0, 4);
    graphics.endFill();
    return app.renderer.generateTexture(graphics);
  }

  // Create spark pool
  for (let i = 0; i < 100; i++) {
    const spark = new PIXI.Sprite(sparkTexture);
    spark.anchor.set(0.5);
    spark.visible = false;
    spark.tint = config.baseColor;
    sparksContainer.addChild(spark);
    sparkPool.push(spark);
  }

  // Mouse state
  let mouseDown = false;
  let mousePosition = { x: 0, y: 0 };

  // Optimize collision detection with spatial partitioning
  function getSkillsNearPoint(point, radius) {
    return floatingSkills.filter(skill => {
      const dx = skill.text.x - point.x;
      const dy = skill.text.y - point.y;
      return dx * dx + dy * dy < radius * radius;
    });
  }

  // Create sparks effect
  function createSparks(x, y, count = 5) {
    for (let i = 0; i < count && sparkPool.length > 0; i++) {
      const spark = sparkPool.pop();
      if (!spark) continue;
      
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 6;
      
      spark.x = x;
      spark.y = y;
      spark.visible = true;
      spark.alpha = 1;
      spark.scale.set(1);
      
      activeSparks.push({
        sprite: spark,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        },
        life: 1.0,
        decay: 0.02
      });
    }
  }

  // Animation loop
  app.ticker.add((delta) => {
    // Update sparks
    for (let i = activeSparks.length - 1; i >= 0; i--) {
      const spark = activeSparks[i];
      
      spark.sprite.x += spark.velocity.x * delta;
      spark.sprite.y += spark.velocity.y * delta;
      spark.velocity.y += 0.5 * delta; // Gravity
      
      spark.life -= spark.decay * delta;
      spark.sprite.alpha = spark.life;
      spark.sprite.scale.set(spark.life);
      
      if (spark.life <= 0) {
        spark.sprite.visible = false;
        sparkPool.push(spark.sprite);
        activeSparks.splice(i, 1);
      }
    }
    
    // Update floating skills
    floatingSkills.forEach(skill => {
      // Apply attraction when mouse is down
      if (mouseDown) {
        const dx = skill.text.x - mousePosition.x;
        const dy = skill.text.y - mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300 && distance > 0) { // Increased range from 200 to 300
          const force = (1 - distance / 300) * 2.0; // MUCH stronger force - increased to 2.0
          skill.velocity.x -= dx / distance * force * delta;
          skill.velocity.y -= dy / distance * force * delta;
          skill.attractionStrength = Math.max(skill.attractionStrength, 1 - distance / 300);
          
          // Direct position adjustment for immediate response
          const pullStrength = (1 - distance / 300) * 0.15; // Direct pull towards cursor
          skill.text.x -= dx * pullStrength;
          skill.text.y -= dy * pullStrength;
          
          // Add visual feedback for attraction
          const attractionIntensity = 1 - distance / 300;
          skill.text.alpha = Math.min(skill.originalOpacity + (0.4 * attractionIntensity), 1);
          skill.text.scale.set(1 + attractionIntensity * 0.3); // Scale up when attracted
        }
      }
      
      // Apply velocity
      if (Math.abs(skill.velocity.x) > 0.1 || Math.abs(skill.velocity.y) > 0.1) {
        skill.text.x += skill.velocity.x * delta;
        skill.text.y += skill.velocity.y * delta;
        // Less damping when mouse is down for smoother attraction
        const dampingFactor = mouseDown ? 0.85 : 0.92;
        skill.velocity.x *= dampingFactor;
        skill.velocity.y *= dampingFactor;
      }
      
      // Update glow position to follow text (if glow exists)
      if (skill.glow) {
        skill.glow.x = skill.text.x;
        skill.glow.y = skill.text.y;
        skill.glow.scale.set(skill.text.scale.x); // Match text scale
        
        // Enhanced glow during attraction
        if (skill.attractionStrength > 0) {
          skill.glow.alpha = skill.originalOpacity * 0.15 + (skill.attractionStrength * 0.2);
        } else {
          skill.glow.alpha = skill.originalOpacity * 0.15;
        }
      }
      
      // Normal falling motion
      skill.text.y += skill.speed * delta;
      if (skill.glow) {
        skill.glow.y += skill.speed * delta;
      }
      
      // Wrap around edges
      if (skill.text.x < -50) {
        skill.text.x = app.screen.width + 50;
        if (skill.glow) skill.glow.x = skill.text.x;
      }
      if (skill.text.x > app.screen.width + 50) {
        skill.text.x = -50;
        if (skill.glow) skill.glow.x = skill.text.x;
      }
      
      // Reset when below screen
      if (skill.text.y > app.screen.height + 50) {
        skill.text.y = -50;
        skill.text.x = Math.random() * app.screen.width;
        if (skill.glow) {
          skill.glow.x = skill.text.x;
          skill.glow.y = skill.text.y;
        }
        skill.velocity.x = 0;
        skill.velocity.y = 0;
        skill.text.text = skills[Math.floor(Math.random() * skills.length)];
      }
    });
  });

  // Mouse event handlers
  app.stage.interactive = true;
  app.stage.hitArea = app.screen;

  app.stage.on('pointermove', (event) => {
    mousePosition = event.data.global;
    
    if (!mouseDown) {
      // Reset all scales first
      floatingSkills.forEach(skill => skill.text.scale.set(1));
      
      const nearbySkills = getSkillsNearPoint(mousePosition, 150);
      nearbySkills.forEach(skill => {
        const dx = skill.text.x - mousePosition.x;
        const dy = skill.text.y - mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          skill.text.x += (dx / distance) * 8; // Increased repulsion from 5 to 8
          skill.text.y += (dy / distance) * 8;
          
          // Add subtle scale effect on hover
          skill.text.scale.set(1.1);
        }
      });
    }
  });

  app.stage.on('pointerdown', () => {
    mouseDown = true;
  });

  app.stage.on('pointerup', () => {
    mouseDown = false;
    
    // Explosion effect
    floatingSkills.forEach(skill => {
      if (skill.attractionStrength > 0.1) {
        const dx = skill.text.x - mousePosition.x;
        const dy = skill.text.y - mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
          const force = skill.attractionStrength * 25; // Increased explosion force from 15 to 25
          skill.velocity.x = (dx / distance) * force;
          skill.velocity.y = (dy / distance) * force;
          
          if (skill.attractionStrength > 0.3) {
            createSparks(skill.text.x, skill.text.y);
          }
        }
        
        skill.attractionStrength = 0;
      }
    });
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackgroundAnimation);
} else {
  initBackgroundAnimation();
}