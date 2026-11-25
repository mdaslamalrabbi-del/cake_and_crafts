/* ---------- 3D cake kit (three.js r128) ---------- */
const Kit = (() => {
  if (!window.THREE) return null;
  const T = THREE;
  const TAU = Math.PI * 2;
  const lin = (h) => new T.Color(h).convertSRGBToLinear();
  const mat = (h, r = 0.62, o = {}) => new T.MeshStandardMaterial(Object.assign({ color: lin(h), roughness: r, metalness: 0 }, o));
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const inRange = (a, s, l) => (((a - s) % TAU) + TAU) % TAU < l;

  const V = {
    choc: { frost: "#a86e55", sponge: "#4e2a1c", cream: "#e9cbb7", ganache: "#2f160e", ros: ["#5a2f20", "#c89279", "#7d4632", "#e8c2ad"], drip: true, rosette: true },
    straw: { frost: "#fff6f1", sponge: "#f19aa8", cream: "#fffaf6", ros: ["#fffaf7"], kiss: true, sprinkles: true, beads: "#f4a3af" },
    cherry: { frost: "#fbf1e1", sponge: "#efc977", cream: "#fff7ec", jam: "#a81b2a", ros: ["#fff8ee"], kiss: true, cherries: true },
    gold: { frost: "#f7efe6", sponge: "#efc977", cream: "#fff7ec", ganache: "#c9a25e", ros: ["#fff8ee"], kiss: true, rect: true, drip: true, plaque: true },
  };

  /* cut face texture: u = centre to outer edge, v = bottom to top */
  const texCache = {};
  function cutTex(key) {
    if (texCache[key]) return texCache[key];
    const v = V[key];
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d");
    const band = (a, b, col) => { g.fillStyle = col; g.fillRect(0, (1 - b) * 512, 512, (b - a) * 512); };
    const crumbs = (a, b, col) => {
      for (let i = 0; i < 520; i++) {
        const y = (1 - (a + rnd() * (b - a))) * 512, x = rnd() * 512;
        g.fillStyle = col; g.globalAlpha = 0.05 + rnd() * 0.12;
        g.beginPath(); g.arc(x, y, 0.8 + rnd() * 2.4, 0, TAU); g.fill();
      }
      g.globalAlpha = 1;
    };
    const L = [[0, 0.29, "s"], [0.29, 0.36, "c"], [0.36, 0.62, "s"], [0.62, 0.69, "c"], [0.69, 0.93, "s"]];
    for (const [a, b, t] of L) {
      if (t === "s") { band(a, b, v.sponge); crumbs(a, b, "#000"); crumbs(a, b, "#fff"); }
      else {
        band(a, b, v.cream);
        if (v.jam) { g.fillStyle = v.jam; g.fillRect(0, (1 - (a + b) / 2) * 512 - 4, 470, 8); for (let i = 0; i < 16; i++) { g.beginPath(); g.arc(rnd() * 470, (1 - (a + b) / 2) * 512 + (rnd() - 0.5) * 10, 3 + rnd() * 5, 0, TAU); g.fill(); } }
      }
    }
    band(0.93, 1, v.frost);
    g.fillStyle = v.frost; g.fillRect(478, 0, 34, 512);
    if (v.ganache) { g.fillStyle = v.ganache; g.fillRect(0, 0, 512, 10); g.fillRect(500, 0, 12, 60); }
    const t = new T.CanvasTexture(c);
    t.encoding = T.sRGBEncoding;
    t.anisotropy = 4;
    return (texCache[key] = t);
  }

  /* custom surface: piped star "kiss" with flutes and a twist */
  function kissGeo(s) {
    const nu = 40, nv = 16, pos = [], idx = [];
    for (let j = 0; j <= nv; j++) {
      const v = j / nv;
      for (let i = 0; i <= nu; i++) {
        const u = (i / nu) * TAU;
        const r = s * Math.pow(1 - v, 0.8) * (1 + 0.14 * Math.cos(8 * u + 5 * v)) + 0.0001;
        pos.push(r * Math.cos(u), s * 1.45 * v, r * Math.sin(u));
      }
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const a = j * (nu + 1) + i, b = a + nu + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  /* rosette: a tube along a rising spiral */
  function roseGeo(s) {
    const pts = [];
    for (let i = 0; i <= 48; i++) {
      const t = i / 48, a = t * Math.PI * 4.6, r = s * (1 - 0.82 * t);
      pts.push(new T.Vector3(r * Math.cos(a), s * (0.16 + 0.32 * t), r * Math.sin(a)));
    }
    return new T.TubeGeometry(new T.CatmullRomCurve3(pts), 90, s * 0.3, 8, false);
  }
  const kissCache = {}, roseCache = {};
  const kiss = (s) => kissCache[s] || (kissCache[s] = kissGeo(s));
  const rose = (s) => roseCache[s] || (roseCache[s] = roseGeo(s));

  function cherry(group, x, y, z, k = 1) {
    const m = new T.Mesh(new T.SphereGeometry(0.12 * k, 24, 18), mat("#b3121f", 0.18));
    m.scale.y = 0.92; m.position.set(x, y + 0.1 * k, z); group.add(m);
    const curve = new T.QuadraticBezierCurve3(new T.Vector3(0, 0.1 * k, 0), new T.Vector3(0.02 * k, 0.26 * k, 0), new T.Vector3(0.09 * k, 0.34 * k, 0.04 * k));
    const st = new T.Mesh(new T.TubeGeometry(curve, 12, 0.012 * k, 6, false), mat("#5f6b25", 0.6));
    st.position.set(x, y + 0.08 * k, z); group.add(st);
  }

  /* perimeter points for decorations */
  function ring(R, n, off = 0) {
    const out = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * TAU + off; out.push({ x: R * Math.sin(a), z: R * Math.cos(a), nx: Math.sin(a), nz: Math.cos(a), a }); }
    return out;
  }
  function rectRing(w, d, n) {
    const per = 2 * (w + d), out = [];
    for (let i = 0; i < n; i++) {
      let t = (i / n) * per, x, z, nx = 0, nz = 0;
      if (t < w) { x = -w / 2 + t; z = d / 2; nz = 1; }
      else if ((t -= w) < d) { x = w / 2; z = d / 2 - t; nx = 1; }
      else if ((t -= d) < w) { x = w / 2 - t; z = -d / 2; nz = -1; }
      else { t -= w; x = -w / 2; z = -d / 2 + t; nx = -1; }
      out.push({ x, z, nx, nz, a: Math.atan2(x, z) });
    }
    return out;
  }

  function drips(group, pts, H, colHex, filter) {
    const m = mat(colHex, 0.34, { metalness: colHex === "#c9a25e" ? 0.55 : 0 });
    for (const p of pts) {
      if (filter && !filter(p.a)) continue;
      const L = 0.1 + rnd() * 0.32;
      const c = new T.Mesh(new T.CylinderGeometry(0.036, 0.034, L, 10), m);
      c.position.set(p.x + p.nx * 0.012, H / 2 - L / 2 + 0.02, p.z + p.nz * 0.012);
      const b = new T.Mesh(new T.SphereGeometry(0.042, 12, 10), m);
      b.position.set(c.position.x, H / 2 - L + 0.02, c.position.z);
      group.add(c, b);
    }
  }

  function decorate(group, v, H, R, filter, tier = 1) {
    const ok = (a) => !filter || filter(a);
    if (v.rosette) {
      for (const p of ring(R * 0.72, 11, 0.12)) {
        if (!ok(p.a)) continue;
        const big = rnd() > 0.38, s = (big ? 0.2 : 0.12) * tier;
        const m = new T.Mesh(big ? rose(s) : kiss(s), mat(v.ros[Math.floor(rnd() * v.ros.length)], 0.7));
        m.position.set(p.x, H / 2 + 0.03, p.z); m.rotation.y = rnd() * TAU; group.add(m);
      }
      for (const p of ring(R * 0.4, 5, 0.5)) {
        if (!ok(p.a)) continue;
        const m = new T.Mesh(kiss(0.09 * tier), mat(v.ros[Math.floor(rnd() * v.ros.length)], 0.7));
        m.position.set(p.x, H / 2 + 0.03, p.z); group.add(m);
      }
    }
    if (v.kiss) {
      for (const p of ring(R * 0.82, 14, 0.2)) {
        if (!ok(p.a)) continue;
        const m = new T.Mesh(kiss(0.13 * tier), mat(v.ros[0], 0.72));
        m.position.set(p.x, H / 2, p.z); m.rotation.y = rnd() * TAU; group.add(m);
      }
    }
    if (v.cherries) {
      for (const p of ring(R * 0.3, 3, 0.4)) if (ok(p.a)) cherry(group, p.x, H / 2, p.z, tier);
      for (const p of ring(R * 0.82, 7, 0.42)) if (ok(p.a)) cherry(group, p.x, H / 2 + 0.17 * tier, p.z, 0.7 * tier);
    }
    if (v.sprinkles) {
      const cols = ["#f2b134", "#e94f6b", "#5bb5d6", "#8fd07a", "#ffffff", "#c77dd8"].map((h) => mat(h, 0.5));
      const g = new T.CylinderGeometry(0.014, 0.014, 0.07, 6);
      for (let i = 0; i < 80; i++) {
        const a = rnd() * TAU, r = Math.sqrt(rnd()) * R * 0.66;
        if (!ok(a)) continue;
        const m = new T.Mesh(g, cols[i % cols.length]);
        m.position.set(r * Math.sin(a), H / 2 + 0.012, r * Math.cos(a));
        m.rotation.set(Math.PI / 2, 0, rnd() * TAU); group.add(m);
      }
    }
    if (v.beads) {
      const m = mat(v.beads, 0.6), g = new T.SphereGeometry(0.055, 12, 10);
      for (const p of ring(R + 0.01, 40)) { if (!ok(p.a)) continue; const b = new T.Mesh(g, m); b.position.set(p.x, -H / 2 + 0.05, p.z); group.add(b); }
    }
  }

  function faceGeo(th, R, H) {
    const s = Math.sin(th) * R, c = Math.cos(th) * R, g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute([0, -H / 2, 0, s, -H / 2, c, s, H / 2, c, 0, H / 2, 0], 3));
    g.setAttribute("uv", new T.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
    g.setIndex([0, 1, 2, 0, 2, 3]);
    g.computeVertexNormals();
    return g;
  }

  function piece(key, R, H, ts, tl, cut, tier = 1) {
    const v = V[key], grp = new T.Group();
    const segs = Math.max(8, Math.round(96 * (tl / TAU)));
    const fm = mat(v.frost, 0.58), base = mat(v.sponge, 0.9);
    grp.add(new T.Mesh(new T.CylinderGeometry(R, R, H, segs, 1, false, ts, tl), [fm, fm, base]));
    if (cut) {
      const fmat = new T.MeshStandardMaterial({ map: cutTex(key), roughness: 0.92, side: T.DoubleSide });
      grp.add(new T.Mesh(faceGeo(ts, R, H), fmat), new T.Mesh(faceGeo(ts + tl, R, H), fmat));
    }
    const filter = cut ? (a) => inRange(a, ts, tl) : null;
    if (v.ganache) {
      const cap = new T.Mesh(new T.CylinderGeometry(R * 1.012, R * 1.012, 0.06, segs, 1, false, ts, tl), mat(v.ganache, 0.52, { metalness: key === "gold" ? 0.55 : 0 }));
      cap.position.y = H / 2 + 0.005; grp.add(cap);
    }
    if (v.drip) drips(grp, ring(R, 30, 0.05), H, v.ganache, filter);
    decorate(grp, v, H + (v.ganache ? 0.06 : 0), R, filter, tier);
    return grp;
  }

  function rectCake(key) {
    const v = V[key], grp = new T.Group(), w = 2.3, d = 1.55, H = 0.78;
    const fm = mat(v.frost, 0.58);
    grp.add(new T.Mesh(new T.BoxGeometry(w, H, d), fm));
    const cap = new T.Mesh(new T.BoxGeometry(w + 0.02, 0.05, d + 0.02), mat(v.ganache, 0.3, { metalness: 0.55 }));
    cap.position.y = H / 2 + 0.01; grp.add(cap);
    drips(grp, rectRing(w + 0.01, d + 0.01, 34), H, v.ganache);
    for (const p of rectRing(w - 0.22, d - 0.22, 20)) { const m = new T.Mesh(kiss(0.11), mat(v.ros[0], 0.72)); m.position.set(p.x, H / 2 + 0.03, p.z); grp.add(m); }
    const pl = new T.Mesh(new T.BoxGeometry(1.1, 0.035, 0.55), mat("#c9a25e", 0.3, { metalness: 0.7 }));
    pl.position.y = H / 2 + 0.06; grp.add(pl);
    const pl2 = new T.Mesh(new T.BoxGeometry(0.95, 0.04, 0.42), mat("#fbf2ec", 0.5));
    pl2.position.y = H / 2 + 0.07; grp.add(pl2);
    for (const p of rectRing(w + 0.02, d + 0.02, 52)) { const b = new T.Mesh(new T.SphereGeometry(0.05, 10, 8), fm); b.position.set(p.x, -H / 2 + 0.05, p.z); grp.add(b); }
    return grp;
  }

  function stand(scale = 1) {
    const g = new T.Group(), m = mat("#fbf6f0", 0.32);
    const top = new T.Mesh(new T.CylinderGeometry(0.86, 0.8, 0.06, 64), m); top.position.y = -0.03;
    const rim = new T.Mesh(new T.TorusGeometry(0.84, 0.025, 10, 64), m); rim.rotation.x = Math.PI / 2; rim.position.y = 0.0;
    const stem = new T.Mesh(new T.CylinderGeometry(0.11, 0.2, 0.4, 32), m); stem.position.y = -0.26;
    const foot = new T.Mesh(new T.CylinderGeometry(0.36, 0.42, 0.06, 48), m); foot.position.y = -0.48;
    g.add(top, rim, stem, foot);
    g.scale.setScalar(scale);
    return g;
  }

  /* build: full cake, or cut cake with a 60 degree wedge facing the camera (+z) */
  function build(key, { cut = false, R = 1, H = 1.02, wedge = Math.PI / 3 } = {}) {
    seed = 11;
    const root = new T.Group();
    if (key !== "choc2" && V[key].rect) { root.add(rectCake(key)); return { root }; }
    if (key === "choc2") {
      seed = 5;
      const a = piece("choc", 1, 0.86, 0, TAU, false), b = piece("choc", 0.64, 0.66, 0, TAU, false, 0.8);
      a.position.y = -0.38; b.position.y = 0.38; root.add(a, b);
      return { root };
    }
    if (!cut) { root.add(piece(key, R, H, 0, TAU, false)); return { root }; }
    const rest = piece(key, R, H, wedge / 2, TAU - wedge, true);
    const c = (2 * R * Math.sin(wedge / 2)) / (3 * (wedge / 2));
    const slicePivot = new T.Group(); slicePivot.position.z = c;
    const spinner = new T.Group();
    const slice = piece(key, R, H, -wedge / 2, wedge, true); slice.position.z = -c;
    const plate = stand(0.78); plate.position.y = -H / 2 - 0.02; plate.scale.setScalar(0);
    spinner.add(slice, plate); slicePivot.add(spinner);
    root.add(rest, slicePivot);
    return { root, rest, slicePivot, spinner, slice, plate, c, H };
  }

  function lights(scene) {
    scene.add(new T.HemisphereLight(lin("#fff6ef"), lin("#b89488"), 0.95));
    const k = new T.DirectionalLight(lin("#fff1e4"), 1.05); k.position.set(3, 5, 4); scene.add(k);
    const f = new T.DirectionalLight(lin("#ffd8cf"), 0.35); f.position.set(-4, 2, -2); scene.add(f);
    const r = new T.DirectionalLight(0xffffff, 0.22); r.position.set(-4, 1, -5); scene.add(r);
  }

  const views = [];
  class View {
    constructor(canvas, { fov = 35, z = 6, dpr = 2 } = {}) {
      this.canvas = canvas;
      this.r = new T.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
      this.r.setPixelRatio(Math.min(window.devicePixelRatio || 1, dpr));
      this.r.outputEncoding = T.sRGBEncoding;
      this.r.setClearColor(0x000000, 0);
      this.scene = new T.Scene();
      lights(this.scene);
      this.camera = new T.PerspectiveCamera(fov, 1, 0.1, 100);
      this.camera.position.set(0, 0, z);
      this.on = true;
      this.onFrame = null;
      this.resize();
      new ResizeObserver(() => this.resize()).observe(canvas);
      new IntersectionObserver((e) => { this.on = e[0].isIntersecting; }, { rootMargin: "120px" }).observe(canvas.parentElement || canvas);
      views.push(this);
    }
    resize() {
      const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
      if (!w || !h) return;
      this.r.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.onResize && this.onResize(w, h);
    }
    visH(z = this.camera.position.z) { return 2 * z * Math.tan((this.camera.fov * Math.PI) / 360); }
  }
  let last = performance.now();
  function frame() {
    const now = performance.now(), dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    for (const v of views) if (v.on) { v.onFrame && v.onFrame(dt, now / 1000); v.r.render(v.scene, v.camera); }
  }
  return { T, build, View, frame, stand, V };
})();
