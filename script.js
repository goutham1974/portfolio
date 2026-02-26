/* ====================================================
   GOUTHAM REDDY PORTFOLIO — script.js
   Particles | Cursor | Typewriter | Scroll Animations
   ==================================================== */

'use strict';

/* ─── Loader ───────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    // Trigger hero animations after load
    document.querySelectorAll('.hero-content > *').forEach((el, i) => {
      el.style.animationDelay = `${i * 0.15}s`;
    });
    initCounters();
  }, 1800);
});

/* ─── Custom Cursor ────────────────────────────────── */
const cursorDot     = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
let mouseX = -100, mouseY = -100;
let outX = -100, outY = -100;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function animateCursor() {
  outX += (mouseX - outX) * 0.12;
  outY += (mouseY - outY) * 0.12;
  cursorOutline.style.left = outX + 'px';
  cursorOutline.style.top  = outY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ─── Particle Canvas ──────────────────────────────── */
const canvas  = document.getElementById('particleCanvas');
const ctx     = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.size = Math.random() * 2.5 + 0.5;
    this.vx   = (Math.random() - 0.5) * 0.4;
    this.vy   = (Math.random() - 0.5) * 0.4;
    this.life = 0;
    this.maxLife = 200 + Math.random() * 300;
    const colors = ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(236,72,153,', 'rgba(245,158,11,'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = Math.random() * 0.6 + 0.1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life++;
    if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
      this.reset();
    }
  }
  draw() {
    const fade = this.life < 30 ? this.life / 30 :
                 this.life > this.maxLife - 30 ? (this.maxLife - this.life) / 30 : 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color + (this.alpha * fade) + ')';
    ctx.fill();
  }
}

// Connection lines
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const alpha = (1 - dist / 120) * 0.15;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

// Mouse attraction
let mx = -1000, my = -1000;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function particleLoop() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    // Mouse attraction
    const dx = mx - p.x, dy = my - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) {
      p.vx += dx * 0.0002;
      p.vy += dy * 0.0002;
    }
    // Dampen velocity
    p.vx *= 0.995;
    p.vy *= 0.995;
    p.update();
    p.draw();
  });
  drawConnections();
  requestAnimationFrame(particleLoop);
}

// Init particles
for (let i = 0; i < 100; i++) particles.push(new Particle());
particleLoop();

/* ─── Typewriter ───────────────────────────────────── */
const titles = [
  'Software Developer',
  'Java Full-Stack Dev',
  'Spring Boot Expert',
  'React.js Builder',
  'Microservices Architect',
  'Cyber Security Scholar'
];
let tIdx = 0, charIdx = 0, isDeleting = false;
const typeEl = document.getElementById('typewriter');

function typeWriter() {
  const current = titles[tIdx];
  if (isDeleting) {
    typeEl.textContent = current.substring(0, charIdx--);
  } else {
    typeEl.textContent = current.substring(0, charIdx++);
  }

  let speed = isDeleting ? 60 : 110;

  if (!isDeleting && charIdx > current.length) {
    speed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIdx < 0) {
    isDeleting = false;
    tIdx = (tIdx + 1) % titles.length;
    speed = 400;
    charIdx = 0;
  }
  setTimeout(typeWriter, speed);
}
setTimeout(typeWriter, 2000);

