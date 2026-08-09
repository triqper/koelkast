/* Koelkast-keuzehulp — rendering en interactie */

(function () {
  'use strict';

  const sections = document.getElementById('sections');
  const tableBody = document.querySelector('#compare-table tbody');
  const modal = document.getElementById('modal');
  const stage = document.getElementById('stage');
  const thumbs = document.getElementById('thumbs');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  /* De pagina toont alles, opgedeeld in secties in deze volgorde. */
  const SECTIONS = [
    {
      group: 'koelkast',
      title: 'Volledig koelkast',
      blurb: 'Geen vriesvak — de hele kast is koelruimte.'
    },
    {
      group: 'combi-hoog',
      title: 'Koelvries combi — hoog',
      blurb: 'Nis 189,4 cm. Past alleen als de plank boven de kast wordt ' +
             'verwijderd en opnieuw geplaatst (meerprijs € 50 in de offerte).'
    },
    {
      group: 'combi-nis178',
      title: 'Koelvries combi — huidige maat',
      blurb: 'Nis 178 cm, dus direct te plaatsen in de bestaande opening.'
    }
  ];

  let activeSort = 'default';

  /* Notities per model, bewaard in de browser van de bezoeker. Staat
     localStorage niet toe (privémodus, file://), dan werkt alles nog, maar
     is het na het sluiten van het tabblad weg. */
  const NOTES_KEY = 'koelkast-notities-v1';

  const AUTHORS = { robbin: 'Robbin', anne: 'Anne' };

  function authorLabel(key) {
    return AUTHORS[key] || key;
  }

  /* Oude notities waren platte tekst-strings zonder auteur. Alles wat al
     bestond is van Robbin — dat migreren we bij het inladen naar het nieuwe
     { text, author }-formaat. */
  function loadNotes() {
    let raw;
    try {
      raw = JSON.parse(localStorage.getItem(NOTES_KEY)) || {};
    } catch (e) {
      return {};
    }
    Object.keys(raw).forEach(function (id) {
      ['pro', 'con'].forEach(function (kind) {
        raw[id][kind] = (raw[id][kind] || []).map(function (n) {
          return typeof n === 'string' ? { text: n, author: 'robbin' } : n;
        });
      });
    });
    return raw;
  }

  function saveNotes() {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(NOTES));
    } catch (e) {
      /* vol of geblokkeerd: de notities blijven in deze sessie staan */
    }
  }

  const NOTES = loadNotes();

  /* Wie de notitielijst nu ziet ('robbin', 'anne' of 'all' voor beiden) en
     wie als auteur geldt zodra je zelf een notitie toevoegt. Op 'all' staan
     blijft de laatst gekozen persoon de auteur — je kunt niet 'als beiden'
     iets toevoegen. */
  let authorFilter = 'all';
  let currentAuthor = 'robbin';

  /* Favorieten, per model, bewaard in de browser van de bezoeker — zelfde
     opzet als de notities. */
  const FAV_KEY = 'koelkast-favorieten-v1';

  function loadFavorites() {
    try {
      return JSON.parse(localStorage.getItem(FAV_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveFavorites() {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(FAVORITES));
    } catch (e) {
      /* vol of geblokkeerd: favorieten blijven in deze sessie staan */
    }
  }

  const FAVORITES = loadFavorites();
  let lastFocused = null;
  let lightboxOrigin = null;
  let currentFridge = null;
  let currentView = 'front';

  /* ---------- helpers ---------- */

  const euro = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  });

  function best(key, lowerIsBetter) {
    const values = FRIDGES.map(function (f) { return f[key]; });
    return lowerIsBetter ? Math.min.apply(null, values) : Math.max.apply(null, values);
  }

  const BEST = {
    price: best('price', true),
    noiseDb: best('noiseDb', true),
    energyKwh: best('energyKwh', true),
    heightCm: best('heightCm', true)
  };

  function energyPill(letter) {
    return '<span class="energy-pill" style="background:' + ENERGY_COLORS[letter] + '">' +
      letter + '</span>';
  }

  /* Alleen op specificaties, niet op prijs: de indicatieprijzen zijn niet
     vergelijkbaar met de offerteprijzen. */
  function badgeFor(f) {
    if (f.noiseDb === BEST.noiseDb) return 'Stilst';
    if (f.energyKwh === BEST.energyKwh) return 'Zuinigst';
    return null;
  }

  function sorted(list) {
    const cmp = {
      price: function (a, b) { return a.price - b.price; },
      noise: function (a, b) { return a.noiseDb - b.noiseDb; },
      energy: function (a, b) { return a.energyKwh - b.energyKwh; },
      height: function (a, b) { return a.heightCm - b.heightCm; }
    }[activeSort];
    return cmp ? list.slice().sort(cmp) : list.slice();
  }

  function byId(id) {
    return FRIDGES.filter(function (f) { return f.id === id; })[0];
  }

  function twinOf(f) {
    return TWINS.filter(function (t) {
      return t.members.indexOf(f.id) !== -1;
    })[0];
  }

  /* Welk lid van een tweeling op dit moment op de kaart staat. */
  const activeTwin = {};
  TWINS.forEach(function (t) { activeTwin[t.id] = t.members[0]; });

  function fridgesIn(group) {
    return sorted(FRIDGES.filter(function (f) {
      if (f.group !== group) return false;
      const t = twinOf(f);
      /* Van een tweeling staat alleen het gekozen merk op het overzicht. */
      return !t || activeTwin[t.id] === f.id;
    }));
  }

  /* De vergelijktabel toont alle modellen, ook het merk dat nu niet op de
     kaart staat, in dezelfde volgorde als de secties. */
  function visibleFridges() {
    return SECTIONS.reduce(function (all, s) {
      return all.concat(sorted(FRIDGES.filter(function (f) {
        return f.group === s.group;
      })));
    }, []);
  }

  /* ---------- kaarten ---------- */

  /* De kaart is geen knop meer: de merkschakelaar en de detailknop zijn zelf
     knoppen, en die mogen niet in een knop genest zitten. */
  function cardHtml(f) {
    const badge = badgeFor(f);
    const twin = twinOf(f);
    return '' +
      '<article class="card' + (twin ? ' is-twin' : '') + '" ' +
        'style="--accent:' + f.accent + '" data-id="' + f.id + '">' +
        '<div class="card-media" data-zoom>' +
          cardMedia(f) +
          '<span class="badge-type">' + f.nicheLabel + '</span>' +
          (badge ? '<span class="badge-best">' + badge + '</span>' : '') +
          (twin ? twinMediaToggle(twin, f) : '') +
          favButton(f) +
          '<span class="card-zoom" aria-hidden="true">Foto vergroten</span>' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-head">' +
            '<div class="card-head-text">' +
              '<p class="card-brand">' + f.brand + '</p>' +
              '<h2 class="card-model">' + f.model + '</h2>' +
              '<p class="card-series">' + f.series + '</p>' +
              '<p class="card-price">' +
                (f.energy === 'D'
                  ? '<span class="price-original">' + euro.format(f.price) + '</span>' +
                    '<span class="price-discount" title="€650 duurzaamheidsregeling">−€650</span>' +
                    '<span class="price-value">' + euro.format(f.price - 650) + '</span>'
                  : '<span class="price-value">' + euro.format(f.price) + '</span>') +
                sourceTag(f) +
              '</p>' +
            '</div>' +
            '<div class="card-head-badges">' +
              energyPill(f.energy) +
              '<span class="noise-badge">' + f.noiseDb + ' dB</span>' +
            '</div>' +
          '</div>' +
          notesHtml(f.id) +
          capacityBlock(f) +
          '<ul class="card-features">' +
            f.highlights.map(function (h) { return '<li>' + h + '</li>'; }).join('') +
          '</ul>' +
          (twin ? twinDiffNote(twin) : '') +
          '<button type="button" class="card-open">' +
            'Bekijk foto&rsquo;s, beschrijving &amp; specificaties &rarr;</button>' +
        '</div>' +
      '</article>';
  }

  /* ---------- eigen notities ---------- */

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function notesFor(id) {
    const n = NOTES[id] || {};
    return { pro: n.pro || [], con: n.con || [] };
  }

  /* `i` is de index in de volledige (ongefilterde) lijst van dat model —
     data-i moet daarnaar blijven wijzen, ook als er door de auteursfilter
     minder rijen te zien zijn, anders verwijdert het kruisje de verkeerde
     notitie. */
  function noteRow(kind, note, i) {
    const pro = kind === 'pro';
    const author = authorLabel(note.author);
    return '<li class="note is-' + kind + '">' +
      '<span class="note-mark" aria-hidden="true">' + (pro ? '+' : '&minus;') + '</span>' +
      '<span class="sr-only">' + (pro ? 'Pluspunt' : 'Minpunt') + ' van ' + author + ': </span>' +
      '<span class="note-text">' + esc(note.text) + '</span>' +
      '<span class="note-author is-' + note.author + '">' + author + '</span>' +
      '<button type="button" class="note-del" data-kind="' + kind + '" data-i="' + i + '" ' +
        'aria-label="Notitie verwijderen">&times;</button>' +
    '</li>';
  }

  function noteListHtml(id) {
    const n = notesFor(id);
    const visible = function (note) {
      return authorFilter === 'all' || note.author === authorFilter;
    };
    const rows = [];
    n.pro.forEach(function (note, i) { if (visible(note)) rows.push(noteRow('pro', note, i)); });
    n.con.forEach(function (note, i) { if (visible(note)) rows.push(noteRow('con', note, i)); });
    if (rows.length) return rows.join('');
    const anyAtAll = n.pro.length + n.con.length > 0;
    return '<li class="note-empty">' + (anyAtAll
      ? 'Geen notities van ' + authorLabel(authorFilter) + '.'
      : 'Nog geen notities.') + '</li>';
  }

  function notesHtml(id) {
    return '<div class="card-notes" data-notes>' +
      '<p class="notes-title">Mijn notities</p>' +
      '<ul class="note-list" data-note-list>' + noteListHtml(id) + '</ul>' +
      '<form class="note-form" data-kind="pro">' +
        '<div class="note-kind" role="group" aria-label="Soort notitie">' +
          '<button type="button" class="note-kind-btn is-on" data-kind="pro" ' +
            'aria-pressed="true" aria-label="Pluspunt">+</button>' +
          '<button type="button" class="note-kind-btn" data-kind="con" ' +
            'aria-pressed="false" aria-label="Minpunt">&minus;</button>' +
        '</div>' +
        '<input type="text" class="note-input" maxlength="120" ' +
          'placeholder="Wat valt je op?" aria-label="Nieuwe notitie">' +
        '<button type="submit" class="note-add">Voeg toe</button>' +
      '</form>' +
    '</div>';
  }

  /* Werkt alleen de notitielijst van deze kaart bij, zodat de cursor in het
     invoerveld blijft staan. */
  function refreshNotes(card) {
    card.querySelector('[data-note-list]').innerHTML = noteListHtml(card.dataset.id);
  }

  function addNote(card, kind, text) {
    const id = card.dataset.id;
    const n = notesFor(id);
    n[kind] = n[kind].concat({ text: text, author: currentAuthor });
    NOTES[id] = n;
    saveNotes();
    refreshNotes(card);
  }

  function removeNote(card, kind, index) {
    const id = card.dataset.id;
    const n = notesFor(id);
    n[kind] = n[kind].filter(function (_, i) { return i !== index; });
    if (!n.pro.length && !n.con.length) delete NOTES[id];
    else NOTES[id] = n;
    saveNotes();
    refreshNotes(card);
  }

  /* Twee merken op één kaart: de schakelaar staat rechtsboven op de foto en
     wisselt welk model de kaart toont. */
  function twinMediaToggle(t, active) {
    return '<div class="twin-toggle media-twin-toggle" role="group" aria-label="Kies merk">' +
      t.members.map(function (id) {
        const m = byId(id);
        const on = id === active.id;
        return '<button type="button" class="twin-btn' + (on ? ' is-on' : '') +
          '" data-twin="' + t.id + '" data-member="' + id + '" ' +
          'aria-pressed="' + on + '">' + m.brand + '</button>';
      }).join('') +
    '</div>';
  }

  /* Hartje rechtsonder op de foto: favoriet markeren voor de vergelijking
     onderaan de pagina. */
  /* Eigen hartpad (geen icoonbibliotheek): symmetrisch om x=12, twee lobben
     boven die samenkomen in een punt onderaan. Gevuld bij favoriet, anders
     alleen een omtrek. */
  const HEART_PATH = 'M12 21C12 21 3 14.6 3 9.1 3 6.1 5.4 4 8.3 4 10.1 4 11.4 5 12 6.4 ' +
    '12.6 5 13.9 4 15.7 4 18.6 4 21 6.1 21 9.1 21 14.6 12 21 12 21Z';

  function favButton(f) {
    const on = !!FAVORITES[f.id];
    return '<button type="button" class="fav-btn' + (on ? ' is-fav' : '') +
      '" data-fav="' + f.id + '" aria-pressed="' + on + '" aria-label="' +
      (on ? 'Verwijder uit favorieten' : 'Markeer als favoriet') + '">' +
      '<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true">' +
        '<path d="' + HEART_PATH + '"></path>' +
      '</svg>' +
    '</button>';
  }

  /* Laatste zin van de kaart: waarin de twee merken verschillen. De titel
     volgt uit de merken zelf, zodat een volgend paar in TWINS geen eigen
     titeltekst nodig heeft. */
  function twinDiffNote(t) {
    const title = 'Verschil ' + t.members.map(function (id) {
      return byId(id).brand;
    }).join(' en ');
    return '<p class="twin-note-title">' + title + '</p>' +
      '<p class="twin-note">' + t.differs + '</p>';
  }

  /* De eerste foto uit de galerij is het kaartbeeld. */
  function cardMedia(f) {
    return renderItem(f, galleryItems(f)[0]);
  }

  function stat(label, value) {
    return '<div class="stat"><span class="stat-label">' + label + '</span>' +
      '<span class="stat-value">' + value + '</span></div>';
  }

  /* Uit de cijfers afgeleid, niet apart genoteerd: een handgeschreven totaal
     liep uit de pas met de deelinhouden. */
  function capacityText(f) {
    if (!f.capacityFreezer) return f.capacityFridge + ' l koelruimte';
    return (f.capacityFridge + f.capacityFreezer) + ' l totaal — ' +
      f.capacityFridge + ' l koel + ' + f.capacityFreezer + ' l vries';
  }

  /* Alleen het verschil met de kast die er nu staat, niet de liters zelf: op
     één regel, Koel en Vries naast elkaar. Geen vriesvak is een feit ('Geen'),
     geen verlies om in liters uit te drukken. */
  function capacityBlock(f) {
    const koel = capDelta(f.capacityFridge - HUIDIG.fridge);
    const vries = f.capacityFreezer
      ? capDelta(f.capacityFreezer - HUIDIG.freezer)
      : { cls: ' is-none', text: 'Geen' };
    return '<div class="cap">' +
      '<p class="cap-title">Inhoud tegenover de huidige kast ' +
        '<span>' + HUIDIG.fridge + ' l koel + ' + HUIDIG.freezer + ' l vries</span></p>' +
      '<p class="cap-line">' +
        capItem('Koel', koel) +
        capItem('Vries', vries) +
      '</p>' +
    '</div>';
  }

  function capDelta(d) {
    if (d === 0) return { cls: ' is-same', text: 'gelijk' };
    return { cls: d > 0 ? ' is-up' : ' is-down', text: (d > 0 ? '+' : '−') + Math.abs(d) + ' l' };
  }

  function capItem(label, d) {
    return '<span class="cap-item">' +
      '<span class="cap-item-label">' + label + '</span> ' +
      '<span class="cap-item-value' + d.cls + '">' + d.text + '</span>' +
    '</span>';
  }

  /* Maakt zichtbaar waar een prijs vandaan komt: de offerte, de webshop van
     Expert, of een schatting. */
  const SOURCE_TAGS = {
    offerte: {
      label: 'offerte',
      cls: ' is-quoted',
      title: 'Prijs en specificaties uit de Expert-offerte en het AEG-datasheet'
    },
    expert: {
      label: 'expert.nl',
      cls: ' is-checked',
      title: 'Prijs afgelezen van de productpagina op expert.nl, 8 augustus 2026'
    },
    web: {
      label: 'indicatie',
      cls: '',
      title: 'Indicatieve straatprijs, niet bij Expert gecontroleerd'
    }
  };

  function sourceTag(f) {
    const t = SOURCE_TAGS[f.source] || SOURCE_TAGS.web;
    return '<span class="src-tag' + t.cls + '" title="' + t.title + '">' +
      t.label + '</span>';
  }

  /* Favoriete modellen, ongeacht sectie — elk model telt apart mee, ook de
     kant van een tweeling die nu niet in het overzicht staat. */
  function favoriteFridges() {
    return sorted(FRIDGES.filter(function (f) { return FAVORITES[f.id]; }));
  }

  function renderSections() {
    const groupSections = SECTIONS.map(function (s) {
      const list = fridgesIn(s.group);
      if (!list.length) return '';
      /* Tel modellen, niet kaarten: een tweeling is één kaart maar twee
         modellen, en de tabel eronder toont ze allebei. */
      const total = FRIDGES.filter(function (f) { return f.group === s.group; }).length;
      return '<section class="model-section" aria-labelledby="sec-' + s.group + '">' +
        '<div class="section-head">' +
          '<h2 id="sec-' + s.group + '">' + s.title +
            '<span class="section-count">' + total + '</span></h2>' +
          '<p class="section-blurb">' + s.blurb + '</p>' +
        '</div>' +
        '<div class="grid">' + list.map(cardHtml).join('') + '</div>' +
      '</section>';
    }).join('');

    const favs = favoriteFridges();
    const favSection = !favs.length ? '' :
      '<section class="model-section is-favorites" aria-labelledby="sec-favorites">' +
        '<div class="section-head">' +
          '<h2 id="sec-favorites">Favorieten' +
            '<span class="section-count">' + favs.length + '</span></h2>' +
          '<p class="section-blurb">Met het hartje op een foto gemarkeerd, hier ' +
            'naast elkaar om ze direct te vergelijken.</p>' +
        '</div>' +
        '<div class="grid">' + favs.map(cardHtml).join('') + '</div>' +
      '</section>';

    sections.innerHTML = groupSections + favSection;
  }

  function sectionTitle(f) {
    const s = SECTIONS.filter(function (x) { return x.group === f.group; })[0];
    return s ? s.title : '';
  }

  /* ---------- vergelijktabel ---------- */

  function renderTable() {
    tableBody.innerHTML = visibleFridges().map(function (f) {
      const priceCell = f.energy === 'D'
        ? '<span class="price-original">' + euro.format(f.price) + '</span> ' +
          '<span class="price-discount">−€650</span> ' +
          '<strong>' + euro.format(f.price - 650) + '</strong>'
        : euro.format(f.price);
      return '<tr data-id="' + f.id + '">' +
        '<td class="row-model">' + f.brand + ' ' + f.model + '<small>' + f.series + '</small></td>' +
        '<td>' + sectionTitle(f) + '</td>' +
        '<td class="num">' + priceCell + ' ' + sourceTag(f) + '</td>' +
        '<td>' + energyPill(f.energy) + '</td>' +
        '<td class="num' + (f.energyKwh === BEST.energyKwh ? ' best' : '') + '">' +
          f.energyKwh + '</td>' +
        '<td class="num">' + f.heightLabel + '</td>' +
        '<td class="num' + (f.noiseDb === BEST.noiseDb ? ' best' : '') + '">' +
          f.noiseDb + ' dB</td>' +
        '<td>' + capacityText(f) + '</td>' +
      '</tr>';
    }).join('');
  }

  /* ---------- modal ---------- */

  function openModal(id) {
    const f = FRIDGES.filter(function (x) { return x.id === id; })[0];
    if (!f) return;
    currentFridge = f;
    currentView = galleryItems(f)[0].id;
    lastFocused = document.activeElement;

    document.getElementById('modal-eyebrow').textContent = f.brand + ' · ' + f.series;
    document.getElementById('modal-eyebrow').style.color = f.accent;
    document.getElementById('modal-title').textContent = f.model;
    document.getElementById('modal-tagline').textContent = f.tagline;
    document.getElementById('modal-desc').textContent = f.description;

    const priceDisplay = f.energy === 'D'
      ? euro.format(f.price - 650) + ' <span class="stat-note">(was ' + euro.format(f.price) + ')</span>'
      : euro.format(f.price);
    document.getElementById('modal-keys').innerHTML =
      stat('Prijs', priceDisplay) +
      stat('Label', energyPill(f.energy)) +
      stat('Hoogte', f.heightLabel) +
      stat('Geluid', f.noiseDb + ' dB') +
      stat('Inhoud', (f.capacityFridge + f.capacityFreezer) + ' l');

    document.getElementById('modal-features').innerHTML =
      f.highlights.map(function (h) { return '<li>' + h + '</li>'; }).join('');

    document.getElementById('modal-specs').innerHTML =
      f.specs.map(function (row) {
        return '<tr><td>' + row[0] + '</td><td>' + row[1] + '</td></tr>';
      }).join('');

    const link = document.getElementById('modal-link');
    link.href = f.expertUrl;

    const photoLink = document.getElementById('modal-photo-link');
    if (f.photoUrl) {
      photoLink.href = f.photoUrl;
      photoLink.textContent = f.photoLabel || 'Foto’s bij de fabrikant';
      photoLink.hidden = false;
    } else {
      photoLink.hidden = true;
    }

    document.getElementById('modal-fineprint').textContent = (f.source === 'offerte'
      ? 'Prijs uit de Expert Twello-offerte 2601004099 (6 augustus 2026, incl. btw); ' +
        'specificaties uit het AEG-datasheet.'
      : 'Indicatieve prijs (' + f.priceNote + '), niet bij Expert gecontroleerd.') +
      (f.photoCredit ? ' ' + f.photoCredit : '');

    modal.querySelector('.modal-panel').style.setProperty('--accent', f.accent);
    renderThumbs();
    renderStage();

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  }

  /* De galerij bestaat uit de productfoto's uit assets/photos/. Een foto is een
   * pad, of een object { src, label } als je een eigen bijschrift wilt. */
  function galleryItems(f) {
    return (f.photos || []).map(function (p, i) {
      const src = typeof p === 'string' ? p : p.src;
      const label = (typeof p === 'string' ? null : p.label) || 'Foto ' + (i + 1);
      return { id: 'photo-' + i, label: label, src: src };
    });
  }

  function altFor(f, item) {
    return f.brand + ' ' + f.model + ' — ' + item.label;
  }

  function renderItem(f, item) {
    if (!item) return '';
    return '<img class="fridge-photo" src="' + item.src + '" loading="lazy" alt="' +
      altFor(f, item) + '">';
  }

  function renderThumbs() {
    thumbs.innerHTML = galleryItems(currentFridge).map(function (v) {
      return '<button class="thumb' + (v.id === currentView ? ' is-active' : '') +
        '" data-view="' + v.id + '" role="tab" aria-selected="' + (v.id === currentView) + '">' +
        renderItem(currentFridge, v) + '<span>' + v.label + '</span></button>';
    }).join('');
  }

  function currentItem() {
    const items = galleryItems(currentFridge);
    return items.filter(function (v) { return v.id === currentView; })[0] || items[0];
  }

  function renderStage() {
    stage.innerHTML = renderItem(currentFridge, currentItem()) +
      '<span class="stage-zoom" aria-hidden="true">Vergroten</span>';
  }

  function setView(id) {
    currentView = id;
    renderThumbs();
    renderStage();
    if (!lightbox.hidden) syncLightbox();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  /* ---------- foto op volle schermgrootte ---------- */

  /* Zet de lightbox op de foto die nu in de galerij actief is. */
  function syncLightbox() {
    const items = galleryItems(currentFridge);
    const item = currentItem();
    if (!item) return;
    /* Op id zoeken: galleryItems levert bij elke aanroep nieuwe objecten. */
    const nr = items.map(function (v) { return v.id; }).indexOf(item.id) + 1;
    lightboxImg.src = item.src;
    lightboxImg.alt = altFor(currentFridge, item);
    document.getElementById('lightbox-caption').textContent =
      currentFridge.brand + ' ' + currentFridge.model + ' — ' + item.label;
    document.getElementById('lightbox-count').textContent = nr + ' / ' + items.length;
    const solo = items.length < 2;
    document.getElementById('lightbox-prev').hidden = solo;
    document.getElementById('lightbox-next').hidden = solo;
  }

  /* De vergroting kan uit het detailvenster komen of rechtstreeks van een
     kaart in het overzicht; `origin` krijgt de focus weer terug. */
  function openLightbox(origin) {
    if (!currentItem()) return;
    lightboxOrigin = origin || stage;
    syncLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    /* Staat het detailvenster nog open, dan blijft de pagina op slot. */
    if (modal.hidden) document.body.style.overflow = '';
    if (lightboxOrigin) lightboxOrigin.focus();
  }

  /* Opent de vergroting bij de eerste foto van een model uit het overzicht. */
  function openPhotoFor(id) {
    const f = FRIDGES.filter(function (x) { return x.id === id; })[0];
    if (!f) return;
    const first = galleryItems(f)[0];
    if (!first) return;
    currentFridge = f;
    currentView = first.id;
    openLightbox(document.querySelector('.card[data-id="' + id + '"]'));
  }

  /* Bladert door de galerij; de kleine weergave loopt mee. */
  function stepPhoto(dir) {
    const ids = galleryItems(currentFridge).map(function (v) { return v.id; });
    if (ids.length < 2) return;
    const i = ids.indexOf(currentView);
    setView(ids[(i + dir + ids.length) % ids.length]);
  }

  /* ---------- events ---------- */

  document.getElementById('sort').addEventListener('change', function (e) {
    activeSort = e.target.value;
    renderSections();
    renderTable();
  });

  /* Geldt voor alle kaarten tegelijk, dus staat los van de sectiehernder.
     'Beiden' laat currentAuthor ongewijzigd: dat blijft de auteur zodra je
     zelf iets toevoegt terwijl je alles bekijkt. */
  document.querySelector('.author-filter').addEventListener('click', function (e) {
    const btn = e.target.closest('.author-btn');
    if (!btn) return;
    authorFilter = btn.dataset.author;
    if (authorFilter !== 'all') currentAuthor = authorFilter;
    document.querySelectorAll('.author-btn').forEach(function (b) {
      const on = b === btn;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    renderSections();
  });

  /* Op de foto klikken vergroot hem meteen; de merkschakelaar wisselt van
     model; elders op de kaart opent het detailvenster. */
  sections.addEventListener('click', function (e) {
    const card = e.target.closest('.card');
    if (!card) return;

    /* Het notitieblok is een eigen werkgebied: klikken daarin mag de kaart
       niet openen. */
    if (e.target.closest('[data-notes]')) {
      const del = e.target.closest('.note-del');
      if (del) removeNote(card, del.dataset.kind, Number(del.dataset.i));
      const kind = e.target.closest('.note-kind-btn');
      if (kind) setNoteKind(card, kind.dataset.kind);
      return;
    }

    const twinBtn = e.target.closest('[data-twin]');
    if (twinBtn) {
      switchTwin(twinBtn.dataset.twin, twinBtn.dataset.member);
      return;
    }
    const favBtn = e.target.closest('[data-fav]');
    if (favBtn) {
      toggleFavorite(favBtn.dataset.fav);
      return;
    }
    if (e.target.closest('[data-zoom]')) openPhotoFor(card.dataset.id);
    else openModal(card.dataset.id);
  });

  /* Herbouwt de secties (de kaart met dit model kan er ná een wissel niet meer
     staan) en zet de focus terug op het hartje, zodat toetsenbordgebruikers
     niet kwijtraken waar ze waren. */
  function toggleFavorite(id) {
    const turningOn = !FAVORITES[id];
    if (FAVORITES[id]) delete FAVORITES[id];
    else FAVORITES[id] = true;
    saveFavorites();
    renderSections();
    /* Een favoriet kan nu op twee plekken staan (de eigen sectie én de
       favorietensectie) — allebei krijgen het pop-effect. */
    const btns = sections.querySelectorAll('[data-fav="' + id + '"]');
    btns.forEach(function (b) {
      if (!turningOn) return;
      b.classList.add('just-set');
      b.addEventListener('animationend', function done() {
        b.classList.remove('just-set');
        b.removeEventListener('animationend', done);
      });
    });
    if (btns[0]) btns[0].focus();
  }

  function setNoteKind(card, kind) {
    const form = card.querySelector('.note-form');
    form.dataset.kind = kind;
    form.querySelectorAll('.note-kind-btn').forEach(function (b) {
      const on = b.dataset.kind === kind;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    form.querySelector('.note-input').focus();
  }

  /* Enter in het invoerveld voegt de notitie toe. */
  sections.addEventListener('submit', function (e) {
    const form = e.target.closest('.note-form');
    if (!form) return;
    e.preventDefault();
    const input = form.querySelector('.note-input');
    const text = input.value.trim();
    if (!text) return;
    addNote(form.closest('.card'), form.dataset.kind, text);
    input.value = '';
    input.focus();
  });

  function switchTwin(twinId, memberId) {
    if (activeTwin[twinId] === memberId) return;
    activeTwin[twinId] = memberId;
    renderSections();
    /* De kaart is opnieuw opgebouwd; zet de focus terug op de knop. */
    const btn = sections.querySelector(
      '[data-twin="' + twinId + '"][data-member="' + memberId + '"]');
    if (btn) btn.focus();
  }

  tableBody.addEventListener('click', function (e) {
    const row = e.target.closest('tr');
    if (row) openModal(row.dataset.id);
  });

  thumbs.addEventListener('click', function (e) {
    const t = e.target.closest('.thumb');
    if (t) setView(t.dataset.view);
  });

  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close')) closeModal();
  });

  stage.addEventListener('click', function () { openLightbox(stage); });

  lightbox.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-lightbox-close')) closeLightbox();
  });
  document.getElementById('lightbox-prev').addEventListener('click', function () {
    stepPhoto(-1);
  });
  document.getElementById('lightbox-next').addEventListener('click', function () {
    stepPhoto(1);
  });

  document.addEventListener('keydown', function (e) {
    /* De lightbox ligt boven het detailvenster en krijgt de toetsen eerst. */
    const inLightbox = !lightbox.hidden;
    if (!inLightbox && modal.hidden) return;
    if (e.key === 'Escape') {
      if (inLightbox) closeLightbox(); else closeModal();
      return;
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      stepPhoto(e.key === 'ArrowRight' ? 1 : -1);
      e.preventDefault();
    }
  });

  renderSections();
  renderTable();
})();
