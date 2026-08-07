/* Schematische SVG-illustraties per koelkast.
 *
 * De tekeningen zijn op schaal: de verhouding breedte/hoogte van de kast in
 * de tekening komt overeen met de werkelijke buitenmaten uit data.js.
 * Er worden geen externe afbeeldingen geladen — alles is inline SVG.
 */

const VIEWS = [
  { id: 'front', label: 'Vooraanzicht' },
  { id: 'interior', label: 'Interieur' },
  { id: 'panel', label: 'Bediening' },
  { id: 'niche', label: 'Inbouwmaten' }
];

/* ---------- basisgeometrie ---------- */

const BODY_H = 400;   // hoogte van de kast in tekeneenheden
const BODY_Y = 26;

/* Breedte van de kast, op schaal t.o.v. de werkelijke buitenmaten. */
function bodyW(f) {
  return Math.round(BODY_H * (f.widthCm / f.heightCm));
}

function bodyBox(f, vbWidth, offsetX) {
  const w = bodyW(f);
  return { x: Math.round((vbWidth - w) / 2) + (offsetX || 0), y: BODY_Y, w: w, h: BODY_H };
}

function svgWrap(inner, w, h) {
  return '<svg class="fridge-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" ' +
    'xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' + inner + '</svg>';
}

function defs(f, key) {
  return '<defs>' +
    '<linearGradient id="door-' + key + '" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="var(--metal-1)"/>' +
      '<stop offset="0.40" stop-color="var(--metal-2)"/>' +
      '<stop offset="0.74" stop-color="var(--metal-1)"/>' +
      '<stop offset="1" stop-color="var(--metal-3)"/>' +
    '</linearGradient>' +
    '<linearGradient id="glass-' + key + '" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="' + f.accent + '" stop-opacity="0.28"/>' +
      '<stop offset="1" stop-color="' + f.accent + '" stop-opacity="0.09"/>' +
    '</linearGradient>' +
    '<linearGradient id="led-' + key + '" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#ffd977" stop-opacity="0"/>' +
      '<stop offset="0.5" stop-color="#ffd977" stop-opacity="1"/>' +
      '<stop offset="1" stop-color="#ffd977" stop-opacity="0"/>' +
    '</linearGradient>' +
  '</defs>';
}

/* Positie van de scheiding koel/vries, als fractie vanaf de bovenkant. */
function freezerSplit(f) {
  if (f.category !== 'combi') return null;
  return f.capacityFridge / (f.capacityFridge + f.capacityFreezer);
}

/* ---------- 1. Vooraanzicht ---------- */

const FRONT_W = 190, FRONT_H = 470;

function viewFront(f) {
  const b = bodyBox(f, FRONT_W);
  const k = f.id;
  const split = freezerSplit(f);
  let s = defs(f, k);

  s += '<ellipse cx="' + (b.x + b.w / 2) + '" cy="' + (b.y + b.h + 11) + '" rx="' +
       (b.w * 0.60) + '" ry="8" class="shadow"/>';
  s += '<rect x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h +
       '" rx="7" fill="url(#door-' + k + ')" class="body-stroke"/>';

  const coolBottom = split ? b.y + Math.round(b.h * split) : b.y + b.h;

  if (split) {
    s += '<line x1="' + b.x + '" y1="' + coolBottom + '" x2="' + (b.x + b.w) + '" y2="' +
         coolBottom + '" class="seam"/>';
    const dh = (b.y + b.h - coolBottom) / 3;
    for (let i = 0; i < 3; i++) {
      const y = coolBottom + dh * i;
      if (i > 0) {
        s += '<line x1="' + (b.x + 5) + '" y1="' + y + '" x2="' + (b.x + b.w - 5) + '" y2="' +
             y + '" class="seam-soft"/>';
      }
      s += '<rect x="' + (b.x + b.w / 2 - 15) + '" y="' + (y + dh / 2 - 2) +
           '" width="30" height="3.5" rx="1.75" class="handle-bar"/>';
    }
    s += '<text x="' + (b.x + b.w / 2) + '" y="' + (b.y + b.h - 6) +
         '" class="svg-micro" text-anchor="middle">vriesruimte</text>';
  }

  // greepgleuf van de koeldeur (rechterrand)
  s += '<rect x="' + (b.x + b.w - 12) + '" y="' + (b.y + 14) + '" width="5.5" height="' +
       (coolBottom - b.y - 28) + '" rx="2.75" class="handle-groove"/>';

  // merkplaatje
  s += '<rect x="' + (b.x + 11) + '" y="' + (b.y + 14) + '" width="' + (b.w - 32) +
       '" height="20" rx="4" fill="' + f.accent + '" fill-opacity="0.12"/>';
  s += '<text x="' + (b.x + 18) + '" y="' + (b.y + 28) + '" class="svg-brand" fill="' +
       f.accent + '">' + f.brand.toUpperCase() + '</text>';

  // reflectie
  s += '<rect x="' + (b.x + b.w * 0.15) + '" y="' + (b.y + 4) + '" width="' + (b.w * 0.055) +
       '" height="' + (b.h - 8) + '" rx="3" class="sheen"/>';

  s += caption(FRONT_W, FRONT_H, f.brand + ' ' + f.model + ' — deur dicht',
       f.heightLabel + ' × ' + fmtCm(f.widthCm) + ' × ' + fmtCm(f.depthCm));
  return svgWrap(s, FRONT_W, FRONT_H);
}

