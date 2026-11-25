/* ---------- Cake & Craft site ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
const G = window.gsap, ST = window.ScrollTrigger, SPLIT = window.SplitText;
const OK = !!(G && ST);
const MOB = () => innerWidth <= 1025;
const TAU = Math.PI * 2;
const fmt = (n) => "৳" + n.toLocaleString("en-US");
const emit = (n, d) => dispatchEvent(new CustomEvent(n, { detail: d }));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
if (OK) G.registerPlugin(ST);
if (OK && SPLIT) G.registerPlugin(SPLIT);
if (!Kit) document.documentElement.classList.add("no3d");

const SIZES = [
  /* price per flavour in BDT; price: 0 means "Negotiable" */
  { id: "small", name: "Small Cake", serves: "1 lb", price: { choc: 750, straw: 750, cherry: 650 }, color: "#C8414B", variant: "cherry", img: "img/cherry.jpg" },
  { id: "medium", name: "Medium Cake", serves: "2 lb", price: { choc: 1300, straw: 1300, cherry: 1100 }, color: "#E58C96", variant: "straw", img: "img/pink.jpg" },
  { id: "large", name: "Large Cake", serves: "3 lb", price: { choc: 2050, straw: 2050, cherry: 1800 }, color: "#7A4430", variant: "choc2", img: "img/choc.jpg" },
  { id: "corp", name: "Corporate Cake", serves: "Custom size", price: 0, color: "#B98A3E", variant: "gold", img: "img/choc.jpg" },
];
const FLAVS = [
  { id: "choc", name: "Chocolate Drip", full: "Chocolate Drip Cake", note: "Ganache drip, chocolate buttercream", color: "#7A4430", img: "img/choc.jpg" },
  { id: "straw", name: "Strawberry Dream", full: "Strawberry Dream Cake", note: "Pink sponge, vanilla cream, sprinkles", color: "#E58C96", img: "img/pink.jpg" },
  { id: "cherry", name: "Vanilla Cherry", full: "Vanilla Cherry Cake", note: "Vanilla sponge, cherry jam", color: "#C8414B", img: "img/cherry.jpg" },
];
const DELIVERY = 150; /* delivery fee in Dhaka */
const priceOf = (s, f) => (s.price ? s.price[f.id] : 0);
const ptxt = (s, f, q = 1) => (s.price ? fmt(priceOf(s, f) * q) : "Negotiable");
const fixedSum = (lines) => lines.reduce((a, l) => a + l.q * priceOf(l.s, l.f), 0);
const hasQuote = (lines) => lines.some((l) => !l.s.price);
const totalTxt = (lines) => { const f = fixedSum(lines); return !hasQuote(lines) ? fmt(f + DELIVERY) : f ? fmt(f + DELIVERY) + " + quote" : "To discuss"; };
const subTxt = (lines) => { const f = fixedSum(lines); return !hasQuote(lines) ? fmt(f) : f ? fmt(f) + " + quote" : "Negotiable"; };
/* occasion cards: art + background motif + colours make each one readable without the words */
const MOMENTS = [
  { q: "Birthdays that start with a wish.", t: "#birthday", k: "bday", bg: "#FCE1DE", hi: "#F6B5B0" },
  { q: "First anniversaries, and fiftieth.", t: "#anniversary", k: "anni", bg: "#EEE2F3", hi: "#D3BCE4" },
  { q: "Baby showers in soft pink.", t: "#babyshower", k: "baby", bg: "#DFECF4", hi: "#B9D6E9" },
  { q: "Office wins worth sharing.", t: "#teamtreat", k: "team", bg: "#F6E9C9", hi: "#E7C77D" },
  { q: "Weddings, one tier at a time.", t: "#wedding", k: "wed", bg: "#FFF8EE", hi: "#EADBBE" },
  { q: "Tuesdays, just because.", t: "#justbecause", k: "just", bg: "#E3F0E0", hi: "#BCDDB8" },
];
const ART = {
  bday: '<path class="fill" fill="#F6B5B0" d="M24 60h64v30H24z"/><path d="M24 60h64v30H24z"/><path d="M24 71c7 6 14 6 18 0s14-6 18 0 14 6 18 0 7-6 10 0"/><path d="M38 60V46M56 60V46M74 60V46"/><path class="flame" fill="#C9A25E" stroke="none" d="M38 43c-5-5 0-11 0-13 0 2 5 8 0 13zM56 43c-5-5 0-11 0-13 0 2 5 8 0 13zM74 43c-5-5 0-11 0-13 0 2 5 8 0 13z"/><ellipse class="balloon" fill="#E58C96" cx="104" cy="24" rx="11" ry="14"/><path d="M104 38c-4 9 4 16-2 26"/><path d="M14 94h84"/>',
  anni: '<circle cx="46" cy="62" r="22"/><circle cx="72" cy="62" r="22"/><path class="fill" fill="#C9A25E" d="M66 30l6-8 6 8-6 7z"/><path d="M66 30l6-8 6 8-6 7z"/><path class="fill" fill="#E58C96" stroke="none" d="M24 30c-8-6-12-10-12-15 0-4 3-7 6-7 3 0 5 2 6 4 1-2 3-4 6-4 3 0 6 3 6 7 0 5-4 9-12 15z"/><path fill="#E58C96" stroke="none" d="M100 46c-5-4-8-7-8-10 0-3 2-5 4-5 2 0 3 1 4 3 1-2 2-3 4-3 2 0 4 2 4 5 0 3-3 6-8 10z"/>',
  baby: '<path d="M52 14c0-7 12-7 12 0v8H52z"/><rect x="46" y="22" width="24" height="8" rx="2"/><rect class="fill" fill="#B9D6E9" x="44" y="30" width="28" height="58" rx="10"/><rect x="44" y="30" width="28" height="58" rx="10"/><path d="M44 46h10M44 58h10M44 70h10"/><circle class="fill" fill="#F6B5B0" cx="96" cy="38" r="12"/><circle cx="96" cy="38" r="12"/><path d="M96 50v28"/><circle cx="96" cy="82" r="5"/><path d="M8 22c0-6 8-8 11-4 2-6 12-6 13 1 5 0 6 7 1 8H10c-3 0-4-3-2-5z"/>',
  team: '<path class="fill" fill="#E7C77D" d="M40 16h40v20a20 20 0 0 1-40 0z"/><path d="M40 16h40v20a20 20 0 0 1-40 0z"/><path d="M40 22H29c0 13 6 18 13 18M80 22h11c0 13-6 18-13 18"/><path d="M60 56v12"/><path d="M48 68h24v8H48zM40 84h40"/><path fill="#FBF2EC" d="M60 22l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/><path d="M16 30l4 4M14 50h6M104 30l-4 4M100 50h6"/>',
  wed: '<path class="fill" fill="#FFF8EE" d="M30 82c0-26 6-46 22-46s22 20 22 46z" transform="rotate(-12 52 60)"/><path d="M30 82c0-26 6-46 22-46s22 20 22 46z" transform="rotate(-12 52 60)"/><path class="fill" fill="#EADBBE" d="M50 82c0-26 6-46 22-46s22 20 22 46z" transform="rotate(12 72 60)"/><path d="M50 82c0-26 6-46 22-46s22 20 22 46z" transform="rotate(12 72 60)"/><circle cx="48" cy="88" r="4"/><circle cx="78" cy="88" r="4"/><path class="fill" fill="#C9A25E" d="M62 26c-10-8-18-4-14 2s14 0 14-2zM62 26c10-8 18-4 14 2s-14 0-14-2z"/><path d="M62 26c-10-8-18-4-14 2s14 0 14-2zM62 26c10-8 18-4 14 2s-14 0-14-2z"/><path d="M62 28l-6 12M62 28l6 12"/>',
  just: '<path class="fill" fill="#F6B5B0" d="M36 58h48l-7 32H43z"/><path d="M36 58h48l-7 32H43z"/><path d="M48 60l3 28M60 60v28M72 60l-3 28"/><path class="fill" fill="#FBF2EC" d="M32 58c-5-12 7-17 12-14 0-10 12-14 18-7 7-7 19-3 18 7 5-3 17 2 12 14z"/><path d="M32 58c-5-12 7-17 12-14 0-10 12-14 18-7 7-7 19-3 18 7 5-3 17 2 12 14z"/><circle class="fill" fill="#C8414B" stroke="none" cx="62" cy="28" r="7"/><path d="M62 21c1-6 5-9 9-9"/><circle cx="104" cy="22" r="8"/><path d="M104 8v4M104 32v4M90 22h4M114 22h4M94 12l3 3M114 12l-3 3"/>',
};
const MOTIF = {
  bday: '<rect x="2" y="8" width="16" height="6" rx="2" fill="#E58C96" transform="rotate(-25 10 11)"/>',
  anni: '<path fill="#B08AC9" d="M10 18C4 13 1 10 1 6c0-3 2-5 5-5 2 0 3 1 4 3 1-2 2-3 4-3 3 0 5 2 5 5 0 4-3 7-9 12z"/>',
  baby: '<path fill="#fff" d="M2 14c0-4 5-6 8-3 2-5 10-5 11 1 4 0 5 6 0 6H4c-2 0-3-2-2-4z"/>',
  team: '<path fill="#C9A25E" d="M10 1l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z"/>',
  wed: '<circle cx="10" cy="10" r="7" fill="none" stroke="#C9A25E" stroke-width="2.4"/>',
  just: '<circle cx="10" cy="10" r="5" fill="#8DBF88"/>',
};
const MOTIFPOS = [[8, 12, -20], [82, 8, 15], [90, 58, -10], [6, 70, 25], [22, 40, 10], [74, 34, -30]];
const PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M12 3v18M3 12h18"/></svg>';
const BITS = [
  '<svg viewBox="0 0 200 160" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 66L160 24L190 64L14 66Z"/><path d="M14 66V124L190 126V64"/><path d="M14 92L190 94"/></svg>',
  '<svg viewBox="0 0 160 200" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M30 104h100l-14 82H44z"/><path d="M24 104c-8-22 14-30 22-26 0-18 22-26 34-14 12-12 34-4 34 14 8-4 30 4 22 26z"/></svg>',
  '<svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"><circle cx="40" cy="84" r="24"/><circle cx="86" cy="90" r="22"/><path d="M40 60C48 30 62 16 74 10M86 68C84 40 78 22 74 10"/></svg>',
  '<svg viewBox="0 0 40 36" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 33C9 25 3 19 3 12 3 7 7 3 12 3c3.5 0 6 2 8 5 2-3 4.5-5 8-5 5 0 9 4 9 9 0 7-6 13-17 21z"/></svg>',
];
const BITPOS = [["left:-2vw;bottom:-3vw;width:11vw", -160, 160, -45], ["right:-2vw;top:-3vw;width:10vw", 160, -160, 60], ["right:1.5vw;bottom:1.5vw;width:7vw", 160, 160, 90], ["left:-1vw;top:1vw;width:6vw", -160, -160, -70]];

