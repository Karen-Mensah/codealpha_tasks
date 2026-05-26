alert("Script is running");
(function () {
  // ── INTRO SPLASH OVERLAY ──
  const splash = document.createElement('div');
  splash.id = 'splash';
  Object.assign(splash.style, {
    position: 'fixed', inset: '0', zIndex: '9999',
    background: '#0d1b2a', display: 'flex',
    flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', overflow: 'hidden',
    transition: 'opacity 0.8s ease',
  });

  // Name text
  const nameEl = document.createElement('div');
  nameEl.innerHTML = 'KAREN <span style="color:#2e9ef4;font-style:italic;">MENSAH</span>';
  Object.assign(nameEl.style, {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(36px,8vw,80px)',
    fontWeight: '900', color: '#fff',
    letterSpacing: '4px', opacity: '0',
    transform: 'translateY(30px)',
    transition: 'opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s',
  });

  const roleEl = document.createElement('div');
  roleEl.textContent = 'FRONTEND DEVELOPER';
  Object.assign(roleEl.style, {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px', letterSpacing: '6px',
    color: '#2e9ef4', marginTop: '12px', opacity: '0',
    transform: 'translateY(20px)',
    transition: 'opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s',
  });

  // Progress bar
  const barWrap = document.createElement('div');
  Object.assign(barWrap.style, {
    width: '200px', height: '2px',
    background: 'rgba(255,255,255,0.08)',
    marginTop: '40px', overflow: 'hidden',
    opacity: '0', transition: 'opacity 0.5s ease 0.7s',
  });
  const barFill = document.createElement('div');
  Object.assign(barFill.style, {
    height: '100%', width: '0%',
    background: 'linear-gradient(90deg,#2e9ef4,#6dc0fb)',
    transition: 'width 1.4s cubic-bezier(.4,0,.2,1) 0.8s',
    boxShadow: '0 0 10px #2e9ef4',
  });
  barWrap.appendChild(barFill);

  splash.appendChild(nameEl);
  splash.appendChild(roleEl);
  splash.appendChild(barWrap);
  document.body.appendChild(splash);

  // ── PARTICLE BURST CANVAS (on splash) ──
  const pc = document.createElement('canvas');
  Object.assign(pc.style, { position:'absolute', inset:'0', pointerEvents:'none' });
  splash.appendChild(pc);
  const pctx = pc.getContext('2d');

  function resizePC() { pc.width = window.innerWidth; pc.height = window.innerHeight; }
  resizePC();
  window.addEventListener('resize', resizePC);

  const cx = () => pc.width / 2;
  const cy = () => pc.height / 2;

  // Burst particles
  const particles = Array.from({length: 120}, () => ({
    angle: Math.random() * Math.PI * 2,
    speed: Math.random() * 5 + 1,
    radius: Math.random() * 2 + 0.5,
    dist: 0,
    maxDist: Math.random() * Math.min(pc.width, pc.height) * 0.55 + 80,
    hue: Math.random() > 0.5 ? '#2e9ef4' : '#6dc0fb',
    opacity: 1,
    trail: [],
  }));

  // Floating ambient dots
  const dots = Array.from({length: 60}, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    op: Math.random() * 0.4 + 0.1,
  }));

  let burst = false;
  let frame = 0;

  function drawParticles() {
    pctx.clearRect(0, 0, pc.width, pc.height);
    frame++;

    // Ambient floating dots
    dots.forEach(d => {
      pctx.beginPath();
      pctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      pctx.fillStyle = `rgba(46,158,244,${d.op})`;
      pctx.fill();
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0) d.x = pc.width;
      if (d.x > pc.width) d.x = 0;
      if (d.y < 0) d.y = pc.height;
      if (d.y > pc.height) d.y = 0;
    });

    // Ring pulse
    if (burst) {
      const progress = Math.min((frame - burstFrame) / 60, 1);
      const ringR = progress * Math.min(pc.width, pc.height) * 0.45;
      const ringOp = (1 - progress) * 0.5;
      pctx.beginPath();
      pctx.arc(cx(), cy(), ringR, 0, Math.PI * 2);
      pctx.strokeStyle = `rgba(46,158,244,${ringOp})`;
      pctx.lineWidth = 2;
      pctx.stroke();
    }

    // Burst particles
    if (burst) {
      particles.forEach(p => {
        p.dist += p.speed;
        const x = cx() + Math.cos(p.angle) * p.dist;
        const y = cy() + Math.sin(p.angle) * p.dist;
        p.opacity = Math.max(0, 1 - p.dist / p.maxDist);

        p.trail.push({x, y});
        if (p.trail.length > 6) p.trail.shift();

        // Draw trail
        for (let i = 1; i < p.trail.length; i++) {
          const t = p.trail[i];
          const tp = p.trail[i - 1];
          const trailOp = (i / p.trail.length) * p.opacity * 0.5;
          pctx.beginPath();
          pctx.moveTo(tp.x, tp.y);
          pctx.lineTo(t.x, t.y);
          pctx.strokeStyle = `rgba(46,158,244,${trailOp})`;
          pctx.lineWidth = p.radius;
          pctx.stroke();
        }

        pctx.beginPath();
        pctx.arc(x, y, p.radius, 0, Math.PI * 2);
        pctx.fillStyle = p.hue.replace(')', `,${p.opacity})`).replace('rgb', 'rgba').replace('#2e9ef4', `rgba(46,158,244,${p.opacity})`).replace('#6dc0fb', `rgba(109,192,251,${p.opacity})`);
        pctx.fill();
      });
    }

    requestAnimationFrame(drawParticles);
  }

  let burstFrame = 0;
  drawParticles();

  // Sequence
  setTimeout(() => {
    nameEl.style.opacity = '1';
    nameEl.style.transform = 'translateY(0)';
    roleEl.style.opacity = '1';
    roleEl.style.transform = 'translateY(0)';
    barWrap.style.opacity = '1';
  }, 100);

  setTimeout(() => {
    barFill.style.width = '100%';
  }, 200);

  setTimeout(() => {
    burst = true;
    burstFrame = frame;
  }, 600);

  // Dismiss splash
  setTimeout(() => {
    splash.style.opacity = '0';
    setTimeout(() => { splash.remove(); }, 900);
  }, 2600);

  // ── BACKGROUND PARTICLE CANVAS (main site) ──
  const canvas = document.getElementById('rain-canvas');
  const ctx = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const bgDots = Array.from({length: 60}, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 18 + 6,
    vx: (Math.random() - 0.5) * 0.5,
    vy: -(Math.random() * 0.6 + 0.2),
    op: Math.random() * 0.35 + 0.25,
    pulse: Math.random() * Math.PI * 2,
  }));

  // Connection lines between close dots
  function drawBg() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bgDots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      d.pulse += 0.018;
      // Wrap around
      if (d.y + d.r < 0) { d.y = canvas.height + d.r; d.x = Math.random() * canvas.width; }
      if (d.x < -d.r) d.x = canvas.width + d.r;
      if (d.x > canvas.width + d.r) d.x = -d.r;

      const op = d.op + Math.sin(d.pulse) * 0.08;

      // Outer glow
      const glow = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 2.2);
      glow.addColorStop(0, `rgba(46,158,244,${op * 0.3})`);
      glow.addColorStop(1, `rgba(46,158,244,0)`);
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Bubble body
      const grad = ctx.createRadialGradient(d.x - d.r * 0.3, d.y - d.r * 0.3, d.r * 0.1, d.x, d.y, d.r);
      grad.addColorStop(0, `rgba(180,225,255,${op * 0.5})`);
      grad.addColorStop(0.4, `rgba(46,158,244,${op * 0.15})`);
      grad.addColorStop(1, `rgba(46,158,244,${op * 0.05})`);
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Bubble rim
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(109,192,251,${op * 0.7})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Highlight glint
      ctx.beginPath();
      ctx.arc(d.x - d.r * 0.3, d.y - d.r * 0.3, d.r * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${op * 0.6})`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < bgDots.length; i++) {
      for (let j = i + 1; j < bgDots.length; j++) {
        const dx = bgDots[i].x - bgDots[j].x;
        const dy = bgDots[i].y - bgDots[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(bgDots[i].x, bgDots[i].y);
          ctx.lineTo(bgDots[j].x, bgDots[j].y);
          ctx.strokeStyle = `rgba(46,158,244,${(1 - dist/120) * 0.2})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawBg);
  }

  drawBg();
})();

function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Message Sent ✓';
  btn.style.background = '#2e7d5e';
  btn.style.color = '#fff';
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.style.background = '';
    btn.style.color = '';
    e.target.reset();
  }, 3000);
}