/* ---------- 2. Interieur ---------- */

function viewInterior(f) {
  const b = bodyBox(f, FRONT_W);
  const k = f.id;
  const split = freezerSplit(f);
  let s = defs(f, k);

  s += '<ellipse cx="' + (b.x + b.w / 2) + '" cy="' + (b.y + b.h + 11) + '" rx="' +
       (b.w * 0.60) + '" ry="8" class="shadow"/>';
  s += '<rect x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h +
       '" rx="7" class="cabinet-shell"/>';

  const li = { x: b.x + 6, y: b.y + 6, w: b.w - 12, h: b.h - 12 };
  s += '<rect x="' + li.x + '" y="' + li.y + '" width="' + li.w + '" height="' + li.h +
       '" rx="4" class="liner"/>';

  // LED-strip bovenin
  s += '<rect x="' + (li.x + 8) + '" y="' + (li.y + 6) + '" width="' + (li.w - 16) +
       '" height="3.5" rx="1.75" fill="url(#led-' + k + ')"/>';
  s += '<text x="' + (li.x + li.w / 2) + '" y="' + (li.y + 19) +
       '" class="svg-micro" text-anchor="middle">LED-verlichting</text>';

  const coolBottom = split ? b.y + b.h * split : b.y + b.h - 6;
  const shelfTop = li.y + 26;

  if (f.id === 'liebherr-irbsd-5120') {
    const zoneH = 116;
    const zoneTop = coolBottom - zoneH;
    s += shelves(4, shelfTop, zoneTop - 14, li, k);
    s += '<rect x="' + (li.x + 2) + '" y="' + zoneTop + '" width="' + (li.w - 4) +
         '" height="' + zoneH + '" rx="4" fill="' + f.accent + '" fill-opacity="0.09"/>';
    for (let i = 0; i < 3; i++) {
      const dy = zoneTop + 7 + i * 35;
      s += '<rect x="' + (li.x + 7) + '" y="' + dy + '" width="' + (li.w - 14) +
           '" height="29" rx="3" fill="url(#glass-' + k + ')" class="drawer"/>';
      s += '<line x1="' + (li.x + 2) + '" y1="' + (dy + 14.5) + '" x2="' + (li.x + 7) +
           '" y2="' + (dy + 14.5) + '" class="rail"/>';
      s += '<line x1="' + (li.x + li.w - 7) + '" y1="' + (dy + 14.5) + '" x2="' +
           (li.x + li.w - 2) + '" y2="' + (dy + 14.5) + '" class="rail"/>';
    }
    s += zoneLabel(li, zoneTop - 5, 'BioFresh 0°C', f.accent);
  } else {
    const drawerH = 30;
    const zoneTop = coolBottom - (2 * drawerH + 8);
    s += shelves(split ? 3 : 5, shelfTop, zoneTop - 14, li, k);
    for (let i = 0; i < 2; i++) {
      s += '<rect x="' + (li.x + 7) + '" y="' + (zoneTop + 6 + i * drawerH) + '" width="' +
           (li.w - 14) + '" height="' + (drawerH - 5) + '" rx="3" fill="url(#glass-' + k +
           ')" class="drawer"/>';
    }
    const label = f.id === 'aeg-nsc7c191ds' ? 'ExtraChill'
                : f.id === 'bosch-kir81nse0' ? 'MultiBox-lades'
                : f.id === 'aeg-tk6fs181ds' ? 'CustomFlex®'
                : 'vershoudlades';
    s += zoneLabel(li, zoneTop - 4, label, f.accent);
  }

  if (split) {
    s += '<line x1="' + li.x + '" y1="' + coolBottom + '" x2="' + (li.x + li.w) + '" y2="' +
         coolBottom + '" class="seam"/>';
    const fzTop = coolBottom + 16;
    const fzH = (b.y + b.h - 12) - fzTop;
    const dh = fzH / 3;
    for (let i = 0; i < 3; i++) {
      s += '<rect x="' + (li.x + 7) + '" y="' + (fzTop + i * dh + 2) + '" width="' +
           (li.w - 14) + '" height="' + (dh - 5) + '" rx="3" class="freezer-drawer"/>';
    }
    s += '<text x="' + (li.x + li.w / 2) + '" y="' + (coolBottom + 12) +
         '" class="svg-micro" text-anchor="middle">' +
         (f.id === 'aeg-nsc6m191es' ? 'TwinTech® No Frost' : 'NoFrost') + '</text>';
  }

  s += caption(FRONT_W, FRONT_H, 'Interieur — indeling schematisch', f.capacity);
  return svgWrap(s, FRONT_W, FRONT_H);
}

