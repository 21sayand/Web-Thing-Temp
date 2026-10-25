

document.addEventListener('DOMContentLoaded', () => {
  initEasterEggListeners();
  initLiquidCanvas();
  initBlurredPhone();
  initFavPlayerHover();
  initNoContactButton();

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

function initBlurredPhone() {
  const phoneElems = document.querySelectorAll('.blurred-phone');
  phoneElems.forEach(elem => {
    let timer = null;
    elem.addEventListener('mouseenter', () => {
      elem.classList.add('revealed');
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        elem.classList.remove('revealed');
      }, 10000); // exactly 10 seconds!
    });
  });
}

function initFavPlayerHover() {
  const trigger = document.getElementById('favPlayerTrigger');
  const overlay = document.getElementById('benStokesOverlay');
  const textElem = document.getElementById('benStokesText');
  if (!trigger || !overlay || !textElem) return;

  const smileys = ['😊', '😄', '😁', '😎', '🏏', '🔥', '👑', '🤩', '😇', '⚡'];
  let leaveTimer = null;

  trigger.addEventListener('mouseenter', () => {
    if (leaveTimer) clearTimeout(leaveTimer);
    const randomSmiley = smileys[Math.floor(Math.random() * smileys.length)];
    textElem.textContent = `${randomSmiley} benstokes`;
    overlay.classList.add('active');
  });

  trigger.addEventListener('mouseleave', () => {
    leaveTimer = setTimeout(() => {
      overlay.classList.remove('active');
    }, 1200);
  });

  overlay.addEventListener('mouseenter', () => {
    if (leaveTimer) clearTimeout(leaveTimer);
  });

  overlay.addEventListener('mouseleave', () => {
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', () => {
    overlay.classList.remove('active');
  });
}

function initNoContactButton() {
  const btn = document.getElementById('noContactBtn');
  const overlay = document.getElementById('noContactOverlay');
  if (!btn || !overlay) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    overlay.classList.add('active');
  });

  overlay.addEventListener('click', () => {
    overlay.classList.remove('active');
  });
}

function initEasterEggListeners() {

  const targetCode = ['z', 'e', 'n'];
  let currentKeyIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const key = e.key.toLowerCase();
    if (key === targetCode[currentKeyIndex]) {
      currentKeyIndex++;
      if (currentKeyIndex === targetCode.length) {
        triggerZenMode();
        currentKeyIndex = 0;
      }
    } else {
      currentKeyIndex = (key === targetCode[0]) ? 1 : 0;
    }
  });

  const cgpaBadge = document.getElementById('cgpaPillBadge');
  let cgpaClicks = 0;
  if (cgpaBadge) {
    cgpaBadge.addEventListener('click', () => {
      cgpaClicks++;
      if (cgpaClicks >= 3) {
        openHostelNoteModal();
        cgpaClicks = 0;
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeHostelNoteModal();
      const stokesOverlay = document.getElementById('benStokesOverlay');
      if (stokesOverlay) stokesOverlay.classList.remove('active');
      const noContactOverlay = document.getElementById('noContactOverlay');
      if (noContactOverlay) noContactOverlay.classList.remove('active');
    }
  });
}

function triggerZenMode() {
  const canvas = document.getElementById('zenCanvasOverlay');
  if (!canvas) return;
  canvas.classList.add('active');
  playSoftChime(432, 1.2);
  showToast("🍃 Twilight Zen Mode activated!");

  const ctx = canvas.getContext('2d');
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  class Leaf {
    constructor() {
      this.x = Math.random() * w;
      this.y = -20;
      this.size = Math.random() * 8 + 5;
      this.speed = Math.random() * 1.5 + 0.8;
      this.sway = Math.random() * 2 - 1;
      this.angle = Math.random() * Math.PI * 2;
    }
    update() {
      this.y += this.speed;
      this.x += Math.sin(this.y * 0.02) * this.sway;
      this.angle += 0.02;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.75)';
      ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let leaves = Array.from({ length: 45 }, () => new Leaf());
  let duration = 0;

  function renderZen() {
    ctx.clearRect(0, 0, w, h);
    leaves.forEach(leaf => {
      leaf.update();
      leaf.draw();
    });
    duration++;
    if (duration < 320) {
      requestAnimationFrame(renderZen);
    } else {
      canvas.classList.remove('active');
    }
  }
  renderZen();
}

function openHostelNoteModal() {
  const modal = document.getElementById('hostelNoteModal');
  if (modal) {
    modal.classList.add('open');
    playSoftChime(440, 0.3);
  }
}

function closeHostelNoteModal() {
  const modal = document.getElementById('hostelNoteModal');
  if (modal) modal.classList.remove('open');
}

function playSoftChime(freq = 432, duration = 0.5) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function copyToClipboard(text, msg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast(msg)).catch(() => fallbackCopy(text, msg));
  } else {
    fallbackCopy(text, msg);
  }
}

function fallbackCopy(text, msg) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast(msg);
}

function showToast(message) {
  const toast = document.getElementById('toastBanner');
  const toastMsg = document.getElementById('toastBannerMsg');
  if (toast && toastMsg) {
    toastMsg.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  }
}

function initLiquidCanvas() {
  const canvas = document.getElementById('liquidCanvas');
  if (!canvas || canvas.dataset.mainLiquidInit) return;
  canvas.dataset.mainLiquidInit = 'true';
  const ctx = canvas.getContext('2d');

  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  class GentleBlob {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.r = Math.random() * 200 + 160;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw() {
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.055)');
      grad.addColorStop(0.5, 'rgba(59, 130, 246, 0.025)');
      grad.addColorStop(1, 'rgba(9, 13, 22, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const blobs = Array.from({ length: 5 }, () => new GentleBlob());

  function loop() {
    ctx.clearRect(0, 0, w, h);
    blobs.forEach(b => {
      b.update();
      b.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();
}
