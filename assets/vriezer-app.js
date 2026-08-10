/* Vriezer-keuzehulp — rendering en interactie */

(function () {
  'use strict';

  const sections = document.getElementById('sections');
  const tableBody = document.querySelector('#compare-table tbody');
  const modal = document.getElementById('modal');
  const stage = document.getElementById('stage');
  const thumbs = document.getElementById('thumbs');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  const SECTION = {
    title: 'Vrijstaande vrieskasten',
    blurb: 'Alle modellen op één rij — inhoud, geluid, maten, energielabel ' +
           'en geschatte stroomkosten staan direct op de kaart.'
  };

  let activeSort = 'price';

  const NOTES_KEY = 'vriezer-notities-v1';
  const AUTHORS = { robbin: 'Robbin', anne: 'Anne' };

  function authorLabel(key) {
    return AUTHORS[key] || key;
  }

  function loadNotes() {
    try {
      return JSON.parse(localStorage.getItem(NOTES_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveNotes() {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(NOTES));
    } catch (e) {
      /* vol of geblokkeerd: de notities blijven in deze sessie staan */
    }
  }

  const NOTES = loadNotes();

  let authorFilter = 'all';
  let currentAuthor = 'robbin';

  /* 'all', 'wit' of 'niet-wit' — filtert op het kleurveld dat elk model al
     heeft (Wit, Rvs, Zwart, Grijs...). Alles wat niet letterlijk 'Wit' is
     valt in 'niet-wit'. */
  let colorFilter = 'all';

  function colorMatches(f) {
    if (colorFilter === 'all') return true;
    const isWhite = f.kleur === 'Wit';
    return colorFilter === 'wit' ? isWhite : !isWhite;
  }

  const FAV_KEY = 'vriezer-favorieten-v1';

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
  let currentFreezer = null;
  let currentView = 'front';

  /* ---------- helpers ---------- */

  const euro = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  });

  function best(key, lowerIsBetter) {
    const values = VRIEZERS.map(function (f) { return f[key]; });
    return lowerIsBetter ? Math.min.apply(null, values) : Math.max.apply(null, values);
  }

  const BEST = {
    price: best('price', true),
    noiseDb: best('noiseDb', true),
    energyKwh: best('energyKwh', true),
    capacityL: best('capacityL', false)
  };

  function yearlyCost(f) {
    return Math.round(f.energyKwh * STROOMPRIJS);
  }

  function costLabel(f) {
    return '€' + yearlyCost(f) + ' p.j.';
  }

  function energyPill(letter) {
    return '<span class="energy-pill" style="background:' + ENERGY_COLORS[letter] + '">' +
      letter + '</span>';
  }

  function badgeFor(f) {
    if (f.noiseDb === BEST.noiseDb) return 'Stilst';
    if (f.energyKwh === BEST.energyKwh) return 'Zuinigst';
    if (f.capacityL === BEST.capacityL) return 'Meeste inhoud';
    return null;
  }

  /* Laagste prijs uit het prijsonderzoek bij andere NL-webshops; zonder
     goedkopere vondst valt dit terug op de prijs die hier vermeld staat. */
  function cheapestFound(f) {
    return f.cheaper ? f.cheaper.price : f.price;
  }

  function sorted(list) {
    const cmp = {
      price: function (a, b) { return a.price - b.price; },
      cheapest: function (a, b) { return cheapestFound(a) - cheapestFound(b); },
      noise: function (a, b) { return a.noiseDb - b.noiseDb; },
      energy: function (a, b) { return a.energyKwh - b.energyKwh; },
      capacity: function (a, b) { return b.capacityL - a.capacityL; },
      height: function (a, b) { return a.heightCm - b.heightCm; }
    }[activeSort];
    return cmp ? list.slice().sort(cmp) : list.slice();
  }

  function freezersIn() {
    return sorted(VRIEZERS.filter(colorMatches));
  }

  /* ---------- kaarten ---------- */

  function cardHtml(f) {
    const badge = badgeFor(f);
    return '' +
      '<article class="card" style="--accent:' + f.accent + '" data-id="' + f.id + '">' +
        '<div class="card-media">' +
          cardMedia(f) +
          '<span class="badge-type">' + f.kleur + '</span>' +
          (f.award ? '<span class="badge-award">' + f.award + '</span>' : '') +
          (badge ? '<span class="badge-best">' + badge + '</span>' : '') +
          favButton(f) +
          '<span class="card-zoom" aria-hidden="true">Foto vergroten</span>' +
        '</div>' +
        '<div class="card-body">' +
          '<div class="card-head">' +
            '<div class="card-head-text">' +
              '<p class="card-brand">' + f.brand + '</p>' +
              '<h2 class="card-model">' + f.model + '</h2>' +
              (f.series ? '<p class="card-series">' + f.series + '</p>' : '') +
              '<p class="card-price">' +
                '<span class="price-value">' + euro.format(f.price) + '</span>' +
                sourceTag(f) +
              '</p>' +
              cheaperHtml(f, 'card-cheaper') +
            '</div>' +
            '<div class="card-head-badges">' +
              energyPill(f.energy) +
              '<span class="noise-badge">' + f.noiseDb + ' dB</span>' +
              '<span class="noise-badge">' + f.capacityL + 'l</span>' +
              '<span class="noise-badge">' + costLabel(f) + '</span>' +
            '</div>' +
          '</div>' +
          reviewsHtml(f) +
          buildQualityHtml(f) +
          notesHtml(f.id) +
          specStrip(f) +
          '<ul class="card-features">' +
            f.highlights.map(function (h) { return '<li>' + h + '</li>'; }).join('') +
          '</ul>' +
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

  /* Hartje rechtsonder op de foto: favoriet markeren voor de vergelijking
     onderaan de pagina. */
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

  /* De eerste foto uit de galerij is het kaartbeeld. Zonder foto's komt er
     een simpele placeholder met vriessymbool, zodat de kaart niet leeg is. */
  /* Twee foto's naast elkaar op de kaart: dicht en open, zodat de indeling
     direct te zien is zonder het detailvenster te openen. */
  function cardMedia(f) {
    const items = galleryItems(f);
    return '<div class="card-media-photos">' +
      mediaSlot(f, items[0], 0) +
      mediaSlot(f, items[1], 1) +
    '</div>';
  }

  function mediaSlot(f, item, index) {
    const label = index === 0 ? 'Dicht' : 'Open';
    const photo = item ? renderItem(f, item) :
      '<div class="photo-placeholder" aria-hidden="true">' +
        '<span>' + f.brand + '<br>' + f.model + '</span></div>';
    return '<div class="card-media-photo" data-zoom data-photo-index="' + index + '">' +
      photo +
      '<span class="card-media-photo-label">' + label + '</span>' +
    '</div>';
  }

  function stat(label, value) {
    return '<div class="stat"><span class="stat-label">' + label + '</span>' +
      '<span class="stat-value">' + value + '</span></div>';
  }

  /* De vijf dingen die direct in het overzicht moeten staan: inhoud,
     geluid, maten, energielabel en geschatte stroomkosten per jaar. */
  function specStrip(f) {
    return '<div class="cap">' +
      '<p class="cap-title">Kernspecs</p>' +
      '<p class="cap-line spec-strip">' +
        specItem('Maten (h×b×d)', f.heightCm + '×' + f.widthCm + '×' + f.depthCm + ' cm') +
        specItem('Jaarverbruik', f.energyKwh + ' kWh/jr') +
      '</p>' +
    '</div>';
  }

  function specItem(label, value) {
    return '<span class="cap-item">' +
      '<span class="cap-item-label">' + label + '</span> ' +
      '<span class="cap-item-value">' + value + '</span>' +
    '</span>';
  }

  const SOURCE_TAGS = {
    expert: {
      label: 'expert.nl',
      cls: ' is-checked',
      title: 'Prijs van expert.nl, 9 augustus 2026'
    }
  };

  function sourceTag(f) {
    const t = SOURCE_TAGS[f.source] || SOURCE_TAGS.expert;
    return '<span class="src-tag' + t.cls + '" title="' + t.title + '">' +
      t.label + '</span>';
  }

  /* Prijs bij een andere NL-webshop, als die goedkoper is dan Expert.nl.
     `cls` bepaalt de plek: op de kaart of in het detailvenster. */
  function cheaperHtml(f, cls) {
    if (!f.cheaper) {
      return '<p class="' + cls + ' is-none">Geen goedkopere prijs gevonden bij andere NL-webshops.</p>';
    }
    const c = f.cheaper;
    return '<p class="' + cls + '">' +
      '<a href="' + c.url + '" target="_blank" rel="noopener noreferrer">' +
        c.shop + ': ' + euro.format(c.price) +
      '</a> — ' + euro.format(c.savings) + ' goedkoper dan Expert.nl' +
    '</p>';
  }

  function reviewScoreText(r) {
    return r.score.toFixed(1).replace('.', ',') + '/' + r.scale;
  }

  /* Reviews van bol.com, Coolblue, Kieskeurig e.d. — alleen als plus- en
     minpunten daadwerkelijk uit meerdere reviews te halen waren. Bij te
     weinig reviews (status 'insufficient') tonen we het cijfer wel, maar
     geen verzonnen plus-/minpuntenlijst; bij status 'none' alleen een
     duidelijke melding dat er niets gevonden is. */
  function reviewsHtml(f) {
    const r = f.reviews;
    if (!r) return '';
    const checked = 'Gecontroleerd ' + r.checked;

    if (r.status === 'none') {
      return '<div class="reviews-block is-empty">' +
        '<p class="rev-line">Nog geen (betrouwbare) reviews gevonden bij Nederlandse webshops.</p>' +
        '<p class="pc-checked">' + checked + '</p>' +
      '</div>';
    }

    const scoreLine = '<span class="rev-score">&#9733; ' + reviewScoreText(r) + '</span> ' +
      '<span class="rev-count">(' + r.count + ' review' + (r.count === 1 ? '' : 's') +
      ' bij ' + esc(r.source) + ')</span>';
    const link = r.url
      ? '<a class="pc-link" href="' + r.url + '" target="_blank" rel="noopener noreferrer">' +
          'Bekijk reviews bij ' + esc(r.source) + ' &rarr;</a>'
      : '';

    if (r.status === 'insufficient') {
      return '<div class="reviews-block">' +
        '<p class="rev-line">' + scoreLine + '</p>' +
        '<p class="rev-line">Te weinig reviews om plus- en minpunten uit te halen.</p>' +
        link +
        '<p class="pc-checked">' + checked + '</p>' +
      '</div>';
    }

    const prosHtml = (r.pros && r.pros.length)
      ? '<ul>' + r.pros.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>'
      : '<p class="rev-col-empty">Geen pluspunten gevonden.</p>';
    const consHtml = (r.cons && r.cons.length)
      ? '<ul>' + r.cons.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>'
      : '<p class="rev-col-empty">Geen minpunten gevonden.</p>';

    return '<div class="reviews-block">' +
      '<p class="rev-line">' + scoreLine + '</p>' +
      '<div class="rev-cols">' +
        '<div class="rev-col is-pro"><p class="rev-col-title">Wat bevalt</p>' + prosHtml + '</div>' +
        '<div class="rev-col is-con"><p class="rev-col-title">Minder goed</p>' + consHtml + '</div>' +
      '</div>' +
      link +
      (r.note ? '<p class="rev-note">' + esc(r.note) + '</p>' : '') +
      '<p class="pc-checked">' + checked + '</p>' +
    '</div>';
  }

  /* Bouwkwaliteit-ervaringen van gebruikers (lades, legplanken, plastic
     onderdelen), grotendeels merkbreed of bij vergelijkbare modellen van
     hetzelfde merk onderzocht — niet apart getest per model, dat staat er
     expliciet bij. */
  function buildQualityHtml(f) {
    const bq = f.buildQuality;
    if (!bq) return '';
    return '<div class="quality-block">' +
      '<p class="quality-title">Bouwkwaliteit — ervaringen van gebruikers</p>' +
      '<ul class="quality-list">' +
        '<li><strong>Lades:</strong> ' + esc(bq.drawers) + '</li>' +
        '<li><strong>Legplanken:</strong> ' + esc(bq.shelves) + '</li>' +
        '<li><strong>Plastic onderdelen:</strong> ' + esc(bq.plastic) + '</li>' +
      '</ul>' +
      (bq.lifespan ? '<p class="quality-lifespan">' + esc(bq.lifespan) + '</p>' : '') +
      (bq.note ? '<p class="rev-note">' + esc(bq.note) + '</p>' : '') +
      '<p class="pc-checked">' + esc(bq.scope) + ' · gecontroleerd ' + bq.checked + '</p>' +
    '</div>';
  }

  function favoriteFreezers() {
    return sorted(VRIEZERS.filter(function (f) { return FAVORITES[f.id]; }));
  }

  function renderSections() {
    const list = freezersIn();
    const main = !list.length ? '' :
      '<section class="model-section" aria-labelledby="sec-vriezer">' +
        '<div class="section-head">' +
          '<h2 id="sec-vriezer">' + SECTION.title +
            '<span class="section-count">' + list.length + '</span></h2>' +
          '<p class="section-blurb">' + SECTION.blurb + '</p>' +
        '</div>' +
        '<div class="grid">' + list.map(cardHtml).join('') + '</div>' +
      '</section>';

    const favs = favoriteFreezers();
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

    sections.innerHTML = main + favSection;
  }

  /* ---------- vergelijktabel ---------- */

  function renderTable() {
    tableBody.innerHTML = sorted(VRIEZERS).map(function (f) {
      return '<tr data-id="' + f.id + '">' +
        '<td class="row-model">' + f.brand + ' ' + f.model + '<small>' + f.kleur + '</small></td>' +
        '<td class="num">' + euro.format(f.price) + ' ' + sourceTag(f) + '</td>' +
        '<td>' + energyPill(f.energy) + '</td>' +
        '<td class="num' + (f.energyKwh === BEST.energyKwh ? ' best' : '') + '">' +
          f.energyKwh + '</td>' +
        '<td class="num">&plusmn; ' + euro.format(yearlyCost(f)) + '</td>' +
        '<td class="num">' + f.heightCm + '×' + f.widthCm + '×' + f.depthCm + '</td>' +
        '<td class="num' + (f.noiseDb === BEST.noiseDb ? ' best' : '') + '">' +
          f.noiseDb + ' dB</td>' +
        '<td class="num' + (f.capacityL === BEST.capacityL ? ' best' : '') + '">' +
          f.capacityL + ' l</td>' +
        '<td class="num' + (f.cheaper ? ' best' : '') + '">' + tableCheaper(f) + '</td>' +
      '</tr>';
    }).join('');
  }

  function tableCheaper(f) {
    if (!f.cheaper) return '<span class="table-cheaper-none">—</span>';
    const c = f.cheaper;
    return '<a href="' + c.url + '" target="_blank" rel="noopener noreferrer">' +
      c.shop + ': ' + euro.format(c.price) + '</a> (&minus;' + euro.format(c.savings) + ')';
  }

  /* ---------- modal ---------- */

  function openModal(id) {
    const f = VRIEZERS.filter(function (x) { return x.id === id; })[0];
    if (!f) return;
    currentFreezer = f;
    const first = galleryItems(f)[0];
    currentView = first ? first.id : null;
    lastFocused = document.activeElement;

    document.getElementById('modal-eyebrow').textContent = f.brand + (f.series ? ' · ' + f.series : '');
    document.getElementById('modal-eyebrow').style.color = f.accent;
    document.getElementById('modal-title').textContent = f.model;
    document.getElementById('modal-tagline').textContent = f.tagline;
    document.getElementById('modal-desc').textContent = f.description;

    document.getElementById('modal-keys').innerHTML =
      stat('Prijs', euro.format(f.price)) +
      stat('Label', energyPill(f.energy)) +
      stat('Inhoud', f.capacityL + ' l') +
      stat('Geluid', f.noiseDb + ' dB') +
      stat('Maten', f.heightCm + '×' + f.widthCm + '×' + f.depthCm + ' cm') +
      stat('Stroomkosten', '&plusmn; ' + euro.format(yearlyCost(f)) + '/jr');

    document.getElementById('modal-cheaper').innerHTML = cheaperHtml(f, 'modal-cheaper');

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

    document.getElementById('modal-fineprint').textContent = f.priceNote +
      (f.photoCredit ? ' ' + f.photoCredit : '') +
      ' Stroomkosten zijn een schatting bij ' + euro.format(STROOMPRIJS) + '/kWh, geen offerte.';

    modal.querySelector('.modal-panel').style.setProperty('--accent', f.accent);
    renderThumbs();
    renderStage();

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  }

  /* Een item is meestal een foto ({src, label}), maar kan ook een YouTube-
     video zijn ({type: 'video', videoId, label}) — bijvoorbeeld voor een
     kleurreferentie die met een foto alleen niet goed te laten zien is. */
  function galleryItems(f) {
    return (f.photos || []).map(function (p, i) {
      if (typeof p === 'object' && p.type === 'video') {
        return { id: 'photo-' + i, label: p.label || 'Video', type: 'video', videoId: p.videoId };
      }
      const src = typeof p === 'string' ? p : p.src;
      const label = (typeof p === 'string' ? null : p.label) || 'Foto ' + (i + 1);
      return { id: 'photo-' + i, label: label, src: src };
    });
  }

  function altFor(f, item) {
    return f.brand + ' ' + f.model + ' — ' + item.label;
  }

  /* `context` is 'thumb' of 'stage': een video toont in de thumb een
     YouTube-voorbeeldplaatje met afspeelknopje, en pas in de stage de
     werkelijke embed — anders spelen er in de duimnagelrij ongewild
     meerdere video's tegelijk af. */
  function renderItem(f, item, context) {
    if (!item) return '';
    if (item.type === 'video') {
      if (context === 'thumb') {
        return '<img class="fridge-photo" src="https://img.youtube.com/vi/' + item.videoId +
          '/hqdefault.jpg" loading="lazy" alt="' + altFor(f, item) + '">' +
          '<span class="video-play-badge" aria-hidden="true">&#9654;</span>';
      }
      return '<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/' +
        item.videoId + '" title="' + altFor(f, item) + '" loading="lazy" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
        'allowfullscreen></iframe></div>';
    }
    return '<img class="fridge-photo" src="' + item.src + '" loading="lazy" alt="' +
      altFor(f, item) + '">';
  }

  function renderThumbs() {
    const items = galleryItems(currentFreezer);
    thumbs.innerHTML = items.map(function (v) {
      return '<button class="thumb' + (v.id === currentView ? ' is-active' : '') +
        '" data-view="' + v.id + '" role="tab" aria-selected="' + (v.id === currentView) + '">' +
        renderItem(currentFreezer, v, 'thumb') + '<span>' + v.label + '</span></button>';
    }).join('');
  }

  function currentItem() {
    const items = galleryItems(currentFreezer);
    return items.filter(function (v) { return v.id === currentView; })[0] || items[0];
  }

  /* Een video is al interactief in de stage zelf — geen vergrootknop of
     klik-naar-lightbox nodig (en een iframe binnenin een lightbox-<img>
     zou toch niet werken). */
  function renderStage() {
    const item = currentItem();
    const isVideo = item && item.type === 'video';
    stage.classList.toggle('is-video', !!isVideo);
    stage.innerHTML = (item ? renderItem(currentFreezer, item, 'stage') :
        '<div class="photo-placeholder" aria-hidden="true"><span>Geen foto beschikbaar</span></div>') +
      (isVideo ? '' : '<span class="stage-zoom" aria-hidden="true">Vergroten</span>');
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

  function syncLightbox() {
    const items = galleryItems(currentFreezer);
    const item = currentItem();
    if (!item) return;
    /* Doorstappen (pijltjestoetsen) kan de lightbox op een video-item laten
       uitkomen — die hoort daar niet thuis, dus sluit hem dan gewoon. */
    if (item.type === 'video') { closeLightbox(); return; }
    const nr = items.map(function (v) { return v.id; }).indexOf(item.id) + 1;
    lightboxImg.src = item.src;
    lightboxImg.alt = altFor(currentFreezer, item);
    document.getElementById('lightbox-caption').textContent =
      currentFreezer.brand + ' ' + currentFreezer.model + ' — ' + item.label;
    document.getElementById('lightbox-count').textContent = nr + ' / ' + items.length;
    const solo = items.length < 2;
    document.getElementById('lightbox-prev').hidden = solo;
    document.getElementById('lightbox-next').hidden = solo;
  }

  function openLightbox(origin) {
    const item = currentItem();
    if (!item || item.type === 'video') return;
    lightboxOrigin = origin || stage;
    syncLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    if (modal.hidden) document.body.style.overflow = '';
    if (lightboxOrigin) lightboxOrigin.focus();
  }

  function openPhotoFor(id, index) {
    const f = VRIEZERS.filter(function (x) { return x.id === id; })[0];
    if (!f) return;
    const items = galleryItems(f);
    const item = items[index] || items[0];
    if (!item) return;
    currentFreezer = f;
    currentView = item.id;
    openLightbox(document.querySelector('.card[data-id="' + id + '"]'));
  }

  function stepPhoto(dir) {
    const ids = galleryItems(currentFreezer).map(function (v) { return v.id; });
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

  document.querySelector('.color-filter').addEventListener('click', function (e) {
    const btn = e.target.closest('.color-btn');
    if (!btn) return;
    colorFilter = btn.dataset.color;
    document.querySelectorAll('.color-btn').forEach(function (b) {
      const on = b === btn;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    /* De vergelijktabel ('Alles op een rij') blijft alle twaalf modellen
       tonen, ongeacht het kleurfilter — alleen de kaarten erboven filteren. */
    renderSections();
  });

  sections.addEventListener('click', function (e) {
    const card = e.target.closest('.card');
    if (!card) return;

    if (e.target.closest('[data-notes]')) {
      const del = e.target.closest('.note-del');
      if (del) removeNote(card, del.dataset.kind, Number(del.dataset.i));
      const kind = e.target.closest('.note-kind-btn');
      if (kind) setNoteKind(card, kind.dataset.kind);
      return;
    }

    const favBtn = e.target.closest('[data-fav]');
    if (favBtn) {
      toggleFavorite(favBtn.dataset.fav);
      return;
    }
    const zoomEl = e.target.closest('[data-zoom]');
    if (zoomEl) openPhotoFor(card.dataset.id, Number(zoomEl.dataset.photoIndex));
    else openModal(card.dataset.id);
  });

  function toggleFavorite(id) {
    const turningOn = !FAVORITES[id];
    if (FAVORITES[id]) delete FAVORITES[id];
    else FAVORITES[id] = true;
    saveFavorites();
    renderSections();
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