/* Plateaus met zijsteunen, zodat ze als legplank leesbaar zijn. */
function shelves(n, top, bottom, li, k) {
  let out = '';
  const gap = (bottom - top) / n;
  for (let i = 0; i < n; i++) {
    const y = top + gap * i;
    out += '<rect x="' + (li.x + 5) + '" y="' + y + '" width="' + (li.w - 10) +
      '" height="4" rx="2" fill="url(#glass-' + k + ')" class="shelf"/>';
    out += '<line x1="' + (li.x + 2) + '" y1="' + (y + 2) + '" x2="' + (li.x + 5) + '" y2="' +
      (y + 2) + '" class="rail"/>';
    out += '<line x1="' + (li.x + li.w - 5) + '" y1="' + (y + 2) + '" x2="' + (li.x + li.w - 2) +
      '" y2="' + (y + 2) + '" class="rail"/>';
  }
  return out;
}

function zoneLabel(li, y, text, color) {
  return '<text x="' + (li.x + li.w / 2) + '" y="' + y +
    '" class="svg-micro" text-anchor="middle" fill="' + color + '">' + esc(text) + '</text>';
}

/* ---------- 3. Bedieningspaneel ---------- */

const PANEL_W = 260, PANEL_H = 250;

function viewPanel(f) {
  const k = f.id;
  let s = defs(f, k);
  const px = 20, py = 26, pw = PANEL_W - 40, ph = 158;

  s += '<rect x="' + px + '" y="' + py + '" width="' + pw + '" height="' + ph +
       '" rx="12" class="panel-shell"/>';
  s += '<rect x="' + (px + 14) + '" y="' + (py + 16) + '" width="' + (pw - 28) +
       '" height="54" rx="7" class="panel-display"/>';

  const tempLabel = f.category === 'combi' ? '4°C    -18°C' : '4°C';
  s += '<text x="' + (px + pw / 2) + '" y="' + (py + 51) +
       '" class="svg-display" text-anchor="middle" fill="' + f.accent + '">' +
       tempLabel + '</text>';

  const btns = f.category === 'combi'
    ? ['FrostMatic', (f.id === 'aeg-nsc7c191ds' ? 'CoolAssist' : 'TwinTech'), 'Alarm']
    : f.brand === 'Liebherr' ? ['SuperCool', 'BioFresh', 'Alarm']
    : f.brand === 'AEG' ? ['SuperCool', 'CustomFlex', 'Alarm']
    : ['superCooling', 'Vers', 'Alarm'];

  const bw = (pw - 28 - 16) / 3;
  btns.forEach(function (label, i) {
    const bx = px + 14 + i * (bw + 8);
    s += '<rect x="' + bx + '" y="' + (py + 82) + '" width="' + bw +
         '" height="40" rx="7" class="panel-btn"/>';
    s += '<circle cx="' + (bx + bw / 2) + '" cy="' + (py + 95) + '" r="3.2" fill="' + f.accent +
         '" fill-opacity="' + (i === 0 ? '1' : '0.25') + '"/>';
    s += '<text x="' + (bx + bw / 2) + '" y="' + (py + 113) +
         '" class="svg-micro" text-anchor="middle">' + label + '</text>';
  });

  s += '<text x="' + (px + pw / 2) + '" y="' + (py + ph - 12) +
       '" class="svg-micro" text-anchor="middle">' + esc(displayKind(f)) + '</text>';

  s += caption(PANEL_W, PANEL_H, 'Bediening', f.brand + ' ' + f.model);
  return svgWrap(s, PANEL_W, PANEL_H);
}

