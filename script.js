(() => {
  // DOM
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const noHint = document.getElementById('noHint');

  const home = document.getElementById('home');
  const celebration = document.getElementById('celebration');
  const overlay = document.getElementById('overlay');

  const messageText = document.getElementById('messageText');
  const nextMsgBtn = document.getElementById('nextMsgBtn');
  const replayFxBtn = document.getElementById('replayFxBtn');
  const backHomeBtn = document.getElementById('backHomeBtn');

  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbClose = document.getElementById('lbClose');

  const musicBtn = document.getElementById('musicBtn');
  const flowerRow = document.getElementById('flowerRow');

  // cute messages (personalized)
  const messages = [
    "Christina, if love had a name, it would sound like yours. 💗",
    "You’re my favorite thought — every single day. ✨",
    "I don’t need a perfect day… I just need you in it. 🌹",
    "Every time I see you, my heart goes: ‘that one.’ 💘",
    "You make ordinary moments feel like magic. 🪄",
    "I’m proud of you… and I’m crazy about you. 🫶",
    "You + Me = my favorite story. 📖💞",
    "I’ll always choose you, Christina Siala. 💐"
  ];
  let msgIndex = 0;

  // NO button dodge
  let noMoves = 0;
  function moveNoButton() {
    noMoves++;

    const pad = 24;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const rect = noBtn.getBoundingClientRect();
    const maxX = Math.max(40, vw - rect.width - pad);
    const maxY = Math.max(40, vh - rect.height - pad);

    const x = Math.floor(Math.random() * maxX);
    const y = Math.floor(Math.random() * maxY);

    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
    noBtn.style.zIndex = 999;

    if (noMoves === 2) noHint.textContent = "hehe 😅 but are you sure? 💞";
    if (noMoves >= 4) noHint.textContent = "the universe votes YES 💘";
  }
  noBtn.addEventListener('mouseenter', moveNoButton);
  noBtn.addEventListener('click', moveNoButton);

  // YES flow
  yesBtn.addEventListener('click', () => {
    overlay.hidden = false;
    burstFX(80);

    home.hidden = true;
    celebration.hidden = false;

    msgIndex = 0;
    messageText.textContent = messages[msgIndex];

    setTimeout(() => {
      overlay.hidden = true;
      setFXMode('romantic');
      replayFlowers();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 5000);
  });

  backHomeBtn.addEventListener('click', () => {
    celebration.hidden = true;
    home.hidden = false;

    noBtn.style.position = '';
    noBtn.style.left = '';
    noBtn.style.top = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  nextMsgBtn.addEventListener('click', () => {
    msgIndex = (msgIndex + 1) % messages.length;
    messageText.textContent = messages[msgIndex];
    burstFX(22);
  });

  replayFxBtn.addEventListener('click', () => {
    overlay.hidden = false;
    burstFX(65);
    replayFlowers();
    setTimeout(() => (overlay.hidden = true), 5000);
  });

  function replayFlowers() {
    if (!flowerRow) return;
    flowerRow.style.display = 'none';
    flowerRow.offsetHeight; // reflow
    flowerRow.style.display = 'flex';
  }

  // Lightbox gallery
  document.querySelectorAll('.tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const img = tile.querySelector('img');
      const cap = tile.querySelector('figcaption');
      if (img) lbImg.src = img.src;
      lbCap.textContent = cap ? cap.textContent : '';
      lightbox.hidden = false;
    });
  });

  lbClose.addEventListener('click', () => (lightbox.hidden = true));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.hidden = true;
  });

  musicBtn.addEventListener('click', () => burstFX(32));

  // Canvas hearts & petals
  const canvas = document.getElementById('fxCanvas');
  const ctx = canvas.getContext('2d');

  let w, h, dpr;
  let particles = [];
  let mode = 'idle';

  function resizeCanvas() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = canvas.width = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function setFXMode(m) { mode = m; }
  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle(type, x, y, boost = false) {
    const size = rand(8, 22) * dpr;
    return {
      type,
      x: x ?? rand(0, w),
      y: y ?? rand(-h * 0.1, 0),
      vx: rand(-0.35, 0.35) * dpr * (boost ? 1.7 : 1),
      vy: rand(0.65, 1.55) * dpr * (boost ? 1.3 : 1),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.02, 0.02),
      size,
      life: rand(200, 420),
      t: 0,
    };
  }

  function burstFX(count = 50) {
    const cx = w * 0.5;
    const cy = h * 0.36;

    for (let i = 0; i < count; i++) {
      const type = Math.random() < 0.52 ? 'heart' : 'petal';
      const p = createParticle(type, cx + rand(-150, 150) * dpr, cy + rand(-70, 70) * dpr, true);
      p.vx += rand(-1.7, 1.7) * dpr;
      p.vy += rand(-1.4, 0.9) * dpr;
      particles.push(p);
    }
  }

  function drawHeart(x, y, s, rot, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(s / 20, s / 20);
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.bezierCurveTo(0, -2, -12, -2, -12, 6);
    ctx.bezierCurveTo(-12, 14, -2, 18, 0, 22);
    ctx.bezierCurveTo(2, 18, 12, 14, 12, 6);
    ctx.bezierCurveTo(12, -2, 0, -2, 0, 8);
    ctx.closePath();
    ctx.fillStyle = `rgba(255, 77, 109, ${alpha})`;
    ctx.fill();
    ctx.restore();
  }

  function drawPetal(x, y, s, rot, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 0.30, s * 0.85, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 182, 193, ${alpha})`;
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    if (mode === 'romantic' && particles.length < 260) {
      if (Math.random() < 0.60) particles.push(createParticle('petal'));
      if (Math.random() < 0.26) particles.push(createParticle('heart'));
    }

    particles.forEach(p => {
      p.t++;
      p.x += p.vx + Math.sin(p.t * 0.08) * 0.35 * dpr;
      p.y += p.vy;
      p.rot += p.vr;
      p.life--;

      const alpha = Math.min(1, Math.max(0, p.life / 200));
      if (p.type === 'heart') drawHeart(p.x, p.y, p.size, p.rot, alpha);
      else drawPetal(p.x, p.y, p.size, p.rot, alpha);
    });

    particles = particles.filter(p => p.life > 0 && p.y < h + 120 && p.x > -120 && p.x < w + 120);
    requestAnimationFrame(animate);
  }

  setFXMode('idle');
  animate();
})();