/* ---------- scroll + locks ---------- */
let lenis = null;
const locks = new Set();
function applyLock() {
  const on = locks.size > 0;
  if (lenis) on ? lenis.stop() : lenis.start();
  else document.documentElement.style.overflow = on ? "hidden" : "";
}
const lock = (k) => { locks.add(k); applyLock(); };
const unlock = (k) => { locks.delete(k); applyLock(); };
if (OK && window.Lenis && !RM) {
  lenis = new Lenis({ lerp: 0.075, smoothWheel: true, wheelMultiplier: 0.8, touchMultiplier: 0.9 });
  lenis.on("scroll", ST.update);
  G.ticker.add((t) => lenis.raf(t * 1000));
  G.ticker.lagSmoothing(0);
}
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
scrollTo(0, 0);

/* ---------- small builders ---------- */
const OVAL = "M120 66C70 68 6 64 3 40C0 14 52 3 100 2C150 1 202 6 205 32C208 60 150 72 44 71";
function buildBtn(b) {
  const label = b.dataset.label;
  b.setAttribute("aria-label", label);
  b.innerHTML = `<svg viewBox="0 0 208 74" preserveAspectRatio="none" aria-hidden="true"><path d="${OVAL}"/></svg><span class="lbl" aria-hidden="true">${label.split(" ").map((w) => `<span class="w">${[...w].map((c) => `<span class="l"><span><span>${esc(c)}</span><span>${esc(c)}</span></span></span>`).join("")}</span>`).join("")}</span>`;
  const p = $("path", b), letters = $$(".l>span", b);
  let len = 0;
  const measure = () => {
    len = p.getTotalLength(); p.style.strokeDasharray = len;
    const r = b.getBoundingClientRect();
    if (r.width && r.height) p.style.strokeWidth = 3 / Math.sqrt((r.width / 208) * (r.height / 74));
  };
  measure();
  new ResizeObserver(measure).observe(b);
  if (!OK || RM) return;
  b.addEventListener("pointerenter", () => {
    G.to(p, { strokeDashoffset: len, duration: 0.5, ease: "power2.inOut", overwrite: "auto" });
    G.to(p, { opacity: 0, duration: 0.16, delay: 0.34, ease: "power2.in" });
    G.to(letters, { yPercent: -50, duration: 0.575, ease: "expo.out", stagger: { each: 0.014 }, overwrite: "auto" });
  });
  b.addEventListener("pointerleave", () => {
    G.killTweensOf(p, "opacity");
    G.to(p, { opacity: 1, duration: 0.14 });
    G.to(p, { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut", overwrite: "auto" });
    G.to(letters, { yPercent: 0, duration: 0.52, ease: "expo.out", stagger: { each: 0.0115, from: "end" }, overwrite: "auto" });
  });
  if (b.dataset.entry) {
    G.set(b, { autoAlpha: 0 });
    addEventListener("loaderdone", () => {
      G.set(p, { strokeDashoffset: len });
      G.timeline({ delay: +b.dataset.entry })
        .fromTo(b, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to(p, { strokeDashoffset: 0, duration: 0.45, ease: "power2.inOut" }, "-=.35");
    }, { once: true });
  }
}
$$(".btn[data-label]").forEach(buildBtn);

/* sunburst path */
{
  let d = "";
  for (let i = 0; i <= 36; i++) { const r = i % 2 ? 40 : 56, a = (i / 36) * TAU; d += (i ? "L" : "M") + (r * Math.sin(a)).toFixed(1) + " " + (-r * Math.cos(a)).toFixed(1); }
  $("#burstPath").setAttribute("d", d + "Z");
}

/* cards */
$("#cgrid").innerHTML = SIZES.map((s, i) => `
  <article class="card" data-i="${i}" style="--c:${s.color}">
    <div class="cbox">
      <span class="wash" style="background:${s.color}"></span>
      <div class="cbits">${BITPOS.map((b, j) => `<span style="${b[0]}">${BITS[j]}</span>`).join("")}</div>
      <canvas aria-label="3D ${esc(s.name)}" role="img"></canvas>
      <img class="fb" src="${s.img}" alt="">
    </div>
    <div class="cfoot">
      <div class="cmeta"><p class="cname" style="margin:0">${[...s.name].map((c) => `<span><span><i>${c === " " ? "&nbsp;" : esc(c)}</i><i aria-hidden="true">${c === " " ? "&nbsp;" : esc(c)}</i></span></span>`).join("")}<span class="cserve">${s.serves}</span></p>
      <p class="cflav"><span class="cfn">${s.price ? esc(FLAVS[0].name) : "Any flavour"}</span><b class="cfp">${ptxt(s, FLAVS[0])}</b></p></div>
      <div class="add">
        <span class="toast">Added to basket</span>
        <button class="plus" aria-expanded="false" aria-label="Add ${esc(s.name)} to basket">${PLUS}</button>
        <div class="pick" role="menu">
          <p>Pick a flavour, ${esc(s.serves.toLowerCase())}${s.price ? "" : ", price on request"}</p>
          ${FLAVS.map((f) => `<button data-f="${f.id}" role="menuitem"><span><span class="pn">${f.name}</span><span class="ps">${f.note}</span></span><span class="pp">${ptxt(s, f)}</span></button>`).join("")}
          <button class="vb">View basket</button>
        </div>
      </div>
    </div>
  </article>`).join("");

/* moments */
$("#mtrack").innerHTML = [0, 1, 2].map((k) => MOMENTS.map((m) => `<article class="mcard m-${m.k}" style="--bg:${m.bg};--hi:${m.hi}"${k ? ' aria-hidden="true"' : ""}>
  <span class="mbg" aria-hidden="true">${MOTIFPOS.map(([x, y, r], j) => `<svg viewBox="0 0 20 20" style="left:${x}%;top:${y}%;--r:${r}deg;--d:${j % 2 ? 1 : -1}">${MOTIF[m.k]}</svg>`).join("")}</span>
  <i class="bolt a"></i><i class="bolt b"></i>
  <svg class="mart" viewBox="0 0 120 100" fill="none" stroke="#3D2018" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ART[m.k]}</svg>
  <h3>${m.q}</h3><p>${m.t}</p></article>`).join("")).join("");

/* loader digits */
$$("#ldCount .dg>span").forEach((s) => { s.innerHTML = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => `<i>${n}</i>`).join(""); });

/* ---------- cart + WhatsApp order (no backend) ---------- */
const WA = { number: "8801770470421", show: "01770-470421" };
const pad2 = (n) => String(n).padStart(2, "0");
const isoDate = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const MIN_DATE = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return isoDate(d); })();
const niceDate = (v) => { const [y, m, d] = v.split("-").map(Number); return new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); };
/* lines: [{q, f, s}] */
function waText(lines, name, msg, date) {
  return [
    `Hi Cake & Craft! ${name ? "This is " + name + ". " : ""}I would like to order:`,
    ...lines.map((l) => `- ${l.q} x ${l.f.name}, ${l.s.name} (${l.s.serves.toLowerCase()}): ${l.s.price ? fmt(priceOf(l.s, l.f) * l.q) : "price to discuss"}`),
    "",
    `Message on the cake: ${msg || "None"}`,
    `Needed on: ${date ? niceDate(date) : "Not chosen yet"}`,
    "",
    `Subtotal: ${subTxt(lines)}`,
    `Delivery in Dhaka: ${fmt(DELIVERY)}`,
    `Total: ${totalTxt(lines)}`,
    ...(hasQuote(lines) ? ["", "Corporate cake: please share the size and price with me."] : []),
  ].join("\n");
}
const waHref = (text) => `https://wa.me/${WA.number}${text ? "?text=" + encodeURIComponent(text) : ""}`;
function checkOrder(nameEl, dateEl, err) {
  for (const el of [nameEl, dateEl]) el.classList.remove("bad");
  let m = "";
  if (!nameEl.value.trim()) { m = "Add your name so we know who is ordering."; nameEl.classList.add("bad"); nameEl.focus(); }
  else if (!dateEl.value) { m = "Pick the date you need the cake."; dateEl.classList.add("bad"); dateEl.focus(); }
  else if (dateEl.value < MIN_DATE) { m = "Please pick tomorrow or a later date."; dateEl.classList.add("bad"); dateEl.focus(); }
  err.textContent = m;
  return !m;
}
$$(".waShow").forEach((e) => (e.textContent = WA.show));
$$(".waLink").forEach((a) => (a.href = waHref("")));
const cart = (() => {
  let items = [];
  try { items = JSON.parse(localStorage.getItem("cc-basket") || "[]"); } catch (e) { items = []; }
  items = items.filter((it) => SIZES.some((s) => s.id === it.s) && FLAVS.some((f) => f.id === it.f) && it.q > 0);
  const save = () => { try { localStorage.setItem("cc-basket", JSON.stringify(items)); } catch (e) {} };
  const count = () => items.reduce((a, b) => a + b.q, 0);
  const total = () => fixedSum(items.map(line));
  const line = (it) => ({ s: SIZES.find((x) => x.id === it.s), f: FLAVS.find((x) => x.id === it.f), q: it.q });
  const msgEl = $("#oMsg"), dateEl = $("#oDate"), nameEl = $("#oName"), err = $("#oErr"), wa = $("#waBtn");
  dateEl.min = MIN_DATE;
  try { const saved = JSON.parse(localStorage.getItem("cc-order") || "{}"); msgEl.value = saved.m || ""; nameEl.value = saved.n || ""; if (saved.d && saved.d >= MIN_DATE) dateEl.value = saved.d; } catch (e) {}
  const orderText = () => waText(items.map(line), nameEl.value.trim(), msgEl.value.trim(), dateEl.value);
  function summary() {
    const sub = total(), msg = msgEl.value.trim();
    $("#sList").innerHTML = items.map(line).map((l) => `<li><span class="nm">${l.q > 1 ? l.q + " &times; " : ""}${esc(l.f.name)}</span><span class="pr">${ptxt(l.s, l.f, l.q)}</span><span class="sub">${esc(l.s.name)}, ${esc(l.s.serves.toLowerCase())}</span></li>`).join("");
    $("#sName").textContent = nameEl.value.trim() || "Not added";
    $("#sMsg").textContent = msg || "None";
    $("#sDate").textContent = dateEl.value ? niceDate(dateEl.value) : "Pick a date";
    const L = items.map(line); $("#sSub").textContent = subTxt(L); $("#sDel").textContent = fmt(DELIVERY); $("#sTot").textContent = totalTxt(L);
    wa.href = waHref(orderText());
    wa.classList.toggle("off", !dateEl.value || !nameEl.value.trim());
    try { localStorage.setItem("cc-order", JSON.stringify({ m: msgEl.value, d: dateEl.value, n: nameEl.value })); } catch (e) {}
  }
  [msgEl, nameEl, dateEl].forEach((el) => el.addEventListener("input", () => { el.classList.remove("bad"); err.textContent = ""; summary(); }));
  wa.addEventListener("click", (e) => {
    if (!checkOrder(nameEl, dateEl, err)) { e.preventDefault(); return; }
    summary();
    $("#waNote").textContent = "WhatsApp is opening with your order. Press send there, and we will confirm within the day.";
  });
  $("#waCopy").addEventListener("click", async () => {
    if (!checkOrder(nameEl, dateEl, err)) return;
    let ok = true;
    try { await navigator.clipboard.writeText(orderText()); } catch (e) { ok = false; }
    $("#waNote").textContent = ok ? `Copied. Paste it into WhatsApp to ${WA.show}.` : `Copying is blocked here. Message us on WhatsApp at ${WA.show}.`;
  });
  function step(which) {
    const sum = which === "sum";
    $("#stepCart").hidden = sum; $("#stepSum").hidden = !sum;
    $("#dTitle").textContent = sum ? "Your order" : "Your basket";
    if (sum) { summary(); $("#waNote").textContent = "Opens WhatsApp with your order written out. We confirm within the day."; }
    $(".dbody").scrollTop = 0;
  }
  function render() {
    const n = count(), c = $("#count");
    c.textContent = n > 9 ? "9+" : n; c.classList.toggle("on", n > 0);
    $("#bagBtn").setAttribute("aria-label", n ? `Open basket, ${n} items` : "Open basket");
    $("#dEmpty").style.display = items.length ? "none" : "flex";
    $("#dList").style.display = items.length ? "block" : "none";
    $("#cartFoot").style.display = items.length ? "grid" : "none";
    $("#dList").innerHTML = items.map((it, i) => {
      const { s, f } = line(it);
      return `<li><span><span class="nm">${esc(f.name)}</span><br><span class="sub">${esc(s.name)}, ${esc(s.serves.toLowerCase())}</span></span><b class="hand" style="font-size:18px;font-weight:400;white-space:nowrap">${ptxt(s, f, it.q)}</b><span class="qty"><button data-d="-1" data-i="${i}" aria-label="One less">&minus;</button>${it.q}<button data-d="1" data-i="${i}" aria-label="One more">+</button></span></li>`;
    }).join("");
    $("#dSub").textContent = subTxt(items.map(line));
    if (!items.length) step("cart"); else if (!$("#stepSum").hidden) summary();
  }
  function add(s, f) {
    const it = items.find((x) => x.s === s && x.f === f);
    it ? it.q++ : items.push({ s, f, q: 1 });
    save(); render();
    if (OK) G.fromTo("#count", { scale: 1 }, { scale: 1.3, duration: 0.22, ease: "sine.out", yoyo: true, repeat: 1 });
  }
  $("#dList").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-d]"); if (!b) return;
    const it = items[+b.dataset.i]; it.q += +b.dataset.d;
    if (it.q <= 0) items.splice(+b.dataset.i, 1);
    save(); render();
  });
  $("#dClear").addEventListener("click", () => { items = []; save(); render(); });
  $("#dCheckout").addEventListener("click", () => { if (items.length) step("sum"); });
  $("#dBack").addEventListener("click", () => step("cart"));
  render();
  return { add, step };
})();

