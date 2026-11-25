/* ---------- footer: fixed reveal + sweet slicing game ---------- */
function footerSetup() {
  const fw = $("#fwrap"), sp = $("#footer"), slash = $("#slash"), canvas = $("#game");
  const game = sweetGame(canvas);
  let seen = false;
  new IntersectionObserver((e) => {
    const on = e[0].isIntersecting;
    fw.classList.toggle("on", on); game.active(on);
    if (on && e[0].intersectionRatio > 0.3 && !seen && !RM) { seen = true; slash.classList.add("go"); }
  }, { threshold: [0, 0.3] }).observe(sp);
  const fz = $("#freeze");
  fz.addEventListener("click", () => {
    const on = !fz.classList.contains("on");
    fz.classList.toggle("on", on); fz.setAttribute("aria-pressed", on); fz.textContent = on ? "Frozen" : "Freeze";
    on ? lock("freeze") : unlock("freeze");
    document.body.style.touchAction = on ? "none" : "";
    canvas.style.touchAction = on ? "none" : "pan-y";
  });
}

function sweetGame(c) {
  const g = c.getContext("2d");
  let W = 0, H = 0, dpr = 1, on = false, raf = null, frame = 0;
  const S = { fruits: [], halves: [], parts: [], waves: [], blade: [], score: 0, bombs: 0, shake: 0, boom: 0 };
  const KINDS = [
    { k: "straw", r: 4.2, juice: "#e0414f", w: 3 },
    { k: "cherry", r: 4, juice: "#b3121f", w: 3 },
    { k: "cupcake", r: 4.6, juice: "#f6b5b0", w: 3 },
    { k: "macaron", r: 4, juice: "#f4a3af", w: 2 },
    { k: "donut", r: 4.4, juice: "#e7a46f", w: 2 },
    { k: "bomb", r: 3.8, juice: "#3d2018", w: 1.2 },
  ];
  const totalW = KINDS.reduce((a, b) => a + b.w, 0);
  const pick = () => { let r = Math.random() * totalW; for (const k of KINDS) { if ((r -= k.w) <= 0) return k; } return KINDS[0]; };

  /* sprite painters, unit radius 100 on a 240 canvas */
  const P = {
    straw(x) {
      x.fillStyle = "#e0414f"; x.beginPath(); x.moveTo(120, 205); x.bezierCurveTo(40, 160, 20, 70, 70, 52); x.bezierCurveTo(95, 42, 110, 50, 120, 60); x.bezierCurveTo(130, 50, 145, 42, 170, 52); x.bezierCurveTo(220, 70, 200, 160, 120, 205); x.fill();
      x.fillStyle = "rgba(255,255,255,.25)"; x.beginPath(); x.ellipse(85, 95, 14, 28, -0.4, 0, 7); x.fill();
      x.fillStyle = "#f7d36b"; for (let i = 0; i < 22; i++) { const a = i * 2.4, rr = 18 + (i * 37) % 60; x.beginPath(); x.ellipse(120 + Math.cos(a) * rr, 115 + Math.sin(a) * rr * 0.9, 3, 5, a, 0, 7); x.fill(); }
      x.fillStyle = "#5e8f3a"; for (let i = 0; i < 5; i++) { x.save(); x.translate(120, 55); x.rotate(-1.2 + i * 0.6); x.beginPath(); x.ellipse(0, -22, 10, 26, 0, 0, 7); x.fill(); x.restore(); }
    },
    cherry(x) {
      x.strokeStyle = "#5f6b25"; x.lineWidth = 7; x.lineCap = "round"; x.beginPath(); x.moveTo(80, 150); x.quadraticCurveTo(100, 70, 140, 30); x.moveTo(160, 160); x.quadraticCurveTo(160, 80, 140, 30); x.stroke();
      x.fillStyle = "#5e8f3a"; x.beginPath(); x.ellipse(165, 40, 32, 14, -0.4, 0, 7); x.fill();
      for (const [cx, cy] of [[78, 168], [162, 176]]) { x.fillStyle = "#b3121f"; x.beginPath(); x.arc(cx, cy, 46, 0, 7); x.fill(); x.fillStyle = "rgba(255,255,255,.35)"; x.beginPath(); x.ellipse(cx - 16, cy - 16, 10, 16, -0.6, 0, 7); x.fill(); }
    },
    cupcake(x) {
      x.fillStyle = "#f6b5b0"; x.beginPath(); x.moveTo(50, 130); x.lineTo(190, 130); x.lineTo(170, 215); x.lineTo(70, 215); x.closePath(); x.fill();
      x.strokeStyle = "#e88e88"; x.lineWidth = 5; for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(64 + i * 22, 132); x.lineTo(76 + i * 18, 213); x.stroke(); }
      x.fillStyle = "#fff6f1"; [[120, 120, 78, 30], [120, 92, 60, 26], [120, 66, 38, 22]].forEach(([cx, cy, rx, ry]) => { x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, 7); x.fill(); });
      x.fillStyle = "#b3121f"; x.beginPath(); x.arc(120, 38, 16, 0, 7); x.fill();
      ["#f2b134", "#5bb5d6", "#8fd07a", "#e94f6b"].forEach((col, i) => { x.fillStyle = col; x.fillRect(70 + i * 30, 100 + (i % 2) * 16, 12, 4); });
    },
    macaron(x) {
      x.fillStyle = "#f4a3af"; x.beginPath(); x.ellipse(120, 92, 92, 44, 0, 0, 7); x.fill(); x.beginPath(); x.ellipse(120, 150, 92, 44, 0, 0, 7); x.fill();
      x.fillStyle = "#fff6f1"; x.fillRect(32, 112, 176, 18);
      x.fillStyle = "rgba(255,255,255,.3)"; x.beginPath(); x.ellipse(92, 76, 30, 10, -0.1, 0, 7); x.fill();
    },
    donut(x) {
      x.fillStyle = "#d49158"; x.beginPath(); x.arc(120, 120, 98, 0, 7); x.arc(120, 120, 34, 0, 7, true); x.fill("evenodd");
      x.fillStyle = "#f19aa8"; x.beginPath(); for (let i = 0; i <= 24; i++) { const a = (i / 24) * 6.283, r = 82 + (i % 2 ? 8 : -4); x.lineTo(120 + Math.cos(a) * r, 120 + Math.sin(a) * r); } x.arc(120, 120, 40, 0, 7, true); x.fill("evenodd");
      ["#f2b134", "#5bb5d6", "#ffffff", "#8fd07a"].forEach((col, j) => { x.fillStyle = col; for (let i = 0; i < 5; i++) { const a = i * 1.26 + j * 0.3, r = 58 + (i % 2) * 14; x.save(); x.translate(120 + Math.cos(a) * r, 120 + Math.sin(a) * r); x.rotate(a * 2); x.fillRect(-7, -2.5, 14, 5); x.restore(); } });
    },
    bomb(x) {
      x.fillStyle = "#2a1510"; x.beginPath(); x.arc(118, 132, 84, 0, 7); x.fill();
      x.fillStyle = "rgba(255,255,255,.18)"; x.beginPath(); x.ellipse(86, 100, 20, 30, -0.6, 0, 7); x.fill();
      x.fillStyle = "#5b3a2e"; x.fillRect(132, 36, 32, 22);
      x.strokeStyle = "#c9a25e"; x.lineWidth = 6; x.beginPath(); x.moveTo(150, 38); x.quadraticCurveTo(168, 12, 194, 22); x.stroke();
      x.fillStyle = "#ffcc4d"; x.beginPath(); x.arc(196, 20, 12, 0, 7); x.fill();
    },
  };
  const sprites = {};
  for (const k of KINDS) { const cv = document.createElement("canvas"); cv.width = cv.height = 240; P[k.k](cv.getContext("2d")); sprites[k.k] = cv; }

  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = c.clientWidth; H = c.clientHeight;
    c.width = W * dpr; c.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size(); new ResizeObserver(size).observe(c);

  const report = () => {
    $("#scoreN").textContent = S.score;
    $$("#bombs i").forEach((d, i) => d.classList.toggle("hit", i < S.bombs));
  };
  function spawn() {
    const n = Math.random() < 0.4 ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const k = pick(), r = ((innerWidth < 768 ? 3.8 : 1) * k.r * innerWidth) / 100 / 2.2;
      S.fruits.push({ ...k, r, x: W * (0.15 + 0.7 * Math.random()), y: H + r, vx: W * 0.004 * (Math.random() - 0.5), vy: -(H * 0.018 + H * 0.008 * Math.random()), rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.12 });
    }
  }
  function slice(f, ang) {
    if (f.k === "bomb") {
      S.bombs++; S.shake = 18; S.boom = 40;
      S.waves.push({ x: f.x, y: f.y, r: 10, a: 1 });
      if (S.bombs >= 3) { S.bombs = 0; S.score = 0; }
    } else {
      S.score++;
      for (const s of [-1, 1]) S.halves.push({ ...f, side: s, ang, vx: f.vx + Math.cos(ang + Math.PI / 2) * 3 * s, vy: f.vy - 2, life: 1 });
      for (let i = 0; i < 14; i++) { const a = Math.random() * 6.28, v = 2 + Math.random() * 5; S.parts.push({ x: f.x, y: f.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 2 + Math.random() * 4, c: f.juice, life: 1 }); }
      S.waves.push({ x: f.x, y: f.y, r: 6, a: 0.6, c: f.juice });
    }
    report();
  }
  function hitTest(a, b) {
    for (const f of S.fruits) {
      if (f.cut) continue;
      const dx = b.x - a.x, dy = b.y - a.y, L = dx * dx + dy * dy || 1;
      const t = Math.max(0, Math.min(1, ((f.x - a.x) * dx + (f.y - a.y) * dy) / L));
      const px = a.x + t * dx - f.x, py = a.y + t * dy - f.y;
      if (px * px + py * py < f.r * f.r) { f.cut = true; slice(f, Math.atan2(dy, dx)); }
    }
  }
  let last = null, touching = false;
  const pt = (e) => { const r = c.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() }; };
  c.addEventListener("pointerdown", (e) => { touching = true; last = pt(e); });
  c.addEventListener("pointerup", () => { touching = false; last = null; });
  c.addEventListener("pointerleave", () => { last = null; });
  c.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" && !touching) return;
    const p = pt(e);
    if (last && Math.hypot(p.x - last.x, p.y - last.y) > 3) hitTest(last, p);
    S.blade.push(p); last = p;
  });

  function draw() {
    raf = null; if (!on) return;
    frame++;
    const gr = H * 0.00042;
    g.save();
    if (S.shake > 0.5) { g.translate((Math.random() - 0.5) * S.shake, (Math.random() - 0.5) * S.shake); S.shake *= 0.86; }
    g.clearRect(-30, -30, W + 60, H + 60);
    if (frame % 50 === 0) spawn();
    S.fruits = S.fruits.filter((f) => !f.cut && f.y < H + f.r * 2 + 10);
    for (const f of S.fruits) {
      f.vy += gr * 60 * 0.6; f.x += f.vx; f.y += f.vy; f.rot += f.vr;
      g.save(); g.translate(f.x, f.y); g.rotate(f.rot); g.drawImage(sprites[f.k], -f.r * 1.2, -f.r * 1.2, f.r * 2.4, f.r * 2.4); g.restore();
    }
    S.halves = S.halves.filter((h) => h.y < H + h.r * 3 && h.life > 0);
    for (const h of S.halves) {
      h.vy += gr * 60 * 0.6; h.x += h.vx; h.y += h.vy; h.rot += h.vr * 1.5; h.life -= 0.006;
      g.save(); g.translate(h.x, h.y); g.rotate(h.ang); g.beginPath(); g.rect(-h.r * 1.3, h.side < 0 ? -h.r * 1.3 : 0, h.r * 2.6, h.r * 1.3); g.clip(); g.rotate(h.rot - h.ang);
      g.drawImage(sprites[h.k], -h.r * 1.2, -h.r * 1.2, h.r * 2.4, h.r * 2.4); g.restore();
    }
    S.parts = S.parts.filter((p) => p.life > 0);
    for (const p of S.parts) { p.vy += 0.25; p.x += p.vx; p.y += p.vy; p.life -= 0.03; g.globalAlpha = Math.max(0, p.life); g.fillStyle = p.c; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill(); }
    g.globalAlpha = 1;
    S.waves = S.waves.filter((w) => w.a > 0.02);
    for (const w of S.waves) { w.r += 6; w.a *= 0.9; g.strokeStyle = w.c || "#F6B5B0"; g.globalAlpha = w.a; g.lineWidth = 3; g.beginPath(); g.arc(w.x, w.y, w.r, 0, 7); g.stroke(); }
    g.globalAlpha = 1;
    if (S.boom > 0) { S.boom--; g.fillStyle = "#F6B5B0"; g.font = `600 ${Math.round(W * 0.08)}px Khand, sans-serif`; g.textAlign = "center"; g.globalAlpha = Math.min(1, S.boom / 20); g.fillText(S.bombs === 0 ? "OOPS! START AGAIN" : "OOPS!", W / 2, H * 0.45); g.globalAlpha = 1; }
    const now = performance.now();
    S.blade = S.blade.filter((p) => now - p.t < 200);
    if (S.blade.length > 2) {
      g.strokeStyle = "#F6B5B0"; g.lineCap = "round";
      for (let i = 1; i < S.blade.length; i++) { const a = S.blade[i - 1], b = S.blade[i]; g.globalAlpha = i / S.blade.length; g.lineWidth = 2 + (i / S.blade.length) * 6; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
      g.globalAlpha = 1;
    }
    g.restore();
    if (!document.hidden) raf = requestAnimationFrame(draw);
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden && on && !raf) raf = requestAnimationFrame(draw); });
  return { active(v) { on = v && !RM; if (on && !raf) { size(); raf = requestAnimationFrame(draw); } } };
}

boot();
