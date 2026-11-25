# Cake & Craft

A one-page scroll-story website for Cake & Craft, homemade celebration cakes in Dhaka. A 3D cake turns, gets cut and serves a slice as you scroll; orders go straight to WhatsApp. No backend, no build step.

## Project structure

```
cake-and-craft/
├── index.html        all page markup (sections in scroll order)
├── css/style.css     every style, desktop first, mobile rules at the end
├── js/kit.js         3D cake kit (three.js): builds cakes, cut slices, cake stand, renderer views
├── js/app.js         site logic: data, prices, WhatsApp, basket, loader, menu, text and scroll effects
├── js/scenes.js      3D scenes: hero cake story, card cakes, Box of joy cake, progress readout
├── js/game.js        footer sweet-slicing game, then boot()
├── img/              logo.png, choc.jpg, pink.jpg, cherry.jpg
├── CLAUDE.md         handoff instructions for Claude (design rules and how to edit)
└── README.md
```

Scripts load in this order and share globals: `kit.js` → `app.js` → `scenes.js` → `game.js`. Keep that order.

## Run it locally

Any static server works (opening the file directly may block some features):

```bash
cd cake-and-craft
python3 -m http.server 8000
# open http://localhost:8000
```

## Put it on GitHub

```bash
cd cake-and-craft
git init
git add .
git commit -m "Cake & Craft website"
git branch -M main
git remote add origin https://github.com/<your-username>/cake-and-craft.git
git push -u origin main
```

## Publish on Vercel

1. Go to vercel.com, sign in with GitHub, click **Add New → Project**.
2. Import the `cake-and-craft` repository.
3. Framework preset: **Other**. Build command: leave empty. Output directory: leave empty (root).
4. Click **Deploy**. You get a link like `cake-and-craft.vercel.app`; add your own domain later under **Settings → Domains**.

Every `git push` to `main` redeploys automatically.

Netlify or GitHub Pages also work the same way: it is a plain static site.

## Edit the business details

All in `js/app.js`, near the top:

| What | Where |
| --- | --- |
| Sizes, weights, prices (BDT) | `SIZES`: each size has a price per flavour, e.g. `price: { choc: 750, straw: 750, cherry: 650 }` (`price: 0` means "Negotiable") |
| Flavours and their colours | `FLAVS` |
| WhatsApp number | `WA = { number: "8801770470421", show: "01770-470421" }` (number = country code + number, no plus or spaces) |
| Delivery fee in Dhaka | `DELIVERY` |
| Moments cards | `MOMENTS` (text, tint colours), `ART` (illustrations), `MOTIF` (background shapes) |

Footer text (Facebook, hours) lives in `index.html`, inside `<div class="fcols">`.

## Libraries (loaded from CDN, pinned)

- three.js r128 (3D cakes)
- GSAP 3.13.0 with ScrollTrigger and SplitText (animation)
- Lenis 1.1.13 (smooth scroll)
- Google Fonts: Khand, Inter, Patrick Hand, Great Vibes

Do not upgrade three.js past r128 without changes: later versions drop the `three.min.js` global build used here.