/* drawer */
function drawer(open, which = "cart") {
  if (open) cart.step(which);
  $("#drawer").classList.toggle("on", open); $("#scrim").classList.toggle("on", open);
  $("#drawer").setAttribute("aria-hidden", !open);
  open ? lock("drawer") : unlock("drawer");
  if (open && OK && which === "cart") G.fromTo("#dList li", { x: 30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out", stagger: 0.05, delay: 0.35 });
  if (open && OK && which === "sum") G.fromTo(".scard>*", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out", stagger: 0.05, delay: 0.3 });
  if (open) setTimeout(() => (which === "sum" ? $("#oMsg") : $("#dClose")).focus({ preventScroll: true }), 450);
}
$("#bagBtn").addEventListener("click", () => drawer(true));
$("#dClose").addEventListener("click", () => drawer(false));
$("#scrim").addEventListener("click", () => drawer(false));
addEventListener("keydown", (e) => { if (e.key === "Escape") { drawer(false); menu(false); } });

/* ---------- menu ---------- */
let menuOpen = false, mtl = null;
if (OK) {
  mtl = G.timeline({ paused: true })
    .set("#menu", { visibility: "visible" })
    .fromTo("#menu", { clipPath: "ellipse(75% 0% at 50% -5%)" }, { clipPath: "ellipse(105% 145% at 50% -5%)", duration: 1, ease: "power3.inOut" })
    .fromTo(".mlink>span", { yPercent: 165, rotate: 4 }, { yPercent: 0, rotate: 0, duration: 0.75, ease: "power3.out", stagger: 0.06 }, "-=.45")
    .fromTo("#mfoot", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" }, "-=.5");
}
function menu(open) {
  if (open === menuOpen) return;
  menuOpen = open;
  const m = $("#menu");
  document.body.classList.toggle("menuOpen", open);
  $("#menuBtn").setAttribute("aria-expanded", open);
  $("#menuBtn").setAttribute("aria-label", open ? "Close menu" : "Open menu");
  m.classList.toggle("open", open); m.setAttribute("aria-hidden", !open);
  if (mtl) open ? mtl.timeScale(1).play() : mtl.timeScale(1.4).reverse();
  else { m.style.visibility = open ? "visible" : "hidden"; m.style.clipPath = open ? "none" : ""; }
  open ? lock("menu") : unlock("menu");
  if (open) setTimeout(() => $(".mlink").focus(), 500);
}
$("#menuBtn").addEventListener("click", () => menu(!menuOpen));
$("#copyBtn").addEventListener("click", async () => {
  const b = $("#copyBtn");
  try { await navigator.clipboard.writeText(WA.show.replace("-", "")); } catch (e) {}
  b.classList.add("ok"); setTimeout(() => b.classList.remove("ok"), 2000);
});

/* ---------- navigation: glide, or curtain for long jumps ---------- */
window.__glide = false;
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
function curtain(cover) {
  const c = $("#curtain"), p = $$(".panel", c), [bl, br, fl, fr] = p;
  return new Promise((res) => {
    if (!OK || RM) return res();
    if (cover) {
      G.set(c, { visibility: "visible" });
      G.set([bl, fl], { xPercent: -170, rotate: -5 }); G.set([br, fr], { xPercent: 170, rotate: 5 });
      G.timeline({ onComplete: res }).to([bl, br], { xPercent: 0, rotate: 0, duration: 1.2, ease: "power3.inOut" }).to([fl, fr], { xPercent: 0, rotate: 0, duration: 1.2, ease: "power3.inOut" }, "-=1");
    } else {
      G.timeline({ onComplete: () => { G.set(c, { visibility: "hidden" }); res(); } })
        .to(fl, { xPercent: -170, rotate: -5, duration: 1.4, ease: "power3.inOut" }, 0).to(fr, { xPercent: 170, rotate: 5, duration: 1.4, ease: "power3.inOut" }, 0)
        .to(bl, { xPercent: -170, rotate: -5, duration: 1.4, ease: "power3.inOut" }, 0.25).to(br, { xPercent: 170, rotate: 5, duration: 1.4, ease: "power3.inOut" }, 0.25);
    }
  });
}
async function go(hash) {
  const el = $(hash); if (!el) return;
  const y = el.getBoundingClientRect().top + scrollY, dist = Math.abs(y - scrollY);
  window.__glide = true;
  if (!OK || RM) { el.scrollIntoView(); setTimeout(() => (window.__glide = false), 50); return; }
  if (dist > innerHeight * 4) {
    await curtain(true);
    lenis ? lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y);
    ST.update(); ST.refresh();
    await new Promise((r) => setTimeout(r, 120));
    window.__glide = false;
    await curtain(false);
  } else if (lenis) {
    lenis.scrollTo(y, { duration: Math.min(3.8, Math.max(1.6, dist / 900)), easing: easeIO, force: true, onComplete: () => (window.__glide = false) });
  } else { scrollTo({ top: y, behavior: "smooth" }); setTimeout(() => (window.__glide = false), 1200); }
}
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-go]"); if (!a) return;
  e.preventDefault();
  const h = a.getAttribute("href");
  if (menuOpen) { menu(false); setTimeout(() => go(h), 450); }
  else if ($("#drawer").classList.contains("on")) { drawer(false); setTimeout(() => go(h), 300); }
  else go(h);
});

