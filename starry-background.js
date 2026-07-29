/* Starry Background — drop into any page */
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
    ctx.fillStyle = '#05050f';
    ctx.fillRect(0, 0, W, H);

    var grad1 = ctx.createRadialGradient(W * 0.72, H * 0.18, 0, W * 0.72, H * 0.18, W * 0.55);
    grad1.addColorStop(0, 'rgba(255, 100, 170, 0.45)');
    grad1.addColorStop(0.4, 'rgba(255, 70, 140, 0.18)');
    grad1.addColorStop(1, 'transparent');
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, W, H);

    var grad2 = ctx.createRadialGradient(W * 0.2, H * 0.75, 0, W * 0.2, H * 0.75, W * 0.5);
    grad2.addColorStop(0, 'rgba(255, 130, 190, 0.35)');
    grad2.addColorStop(0.5, 'rgba(220, 70, 130, 0.12)');
    grad2.addColorStop(1, 'transparent');
    ctx.fillStyle = grad2;
    ctx.fillRect(0, 0, W, H);

    var grad3 = ctx.createRadialGradient(W * 0.5, H * 0.45, 0, W * 0.5, H * 0.45, W * 0.35);
    grad3.addColorStop(0, 'rgba(200, 80, 160, 0.15)');
    grad3.addColorStop(1, 'transparent');
    ctx.fillStyle = grad3;
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
