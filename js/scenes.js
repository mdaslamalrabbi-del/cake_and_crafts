/* ---------- hero: one sticky canvas, the cake turns, peeks, gets cut, serves a slice ---------- */
function heroScene() {
  const T = Kit.T, view = new Kit.View($("#cake3d"), { fov: 35, z: 6, dpr: 2 });
  const world = new T.Group(), fit = new T.Group(), rot = new T.Group();
  view.scene.add(world); world.add(fit); fit.add(rot);
  const cake = Kit.build("choc", { cut: true });
  let heroX = 0, scrolled = false;
  rot.add(cake.root);
  rot.rotation.x = 0.42;
  view.onResize = (w, h) => {
    const vh = view.visH(6), vw = (vh * w) / h;
    fit.scale.setScalar(Math.min(0.85, (MOB() ? 0.6 : 0.36) * vw / 2.1, (MOB() ? 0.27 : 0.36) * vh / 1.45));
    fit.position.y = MOB() ? -0.06 : 0.04;
    heroX = MOB() ? 0 : 0.34 * vw / 6;
    if (!scrolled) fit.position.x = heroX;
  };
  view.resize();
  let frames = 0;
  view.onFrame = (dt, t) => {
    const k = Math.min(1, dt * 3);
    world.rotation.x += (mouse.y * 0.2 - world.rotation.x) * k;
    world.rotation.y += (mouse.x * 0.28 - world.rotation.y) * k;
    world.position.y = RM ? 0 : Math.sin(t * 1.2) * 0.04;
    if (++frames === 2) emit("cake:ready");
  };
  G.ticker.add(Kit.frame);

  const cam = view.camera, camZ = 6, c = cake.c, sp = cake.slicePivot;
  const scrubEnd = () => { const r = $("#runway"); return Math.max(1, r.getBoundingClientRect().top + scrollY - innerHeight); };

  /* phase 1: scrubbed turn and peek */
  const scrub = G.timeline({ scrollTrigger: { trigger: "#story", start: "top top", end: () => scrubEnd(), scrub: true, invalidateOnRefresh: true } });
  scrub.fromTo(fit.position, { x: () => heroX }, { x: 0, duration: 1, ease: "power2.inOut", immediateRender: false, onStart: () => (scrolled = true) }, 0)
    .to(rot.rotation, { y: Math.PI * 0.55, x: 0.62, duration: 1, ease: "power2.inOut" }, 0)
    .to(sp.position, { z: c + 0.6, y: 0.14, duration: 1.5, ease: "power2.inOut" }, "<+.5")
    .to(sp.rotation, { y: -0.42, x: -0.12, duration: 1.5, ease: "power2.inOut" }, "<")
    .to(cam.position, { z: 5.1, duration: 1, ease: "power2.inOut" }, "<")
    .to({}, { duration: 0.5 })
    .to(rot.rotation, { y: TAU, x: 0.42, duration: 1, ease: "power2.inOut" })
    .to(cam.position, { z: camZ, duration: 1, ease: "power2.inOut" }, "<")
    .to(sp.position, { z: c, y: 0, duration: 1, ease: "power2.inOut" }, "<")
    .to(sp.rotation, { y: 0, x: 0, duration: 1, ease: "power2.inOut" }, "<");
  const scrubST = scrub.scrollTrigger;

  /* phase 2: the slice slides out and lands on the stand (plays once, no scroll lock, no shake) */
  const btl = G.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
  btl.call(() => { if (!btl.reversed()) emit("seq:cut"); }, null, 0)
    .to(sp.position, { z: c + 1.05, y: 0.2, duration: 0.55, ease: "power2.out" }, 0)
    .to(cake.rest.position, { x: -6, y: -0.6, duration: 0.9, ease: "power2.in" }, 0.2)
    .to(cake.rest.rotation, { y: -1, duration: 0.9, ease: "power2.in" }, 0.2)
    .to(cake.rest.scale, { x: 0.2, y: 0.2, z: 0.2, duration: 0.9, ease: "power2.in" }, 0.2)
    .to(sp.position, { x: 0, y: 0.08, z: 0, duration: 0.8, ease: "power3.out" }, 0.55)
    .to(sp.rotation, { y: Math.PI / 2 + 0.45, x: 0, duration: 0.9, ease: "back.out(1.6)" }, 0.55)
    .fromTo(sp.scale, { x: 1, y: 1, z: 1 }, { x: 1.22, y: 1.22, z: 1.22, duration: 0.9, ease: "back.out(1.6)" }, 0.55)
    .to(cake.plate.scale, { x: 0.78, y: 0.78, z: 0.78, duration: 0.8, ease: "back.out(1.6)" }, 0.65)
    .to(rot.rotation, { x: 0.24, duration: 0.8 }, 0.55);
  let isOpen = false;
  const instant = () => window.__glide || RM;
  function open() {
    if (isOpen) return; isOpen = true;
    if (instant()) { btl.progress(1); emit("seq:cut"); return; }
    btl.timeScale(1).play();
  }
  function close(done) {
    if (!isOpen) return done();
    isOpen = false; emit("seq:reset");
    if (instant()) { btl.pause(0); done(); return; }
    btl.eventCallback("onReverseComplete", done);
    btl.timeScale(1.4).reverse();
  }
  ST.create({
    trigger: "#story", start: "top top", end: () => scrubEnd(), invalidateOnRefresh: true,
    onLeave: () => { scrubST.disable(false); open(); },
    onEnterBack: () => close(() => { scrubST.enable(false); scrubST.update(); }),
  });

  /* phase 3: the slice turns twice down the runway */
  G.timeline({ scrollTrigger: { trigger: "#runway", start: () => scrubEnd() + 2, end: () => $("#cakes").getBoundingClientRect().top + scrollY, scrub: 0.6, invalidateOnRefresh: true } })
    .fromTo(cake.spinner.rotation, { y: 0 }, { y: TAU * 2, ease: "none", duration: 1 });
}