/* ---------- loader ---------- */
const loaderTasks = [];
function track(p, w) { loaderTasks.push({ p, w }); }
track(document.fonts ? document.fonts.ready : Promise.resolve(), 15);
$$("img").forEach((im) => track(im.complete ? Promise.resolve() : new Promise((r) => { im.onload = im.onerror = r; }), 10));
const sceneReady = new Promise((r) => addEventListener("cake:ready", r, { once: true }));
track(Kit ? sceneReady : Promise.resolve(), 35);
function runLoader() {
  const total = loaderTasks.reduce((a, b) => a + b.w, 0);
  let target = 0, shown = 0, start = performance.now(), finished = false, allDone = false, last = start;
  loaderTasks.forEach((t) => t.p.then(() => { target += (t.w / total) * 100; }));
  Promise.all(loaderTasks.map((t) => t.p)).then(() => (allDone = true));
  setTimeout(() => (allDone = true), 12000);
  const digits = $$("#ldCount .dg>span").map((el) => ({ el, p: { v: 0 } }));
  const setDigit = (d, val) => {
    if (d.cur === val) return; d.cur = val;
    let t = 10 * Math.floor(d.p.v / 10) + val; while (t < d.p.v - 0.001) t += 10;
    G.to(d.p, { v: t, duration: 0.3, ease: "power2.out", overwrite: "auto", onUpdate: () => { d.el.style.transform = `translateY(${-(d.p.v % 10)}em)`; } });
  };
  const fillEl = $("#ldFill");
  lock("loader");
  const tick = (now) => {
    if (finished) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (allDone) shown += (100 - shown) * (1 - Math.exp(-6 * dt));
    else if (shown < target) shown += (target - shown) * (1 - Math.exp(-4.5 * dt));
    else shown += (Math.min(99, target + 12) - shown) * (1 - Math.exp(-0.45 * dt));
    if (allDone && 100 - shown < 0.4) shown = 100;
    const v = Math.round(shown);
    setDigit(digits[0], Math.floor(v / 100)); setDigit(digits[1], Math.floor((v % 100) / 10)); setDigit(digits[2], v % 10);
    $("#ldSr").textContent = v + " percent loaded";
    fillEl.setAttribute("transform", `translate(0 ${470 * (1 - shown / 100)})`);
    if (allDone && now - start > 2800 && shown >= 99.5) { finished = true; finish(); return; }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  function finish() {
    const wipe = { v: -36 }, cake = $("#ldCake");
    const t = G.timeline({ defaults: { ease: "power3.inOut" }, onComplete: () => { $("#loader").remove(); ST.refresh(); } });
    t.to(fillEl, { attr: { transform: "translate(0 0)" }, duration: 0.4, ease: "power2.out" })
      .to("#ldCount", { autoAlpha: 0, y: 28, duration: 0.35, ease: "power2.in" }, 0)
      .to(wipe, { v: 100, duration: 0.7, ease: "power2.inOut", onUpdate: () => cake.style.setProperty("--wipe", wipe.v + "%") }, "-=.05")
      .to("#pfl", { xPercent: -170, rotate: -5, duration: 1.45 }, "-=.08")
      .to("#pfr", { xPercent: 170, rotate: 5, duration: 1.45 }, "<")
      .to("#pbl", { xPercent: -170, rotate: -5, duration: 1.45 }, "-=1.2")
      .to("#pbr", { xPercent: 170, rotate: 5, duration: 1.45 }, "<")
      .add(() => { unlock("loader"); emit("loaderdone"); }, "-=1.25");
  }
}

/* ---------- text reveals ---------- */
const splits = $$("[data-split]");
if (OK && SPLIT && !RM) splits.forEach((el) => el.classList.add("split-wait"));
function reveal(el) {
  const chars = el.dataset.split === "chars", delay = +(el.dataset.delay || 0), from = el.dataset.from || "start";
  if (!SPLIT || RM) { el.classList.remove("split-wait"); return; }
  const s = SPLIT.create(el, { type: chars ? "lines,words,chars" : "lines", mask: "lines", linesClass: "mask-line" });
  const t = chars ? s.chars : s.lines;
  G.set(t, chars ? { yPercent: 140 } : { yPercent: 140, opacity: 0 });
  el.classList.remove("split-wait");
  G.to(t, { yPercent: 0, opacity: 1, duration: chars ? 0.85 : 0.8, ease: chars ? "power3.out" : "power2.out", stagger: { each: chars ? 0.035 : 0.08, from }, delay,
    scrollTrigger: { trigger: el, start: "top 88%", once: true }, onComplete: () => s.revert() });
}

/* ---------- self-drawing doodles ---------- */
function drawer2(w) {
  const shapes = $$("path,circle,line", w).filter((p) => getComputedStyle(p).stroke !== "none");
  const lens = shapes.map((p) => (p.getTotalLength ? p.getTotalLength() : 0) || 1);
  shapes.forEach((p, i) => { p.style.strokeDasharray = lens[i]; p.style.strokeDashoffset = lens[i]; });
  const tl = G.timeline({ paused: true });
  if (w.hasAttribute("data-seq")) {
    const tot = lens.reduce((a, b) => a + b, 0); let at = 0;
    shapes.forEach((p, i) => { const d = lens[i] / tot; tl.to(p, { strokeDashoffset: 0, duration: d, ease: "none" }, at); at += d; });
  } else shapes.forEach((p, i) => tl.to(p, { strokeDashoffset: 0, duration: 1 - 0.08 * (shapes.length - 1), ease: "none" }, i * 0.08));
  if (w.dataset.draw === "loader") {
    G.set(w, { autoAlpha: 0 });
    addEventListener("loaderdone", () => { G.set(w, { autoAlpha: 1 }); G.delayedCall(+(w.dataset.delay || 0), () => tl.timeScale(1 / 0.8).play(0)); }, { once: true });
  } else if (w.hasAttribute("data-seq")) {
    ST.create({ trigger: w, start: "top 80%", once: true, onEnter: () => tl.timeScale(1 / 1.2).play(0) });
  } else {
    tl.scrollTrigger = ST.create({ trigger: w, start: w.dataset.start || "top 85%", end: w.dataset.end || "top 35%", scrub: 1, animation: tl });
  }
}

/* ---------- start everything once the loader is done ---------- */
function boot() {
  if (!OK) { $("#loader").remove(); $$(".split-wait").forEach((e) => e.classList.remove("split-wait")); $("#fwrap").classList.add("on"); return; }
  if (RM) { $("#loader").remove(); G.set("#nav", { yPercent: 0 }); emit("loaderdone"); }
  else { G.set("#nav", { yPercent: -120 }); runLoader(); }
  addEventListener("loaderdone", () => {
    if (!RM) G.to("#nav", { yPercent: 0, duration: 0.85, ease: "power3.out", delay: 0.35 });
    const go2 = () => { splits.forEach(reveal); ST.refresh(); };
    document.fonts ? document.fonts.ready.then(go2) : go2();
    titleTicker();
  }, { once: true });
  if (!RM) $$("[data-draw]").forEach(drawer2);
  orderPill(); parallax(); sway(); badges(); slot(); burstSpin(); navDark(); cards(); polaroids(); carousel(); orderBox(); footerSetup(); trail();
  if (Kit) heroScene(); else { emit("cake:ready"); }
  seqOverlay();
}

/* parallax: drift and spin relative to viewport centre */
function parallax() {
  if (RM) return;
  const items = $$("[data-par]").map((el) => ({ el, sp: +el.dataset.par, rot: +(el.dataset.rot || 0), y: 0, sy: G.quickSetter(el, "y", "px"), sr: G.quickSetter(el, "rotation", "deg") }));
  G.ticker.add(() => {
    const vh = innerHeight;
    for (const it of items) {
      const r = it.el.getBoundingClientRect(), top = r.top - it.y;
      if (top + r.height < -200 || top > vh + 200) continue;
      const p = 1 - ((top + r.height / 2) / vh) * 2;
      it.y = p * vh * it.sp; it.sy(it.y); if (it.rot) it.sr(p * it.rot);
    }
  });
}

/* cherries sway forever and lean toward the pointer */
const mouse = { x: 0, y: 0 };
addEventListener("pointermove", (e) => { mouse.x = (e.clientX / innerWidth) * 2 - 1; mouse.y = (e.clientY / innerHeight) * 2 - 1; }, { passive: true });
function sway() {
  if (RM) return;
  $$("[data-sway] svg").forEach((s, i) => G.to(s, { rotation: i % 2 ? -6 : 6, transformOrigin: "53% 17%", duration: 3.5 + i * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1 }));
  $$("[data-lean]").forEach((el) => {
    const rot = G.quickTo(el, "x", { duration: 1.1, ease: "power3.out" }), ty = G.quickTo(el, "y", { duration: 1.1, ease: "power3.out" });
    G.ticker.add(() => { rot(mouse.x * 18); ty(mouse.y * 10); });
  });
}

/* stat badges arc up past the cake on a sine curve */
function badges() {
  const boxes = $$(".badge"), amp = [0.25, 0.3, 0.27, 0.36], tilt = [-45, 40, -50, 48];
  const tl = G.timeline({ scrollTrigger: { trigger: "#recipe", start: "top top", end: "bottom bottom", scrub: true } });
  boxes.forEach((b, i) => {
    const left = i % 2 === 0;
    const reach = () => { const w = $(".stage").offsetWidth; return MOB() ? Math.min(w * amp[i], w / 2 - b.offsetWidth / 2 - 0.02 * w) : innerWidth * amp[i]; };
    tl.fromTo(b, { y: "70vh", x: 0, rotate: 0 }, { y: "-70vh", ease: "none", duration: 1,
      onUpdate() { if (RM) return; const a = this.progress() * Math.PI, x = Math.sin(a) * reach(); G.set(b, { x: left ? -x : x, rotate: Math.sin(a) * tilt[i] }); } }, 0.3 * i);
  });
}

/* slot word: sweet, fresh, yours */
function slot() {
  const el = $("#slot"), sw = $$(".sw", el);
  if (RM) { G.set(sw, { autoAlpha: 0 }); G.set(sw[2], { autoAlpha: 1 }); return; }
  let tl;
  const build = () => {
    tl && (tl.scrollTrigger.kill(), tl.kill());
    const step = sw[0].offsetHeight + innerWidth * 0.01, travel = (sw.length - 1) * step;
    sw.forEach((s, i) => G.set(s, { y: i * step }));
    tl = G.timeline({ scrollTrigger: { trigger: el, start: "top 80%", end: "top 35%", scrub: 0.6, snap: { snapTo: 1 / (sw.length - 1), duration: 0.2, ease: "power1.inOut" } } })
      .to(sw, { y: (i) => i * step - travel, duration: 1, ease: "none" });
  };
  build();
  let w = innerWidth; addEventListener("resize", () => { if (innerWidth !== w) { w = innerWidth; build(); } });
}
function burstSpin() { if (!RM) G.to("#burst", { rotation: 360, ease: "none", scrollTrigger: { trigger: "#cakes", start: "top bottom", end: "bottom top", scrub: true } }); }

/* header pills invert over dark bands */
function navDark() {
  const nav = $("#nav"), darks = $$("[data-dark]");
  let last = null;
  G.ticker.add(() => {
    const probe = nav.offsetHeight / 2;
    let hit = menuOpen;
    if (!hit) for (const d of darks) { const r = d.getBoundingClientRect(); if (r.top <= probe && r.bottom > probe) { hit = true; break; } }
    if (!hit && $("#fwrap").classList.contains("on")) { const r = $("#footer").getBoundingClientRect(); if (r.top <= probe) hit = true; }
    if (hit !== last) { last = hit; nav.classList.toggle("dark", hit); }
  });
}

/* ---------- product cards ---------- */
function cards() {
  $$(".card").forEach((card) => {
    const i = +card.dataset.i, s = SIZES[i], wash = $(".wash", card), chars = $$(".cname>span>span", card), bits = $$(".cbits span", card);
    const add = $(".add", card), plus = $(".plus", card), pick = $(".pick", card), toast = $(".toast", card);
    const hover = { on: false };
    G.set(bits, { xPercent: (j) => BITPOS[j][1], yPercent: (j) => BITPOS[j][2], rotation: (j) => BITPOS[j][3] });
    card.addEventListener("pointerenter", () => {
      hover.on = true; if (RM) return;
      G.killTweensOf([wash, chars, bits]);
      G.fromTo(wash, { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 0.5, ease: "power2.inOut" });
      G.to(chars, { yPercent: -100, duration: 0.5, ease: "power3.out", stagger: { each: 0.018 } });
      G.to(bits, { xPercent: 0, yPercent: 0, rotation: 0, duration: 0.9, ease: "power3.out", stagger: 0.06, delay: 0.08 });
    });
    card.addEventListener("pointerleave", () => {
      hover.on = false; if (RM) return;
      G.killTweensOf([wash, chars, bits]);
      G.to(wash, { clipPath: "circle(0% at 50% 50%)", duration: 0.9, ease: "power2.inOut" });
      G.to(chars, { yPercent: 0, duration: 0.45, ease: "power3.out", stagger: { each: 0.015, from: "end" } });
      G.to(bits, { xPercent: (j) => BITPOS[j][1], yPercent: (j) => BITPOS[j][2], rotation: (j) => BITPOS[j][3], duration: 0.7, ease: "power2.in", stagger: { each: 0.05, from: "end" } });
    });
    let open = false;
    const setOpen = (o) => {
      open = o; add.classList.toggle("open", o); plus.setAttribute("aria-expanded", o);
      $$("button", pick).forEach((b) => (b.tabIndex = o ? 0 : -1));
      if (o) { G.set(pick, { visibility: "visible" }); G.fromTo(pick, { y: 12, autoAlpha: 0, scale: 0.94 }, { y: 0, autoAlpha: 1, scale: 1, duration: 0.4, ease: "sine.out" }); G.fromTo($$("button", pick), { y: 10, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, ease: "sine.out", stagger: 0.045, delay: 0.05 }); }
      else G.to(pick, { y: 8, autoAlpha: 0, scale: 0.96, duration: 0.28, ease: "sine.in", onComplete: () => G.set(pick, { visibility: "hidden" }) });
    };
    $$("button", pick).forEach((b) => (b.tabIndex = -1));
    plus.addEventListener("click", (e) => { e.stopPropagation(); setOpen(!open); });
    /* tap anywhere on the card to pick a flavour (ignore drags that turn the 3D cake) */
    let px0 = 0, py0 = 0;
    card.addEventListener("pointerdown", (e) => { px0 = e.clientX; py0 = e.clientY; });
    card.addEventListener("click", (e) => { if (add.contains(e.target) || Math.hypot(e.clientX - px0, e.clientY - py0) > 6) return; setOpen(!open); });
    const cfn = $(".cfn", card), cfp = $(".cfp", card);
    let chosen = FLAVS[0];
    const showFlav = (f) => { if (!s.price) return; cfn.textContent = f.name; cfp.textContent = ptxt(s, f); };
    $$("button[data-f]", pick).forEach((b) => {
      const f = FLAVS.find((x) => x.id === b.dataset.f);
      b.addEventListener("pointerenter", () => showFlav(f));
      b.addEventListener("focus", () => showFlav(f));
    });
    pick.addEventListener("pointerleave", () => showFlav(chosen));
    pick.addEventListener("click", (e) => {
      e.stopPropagation();
      const b = e.target.closest("button"); if (!b) return;
      if (b.classList.contains("vb")) { setOpen(false); drawer(true); return; }
      cart.add(s.id, b.dataset.f); chosen = FLAVS.find((x) => x.id === b.dataset.f); showFlav(chosen); setOpen(false);
      toast.classList.add("on"); setTimeout(() => toast.classList.remove("on"), 1600);
    });
    addEventListener("pointerdown", (e) => { if (open && !add.contains(e.target) && !card.contains(e.target)) setOpen(false); });
    if (Kit) cardScene($("canvas", card), s.variant, hover);
  });
}

/* ---------- polaroids: flick them, they slide home ---------- */
function polaroids() {
  $$(".pola").forEach((p) => {
    const rest = +p.dataset.r; G.set(p, { rotation: rest });
    let lx = 0, ly = 0, vx = 0, vy = 0;
    p.addEventListener("mouseenter", (e) => { G.killTweensOf(p); lx = e.clientX; ly = e.clientY; vx = vy = 0; });
    p.addEventListener("mousemove", (e) => { vx = e.clientX - lx; vy = e.clientY - ly; lx = e.clientX; ly = e.clientY; });
    p.addEventListener("mouseleave", () => {
      if (RM) return;
      const cx = G.utils.clamp(-60, 60, vx), cy = G.utils.clamp(-60, 60, vy);
      G.timeline().to(p, { x: cx * 6, y: cy * 6, rotation: rest + cx * 0.5, duration: 0.45, ease: "power2.out" })
        .to(p, { x: 0, y: 0, rotation: rest, duration: 1.3, ease: "elastic.out(1,0.65)" });
    });
  });
}

/* ---------- endless draggable moments ---------- */
function carousel() {
  const vp = $("#mview"), tr = $("#mtrack"), cardsEl = $$(".mcard", tr);
  const proxy = { x: 0 };
  let loop = 1, stepW = 1, wrap = G.utils.wrap(-1, 0);
  const render = () => G.set(tr, { x: wrap(proxy.x) });
  const measure = () => { const gap = parseFloat(getComputedStyle(tr).columnGap) || 0; loop = (tr.scrollWidth + gap) / 3; stepW = loop / MOMENTS.length; wrap = G.utils.wrap(-loop, 0); render(); };
  measure(); new ResizeObserver(measure).observe(vp);
  let down = false, sx = 0, sy = 0, px = 0, vx = 0, lt = 0, lx = 0, axis = null;
  vp.addEventListener("pointerdown", (e) => { down = true; axis = null; sx = e.clientX; sy = e.clientY; px = proxy.x; lx = e.clientX; lt = performance.now(); vx = 0; G.killTweensOf(proxy); });
  addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (!axis && Math.hypot(dx, dy) > 6) axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    if (axis !== "x") return;
    vp.classList.add("drag");
    const now = performance.now(); vx = ((e.clientX - lx) / Math.max(1, now - lt)) * 16; lx = e.clientX; lt = now;
    proxy.x = px + dx; render();
  });
  addEventListener("pointerup", () => {
    if (!down) return; down = false; vp.classList.remove("drag");
    if (axis === "x") G.to(proxy, { x: proxy.x + vx * 22, duration: 1.1, ease: "power3.out", onUpdate: render });
  });
  $$("#moments [data-step]").forEach((b) => b.addEventListener("click", () => { G.killTweensOf(proxy); G.to(proxy, { x: Math.round((proxy.x - +b.dataset.step * stepW) / stepW) * stepW, duration: 0.9, ease: "power3.out", onUpdate: render }); }));
  const spins = cardsEl.map((c) => G.quickSetter(c, "rotation", "deg")), tilt = cardsEl.map(() => 0), lag = cardsEl.map((_, i) => 0.09 + (i % 3) * 0.02);
  let lastX = 0;
  if (!RM) G.ticker.add(() => {
    const d = proxy.x - lastX; lastX = proxy.x;
    const target = G.utils.clamp(-10, 10, -0.22 * d), r = G.ticker.deltaRatio();
    for (let i = 0; i < tilt.length; i++) { tilt[i] += (target - tilt[i]) * Math.min(1, lag[i] * r); spins[i](tilt[i]); }
  });
}

