/**
 * Interactive Particle Canvas Background
 * High-performance constellation & data-point particle simulation
 * Supports theme awareness (Dark / Light) and cursor attraction.
 */

class ParticleNetwork {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 140 };
    this.particleCount = 65;
    this.connectionDistance = 125;
    this.animationId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.createParticles();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;

    // Adjust count based on screen width
    if (this.width < 768) {
      this.particleCount = 35;
      this.connectionDistance = 90;
    } else {
      this.particleCount = 70;
      this.connectionDistance = 130;
    }

    if (this.particles.length > 0) {
      this.createParticles();
    }
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const isAccent = Math.random() < 0.25;
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.75,
        vy: (Math.random() - 0.5) * 0.75,
        radius: Math.random() * 2 + (isAccent ? 2.5 : 1.2),
        isAccent: isAccent,
        baseAlpha: Math.random() * 0.4 + 0.3
      });
    }
  }

  animate() {
    const isLight = document.body.classList.contains('light-theme');
    this.ctx.clearRect(0, 0, this.width, this.height);

    const normalDotColor = isLight ? 'rgba(100, 116, 139, ' : 'rgba(148, 163, 184, ';
    const accentDotColor = isLight ? 'rgba(234, 88, 12, ' : 'rgba(249, 115, 22, ';
    const lineColor = isLight ? 'rgba(148, 163, 184, ' : 'rgba(249, 115, 22, ';

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Move particle
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls
      if (p.x < 0 || p.x > this.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.height) p.vy *= -1;

      // Mouse interactivity
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (1 - dist / this.mouse.radius) * 0.8;
          p.x += (dx / dist) * force * 2.5;
          p.y += (dy / dist) * force * 2.5;
        }
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = (p.isAccent ? accentDotColor : normalDotColor) + p.baseAlpha + ')';
      this.ctx.fill();

      // Draw connecting lines
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.connectionDistance) {
          const alpha = (1 - dist / this.connectionDistance) * (isLight ? 0.15 : 0.22);
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = lineColor + alpha + ')';
          this.ctx.lineWidth = 0.85;
          this.ctx.stroke();
        }
      }
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ParticleNetwork('particle-canvas');
});