/* ---------- copy that rises with the cut ---------- */
function seqOverlay() {
  const title = $("#seqTitle"), lead = $("#seqLead"), side = $("#seqSide"), btn = $("#seqBtn");
  if (!OK || RM || !SPLIT) return;
  G.set([title, lead, side], { autoAlpha: 0 });
  const build = () => {
    G.set([title, lead, side], { autoAlpha: 1 });
    const chars = SPLIT.create(title, { type: "chars", mask: "chars" }), la = SPLIT.create(lead, { type: "lines", mask: "lines" }), sa = SPLIT.create(side, { type: "lines", mask: "lines" });
    G.set([...chars.chars, ...la.lines, ...sa.lines], { yPercent: 115 });
    G.set(btn, { autoAlpha: 0, y: 12 });
    const master = G.timeline({ paused: true })
      .to(chars.chars, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: { each: 0.035, from: "center" } }, 0.1)
      .to(la.lines, { yPercent: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }, 0.45)
      .to(sa.lines, { yPercent: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }, 0.6)
      .to(btn, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.85);
    addEventListener("seq:cut", () => master.timeScale(1).play());
    addEventListener("seq:reset", () => master.timeScale(1.4).reverse());
    ST.create({ trigger: "#seq", start: "bottom bottom", onEnter: () => master.play(), onRefresh: (st) => st.progress === 1 && master.progress(1) });
  };
  addEventListener("loaderdone", () => (document.fonts ? document.fonts.ready.then(build) : build()), { once: true });
}