/* pointer-anchored fill on round buttons */
$$(".rb").forEach((b) => {
  const blob = $(".blob", b);
  const place = (e, s) => { const r = b.getBoundingClientRect(); blob.style.left = e.clientX - r.left + "px"; blob.style.top = e.clientY - r.top + "px"; blob.style.transform = `translate(-50%,-50%) scale(${s})`; };
  b.addEventListener("mouseenter", (e) => place(e, 1)); b.addEventListener("mouseleave", (e) => place(e, 0));
});

/* ---------- order box: cycle flavours ---------- */
let orderIdx = 0, orderView = null;
function orderBox() {
  const panel = $("#oPanel"), wash = $("#oWash"), name = $("#oName"), fb = $("#oStage img.fb");
  let busy = false;
  const step = (dir) => {
    if (busy) return;
    orderIdx = (orderIdx + dir + FLAVS.length) % FLAVS.length;
    const f = FLAVS[orderIdx];
    G.to(name, { autoAlpha: 0, y: -6, duration: 0.2, onComplete: () => { name.textContent = f.full; G.to(name, { autoAlpha: 1, y: 0, duration: 0.3 }); } });
    fb.src = f.img;
    if (RM) { panel.style.background = f.color; return; }
    busy = true; setTimeout(() => (busy = false), 1150);
    G.set(wash, { background: f.color, clipPath: "circle(0% at 50% 50%)" });
    G.to(wash, { clipPath: "circle(75% at 50% 50%)", duration: 1.15, ease: "expo.out", onComplete: () => { panel.style.background = f.color; G.set(wash, { clipPath: "circle(0% at 50% 50%)" }); } });
    orderView && orderView.step(dir, orderIdx);
    quick.update();
  };
  $("#oPrev").addEventListener("click", () => step(-1));
  $("#oNext").addEventListener("click", () => step(1));
  if (Kit) orderView = orderScene($("#oCanvas"), $("#oStage"));
  /* add to cart: just adds, no drawer */
  $("#oCart").addEventListener("click", () => {
    cart.add(SIZES[quick.size()].id, FLAVS[orderIdx].id);
    const t = $("#oToast"); t.classList.add("on"); setTimeout(() => t.classList.remove("on"), 1600);
  });
  quick.update();
}

