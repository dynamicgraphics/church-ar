# Church AR Wayfinder

A tiny, self-contained augmented-reality wayfinding system. A visitor opens a link
in their phone's browser, points the camera at a printed marker, and a floating 3D
arrow shows which way to go. **No app install.** Nothing to maintain server-side.

## The pieces

| Page | Who uses it | What it does |
|------|-------------|--------------|
| `index.html`  | everyone | Simple menu linking to the three pages below |
| `viewer.html` | visitors | The AR camera experience |
| `editor.html` | staff    | Assign a destination + arrow direction to each marker. **Single self-contained file** — open it anywhere, even offline |
| `markers.html`| staff    | Printable sheets: each marker paired with a **QR code** + an entrance poster |

A marker is one of 64 printable black-and-white squares (numbered **0–63**). You stick
marker `3` where you want an arrow to "Fellowship Hall," then in the editor you create a
sign that says *marker 3 → "Fellowship Hall", pointing left*. Done.

## How to set it up (staff)

1. Open **Edit the Signs**. Type your church name.
2. For each spot you want an arrow:
   - Add a sign, pick a **marker number**, type the **destination**, choose a **direction** and color.
3. Open **Print the Markers**, print them at **100% scale**, and mount each one flat where
   its arrow belongs (eye level on a wall works well).
4. Give visitors the link to `viewer.html` (a QR code at the entrance is ideal).

Your work is saved automatically in the browser. To move a setup to another device or make
it permanent, use **Download config** / **Load config**, or **Copy share link** (the entire
setup is encoded in the link).

## How a visitor uses it (seamless — no link to type)

Every printed marker card includes a **QR code**. A visitor just opens their phone's normal
camera, points it at the card, and taps the link that pops up — the AR viewer opens straight
to that destination ("Directions to Restrooms"). Then they point the same camera at the black
square on the card and the 3D arrow appears. There's also a big **"Start here" entrance poster**
QR for the front door.

So the flow is: **camera sees QR → viewer opens → camera sees marker → arrow points the way.**
No app, no typing a web address.

> The QR codes need your **hosted viewer address** to work on visitors' phones — set it in the
> editor (see below). The whole sign setup is baked into the QR, so once your files are hosted,
> the codes work immediately with no extra upload.

### Even more seamless: NFC tags (optional)
If you want tap-to-open with no QR at all, buy cheap NFC stickers (NTAG213) and write your
viewer URL (e.g. `https://yourchurch.up.railway.app/viewer.html?go=3`) to each with a free
phone app like "NFC Tools." A visitor taps their phone to the sticker and the viewer opens.
Works great on modern iPhones and Android.

## The staff editor is standalone

`editor.html` has everything bundled inside it (no separate files, no server needed). Staff can
keep a copy on a desktop or a USB stick, open it by double-clicking, and edit the signs however
they like. When they're done they either **Copy share link**, **Download config**, or just have
the viewer address set so the printed QR codes stay current. One required field in the editor —
**Hosted viewer address** — is what makes the QR codes open on visitors' phones.

## Direction note

The arrow angle is **relative to the top of the printed marker**. If an arrow points the wrong
way in real life, just nudge the angle slider in the editor — it updates instantly. (Tip: keep
all markers printed "upright" and the directions stay consistent.)

## Hosting (the only technical bit)

Phone cameras only work over **https://** (or `localhost`). Any static host works — just upload
these files:

- **Railway / Render / Fly** — drop the folder in, serve as static files.
- **Netlify / Cloudflare Pages / GitHub Pages** — drag-and-drop or push; free HTTPS.
- **Local test on your own phone** — run a local server and use your computer's LAN IP, but
  note iOS requires HTTPS, so a real host is easiest.

### Optional: a fixed install
If you want one permanent setup that everyone sees (instead of per-browser editing), export
**config.json** from the editor and place it next to these files on your host. The viewer and
markers page load it automatically.

## What it's built on
- [A-Frame](https://aframe.io) 1.5 + [AR.js](https://github.com/AR-js-org/AR.js) 3.4 (loaded from CDN)
- Marker images from the [artoolkit-barcode-markers-collection](https://github.com/nicolocarpignoli/artoolkit-barcode-markers-collection) (3×3 matrix set)

No build step, no dependencies to install — just static HTML/JS.
