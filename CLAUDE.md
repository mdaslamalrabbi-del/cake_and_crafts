# CLAUDE.md: Cake & Craft website

Read this before changing anything. It records how the site is built and the rules that keep it consistent. When you finish a change, update this file if a rule, price or section changed.

## 1. What this project is

- A one-page scroll-story website for **Cake & Craft**, a home cake business in Dhaka, Bangladesh. Owner: Maksud Alam.
- Structure, type hierarchy and motion are modelled on **palmo.co.in** (a coconut-water site where a 3D coconut cracks into a can as you scroll). Here a **3D chocolate drip cake turns, gets cut and serves a slice**.
- Branding is our own: never use Palmo's name, logo, palm tree, copy or 3D models.
- **No backend.** Orders are sent as a pre-filled WhatsApp message (`wa.me` link). No payments, no order history, no database. The basket lives in the visitor's browser (`localStorage`).
- Static site: plain HTML, CSS and JS, no build step. Deployed from GitHub to Vercel.

## 2. Files

| File | Holds |
| --- | --- |
| `index.html` | All markup, sections in scroll order, inline SVG doodles, `#cherryArt` symbol |
| `css/style.css` | All styles; desktop first, then `@media (max-width:1025px)` and smaller blocks at the end |
| `js/kit.js` | `Kit`: three.js cake builder (`Kit.build(key, {cut})`), cake stand, `Kit.View` renderer, `Kit.frame` loop |
| `js/app.js` | Data (`SIZES` with per-flavour prices, `FLAVS`, `MOMENTS`, `ART`, `MOTIF`), WhatsApp (`WA`, `DELIVERY`, `waText`), basket, drawer, menu, loader, text reveals, parallax, badges, slot word, cards, polaroids, carousel, Box of joy form (`quick`), floating pill, cursor trail |
| `js/scenes.js` | `heroScene` (scroll story), `seqOverlay` ("SLICE" copy reveal), `cardScene`, `orderScene` |
| `js/game.js` | Footer setup and sweet-slicing game; calls `boot()` last |

Scripts are classic scripts sharing globals; load order `kit → app → scenes → game` must stay.

## 3. Business data (current, real)

- WhatsApp: **01770-470421** → `WA.number = "8801770470421"`.
- Prices in BDT (৳), Dhaka:

| Size | Weight | Chocolate Drip | Strawberry Dream | Vanilla Cherry |
| --- | --- | --- | --- | --- |
| Small | 1 lb | ৳750 | ৳750 | ৳650 |
| Medium | 2 lb | ৳1,300 | ৳1,300 | ৳1,100 |
| Large | 3 lb | ৳2,050 | ৳2,050 | ৳1,800 |
| Corporate | Custom size | Negotiable (`price: 0`) | | |

- Prices are per size **and** flavour: `SIZES[i].price = { choc, straw, cherry }`; always read them through `priceOf(size, flavour)` / `ptxt(size, flavour, qty)`.

- Delivery in Dhaka: ৳150 (`DELIVERY`), to be confirmed by the owner.
- Footer contact: Facebook "Cake & Craft", orders 10am to 8pm every day (confirm with owner).
- Flavours: Chocolate Drip, Strawberry Dream, Vanilla Cherry.
- Never invent testimonials, reviews, awards or claims. The "Sweet moments" section uses occasion cards, not reviews; swap in real reviews only when the owner supplies them.

## 4. Design system

### Colour (CSS variables in `:root`)

| Token | Hex | Use |
| --- | --- | --- |
| `--bg` blush cream | `#FBF2EC` | Page ground, light sections |
| `--ink` dark chocolate | `#3D2018` | Text, dark bands, footer, menu |
| `--pink` frosting | `#F6B5B0` | Accent: badges, cherries, wordmark, cursor trail |
| `--blush` | `#F2DCD2` | Card panels, polaroid frames, doodles on dark |
| `--rose` | `#7E3F33` | Dark badges, hover text |
| `--gold` | `#C9A25E` | From the logo ring: hearts, focus ring, slot word "fresh" |