/* ---------- Box of joy: direct WhatsApp order ---------- */
const quick = (() => {
  let si = 1;
  const nameEl = $("#qName"), dateEl = $("#qDate"), msgEl = $("#qMsg"), err = $("#qErr"), wa = $("#qWa"), wrap = $("#qSizes");
  dateEl.min = MIN_DATE;
  try { const sv = JSON.parse(localStorage.getItem("cc-order") || "{}"); nameEl.value = sv.n || ""; msgEl.value = sv.m || ""; if (sv.d && sv.d >= MIN_DATE) dateEl.value = sv.d; } catch (e) {}
  const pills = () => (wrap.innerHTML = SIZES.map((s, i) => `<button type="button" role="radio" class="sz" data-i="${i}" aria-checked="${i === si}" tabindex="${i === si ? 0 : -1}"><b>${esc(s.name.replace(" Cake", ""))}</b><span>${s.price ? esc(s.serves) + " &middot; " + ptxt(s, FLAVS[orderIdx]) : "Negotiable"}</span></button>`).join(""));
  let pillFlav = -1;
  const lines = () => [{ q: 1, f: FLAVS[orderIdx], s: SIZES[si] }];
  const text = () => waText(lines(), nameEl.value.trim(), msgEl.value.trim(), dateEl.value);
  function update() {
    const f = FLAVS[orderIdx], s = SIZES[si];
    if (pillFlav !== orderIdx) { pillFlav = orderIdx; pills(); }
    $$(".sz", wrap).forEach((b) => { b.setAttribute("aria-checked", +b.dataset.i === si); b.tabIndex = +b.dataset.i === si ? 0 : -1; });
    $("#qCake").textContent = f.full;
    $("#qSizeTxt").textContent = `${s.name}, ${s.serves.toLowerCase()}`;
    $("#qPrice").textContent = ptxt(s, f);
    $("#qNameTxt").textContent = nameEl.value.trim() || "Not added";
    $("#qMsgTxt").textContent = msgEl.value.trim() || "None";
    $("#qDateTxt").textContent = dateEl.value ? niceDate(dateEl.value) : "Pick a date";
    $("#qDel").textContent = fmt(DELIVERY);
    $("#qTot").textContent = totalTxt(lines());
    wa.href = waHref(text());
    wa.classList.toggle("off", !dateEl.value || !nameEl.value.trim());
    try { localStorage.setItem("cc-order", JSON.stringify({ m: msgEl.value, d: dateEl.value, n: nameEl.value })); } catch (e) {}
  }
  wrap.addEventListener("click", (e) => { const b = e.target.closest(".sz"); if (!b) return; si = +b.dataset.i; update(); });
  wrap.addEventListener("keydown", (e) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
    e.preventDefault(); si = (si + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1) + SIZES.length) % SIZES.length; update(); $$(".sz", wrap)[si].focus();
  });
  [nameEl, dateEl, msgEl].forEach((el) => el.addEventListener("input", () => { el.classList.remove("bad"); err.textContent = ""; update(); }));
  $("#qForm").addEventListener("submit", (e) => e.preventDefault());
  wa.addEventListener("click", (e) => {
    if (!checkOrder(nameEl, dateEl, err)) { e.preventDefault(); return; }
    update();
    $("#qNote").textContent = "WhatsApp is opening with your order. Press send there, and we will confirm within the day.";
  });
  $("#qCopy").addEventListener("click", async () => {
    if (!checkOrder(nameEl, dateEl, err)) return;
    let ok = true;
    try { await navigator.clipboard.writeText(text()); } catch (e) { ok = false; }
    $("#qNote").textContent = ok ? `Copied. Paste it into WhatsApp to ${WA.show}.` : `Copying is blocked here. Message us on WhatsApp at ${WA.show}.`;
  });
  update();
  return { update, size: () => si };
})();