/* ─── Navbar ───────────────────────────────────────── */
const navbar       = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
const navToggle    = document.getElementById('navToggle');
const navLinks     = document.querySelector('.nav-links');
const backToTop    = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrolled  = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const pct       = (scrolled / maxScroll) * 100;

  scrollProgress.style.width = pct + '%';
  navbar.classList.toggle('scrolled', scrolled > 60);
  backToTop.classList.toggle('show', scrolled > 400);

  // Active nav link
  document.querySelectorAll('.section').forEach(sec => {
    const top    = sec.offsetTop - 100;
    const bottom = top + sec.offsetHeight;
    if (scrolled >= top && scrolled < bottom) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[data-section="${sec.id}"]`);
      if (active) active.classList.add('active');
    }
  });
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ─── Reveal on Scroll (IntersectionObserver) ────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Skill Bars ───────────────────────────────────── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        const pct = bar.dataset.pct;
        setTimeout(() => { bar.style.width = pct + '%'; }, 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-cat-card').forEach(card => skillObserver.observe(card));

/* ─── Circular Ring Progress ─────────────────────── */
const ringObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.ring-progress').forEach(ring => {
        const pct = parseInt(ring.dataset.pct);
        const circumference = 2 * Math.PI * 50; // r=50
        const offset = circumference - (pct / 100) * circumference;
        setTimeout(() => { ring.style.strokeDashoffset = offset; }, 300);
      });
      ringObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.competency-rings').forEach(el => ringObserver.observe(el));

/* ─── Counter Animation ───────────────────────────── */
function initCounters() {
  document.querySelectorAll('.stat-num').forEach(counter => {
    const target = parseInt(counter.dataset.target);
    let current  = 0;
    const step   = Math.max(1, Math.floor(target / 30));
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      counter.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 60);
  });
}

/* ─── 3D Tilt Effect (Project Cards) ─────────────── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateZ(10px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
  });
});

/* ─── Glitch Text Effect ──────────────────────────── */
function glitchEffect(el) {
  const chars = '!<>-_\/[]{}—=+*^?#________';
  const original = el.textContent;
  let iteration  = 0;
  const interval = setInterval(() => {
    el.textContent = original.split('').map((char, idx) => {
      if (idx < iteration) return original[idx];
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    if (iteration >= original.length) clearInterval(interval);
    iteration += 1 / 3;
  }, 30);
}

document.querySelectorAll('.hero-name .name-line').forEach(el => {
  el.addEventListener('mouseenter', () => glitchEffect(el));
});

/* ─── Contact Form ────────────────────────────────── */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn     = document.querySelector('.btn-submit');
  const btnText = btn.querySelector('.btn-text');
  const btnIcon = btn.querySelector('.fa-paper-plane');
  const loader  = btn.querySelector('.btn-loader');
  const success = document.getElementById('formSuccess');

  // Show loading
  btnText.textContent = 'Sending...';
  btnIcon.style.display = 'none';
  loader.style.display = 'flex';
  btn.disabled = true;

  // Simulate send (replace with actual fetch/emailjs)
  setTimeout(() => {
    loader.style.display  = 'none';
    btnIcon.style.display = '';
    btnText.textContent   = 'Send Message';
    btn.disabled          = false;
    success.style.display = 'flex';
    document.getElementById('contactForm').reset();
    setTimeout(() => { success.style.display = 'none'; }, 4000);
  }, 1800);
}

/* ─── Smooth Section Entry (stagger children) ─────── */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const children = entry.target.querySelectorAll('.reveal');
      children.forEach((child, i) => {
        setTimeout(() => child.classList.add('visible'), i * 100);
      });
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('.section').forEach(s => sectionObserver.observe(s));

/* ─── Parallax Orbs ───────────────────────────────── */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const orb3 = document.querySelector('.orb-3');
  if (orb1) orb1.style.transform = `translateY(${scrolled * 0.15}px)`;
  if (orb2) orb2.style.transform = `translateY(${-scrolled * 0.1}px)`;
  if (orb3) orb3.style.transform = `translateY(${scrolled * 0.08}px)`;
});

/* ─── Tech Badge Mouse Repulsion ─────────────────── */
document.querySelectorAll('.tech-badge').forEach(badge => {
  badge.addEventListener('mouseenter', () => {
    badge.style.background = 'rgba(124,58,237,0.2)';
    badge.style.borderColor = 'rgba(124,58,237,0.5)';
    badge.style.color = '#fff';
    badge.style.boxShadow = '0 0 20px rgba(124,58,237,0.4)';
  });
  badge.addEventListener('mouseleave', () => {
    badge.style.background = '';
    badge.style.borderColor = '';
    badge.style.color = '';
    badge.style.boxShadow = '';
  });
});

/* ─── Neon Glow Cursor Trail ─────────────────────── */
const trail = [];
const TRAIL_LENGTH = 12;

for (let i = 0; i < TRAIL_LENGTH; i++) {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position:fixed; width:${4 - i * 0.2}px; height:${4 - i * 0.2}px;
    border-radius:50%; pointer-events:none; z-index:9997;
    background:rgba(6,182,212,${0.6 - i * 0.05});
    transform:translate(-50%,-50%);
    transition:none;
  `;
  document.body.appendChild(dot);
  trail.push({ el: dot, x: -100, y: -100 });
}

let trailMX = -100, trailMY = -100;
document.addEventListener('mousemove', e => {
  trailMX = e.clientX; trailMY = e.clientY;
});

function animateTrail() {
  let x = trailMX, y = trailMY;
  trail.forEach((dot, i) => {
    const prev = trail[i - 1];
    if (i > 0) {
      dot.x += (prev.x - dot.x) * 0.5;
      dot.y += (prev.y - dot.y) * 0.5;
    } else {
      dot.x = x; dot.y = y;
    }
    dot.el.style.left = dot.x + 'px';
    dot.el.style.top  = dot.y + 'px';
  });
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* ─── Skill Card Hover Glow ───────────────────────── */
document.querySelectorAll('.skill-cat-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(124,58,237,0.08), var(--bg-card2) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ─── Timeline Dot Pulse on View ─────────────────── */
const dotObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const dot = entry.target.querySelector('.timeline-dot');
      if (dot) {
        dot.style.animation = 'avatarPulse 2s ease-in-out infinite';
      }
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.timeline-item').forEach(item => dotObserver.observe(item));

/* ─── Certificate Modal Lightbox ─────────────────── */
const certModal       = document.getElementById('certModal');
const certModalFrame  = document.getElementById('certModalFrame');
const certModalTitle  = document.getElementById('certModalTitle');
const certImgPath     = document.getElementById('certImgPath');
const certPlaceholder = document.getElementById('certImgPlaceholder');
const certDownloadBtn = document.getElementById('certDownloadBtn');
const certModalClose  = document.getElementById('certModalClose');
const certOverlay     = document.getElementById('certModalOverlay');

function openCertModal(fileSrc, title) {
  certModalTitle.textContent = title;
  certImgPath.textContent    = fileSrc;
  certDownloadBtn.href       = fileSrc;
  certDownloadBtn.download   = title;

  // Load in iframe (works for PDF, JPG, PNG)
  certModalFrame.src = fileSrc;
  certPlaceholder.classList.add('hidden');

  certModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertModal() {
  certModal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { certModalFrame.src = ''; }, 350);
}

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    const file  = card.dataset.certImg;
    const title = card.dataset.certTitle;
    if (file) openCertModal(file, title);
  });
});

certModalClose.addEventListener('click', closeCertModal);
certOverlay.addEventListener('click', closeCertModal);

// Keyboard ESC to close
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && certModal.classList.contains('open')) closeCertModal();
});

/* ─── Hero grid mouse parallax ────────────────────── */
const heroGrid = document.querySelector('.hero-bg-grid');
if (heroGrid) {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    heroGrid.style.backgroundPosition = `${x}px ${y}px`;
  });
}

/* ─── Scroll-triggered name glow ─────────────────── */
const nameLines = document.querySelectorAll('.hero-name .name-line');
window.addEventListener('scroll', () => {
  if (window.scrollY < 200) {
    nameLines.forEach(l => l.style.textShadow = '');
  }
});
