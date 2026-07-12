const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

// Starfield background effect
(function () {
  var canvas = document.createElement('canvas');
  canvas.id = 'starfield';
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var stars = [];
  var shootingStars = [];
  var W = 0, H = 0;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    var count = Math.floor((W * H) / 6000);
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.3,
        tw: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.02 + 0.005,
        depth: Math.random() * 0.6 + 0.4,
      });
    }
  }

  function spawnShootingStar() {
    if (Math.random() > 0.997) {
      shootingStars.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.5,
        vx: (Math.random() * 4 + 4) * (Math.random() > 0.5 ? 1 : -1),
        vy: Math.random() * 2 + 1,
        life: 1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    var grad = ctx.createRadialGradient(W * 0.7, H * 0.2, 0, W * 0.7, H * 0.2, W * 0.6);
    grad.addColorStop(0, 'rgba(80, 40, 160, 0.06)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.tw += s.sp;
      var alpha = (Math.sin(s.tw) * 0.4 + 0.6) * s.depth;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(220, 210, 255, ' + alpha + ')';
      ctx.fill();
    }

    spawnShootingStar();
    for (var j = shootingStars.length - 1; j >= 0; j--) {
      var ss = shootingStars[j];
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.life -= 0.012;
      if (ss.life <= 0) { shootingStars.splice(j, 1); continue; }
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(200, 190, 255, ' + ss.life + ')';
      ctx.lineWidth = 2;
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - ss.vx * 4, ss.y - ss.vy * 4);
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();


// Mobile menu toggle
if (toggle && nav) {
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        nav.classList.toggle('open');
        toggle.classList.toggle('active');
    });
}

// Close menu when clicking outside
if (nav) {
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
            nav.classList.remove('open');
            toggle.classList.remove('active');
        }
    });
}

// Reveal animations
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Smooth scroll WITHOUT hash in URL
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // close mobile nav after click (optional but good UX)
        nav?.classList.remove('open');
    });
});

// Handle direct access like /#work then remove hash cleanly
window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);

        if (target) {
            target.scrollIntoView({ behavior: 'auto' });
        }

        history.replaceState(
            null,
            '',
            window.location.pathname + window.location.search
        );
    }
});