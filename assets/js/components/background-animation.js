// Background Animation using Paper.js
function initBackgroundAnimation() {
  // Get the canvas element
  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  // Setup Paper.js
  paper.setup(canvas);

  const count = 100;
  let click = false;

  // Create circle path with dark theme colors
  const path = new paper.Path.Circle({
    center: [0, 0],
    radius: 10,
    fillColor: new paper.Color(74/255, 158/255, 255/255, 0.3), // Accent blue with opacity
    strokeColor: new paper.Color(74/255, 158/255, 255/255, 0.5)
  });

  // Create symbol and place instances
  const symbol = new paper.Symbol(path);
  const circles = [];

  for (let i = 0; i < count; i++) {
    const center = paper.Point.random().multiply(paper.view.size);
    const placedSymbol = symbol.place(center);
    placedSymbol.scale(i / count);
    circles.push(placedSymbol);
  }

  // Animation frame handler
  paper.view.onFrame = function(event) {
    for (let i = 0; i < count; i++) {
      const item = circles[i];
      item.position.y += item.bounds.height / 20;
      if (item.bounds.top > paper.view.size.height) {
        item.position.y = -item.bounds.height;
      }
    }
  };

  // Mouse interaction handlers
  paper.view.onMouseMove = function(event) {
    if (!click) {
      for (let i = 0; i < count; i++) {
        const item = circles[i];
        const distance = item.position.getDistance(event.point);
        if (distance < 100) {
          const d = item.position.subtract(event.point);
          item.position = item.position.add(d.multiply(0.1));
        }
      }
    }
  };

  paper.view.onMouseDrag = function(event) {
    click = true;
    for (let i = 0; i < count; i++) {
      const item = circles[i];
      const distance = item.position.getDistance(event.point);
      if (distance < 100) {
        const d = item.position.subtract(event.point);
        item.position = item.position.subtract(d.multiply(0.1));
      }
    }
  };

  paper.view.onMouseUp = function(event) {
    click = false;
  };
}

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackgroundAnimation);
} else {
  initBackgroundAnimation();
}