/* ---------- floating "Order a cake" pill ---------- */
function orderPill() {
  const pill = $("#opill");
  let shown = null, ready = !OK;
  addEventListener("loaderdone", () => (ready = true), { once: true });
  const tick = () => {
    const want = ready && !menuOpen && !$("#drawer").classList.contains("on");
    if (want !== shown) { shown = want; pill.classList.toggle("on", want); pill.tabIndex = want ? 0 : -1; }
  };
  OK ? G.ticker.add(tick) : addEventListener("scroll", tick, { passive: true });
  tick();
}

/* ---------- pink blade trail behind the pointer ---------- */
function trail() {
  if (!matchMedia("(pointer: fine)").matches || RM) return;
  const c = $("#trail"), g = c.getContext("2d"), pts = [];
  let k = 1, muted = false, raf = null;
  const size = () => { const d = Math.min(devicePixelRatio || 1, 2); c.width = innerWidth * d; c.height = innerHeight * d; g.setTransform(d, 0, 0, d, 0, 0); };
  size(); addEventListener("resize", size);
  new IntersectionObserver((e) => { muted = e[0].isIntersecting && e[0].intersectionRatio > 0.15; kick(); }, { threshold: [0, 0.15, 0.5] }).observe($("#footer"));
  const kick = () => { if (raf == null) raf = requestAnimationFrame(draw); };
  function draw() {
    const now = Date.now(); k += ((muted ? 0 : 1) - k) * 0.1;
    g.clearRect(0, 0, innerWidth, innerHeight);
    while (pts.length && now - pts[0].t > 220) pts.shift();
    if (k > 0.02 && pts.length > 2) {
      const L = [], R = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1], age = Math.max(0, 1 - (now - a.t) / 220), dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
        if (!d) continue;
        const w = Math.min(6, d * 0.5) * Math.sin((i / (pts.length - 1)) * Math.PI) * age * k;
        L.push([a.x - (dy / d) * w, a.y + (dx / d) * w]); R.push([a.x + (dy / d) * w, a.y - (dx / d) * w]);
      }
      if (L.length > 1) { g.globalAlpha = 0.32 * k; g.fillStyle = "#F6B5B0"; g.beginPath(); g.moveTo(L[0][0], L[0][1]); L.forEach((p) => g.lineTo(p[0], p[1])); R.reverse().forEach((p) => g.lineTo(p[0], p[1])); g.fill(); g.globalAlpha = 1; }
    }
    if (!pts.length) { raf = null; return; }
    raf = requestAnimationFrame(draw);
  }
  addEventListener("pointermove", (e) => { pts.push({ x: e.clientX, y: e.clientY, t: Date.now() }); kick(); }, { passive: true });
}

function titleTicker() {
  const moods = ["Whisking", "Baking", "Frosting", "Slicing", "Sharing"]; let i = 0;
  setInterval(() => { if (!document.hidden) document.title = "Cake & Craft | " + moods[i++ % moods.length]; }, 800);
}