Flavour colours (hover flood, Box of joy panel): Chocolate `#7A4430`, Strawberry `#E58C96`, Vanilla Cherry `#C8414B`, Corporate gold `#B98A3E`.
Occasion card tints (Sweet moments only, rest / hover): Birthday pink `#FCE1DE`/`#F6B5B0`, Anniversary lavender `#EEE2F3`/`#D3BCE4`, Baby shower blue `#DFECF4`/`#B9D6E9`, Team treat gold `#F6E9C9`/`#E7C77D`, Wedding ivory `#FFF8EE`/`#EADBBE`, Just because mint `#E3F0E0`/`#BCDDB8`.
Light and dark bands alternate; dark bands always start or end with a **scallop edge** (six circles, each `100vw / 5.5`), like piped frosting.

### Type

- **Khand 600**, uppercase, letter-spacing -0.05em, line-height 0.85: all headlines (`.t180` 9rem, `.t150` 8vw).
- **Inter 500**: body (`.t36` 1.45rem, `.t32` 1.3rem); hero and lead copy in Title Case.
- **Patrick Hand**: buttons, labels, card names, notes, menu pill.
- **Great Vibes**: the big "Cake & Craft" wordmark in the footer only.
- Root size is fluid: `1rem = 1.04167vw` on desktop; `min(2.86vw, 19px)` from 769 to 1025px; `min(3.9vw, 17px)` at 768px and below.

### Layout rules

- Desktop places elements like a poster, in `vw`. Anything placed vertically near the 3D cake must use `vh` or be anchored to the bottom (tall screens break `vw`-based tops).
- 1025px and below is the mobile layout: everything stacks and centres.
- Mobile cake cards: **one per row**, never 2×2.
- Mobile Box of joy: cake panel first, order form below.
- The 3D cake never covers the headline, the hero notes or any button at rest. Check 1440×900, 1260×1140, 1024×1366, 700×900 and 390×844 after layout changes.

### Shapes and doodles

Hand-drawn SVG strokes: arrow, frosting wave, cake slice, cupcake, whisk, cherries, smiley, heart, sunburst. Light doodles drift with parallax on dark bands. Buttons are a hand-drawn oval around Patrick Hand text. Cards and panels use 4px borders at 60% ink and four corner "bolts".

## 5. Page sections (scroll order)