function displayKind(f) {
  if (f.brand === 'Liebherr') return 'Monochroom LCD · touch-bediening';
  if (f.id === 'aeg-nsc6m191es') return 'LCD-display';
  if (f.brand === 'AEG') return 'Elektronische TouchControl';
  return 'Elektronisch · led-indicatie';
}

/* ---------- 4. Inbouwmaten ---------- */

const NICHE_W = 300, NICHE_H = 545;

function viewNiche(f) {
  const b = bodyBox(f, NICHE_W, 34);
  let s = defs(f, f.id);
  const nx = b.x - 13, nw = b.w + 26;

  s += '<rect x="' + nx + '" y="' + (b.y - 11) + '" width="' + nw + '" height="' + (b.h + 22) +
       '" rx="4" class="niche"/>';
  s += '<rect x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h +
       '" rx="6" class="cabinet-shell"/>';
  s += '<text x="' + (b.x + b.w / 2) + '" y="' + (b.y + b.h / 2 - 4) +
       '" class="svg-micro" text-anchor="middle">' + f.model + '</text>';
  s += '<text x="' + (b.x + b.w / 2) + '" y="' + (b.y + b.h / 2 + 10) +
       '" class="svg-micro" text-anchor="middle">' + f.capacityFridge +
       (f.capacityFreezer ? '+' + f.capacityFreezer : '') + ' l</text>';

  // maatlijnen links: apparaathoogte en nishoogte
  s += dimV(nx - 20, b.y, b.y + b.h, 'apparaat ' + f.heightLabel);
  s += dimV(nx - 48, b.y - 11, b.y + b.h + 11, f.nicheLabel);
  // breedte onderaan
  s += dimH(b.x, b.x + b.w, b.y + b.h + 32, fmtCm(f.widthCm) + ' breed');
  // diepte
  s += '<text x="' + (b.x + b.w / 2) + '" y="' + (b.y + b.h + 70) +
       '" class="svg-micro" text-anchor="middle">diepte ' + fmtCm(f.depthCm) + '</text>';

  s += caption(NICHE_W, NICHE_H, 'Inbouwmaten in de kolomkast', f.mounting + 'systeem');
  return svgWrap(s, NICHE_W, NICHE_H);
}

function dimV(x, y1, y2, label) {
  const mid = (y1 + y2) / 2;
  return '<line x1="' + x + '" y1="' + y1 + '" x2="' + x + '" y2="' + y2 + '" class="dim"/>' +
    '<line x1="' + (x - 4) + '" y1="' + y1 + '" x2="' + (x + 4) + '" y2="' + y1 + '" class="dim"/>' +
    '<line x1="' + (x - 4) + '" y1="' + y2 + '" x2="' + (x + 4) + '" y2="' + y2 + '" class="dim"/>' +
    '<text x="' + (x - 5) + '" y="' + mid + '" class="svg-micro" text-anchor="middle" ' +
    'transform="rotate(-90 ' + (x - 5) + ' ' + mid + ')">' + esc(label) + '</text>';
}

function dimH(x1, x2, y, label) {
  return '<line x1="' + x1 + '" y1="' + y + '" x2="' + x2 + '" y2="' + y + '" class="dim"/>' +
    '<line x1="' + x1 + '" y1="' + (y - 4) + '" x2="' + x1 + '" y2="' + (y + 4) + '" class="dim"/>' +
    '<line x1="' + x2 + '" y1="' + (y - 4) + '" x2="' + x2 + '" y2="' + (y + 4) + '" class="dim"/>' +
    '<text x="' + ((x1 + x2) / 2) + '" y="' + (y + 15) + '" class="svg-micro" text-anchor="middle">' +
    esc(label) + '</text>';
}

/* ---------- gedeeld ---------- */

function caption(w, h, title, sub) {
  return '<text x="' + w / 2 + '" y="' + (h - 18) + '" class="svg-cap" text-anchor="middle">' +
    esc(title) + '</text>' +
    '<text x="' + w / 2 + '" y="' + (h - 5) + '" class="svg-micro" text-anchor="middle">' +
    esc(sub) + '</text>';
}

function fmtCm(v) {
  return String(v).replace('.', ',') + ' cm';
}

function esc(str) {
  return String(str).replace(/[&<>]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
  });
}

function renderView(fridge, viewId) {
  switch (viewId) {
    case 'interior': return viewInterior(fridge);
    case 'panel': return viewPanel(fridge);
    case 'niche': return viewNiche(fridge);
    default: return viewFront(fridge);
  }
}
