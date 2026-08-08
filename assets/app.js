/* Koelkast-keuzehulp — rendering en interactie */

(function () {
  'use strict';

  const grid = document.getElementById('grid');
  const tableBody = document.querySelector('#compare-table tbody');
  const modal = document.getElementById('modal');
  const stage = document.getElementById('stage');
  const thumbs = document.getElementById('thumbs');

  let activeFilter = 'all';
  let activeSort = 'default';
  let lastFocused = null;
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

  function visibleFridges() {
    let list = FRIDGES.filter(function (f) {
      return activeFilter === 'all' || f.category === activeFilter;
    });
    const cmp = {
      price: function (a, b) { return a.price - b.price; },
      noise: function (a, b) { return a.noiseDb - b.noiseDb; },
      energy: function (a, b) { return a.energyKwh - b.energyKwh; },
      height: function (a, b) { return a.heightCm - b.heightCm; }
    }[activeSort];
    return cmp ? list.slice().sort(cmp) : list;
  }

  /* ---------- kaarten ---------- */

  function cardHtml(f) {
    const badge = badgeFor(f);
    return '' +
      '<button class="card" style="--accent:' + f.accent + '" data-id="' + f.id + '" ' +
        'aria-label="Details van ' + f.brand + ' ' + f.model + '">' +
        '<div class="card-media">' +
          cardMedia(f) +
          '<span class="badge-type">' +
            (f.category === 'combi' ? 'Koelvries combi' : 'Volledig koelkast') +
          '</span>' +
          (badge ? '<span class="badge-best">' + badge + '</span>' : '') +
        '</div>' +
        '<div class="card-body">' +
          '<p class="card-brand">' + f.brand + '</p>' +
          '<h2 class="card-model">' + f.model + '</h2>' +
          '<p class="card-series">' + f.series + '</p>' +
          '<p class="card-price">' +
            '<span class="price-value">' + euro.format(f.price) + '</span>' +
            sourceTag(f) +
          '</p>' +
          '<p class="price-note">' + f.priceNote + '</p>' +
          '<div class="card-stats">' +
            stat('Label', energyPill(f.energy)) +
            stat('Hoogte', f.heightLabel) +
            stat('Geluid', f.noiseDb + ' dB') +
          '</div>' +
          '<ul class="card-features">' +
            f.highlights.map(function (h) { return '<li>' + h + '</li>'; }).join('') +
          '</ul>' +
          '<p class="card-cta">Bekijk beschrijving &amp; alle tekeningen &rarr;</p>' +
        '</div>' +
      '</button>';
  }

  /* Is er een productfoto, dan staat die op de kaart; anders de tekening. */
  function cardMedia(f) {
    const photos = photosFor(f);
    return photos.length ? photoHtml(f, photos[0], null) : renderView(f, 'front');
  }

  function stat(label, value) {
    return '<div class="stat"><span class="stat-label">' + label + '</span>' +
      '<span class="stat-value">' + value + '</span></div>';
  }

  /* Maakt zichtbaar of een prijs uit de offerte komt of een schatting is. */
  function sourceTag(f) {
    const quoted = f.source === 'offerte';
    return '<span class="src-tag' + (quoted ? ' is-quoted' : '') + '" title="' +
      (quoted ? 'Prijs en specificaties uit de Expert-offerte en het AEG-datasheet'
              : 'Indicatieve straatprijs, niet bij Expert gecontroleerd') + '">' +
      (quoted ? 'offerte' : 'indicatie') + '</span>';
  }

  function renderGrid() {
    const list = visibleFridges();
    grid.innerHTML = list.map(cardHtml).join('');
    list.forEach(function (f) {
      const card = grid.querySelector('.card[data-id="' + f.id + '"]');
      if (card) wireImages(card, f);
    });
  }

  function renderCounts() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      const key = el.dataset.count;
      el.textContent = key === 'all'
        ? FRIDGES.length
        : FRIDGES.filter(function (f) { return f.category === key; }).length;
    });
  }

  /* ---------- vergelijktabel ---------- */

  function renderTable() {
    tableBody.innerHTML = visibleFridges().map(function (f) {
      return '<tr data-id="' + f.id + '">' +
        '<td class="row-model">' + f.brand + ' ' + f.model + '<small>' + f.series + '</small></td>' +
        '<td>' + (f.category === 'combi' ? 'Koelvries combi' : 'Volledig koelkast') + '</td>' +
        '<td class="num">' + euro.format(f.price) + ' ' + sourceTag(f) + '</td>' +
        '<td>' + energyPill(f.energy) + '</td>' +
        '<td class="num' + (f.energyKwh === BEST.energyKwh ? ' best' : '') + '">' +
          f.energyKwh + '</td>' +
        '<td class="num">' + f.heightLabel + '</td>' +
        '<td class="num' + (f.noiseDb === BEST.noiseDb ? ' best' : '') + '">' +
          f.noiseDb + ' dB</td>' +
        '<td>' + f.capacity + '</td>' +
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

    document.getElementById('modal-keys').innerHTML =
      stat('Prijs', euro.format(f.price)) +
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

    document.getElementById('modal-fineprint').textContent = f.source === 'offerte'
      ? 'Prijs uit de Expert Twello-offerte 2601004099 (6 augustus 2026, incl. btw); ' +
        'specificaties uit het AEG-datasheet. De tekeningen zijn schematisch, op schaal.'
      : 'Indicatieve prijs (' + f.priceNote + '), niet bij Expert gecontroleerd. ' +
        'De tekeningen zijn schematisch, op schaal.';

    modal.querySelector('.modal-panel').style.setProperty('--accent', f.accent);
    renderThumbs();
    renderStage();

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  }

  /* Eigen foto's (assets/photos/...) gaan voor de tekeningen. De lijst komt uit
     assets/photos.js, dat tools/haal-fotos.sh genereert; `photos` in data.js
     blijft werken als handmatig alternatief. */
  function photosFor(f) {
    const generated = typeof PHOTOS !== 'undefined' ? PHOTOS[f.id] : null;
    return generated || f.photos || [];
  }

  function galleryItems(f) {
    const photos = photosFor(f).map(function (src, i) {
      return { id: 'photo-' + i, label: 'Foto ' + (i + 1), src: src };
    });
    return photos.concat(VIEWS);
  }

  function photoHtml(f, src, label) {
    return '<img class="fridge-photo" src="' + src + '" loading="lazy" alt="' +
      f.brand + ' ' + f.model + (label ? ' — ' + label : '') + '">';
  }

  function renderItem(f, item) {
    if (item.src) return photoHtml(f, item.src, item.label);
    return renderView(f, item.id);
  }

  /* Ontbreekt of laadt een foto niet, dan valt de tekening terug op zijn plek —
     nooit een leeg vlak. */
  function wireImages(container, f) {
    container.querySelectorAll('img.fridge-photo').forEach(function (img) {
      img.addEventListener('error', function () {
        const holder = img.parentNode;
        if (!holder) return;
        img.remove();
        holder.insertAdjacentHTML('afterbegin', renderView(f, 'front'));
      });
    });
  }

  function renderThumbs() {
    thumbs.innerHTML = galleryItems(currentFridge).map(function (v) {
      return '<button class="thumb' + (v.id === currentView ? ' is-active' : '') +
        '" data-view="' + v.id + '" role="tab" aria-selected="' + (v.id === currentView) + '">' +
        renderItem(currentFridge, v) + '<span>' + v.label + '</span></button>';
    }).join('');
    wireImages(thumbs, currentFridge);
  }

  function renderStage() {
    const items = galleryItems(currentFridge);
    const item = items.filter(function (v) { return v.id === currentView; })[0] || items[0];
    stage.innerHTML = renderItem(currentFridge, item);
    wireImages(stage, currentFridge);
  }

  function setView(id) {
    currentView = id;
    renderThumbs();
    renderStage();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  /* ---------- events ---------- */

  document.querySelector('.filters').addEventListener('click', function (e) {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    document.querySelectorAll('.chip').forEach(function (c) {
      const on = c === btn;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-selected', String(on));
    });
    renderGrid();
    renderTable();
  });

  document.getElementById('sort').addEventListener('change', function (e) {
    activeSort = e.target.value;
    renderGrid();
    renderTable();
  });

  grid.addEventListener('click', function (e) {
    const card = e.target.closest('.card');
    if (card) openModal(card.dataset.id);
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

  document.addEventListener('keydown', function (e) {
    if (modal.hidden) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const ids = galleryItems(currentFridge).map(function (v) { return v.id; });
      const i = ids.indexOf(currentView);
      const next = e.key === 'ArrowRight'
        ? (i + 1) % ids.length
        : (i - 1 + ids.length) % ids.length;
      setView(ids[next]);
      e.preventDefault();
    }
  });

  renderCounts();
  renderGrid();
  renderTable();
})();
