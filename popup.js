let points = [];
let numPoints = 25;
let lastSecond = -1;
let baseColor = 180;
let paused = false;
let speed = 1;

let sketch = (p) => {
  p.setup = () => {
    let canvas = p.createCanvas(300, 150);
    canvas.parent("sketch-holder");

    p.colorMode(p.HSB, 360, 255, 255, 255);

    for (let i = 0; i < numPoints; i++) {
      points.push(p.createVector(p.random(p.width), p.random(p.height)));
    }

    let savedSpeed = p.getItem("speed");
    if (savedSpeed) {
      speed = savedSpeed;
      document.getElementById("speedSlider").value = speed;
    }
  };

  p.draw = () => {
    if (paused) return;

    p.background(10, 10, 30, 120);

    let s = new Date().getSeconds();
    if (s !== lastSecond) {
      baseColor = p.random(150, 250);
      lastSecond = s;
      p.storeItem("lastColor", baseColor);
    }

    let savedColor = p.getItem("lastColor");
    if (savedColor) baseColor = parseFloat(savedColor);

    for (let pt of points) {
      pt.x += p.random(-0.4, 0.4) * speed;
      pt.y += p.random(-0.4, 0.4) * speed;
      pt.x = p.constrain(pt.x, 0, p.width);
      pt.y = p.constrain(pt.y, 0, p.height);
    }

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        let d = p.dist(points[i].x, points[i].y, points[j].x, points[j].y);
        if (d < 60) {
          p.stroke(baseColor, 200, 255, p.map(d, 0, 60, 100, 0));
          p.line(points[i].x, points[i].y, points[j].x, points[j].y);
        }
      }
      p.noStroke();
      p.fill(baseColor, 200, 255, 200);
      p.circle(points[i].x, points[i].y, 3);
    }
  };
};

window.addEventListener("DOMContentLoaded", () => {
  new p5(sketch);

  const slider = document.getElementById("speedSlider");
  const btn = document.getElementById("toggleBtn");

  slider.addEventListener("input", () => {
    speed = parseFloat(slider.value);
    storeItem("speed", speed);
  });

  btn.addEventListener("click", () => {
    paused = !paused;
    btn.textContent = paused ? "Reprèn" : "Pausa";
  });
});
