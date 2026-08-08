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

/* Modellen waarvan de indeling is natekend van de officiële productfoto's
 * krijgen een extra aanzicht 'deur open'. Zie PHOTO_REFERENCE onderaan. */
const EXTRA_VIEWS = {
  'siemens-ki81rnse0': [{ id: 'open', label: 'Deur open', after: 'front' }]
};

/* Is de indeling van dit model van de productfoto's overgenomen? */
function hasPhotoLayout(f) {
  return Boolean(PHOTO_LAYOUT[f.id]);
}

/* Aanzichtenlijst voor één model: de basisreeks plus eventuele extra's. */
function viewsFor(f) {
  const extra = EXTRA_VIEWS[f.id];
  if (!extra) return VIEWS;
  const out = VIEWS.slice();
  extra.forEach(function (v) {
    const at = out.map(function (x) { return x.id; }).indexOf(v.after);
    out.splice(at < 0 ? out.length : at + 1, 0, { id: v.id, label: v.label });
  });
  return out;
}

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

  if (PHOTO_LAYOUT[f.id]) {
    s += photoLiner(f, li, k, coolBottom);
    s += caption(FRONT_W, FRONT_H, 'Interieur — natekend van de productfoto’s', f.capacity);
    return svgWrap(s, FRONT_W, FRONT_H);
  }

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

/* Plateaus met zijsteunen, zodat ze als legplank leesbaar zijn.
   Met inclusive=true ligt het laatste plateau precies op `bottom`. */