1. **Loader**: chocolate screen, cake silhouette fills pink bottom-up, odometer counter 000–100% bottom-left, then four panels (two chocolate, two pink) sweep apart with a 5° tilt (1.45s, power3.inOut).
2. **Hero** `#hero`: "Happiness in every slice.", notes "Homemade with love / Baked fresh to order", paragraph and Discover Cakes button bottom-right, swaying pink cherries top-right. 3D cake floats, tilts toward the pointer, starts slightly right on desktop.
3. **Badges** `#recipe` (210vh desktop, 180vh mobile, no heading): four round badges (100% Homemade, 3 Layers, 0 Shortcuts, 4 Sizes) rise on a sine curve around the cake while it turns and the slice peeks out (scrubbed). The old "The real Recipe of every slice." heading was removed on purpose: keep it out.
4. **Cut** `#seq`: no shake, no progress meter, no scroll lock. When the scrub ends the slice slides out, the rest of the cake flies away and the slice lands on the cake stand with a `back.out(1.6)` pop (about 1.5s, plays once, reverses on scroll back). "SLICE" title and copy rise with it.
5. **Runway** `#runway`: "Save me a slice.." while the slice spins two turns.
6. **Cakes** `#cakes` (dark, scallop top `.ctop`): "Explore all ✺ cakes", sunburst spins with scroll; four cards (Small, Medium, Large, Corporate) with live 3D cakes that drop in, spin on hover, colour flood, letters roll, doodles fly in. Each card shows the chosen flavour and its price. **Tapping anywhere on the card** (or "+") opens the flavour picker; hovering a flavour previews its price, picking it adds it to the basket. Products come before the brand statement on purpose.
7. **Statement band** `#intro` (dark, scallop bottom): "Homemade cakes. Soft inside, pretty outside, made [sweet / fresh / yours], from our kitchen." Slot word flips on scroll; note "thats why every party asks for seconds !".
8. **Mission** `#mission`: "You deserve a cake made just for you." with three polaroids (the owner's photos) you can flick; they spring back.
9. **Sweet moments** `#moments`: endless draggable occasion cards that tilt with drag; round arrows with pointer-anchored fill. Every card has its own illustration (`ART`), background motif (`MOTIF`) and tint so it reads without the words: birthday cake + balloon, anniversary rings, baby bottle + rattle, team trophy, wedding bells, just-because cupcake. Hover: tint deepens, art bounces, motifs float.
10. **Box of joy** `#order`: left pink panel is the **WhatsApp order form** (size pills show the price for the current flavour, name, date, cake message, live summary, Order on WhatsApp); right panel cycles flavours with colour flood and cake spin, plus **Add to cart** (adds quietly, toast only).
11. **Footer** (fixed, revealed from under the page): big "Cake & Craft" wordmark with cherries, three columns (Homemade with love / Explore / Contact), bar with copyright and game score. The whole footer is a sweet-slicing game ("Slice activated" banner on first view; Freeze button on touch).

Site-wide: fixed header (round logo with no ring, `clamp(56px,5.2vw,88px)`, 52px on mobile; basket; MENU; pills invert over dark bands), full-screen menu dropping as a clip-path curtain, basket drawer, floating **"Order a cake"** pill (visible from the top of the page to the end; hides only while the menu or basket is open), pink cursor trail, cycling tab title.

## 6. Motion rules (keep these)

- Lenis smooth scroll runs on the GSAP ticker (`lerp 0.075`, `wheelMultiplier 0.8`), so scroll, ScrollTrigger and three.js share one clock.
- Story parts are **scrubbed** to scroll; UI reveals play **once**. Nothing takes control of scroll: the cut plays on its own without locking it. Keep scroll locks for the loader, menu and basket only.
- Headlines: SplitText characters rise from `yPercent 140` (0.85s, power3.out, 0.035s stagger) inside a line mask. Paragraphs: lines rise and fade (0.8s, power2.out, 0.08s stagger).
- Hover in fast (expo/power3 out, about 0.5s); hover out slower (0.7–0.9s). Enter staggers from the start, leave from the end.
- Product pop uses `back.out(1.6)`; idle sway uses `sine.inOut`.
- Every effect has a `prefers-reduced-motion` branch. Keep it.
- 3D renders only while its canvas is on screen; pixel ratio capped at 2 (hero) and 1.5 (cards).

## 7. Ordering flow (no backend)

- Two ways to order: the **basket** (cards "+" or Add to cart → basket → Place order → summary) and the **Box of joy form**.
- Both require **name** and **date** (tomorrow or later) before WhatsApp opens; cake message is optional (max 40 characters).
- Both use `waText()` so the message format is identical:
  ```
  Hi Cake & Craft! This is <name>. I would like to order:
  - 1 x Chocolate Drip, Medium Cake (2 lb): ৳1,300
  Message on the cake: <message or None>
  Needed on: Sat, 28 Nov 2026
  Subtotal / Delivery in Dhaka / Total
  ```
- Corporate (negotiable) items show "Negotiable"; totals read "৳X + quote" or "To discuss", and the message asks for size and price.
- The WhatsApp button is a plain `<a href="https://wa.me/...">` (works on phones and desktop). A "Copy order text instead" fallback sits under it.

## 8. How to work on this project

- Change data in `js/app.js` (`SIZES`, `FLAVS`, `WA`, `DELIVERY`), not in the markup.
- Keep new sections in the same voice: Khand uppercase headline, one short Inter paragraph, a Patrick Hand note or button, light/dark band alternation with scallop edges.
- Keep three.js at **r128** (later versions drop the global build) and GSAP at **3.13.0**.
- Test with a local static server (`python3 -m http.server`), at the five sizes in section 4, and check the browser console is clean.
- Do not add a backend, payments or accounts unless the owner asks.

## 9. Open items

- Confirm delivery fee (৳150), opening hours and Facebook link.
- Add real customer reviews when available.
- Medium Vanilla Cherry is ৳1,100 (owner approved 25 Nov 2026); confirm if it should follow the "minus ৳100" rule (৳1,200).
- Optional next pages in the same style: "Our story", a full cakes and flavours page.