/* ---------- card cakes: drop in on scroll, spin on hover, drag to turn ---------- */
function cardScene(canvas, variant, hover) {
  const T = Kit.T, view = new Kit.View(canvas, { fov: 30, z: 6, dpr: 1.5 });
  const fit = new T.Group(), outer = new T.Group(), inner = new T.Group();
  view.scene.add(fit); fit.add(outer); outer.add(inner);
  inner.add(Kit.build(variant).root);
  fit.rotation.x = 0.36;
  view.onResize = (w, h) => {
    const vh = view.visH(), vw = (vh * w) / h, wid = variant === "gold" ? 2.6 : 2.15, hei = variant === "choc2" ? 2.2 : 1.5;
    fit.scale.setScalar(Math.min((0.74 * vw) / wid, (0.52 * vh) / hei));
    fit.position.y = -0.1 * vh / 3;
  };
  view.resize();
  const prog = { p: RM ? 1 : 0, s: null };
  if (!RM) {
    ST.create({ trigger: canvas, start: "top 115%", end: "top 70%", scrub: true, onUpdate: (st) => (prog.p = st.progress) });
    if (canvas.getBoundingClientRect().top < innerHeight * 0.95) prog.p = 1;
  }
  let spin = 0, vel = 0, hov = 0, drag = 0, dv = 0, down = false, lx = 0;
  if (matchMedia("(pointer: fine)").matches) {
    canvas.addEventListener("pointerdown", (e) => { down = true; lx = e.clientX; dv = 0; });
    addEventListener("pointermove", (e) => { if (!down) return; dv = (e.clientX - lx) * 0.012; drag += dv; lx = e.clientX; });
    addEventListener("pointerup", () => (down = false));
  }
  view.onFrame = (dt) => {
    if (prog.s === null) prog.s = prog.p;
    prog.s += (prog.p - prog.s) * Math.min(1, 7 * dt);
    const p = prog.s, landed = p > 0.99, target = landed && hover.on ? 1 : 0;
    vel += (target - spin) * 26 * dt; vel -= 7.5 * vel * dt; spin += vel * dt;
    hov += (target - hov) * Math.min(1, 5 * dt);
    if (!down) { drag += dv; dv *= 0.92; }
    inner.rotation.y = spin * TAU + drag;
    outer.position.y = 4.5 * (1 - p);
    outer.rotation.y = TAU * (1 - p);
    outer.rotation.x = -0.12 * hov;
    outer.scale.setScalar(1 + 0.08 * hov);
  };
}

/* ---------- order box cake: one turn per flavour, swapped mid-spin ---------- */
function orderScene(canvas, stageEl) {
  const T = Kit.T, view = new Kit.View(canvas, { fov: 30, z: 6, dpr: 2 });
  const fit = new T.Group(), tilt = new T.Group(), spinG = new T.Group();
  view.scene.add(fit); fit.add(tilt); tilt.add(spinG);
  const cakes = FLAVS.map((f, i) => { const r = Kit.build(f.id).root; r.visible = i === 0; spinG.add(r); return r; });
  const plate = Kit.stand(1.3); plate.position.y = -0.51; spinG.add(plate);
  fit.rotation.x = 0.3;
  view.onResize = (w, h) => { const vh = view.visH(), vw = (vh * w) / h; fit.scale.setScalar(Math.min((0.6 * vw) / 2.3, (0.58 * vh) / 2)); fit.position.y = 0.05; };
  view.resize();
  const st = { spin: 0, cur: 0 }; let idle = 0, hov = 0, hovOn = false;
  stageEl.addEventListener("pointerenter", () => (hovOn = true));
  stageEl.addEventListener("pointerleave", () => (hovOn = false));
  view.onFrame = (dt) => {
    if (!RM) idle += dt * 0.35;
    hov += ((hovOn ? 1 : 0) - hov) * Math.min(1, 5 * dt);
    spinG.rotation.y = st.spin * TAU + idle;
    tilt.rotation.x = -0.12 * hov; tilt.scale.setScalar(1 + 0.06 * hov);
  };
  return {
    step(dir, idx) {
      if (RM) { cakes.forEach((c, i) => (c.visible = i === idx)); return; }
      G.to(st, { spin: Math.round(st.spin) + dir, duration: 1.15, ease: "power2.inOut", onUpdate() { if (this.progress() > 0.5 && st.cur !== idx) { cakes.forEach((c, i) => (c.visible = i === idx)); st.cur = idx; } } });
    },
  };
}