function shelves(n, top, bottom, li, k, inclusive) {
  let out = '';
  const gap = (bottom - top) / (inclusive ? n - 1 : n);
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

/* ---------- 2b. Indeling natekend van de productfoto's ----------
 *
 * Voor modellen waarvan officiële productfoto's beschikbaar waren is de
 * indeling niet uit de specificatietabel afgeleid maar van de foto's
 * overgenomen: het aantal plateaus, de plaats van het ventilatiepaneel, de
 * twee vershoudlades met pictogramstrook, en de deurvakken met hun
 * onderlinge diepteverschillen. Zie PHOTO_REFERENCE onderaan dit bestand.
 */
const PHOTO_LAYOUT = {
  'siemens-ki81rnse0': {
    shelves: 6,          // 6 plateaus veiligheidsglas, bovenste vast
    drawers: 2,          // 2 vershoudlades met 'Fresh'-opdruk
    powerVent: 'PowerVentilation',
    drawerLabel: 'Fresh',
    drawerIcons: 'fruit & vegetables',
    tempSteps: ['2°C', '3°C', '4°C', '6°C', '8°C'],
    tempActive: 2,       // fabrieksinstelling 4 °C
    // top = positie vanaf de bovenkant van de deur, inset = hoe ver het vak
    // uitsteekt; de vakken worden naar onderen toe dieper.
    doorBins: [
      { top: 0.05, h: 26, inset: 30, label: '' },
      { top: 0.18, h: 26, inset: 22, label: '' },
      { top: 0.31, h: 26, inset: 14, label: 'potjes' },
      { top: 0.46, h: 34, inset: 6, label: 'sauzen' },
      { top: 0.68, h: 86, inset: 0, label: 'flessenvak', brand: true }
    ]
  }
};

/* Binnenkant zoals op de foto's: bedieningsstrook, ventilatiepaneel,
   merknaam op de achterwand, plateaus en twee vershoudlades. */
function photoLiner(f, li, k, bottom) {
  const L = PHOTO_LAYOUT[f.id];
  let s = '';

  // bedieningsstrook aan de bovenkant, net onder de deurrand
  const stripY = li.y + 24;
  s += '<rect x="' + (li.x + 4) + '" y="' + stripY + '" width="' + (li.w - 8) +
       '" height="9" rx="4.5" class="panel-display"/>';
  s += tempTicks(li.x + 10, stripY + 4.5, li.w - 20, L, f.accent);

  // ventilatiepaneel op de achterwand
  const pvY = stripY + 16;
  const pvW = Math.min(84, li.w - 18);
  s += '<rect x="' + (li.x + (li.w - pvW) / 2) + '" y="' + pvY + '" width="' + pvW +
       '" height="14" rx="3" class="vent-panel"/>';
  s += '<text x="' + (li.x + li.w / 2) + '" y="' + (pvY + 9.5) +
       '" class="svg-nano" text-anchor="middle">' + esc(L.powerVent) + '</text>';

  // plateaus en lades
  const drawerH = 34;
  const drawerTop = bottom - (L.drawers * drawerH + 6);
  const shelfTop = pvY + 24, shelfBottom = drawerTop - 12;
  s += shelves(L.shelves, shelfTop, shelfBottom, li, k, true);

  // merknaam op de achterwand, tussen het tweede en derde plateau
  const gap = (shelfBottom - shelfTop) / (L.shelves - 1);
  s += '<text x="' + (li.x + li.w / 2) + '" y="' + (shelfTop + gap * 2 - 7) +
       '" class="svg-wordmark" text-anchor="middle">' + f.brand.toUpperCase() + '</text>';

  for (let i = 0; i < L.drawers; i++) {
    const dy = drawerTop + 6 + i * drawerH;
    s += '<rect x="' + (li.x + 6) + '" y="' + dy + '" width="' + (li.w - 12) +
         '" height="' + (drawerH - 6) + '" rx="3" fill="url(#glass-' + k +
         ')" class="drawer"/>';
    // pictogramstrook rechtsonder in de lade, zoals op de foto
    for (let p = 0; p < 4; p++) {
      s += '<rect x="' + (li.x + li.w - 40 + p * 8) + '" y="' + (dy + 5) +
           '" width="6" height="6" rx="1.5" fill="' + f.accent + '" fill-opacity="0.55"/>';
    }
    s += '<text x="' + (li.x + 11) + '" y="' + (dy + drawerH - 11) +
         '" class="svg-fresh" fill="' + f.accent + '">' + esc(L.drawerLabel) + '</text>';
  }
  s += '<text x="' + (li.x + li.w - 8) + '" y="' + (drawerTop + 2) +
       '" class="svg-nano" text-anchor="end" fill="' + f.accent + '">' +
       esc(L.drawerIcons) + '</text>';
  return s;
}

/* De temperatuurstrook in het klein: 'super', de vijf standen als
   markeringen en de aan/uit-toets. De graden zelf staan in het
   bedieningsaanzicht, hier is er geen ruimte voor. */
function tempTicks(x, cy, w, L, accent) {
  let s = '<text x="' + x + '" y="' + (cy + 2.6) + '" class="svg-nano">super</text>';
  const first = x + 31, last = x + w - 20;
  const step = (last - first) / (L.tempSteps.length - 1);
  L.tempSteps.forEach(function (label, i) {
    const tx = first + step * i;
    const on = i === L.tempActive;
    s += '<rect x="' + (tx - 3) + '" y="' + (cy - 3) + '" width="6" height="6" rx="1.5" fill="' +
         (on ? accent : 'currentColor') + '" fill-opacity="' + (on ? '1' : '0.22') + '"/>';
  });
  s += powerGlyph(x + w - 6, cy, accent);
  return s;
}

/* Verticaal streepje tussen twee groepen opschriften, zoals op het paneel. */
function divider(x, y1, y2) {
  return '<line x1="' + x + '" y1="' + y1 + '" x2="' + x + '" y2="' + y2 + '" class="seam-soft"/>';
}

function powerGlyph(cx, cy, accent) {
  return '<circle cx="' + cx + '" cy="' + cy + '" r="3.6" fill="none" stroke="' + accent +
    '" stroke-width="1.1" stroke-opacity="0.75"/>' +
    '<line x1="' + cx + '" y1="' + (cy - 4.6) + '" x2="' + cx + '" y2="' + (cy - 0.8) +
    '" stroke="' + accent + '" stroke-width="1.1" stroke-opacity="0.75"/>';
}

/* ---------- 2c. Deur open ---------- */

const OPEN_W = 300, OPEN_H = 470;

function viewOpen(f) {
  const L = PHOTO_LAYOUT[f.id];
  const b = bodyBox(f, OPEN_W, -70);
  const k = f.id;
  let s = defs(f, k);

  s += '<ellipse cx="' + (b.x + b.w / 2) + '" cy="' + (b.y + b.h + 11) + '" rx="' +
       (b.w * 0.60) + '" ry="8" class="shadow"/>';
  s += '<rect x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h +
       '" rx="7" class="cabinet-shell"/>';

  const li = { x: b.x + 6, y: b.y + 6, w: b.w - 12, h: b.h - 12 };
  s += '<rect x="' + li.x + '" y="' + li.y + '" width="' + li.w + '" height="' + li.h +
       '" rx="4" class="liner"/>';
  s += '<rect x="' + (li.x + 8) + '" y="' + (li.y + 6) + '" width="' + (li.w - 16) +
       '" height="3.5" rx="1.75" fill="url(#led-' + k + ')"/>';
  s += photoLiner(f, li, k, li.y + li.h);

  // opengezwaaide deur: dunne deurbladen met de vakken ervoor
  const dx = b.x + b.w + 8;
  s += '<rect x="' + dx + '" y="' + b.y + '" width="9" height="' + b.h +
       '" rx="3" fill="url(#door-' + k + ')" class="body-stroke"/>';
  s += '<rect x="' + (dx + 9) + '" y="' + (b.y + 3) + '" width="4" height="' + (b.h - 6) +
       '" rx="2" class="door-liner"/>';

  const bx = dx + 13, bwMax = OPEN_W - bx - 22;
  L.doorBins.forEach(function (bin) {
    const y = b.y + b.h * bin.top;
    const bw = bwMax - bin.inset;
    s += '<rect x="' + bx + '" y="' + y + '" width="' + bw + '" height="' + bin.h +
         '" rx="3" fill="url(#glass-' + k + ')" class="door-bin"/>';
    // bovenrand van het vak, zodat het als bak leesbaar blijft
    s += '<line x1="' + (bx + 1) + '" y1="' + (y + 4) + '" x2="' + (bx + bw - 1) + '" y2="' +
         (y + 4) + '" class="seam-soft"/>';
    if (bin.brand) {
      s += '<text x="' + (bx + 9) + '" y="' + (y + bin.h - 9) + '" class="svg-wordmark" fill="' +
           f.accent + '">' + f.brand.toUpperCase() + '</text>';
    }
    if (bin.label) {
      s += '<text x="' + (bx + bw - 6) + '" y="' + (y + bin.h - 6) +
           '" class="svg-nano" text-anchor="end">' + esc(bin.label) + '</text>';
    }
  });

  s += '<text x="' + (bx + bwMax / 2) + '" y="' + (b.y - 8) +
       '" class="svg-micro" text-anchor="middle">' + L.doorBins.length + ' deurvakken</text>';
  s += '<text x="' + (b.x + b.w / 2) + '" y="' + (b.y - 8) +
       '" class="svg-micro" text-anchor="middle">scharnier rechts</text>';

  s += caption(OPEN_W, OPEN_H, 'Deur open — indeling van de foto’s',
       L.shelves + ' plateaus · ' + L.drawers + ' vershoudlades · ' +
       L.doorBins.length + ' deurvakken');
  return svgWrap(s, OPEN_W, OPEN_H);
}

/* ---------- 3. Bedieningspaneel ---------- */

const PANEL_W = 260, PANEL_H = 250;

function viewPanel(f) {
  if (PHOTO_LAYOUT[f.id]) return viewPanelStrip(f);
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

/* Bediening zoals op de foto: één slanke touch-strook aan de bovenrand, met
   de temperatuurstappen als vaste markeringen — geen cijferdisplay. */
const STRIP_W = 320, STRIP_H = 250;

function viewPanelStrip(f) {
  const L = PHOTO_LAYOUT[f.id];
  const k = f.id;
  let s = defs(f, k);
  const px = 18, py = 30, pw = STRIP_W - 36;

  // de strook zelf
  s += '<rect x="' + px + '" y="' + py + '" width="' + pw + '" height="44" rx="6" ' +
       'class="panel-shell"/>';

  // opschriften op één rij: super | > | 2 … 8 °C | aan/uit 3 sec.
  const first = px + 78, last = px + pw - 72;
  const step = (last - first) / (L.tempSteps.length - 1);

  s += '<text x="' + (px + 14) + '" y="' + (py + 19) + '" class="svg-micro">super</text>';
  s += '<text x="' + (px + 56) + '" y="' + (py + 19) + '" class="svg-micro">&gt;</text>';
  s += divider(px + 48, py + 9, py + 23);
  s += divider(px + 66, py + 9, py + 23);
  L.tempSteps.forEach(function (label, i) {
    s += '<text x="' + (first + step * i) + '" y="' + (py + 19) +
         '" class="svg-micro" text-anchor="middle">' + label + '</text>';
  });
  s += divider(px + pw - 60, py + 9, py + 23);
  s += powerGlyph(px + pw - 50, py + 15, f.accent);
  s += '<text x="' + (px + pw - 14) + '" y="' + (py + 19) +
       '" class="svg-micro" text-anchor="end">3 sec.</text>';

  // segmentbalk: de scheidingen staan tussen de standen, de ingestelde
  // stand licht op
  const barY = py + 28, barX = px + 12, barW = pw - 24;
  s += '<rect x="' + barX + '" y="' + barY + '" width="' + barW + '" height="6" rx="3" ' +
       'class="panel-display"/>';
  for (let i = 0; i < L.tempSteps.length - 1; i++) {
    const sx = first + step * (i + 0.5);
    s += '<line x1="' + sx + '" y1="' + barY + '" x2="' + sx + '" y2="' + (barY + 6) +
         '" class="seam-soft"/>';
  }
  s += '<line x1="' + (first - step / 2) + '" y1="' + barY + '" x2="' + (first - step / 2) +
       '" y2="' + (barY + 6) + '" class="seam-soft"/>';
  const activeX = first + step * L.tempActive;
  s += '<rect x="' + (activeX - 7) + '" y="' + (barY + 0.6) + '" width="14" height="4.8" rx="2.4" ' +
       'fill="' + f.accent + '"/>';

  // de bovenkant van de koelruimte eronder, met het ventilatiepaneel
  const cy = py + 60, cw = pw, ch = 92;
  s += '<rect x="' + px + '" y="' + cy + '" width="' + cw + '" height="' + ch +
       '" rx="6" class="liner"/>';
  s += '<rect x="' + (px + 10) + '" y="' + (cy + 8) + '" width="' + (cw - 20) +
       '" height="3.5" rx="1.75" fill="url(#led-' + k + ')"/>';
  const pvW = 108;
  s += '<rect x="' + (px + (cw - pvW) / 2) + '" y="' + (cy + 26) + '" width="' + pvW +
       '" height="18" rx="3" class="vent-panel"/>';
  s += '<text x="' + (px + cw / 2) + '" y="' + (cy + 38) +
       '" class="svg-micro" text-anchor="middle">' + esc(L.powerVent) + '</text>';
  s += '<rect x="' + (px + 8) + '" y="' + (cy + ch - 16) + '" width="' + (cw - 16) +
       '" height="4" rx="2" fill="url(#glass-' + k + ')" class="shelf"/>';

  s += '<text x="' + (STRIP_W / 2) + '" y="' + (cy + ch + 16) +
       '" class="svg-micro" text-anchor="middle">instelbereik ' + L.tempSteps[0] + '–' +
       L.tempSteps[L.tempSteps.length - 1] + ' · uit met 3 sec. indrukken</text>';

  s += caption(STRIP_W, STRIP_H, 'Bediening — natekend van de foto',
       'Elektronisch · led-indicatie, geen display');
  return svgWrap(s, STRIP_W, STRIP_H);
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
    case 'open': return viewOpen(fridge);
    case 'panel': return viewPanel(fridge);
    case 'niche': return viewNiche(fridge);
    default: return viewFront(fridge);
  }
}

/* Herkomst van de indeling in PHOTO_LAYOUT.
 *
 * De officiële productfoto's van de Siemens KI81RNSE0 (interieur, deur open,
 * detail bedieningsstrook, ledverlichting) zijn niet als bestand op te nemen:
 * het uitgaande netwerk blokkeert bsh-group.com en bosch-home.com. De
 * afbeeldingen zijn daarom nagetekend. Uit de foto's overgenomen:
 *
 *  - 6 plateaus van veiligheidsglas boven twee vershoudlades met 'Fresh'-
 *    opdruk en een pictogramstrook 'fruit & vegetables';
 *  - PowerVentilation-paneel midden op de achterwand, direct onder de
 *    bedieningsstrook;
 *  - bedieningsstrook: super · > · 2 / 3 / 4 / 6 / 8 °C · uit na 3 sec.
 *    indrukken — vaste markeringen, geen cijferdisplay;
 *  - 5 deurvakken, oplopend in diepte, onderste is het flessenvak met
 *    Siemens-opdruk; deurscharnier rechts.
 *
 * Wie de echte foto's wil toevoegen: zie het kopje 'Afbeeldingen' in
 * README.md — zet ze in assets/photos/ en vul de photos-array in data.js.
 */
