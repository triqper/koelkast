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

  function badgeFor(f) {
    if (f.noiseDb === BEST.noiseDb) return 'Stilst';
    if (f.energyKwh === BEST.energyKwh) return 'Zuinigst';
    if (f.price === BEST.price) return 'Voordeligst';
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
          renderView(f, 'front') +
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
            '<span class="price-note">' + f.priceNote + '</span>' +
          '</p>' +
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

  function stat(label, value) {
    return '<div class="stat"><span class="stat-label">' + label + '</span>' +
      '<span class="stat-value">' + value + '</span></div>';
  }

  function renderGrid() {
    const list = visibleFridges();
    grid.innerHTML = list.map(cardHtml).join('');
  }

  /* ---------- vergelijktabel ---------- */

  function renderTable() {
    tableBody.innerHTML = visibleFridges().map(function (f) {
      return '<tr data-id="' + f.id + '">' +
        '<td class="row-model">' + f.brand + ' ' + f.model + '<small>' + f.series + '</small></td>' +
        '<td>' + (f.category === 'combi' ? 'Koelvries combi' : 'Volledig koelkast') + '</td>' +
        '<td class="num' + (f.price === BEST.price ? ' best' : '') + '">' +
          euro.format(f.price) + '</td>' +
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
    currentView = 'front';
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
    document.getElementById('modal-fineprint').textContent =
      'Prijsindicatie (' + f.priceNote + '). Schematische tekeningen op schaal — ' +
      'productfoto’s staan op de Expert.nl-pagina.';

    modal.querySelector('.modal-panel').style.setProperty('--accent', f.accent);
    renderThumbs();
    renderStage();

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modal.querySelector('.modal-close').focus();
  }

  function renderThumbs() {
    thumbs.innerHTML = VIEWS.map(function (v) {
      return '<button class="thumb' + (v.id === currentView ? ' is-active' : '') +
        '" data-view="' + v.id + '" role="tab" aria-selected="' + (v.id === currentView) + '">' +
        renderView(currentFridge, v.id) + '<span>' + v.label + '</span></button>';
    }).join('');
  }

  function renderStage() {
    stage.innerHTML = renderView(currentFridge, currentView);
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
      const ids = VIEWS.map(function (v) { return v.id; });
      const i = ids.indexOf(currentView);
      const next = e.key === 'ArrowRight'
        ? (i + 1) % ids.length
        : (i - 1 + ids.length) % ids.length;
      setView(ids[next]);
      e.preventDefault();
    }
  });

  renderGrid();
  renderTable();
})();
