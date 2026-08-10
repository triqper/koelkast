/* Vriezers dataset
 *
 * Herkomst van de gegevens staat per model in `source`:
 *  - 'expert' : prijs en de kernspecs (energielabel, hoogte, inhoud) komen van
 *               de productkaart/-pagina op expert.nl (screenshots en pagina's
 *               van 9 augustus 2026). Afmetingen, geluidsniveau en het exacte
 *               jaarverbruik die niet op de kaart/pagina zelf stonden zijn
 *               aangevuld uit de fabrikantdatasheet (Whirlpool/AEG/Smeg) of
 *               publieke productinformatie bij andere winkels — dat staat in
 *               `priceNote`.
 *
 * `group` is voor alle modellen 'vriezer' — er is maar één sectie.
 *
 * Stroomkosten per jaar zijn berekend als jaarverbruik (kWh) x aangenomen
 * stroomprijs, zie STROOMPRIJS hieronder — geen offerte- of contractprijs,
 * alleen een indicatie om modellen onderling te vergelijken.
 *
 * `cheaper` is de goedkoopste vondst bij een andere grote NL-webshop (bol.com,
 * Coolblue, MediaMarkt, of via de prijsvergelijking op BCC.nl), bekeken op
 * 9 augustus 2026 — `null` als daar geen prijs onder de Expert-prijs is
 * gevonden (gelijk, duurder, niet leverbaar of niet verkocht in Nederland).
 *
 * `award` is een optioneel lintje voor een onafhankelijke test/erkenning
 * (bv. Consumentenbond) — los van de automatisch berekende badges
 * (Stilst/Zuinigst/Meeste inhoud).
 */

const STROOMPRIJS = 0.40; /* euro per kWh, indicatief variabel tarief incl. belastingen, 2026 */

const VRIEZERS = [
  {
    id: 'aeg-oag7m281ew',
    brand: 'AEG',
    model: 'OAG7M281EW',
    series: '7000 NoFrost MultiFlow',
    kleur: 'Wit',
    group: 'vriezer',
    accent: '#c1121f',
    source: 'expert',
    price: 829,
    priceNote: 'prijs Expert.nl, 9 augustus 2026; specificaties uit het AEG-datasheet',
    cheaper: {
      shop: 'Bemmel & Kroon',
      price: 779,
      savings: 50,
      url: 'https://www.bemmelenkroon.nl/merken/aeg/oag7m281ew-aego/'
    },
    reviews: {
      status: 'none',
      checked: '10 augustus 2026'
    },
    buildQuality: {
      scope: 'Merkbreed (AEG-vriezers) — niet apart getest voor dit model',
      drawers: 'Vriesladen zijn van kunststof; reviews van AEG-vriezers in het algemeen noemen dat ze bij onvoorzichtig hanteren (bijvoorbeeld met natte handen) kunnen scheuren of afbreken.',
      shelves: 'Geen specifieke klachten gevonden over vakken of platen.',
      plastic: 'Verder geen brede klachten gevonden buiten de kwetsbaarheid van de ladeplastic hierboven.',
      lifespan: 'Qasa.nl: gemiddelde score voor AEG-vriezers 8,7/10 — overwegend tevreden gebruikers, met incidentele klachten over geluid en ijsvorming.',
      note: 'Gebaseerd op reviews van AEG-vriezers in het algemeen, niet specifiek bevestigd voor dit model.',
      checked: '10 augustus 2026'
    },
    energy: 'E',
    energyKwh: 248,
    heightCm: 186,
    widthCm: 59.5,
    depthCm: 65,
    noiseDb: 39,
    capacityL: 278,
    tagline: 'Vrieskast met 278 liter en het meeste vertrouwen: 4,8 sterren.',
    highlights: [
      'NoFrost MultiFlow — nooit meer ontdooien',
      '5 lades, elektronische bediening',
      'Frostmatic snelvriesfunctie',
      'Optisch en akoestisch deuralarm'
    ],
    description:
      'De AEG OAG7M281EW is een vrijstaande vrieskast van 186 cm met 278 liter netto inhoud, verdeeld over 5 lades. NoFrost MultiFlow houdt de temperatuur gelijkmatig en voorkomt ijsvorming, zodat ontdooien niet meer nodig is. De Frostmatic-functie vriest nieuwe boodschappen snel in zonder de rest van de inhoud op te laten warmen, en een optisch en akoestisch alarm waarschuwt als de deur openstaat. Elektronische bediening met ledindicatie maakt de temperatuur in één oogopslag duidelijk.',
    specs: [
      ['Type', 'Vrijstaande vrieskast'],
      ['Netto inhoud', '278 liter'],
      ['Afmetingen (h×b×d)', '186 × 59,5 × 65 cm'],
      ['Energielabel', 'E — 248 kWh/jaar'],
      ['Geluidsniveau', '39 dB(A)'],
      ['Lades', '5'],
      ['Snelvriezen', 'Frostmatic'],
      ['Ontdooiing', 'NoFrost, automatisch'],
      ['Alarm', 'Optisch en akoestisch bij open deur'],
      ['Bediening', 'Elektronisch met ledindicatie'],
      ['Garantie', '10 jaar op de compressor']
    ],
    photos: [
      { src: 'assets/photos-vriezer/aeg-oag7m281ew/01-gesloten.webp', label: 'Dicht' },
      { src: 'assets/photos-vriezer/aeg-oag7m281ew/02-open.jpg', label: 'Open — indeling' }
    ],
    photoCredit: 'Productfoto: AEG, via Expert.nl.',
    photoUrl: 'https://www.aeg.nl/kitchen/cooling/freezers/free-standing-freezer/oag7m281ew/',
    photoLabel: 'Foto’s op AEG.nl',
    expertUrl: 'https://www.expert.nl/aeg-oag7m281ew-372635270'
  },
  {
    id: 'aeg-oag7m281ex',
    brand: 'AEG',
    model: 'OAG7M281EX',
    series: '7000 NoFrost MultiFlow',
    kleur: 'Rvs',
    group: 'vriezer',
    accent: '#c1121f',
    source: 'expert',
    price: 849,
    priceNote: 'prijs Expert.nl, 9 augustus 2026; specificaties uit het AEG-datasheet',
    cheaper: null,
    reviews: {
      status: 'found',
      score: 4.9,
      scale: 5,
      count: 21,
      source: 'AO.com',
      url: 'https://ao.com/p/reviews/oag7m281ex-aeg-7000-series-upright-freezer-silver-101427-34',
      pros: [
        'Erg stil in gebruik',
        'Vriest effectief zonder ijsvorming (NoFrost werkt zoals beloofd)',
        'Ruime, overzichtelijke lades',
        'Eenvoudig in gebruik'
      ],
      cons: [],
      note: 'Reviews van AO.com, een Britse webshop — hetzelfde model, maar geen Nederlandse bron. Bol.com toont voor dit model nog geen reviews.',
      checked: '10 augustus 2026'
    },
    buildQuality: {
      scope: 'Merkbreed (AEG-vriezers) — niet apart getest voor dit model',
      drawers: 'Vriesladen zijn van kunststof; reviews van AEG-vriezers in het algemeen noemen dat ze bij onvoorzichtig hanteren (bijvoorbeeld met natte handen) kunnen scheuren of afbreken.',
      shelves: 'Geen specifieke klachten gevonden over vakken of platen.',
      plastic: 'Verder geen brede klachten gevonden buiten de kwetsbaarheid van de ladeplastic hierboven.',
      lifespan: 'Qasa.nl: gemiddelde score voor AEG-vriezers 8,7/10 — overwegend tevreden gebruikers, met incidentele klachten over geluid en ijsvorming.',
      note: 'Gebaseerd op reviews van AEG-vriezers in het algemeen, niet specifiek bevestigd voor dit model.',
      checked: '10 augustus 2026'
    },
    energy: 'E',
    energyKwh: 248,
    heightCm: 186,
    widthCm: 59.5,
    depthCm: 65,
    noiseDb: 39,
    capacityL: 278,
    tagline: 'Zelfde 278 liter als de witte OAG7M281EW, nu in vingervlekvrij rvs.',
    highlights: [
      'Vingervlekvrij roestvrijstaal',
      'NoFrost MultiFlow — nooit meer ontdooien',
      '5 lades, elektronische bediening',
      'Frostmatic snelvriesfunctie'
    ],
    description:
      'De AEG OAG7M281EX is technisch identiek aan de witte OAG7M281EW — zelfde 278 liter, zelfde label E, zelfde 39 dB — maar in vingervlekvrij roestvrijstaal in plaats van wit. NoFrost MultiFlow houdt de temperatuur gelijkmatig zodat ontdooien niet nodig is, Frostmatic vriest nieuwe voorraad snel in, en een optisch en akoestisch alarm waarschuwt bij een open deur.',
    specs: [
      ['Type', 'Vrijstaande vrieskast'],
      ['Netto inhoud', '278 liter'],
      ['Afmetingen (h×b×d)', '186 × 59,5 × 65 cm'],
      ['Energielabel', 'E — 248 kWh/jaar'],
      ['Geluidsniveau', '39 dB(A)'],
      ['Lades', '5'],
      ['Snelvriezen', 'Frostmatic'],
      ['Ontdooiing', 'NoFrost, automatisch'],
      ['Alarm', 'Optisch en akoestisch bij open deur'],
      ['Bediening', 'Elektronisch met ledindicatie'],
      ['Deurscharnier', 'Links (verwisselbaar)'],
      ['Garantie', '10 jaar op de compressor']
    ],
    photos: [
      { src: 'assets/photos-vriezer/aeg-oag7m281ex/01-gesloten.webp', label: 'Dicht' },
      { src: 'assets/photos-vriezer/aeg-oag7m281ex/02-open.jpg', label: 'Open — indeling' }
    ],
    photoCredit: 'Productfoto: AEG, via Expert.nl.',
    photoUrl: 'https://www.aeg.nl/kitchen/cooling/freezers/free-standing-freezer/oag7m281ex/',
    photoLabel: 'Foto’s op AEG.nl',
    expertUrl: 'https://www.expert.nl/aeg-oag7m281ex-rvs-372635272'
  },
  {
    id: 'whirlpool-whmff6312w5e',
    brand: 'Whirlpool',
    model: 'WHMFF 6312 W5E',
    series: 'fastFreezing',
    kleur: 'Wit',
    group: 'vriezer',
    accent: '#0a3d91',
    source: 'expert',
    price: 838,
    priceNote: 'prijs Expert.nl, 9 augustus 2026; afmetingen en geluidsniveau uit het Whirlpool-datasheet',
    cheaper: null,
    reviews: {
      status: 'none',
      checked: '10 augustus 2026'
    },
    buildQuality: {
      scope: 'Merkbreed (Whirlpool-vriezers) — niet apart getest voor dit model',
      drawers: 'Gebruikers melden dat het bovenste vriesvakklepje kwetsbaar is en dat plastic lades kunnen scheuren bij oneigenlijk gebruik.',
      shelves: 'Dezelfde kwetsbaarheid wordt genoemd voor legplanken/platen als voor de lades.',
      plastic: 'De bredere merkreputatie (niet vriezer-specifiek) wijst op kostenbesparing op plastic onderdelen; ervaringen lopen sterk uiteen, van tevreden gebruikers na jarenlang gebruik tot mensen die het "de slechtste vriezer ooit" noemen.',
      note: 'Ervaringen sterk wisselend en niet specifiek bevestigd voor dit exacte model — gebaseerd op Whirlpool-vriezers in het algemeen.',
      checked: '10 augustus 2026'
    },
    energy: 'D',
    energyKwh: 200,
    heightCm: 186.5,
    widthCm: 59.7,
    depthCm: 70.9,
    noiseDb: 34,
    noiseClass: 'B',
    capacityL: 286,
    tagline: 'De grootste inhoud van dit rijtje: 286 liter, label D.',
    highlights: [
      '286 liter — meeste inhoud in de vergelijking',
      'fastFreezing — sneller invriezen, minder kwaliteitsverlies',
      'Label D · 200 kWh · 34 dB',
      'Waterafvoer voor makkelijk ontdooien'
    ],
    description:
      'De Whirlpool WHMFF 6312 W5E is met 286 liter de ruimste vrieskast in dit overzicht, bij een energielabel D en 200 kWh per jaar — beter dan de meeste AEG- en Smeg-modellen hier. De fastFreezing-functie vriest boodschappen sneller in, wat smaak, structuur en voedingswaarde beter behoudt. Met 34 dB is dit een van de stillere modellen. Een waterafvoersysteem maakt ontdooien en schoonmaken eenvoudiger.',
    specs: [
      ['Type', 'Vrijstaande vrieskast'],
      ['Netto inhoud', '286 liter'],
      ['Afmetingen (h×b×d)', '186,5 × 59,7 × 70,9 cm'],
      ['Energielabel', 'D — 200 kWh/jaar'],
      ['Geluidsniveau', '34 dB(A) — geluidsklasse B'],
      ['Invriescapaciteit', '15 kg/24 uur'],
      ['Snelvriezen', 'fastFreezing'],
      ['Ontdooiing', 'Waterafvoersysteem'],
      ['Deuralarm', 'Ja']
    ],
    photos: [
      { src: 'assets/photos-vriezer/whirlpool-whmff6312w5e/01-gesloten.jpg', label: 'Dicht' },
      { src: 'assets/photos-vriezer/whirlpool-whmff6312w5e/02-open.jpg', label: 'Open — indeling' }
    ],
    photoCredit: 'Productfoto: Whirlpool (European Appliances Netherlands BV).',
    photoUrl: 'https://www.whirlpool.nl/w/whirlpool-vrijstaande-diepvriezer-whmff-6312-w5e/859991740610',
    photoLabel: 'Foto’s op Whirlpool.nl',
    expertUrl: 'https://www.expert.nl/zoeken?q=WHMFF+6312+W5E'
  },
  {
    id: 'whirlpool-whmff6312xp5e',
    brand: 'Whirlpool',
    model: 'WHMFF 6312 XP5E',
    series: 'fastFreezing',
    kleur: 'Grijs (New Silver)',
    group: 'vriezer',
    accent: '#0a3d91',
    source: 'expert',
    price: 889,
    priceNote: 'prijs Expert.nl, 9 augustus 2026; afmetingen en geluidsniveau uit het Whirlpool-datasheet',
    cheaper: null,
    reviews: {
      status: 'none',
      checked: '10 augustus 2026'
    },
    buildQuality: {
      scope: 'Merkbreed (Whirlpool-vriezers) — niet apart getest voor dit model',
      drawers: 'Gebruikers melden dat het bovenste vriesvakklepje kwetsbaar is en dat plastic lades kunnen scheuren bij oneigenlijk gebruik.',
      shelves: 'Dezelfde kwetsbaarheid wordt genoemd voor legplanken/platen als voor de lades.',
      plastic: 'De bredere merkreputatie (niet vriezer-specifiek) wijst op kostenbesparing op plastic onderdelen; ervaringen lopen sterk uiteen, van tevreden gebruikers na jarenlang gebruik tot mensen die het "de slechtste vriezer ooit" noemen.',
      note: 'Ervaringen sterk wisselend en niet specifiek bevestigd voor dit exacte model — gebaseerd op Whirlpool-vriezers in het algemeen.',
      checked: '10 augustus 2026'
    },
    energy: 'D',
    energyKwh: 200,
    heightCm: 186.5,
    widthCm: 59.7,
    depthCm: 70.9,
    noiseDb: 34,
    noiseClass: 'B',
    capacityL: 286,
    tagline: 'Zelfde 286 liter als de witte W5E, nu in inox-look.',
    highlights: [
      '286 liter — meeste inhoud in de vergelijking',
      'Inox-look (New Silver) in plaats van wit',
      'fastFreezing — sneller invriezen',
      'Label D · 200 kWh · 34 dB'
    ],
    description:
      'De Whirlpool WHMFF 6312 XP5E is technisch gelijk aan de witte WHMFF 6312 W5E — 286 liter, label D, 200 kWh, 34 dB — maar in de grijze New Silver-afwerking in plaats van wit. Verder dezelfde fastFreezing-functie en hetzelfde waterafvoersysteem voor het ontdooien.',
    specs: [
      ['Type', 'Vrijstaande vrieskast'],
      ['Netto inhoud', '286 liter'],
      ['Afmetingen (h×b×d)', '186,5 × 59,7 × 70,9 cm'],
      ['Energielabel', 'D — 200 kWh/jaar'],
      ['Geluidsniveau', '34 dB(A) — geluidsklasse B'],
      ['Invriescapaciteit', '15 kg/24 uur'],
      ['Snelvriezen', 'fastFreezing'],
      ['Ontdooiing', 'Waterafvoersysteem'],
      ['Kleur', 'New Silver (inox-look)']
    ],
    photos: [
      { src: 'assets/photos-vriezer/whirlpool-whmff6312xp5e/01-gesloten.jpg', label: 'Dicht' },
      { src: 'assets/photos-vriezer/whirlpool-whmff6312xp5e/02-open.jpg', label: 'Open — indeling' }
    ],
    photoCredit: 'Productfoto: Whirlpool France (vtexassets).',
    photoUrl: 'https://www.whirlpool.nl/w/whirlpool-whmff-6312-xp5e-diepvriezer-kastmodel/859991740620',
    photoLabel: 'Foto’s op Whirlpool.nl',
    expertUrl: 'https://www.expert.nl/zoeken?q=WHMFF+6312+XP5E'
  },
  {
    id: 'whirlpool-whmff1292w4e',
    brand: 'Whirlpool',
    model: 'WHMFF 1292 W4E',
    series: '',
    kleur: 'Wit',
    group: 'vriezer',
    accent: '#0a3d91',
    source: 'expert',
    price: 659,
    priceNote: 'prijs Expert.nl, 9 augustus 2026; overige specificaties uit publieke Whirlpool-productinformatie, niet Expert-specifiek geverifieerd',
    cheaper: {
      shop: 'bol.com (verkoper Art & Craft)',
      price: 499,
      savings: 160,
      url: 'https://www.bol.com/nl/nl/p/whirlpool-whmff-1292-w4e-diepvriezer-vrieskast-vrijstaand-256-l-wit/9300000269024650/'
    },
    reviews: {
      status: 'none',
      checked: '10 augustus 2026'
    },
    buildQuality: {
      scope: 'Merkbreed (Whirlpool-vriezers) — niet apart getest voor dit model',
      drawers: 'Gebruikers melden dat het bovenste vriesvakklepje kwetsbaar is en dat plastic lades kunnen scheuren bij oneigenlijk gebruik.',
      shelves: 'Dezelfde kwetsbaarheid wordt genoemd voor legplanken/platen als voor de lades.',
      plastic: 'De bredere merkreputatie (niet vriezer-specifiek) wijst op kostenbesparing op plastic onderdelen; ervaringen lopen sterk uiteen, van tevreden gebruikers na jarenlang gebruik tot mensen die het "de slechtste vriezer ooit" noemen.',
      note: 'Ervaringen sterk wisselend en niet specifiek bevestigd voor dit exacte model — gebaseerd op Whirlpool-vriezers in het algemeen.',
      checked: '10 augustus 2026'
    },
    energy: 'E',
    energyKwh: 240,
    heightCm: 171.4,
    widthCm: 59.5,
    depthCm: 70,
    noiseDb: 38,
    capacityL: 256,
    tagline: 'Het goedkoopste model — en met 171 cm ook het laagste.',
    highlights: [
      'Laagste prijs van de zeven: € 659',
      'Compacter: 171,4 cm hoog',
      'Interieurverlichting + transparante lades',
      'Invriescapaciteit 18 kg/24 uur'
    ],
    description:
      'De Whirlpool WHMFF 1292 W4E is de instapper: goedkoper én lager dan de andere modellen in dit overzicht, met 256 liter netto inhoud. Interieurverlichting en transparante lades houden overzicht in de inhoud, en met een invriescapaciteit van 18 kg per 24 uur vries je relatief veel tegelijk in voor dit formaat. Label E en 38 dB liggen in de middenmoot van de vergelijking.',
    specs: [
      ['Type', 'Vrijstaande vrieskast'],
      ['Netto inhoud', '256 liter'],
      ['Afmetingen (h×b×d)', '171,4 × 59,5 × 70 cm'],
      ['Energielabel', 'E — 240 kWh/jaar'],
      ['Geluidsniveau', '38 dB(A)'],
      ['Invriescapaciteit', '18 kg/24 uur'],
      ['Verlichting', 'Interieurverlichting'],
      ['Lades', 'Transparant'],
      ['Ontdooiing', 'Waterafvoersysteem']
    ],
    photos: [
      { src: 'assets/photos-vriezer/whirlpool-whmff1292w4e/01-gesloten.webp', label: 'Dicht' },
      { src: 'assets/photos-vriezer/whirlpool-whmff1292w4e/02-open.webp', label: 'Open — indeling' }
    ],
    photoCredit: 'Productfoto: Whirlpool, via Krëfel.be.',
    photoUrl: 'https://www.whirlpool.be/nl_BE/w/whirlpool-whmff-1292-w4e-diepvries-kastmodel/859991739970',
    photoLabel: 'Foto’s op Whirlpool.be',
    expertUrl: 'https://www.expert.nl/zoeken?q=WHMFF+1292+W4E'
  },
  {
    id: 'whirlpool-whlf1292w5e',
    brand: 'Whirlpool',
    model: 'WHLF 1292 W5E',
    series: 'Total NoFrost',
    kleur: 'Wit',
    group: 'vriezer',
    accent: '#0a3d91',
    source: 'expert',
    price: 729,
    priceNote: 'prijs Expert.nl, 9 augustus 2026; overige specificaties uit publieke Whirlpool-productinformatie, niet Expert-specifiek geverifieerd',
    cheaper: null,
    reviews: {
      status: 'none',
      checked: '10 augustus 2026'
    },
    buildQuality: {
      scope: 'Merkbreed (Whirlpool-vriezers) — niet apart getest voor dit model',
      drawers: 'Gebruikers melden dat het bovenste vriesvakklepje kwetsbaar is en dat plastic lades kunnen scheuren bij oneigenlijk gebruik.',
      shelves: 'Dezelfde kwetsbaarheid wordt genoemd voor legplanken/platen als voor de lades.',
      plastic: 'De bredere merkreputatie (niet vriezer-specifiek) wijst op kostenbesparing op plastic onderdelen; ervaringen lopen sterk uiteen, van tevreden gebruikers na jarenlang gebruik tot mensen die het "de slechtste vriezer ooit" noemen.',
      note: 'Ervaringen sterk wisselend en niet specifiek bevestigd voor dit exacte model — gebaseerd op Whirlpool-vriezers in het algemeen.',
      checked: '10 augustus 2026'
    },
    energy: 'D',
    energyKwh: 193,
    heightCm: 170.5,
    widthCm: 59.7,
    depthCm: 70.9,
    noiseDb: 38,
    capacityL: 260,
    tagline: 'Total NoFrost en het beste label D-verbruik: 193 kWh.',
    highlights: [
      'Total NoFrost — geen ontdooien nodig',
      'Zuinigste model: 193 kWh/jaar',
      'Blackout Alert bij stroomuitval',
      'Label D · 260 liter'
    ],
    description:
      'De Whirlpool WHLF 1292 W5E combineert Total NoFrost — volledig automatische ontdooiing — met het laagste jaarverbruik van dit hele overzicht: 193 kWh bij energielabel D. De Blackout Alert-functie houdt de temperatuur in de gaten bij een stroomstoring en waarschuwt als de inhoud risico loopt. Met 260 liter en 170,5 cm is dit een compact maar relatief zuinig model.',
    specs: [
      ['Type', 'Vrijstaande vrieskast'],
      ['Netto inhoud', '260 liter'],
      ['Afmetingen (h×b×d)', '170,5 × 59,7 × 70,9 cm'],
      ['Energielabel', 'D — 193 kWh/jaar'],
      ['Geluidsniveau', '38 dB(A)'],
      ['Vriestechnologie', 'Total NoFrost'],
      ['Extra', 'Blackout Alert bij stroomuitval']
    ],
    photos: [
      { src: 'assets/photos-vriezer/whirlpool-whlf1292w5e/01-gesloten.jpg', label: 'Dicht' },
      { src: 'assets/photos-vriezer/whirlpool-whlf1292w5e/02-open.jpg', label: 'Open — indeling' }
    ],
    photoCredit: 'Productfoto: Whirlpool, via Van Loock Electro.',
    photoUrl: 'https://www.whirlpool.nl/w/whirlpool-whlf-1292-w5e-diepvriezer-kastmodel/859993311710',
    photoLabel: 'Foto’s op Whirlpool.nl',
    expertUrl: 'https://www.expert.nl/zoeken?q=WHLF+1292+W5E'
  },
  {
    id: 'smeg-ff18en2hx',
    brand: 'Smeg',
    model: 'FF18EN2HX',
    series: '',
    kleur: 'Rvs',
    group: 'vriezer',
    accent: '#1d1d1b',
    source: 'expert',
    price: 827,
    priceNote: 'prijs Expert.nl, 9 augustus 2026; specificaties van dezelfde productpagina',
    cheaper: null,
    reviews: {
      status: 'none',
      checked: '10 augustus 2026'
    },
    buildQuality: {
      scope: 'Merkbreed (Smeg-koelkasten en -vriezers) — niet apart getest voor dit model',
      drawers: 'Meerdere gebruikers melden dat een groente- of vrieslade broos is en na korte tijd breekt; één gebruiker kocht vervangende bakjes bij een budgetwinkel omdat die steviger bleken.',
      shelves: 'Klachten over plastic vriesdeurtjes/klepjes die breken, gemeld door meerdere gebruikers.',
      plastic: 'Rubberen afdichtingen raakten bij sommige gebruikers defect, met ijsvorming tot gevolg. Reacties lopen sterk uiteen, van "prachtig en stevig" tot "duur prul".',
      note: 'Klachten gaan over Smeg-koelkasten en -vriezers in het algemeen; niet specifiek bevestigd voor de FF18EN2HX. Bij de hoge prijsklasse van Smeg verwachten sommige reviewers meer van de bouwkwaliteit.',
      checked: '10 augustus 2026'
    },
    energy: 'E',
    energyKwh: 249,
    heightCm: 186,
    widthCm: 60,
    depthCm: 65,
    noiseDb: 41,
    capacityL: 280,
    tagline: 'De meeste lades — 7 stuks — in roestvrijstaal.',
    highlights: [
      '7 lades — meeste van de vergelijking',
      'NoFrost, geen ontdooien nodig',
      'Snelvriesknop + ijsblokjeshouder',
      'Klimaatklasse SN-T'
    ],
    description:
      'De Smeg FF18EN2HX is een vrijstaande vrieskast in roestvrijstaal met 280 liter inhoud, verdeeld over 7 lades — de meeste van dit overzicht. NoFrost-technologie voorkomt ijsvorming door lucht te laten circuleren en vocht naar buiten af te voeren, zodat handmatig ontdooien niet nodig is. Een snelvriesknop en ingebouwde ijsblokjeshouder maken hem praktisch voor dagelijks gebruik. Met 41 dB is dit wel het minst stille model in de vergelijking.',
    specs: [
      ['Type', 'Vrijstaande vrieskast'],
      ['Netto inhoud', '280 liter'],
      ['Afmetingen (h×b×d)', '186 × 60 × 65 cm'],
      ['Energielabel', 'E — 249 kWh/jaar'],
      ['Geluidsniveau', '41 dB(A)'],
      ['Lades', '7 (5 lades + 2 met klep)'],
      ['Klimaatklasse', 'SN-T'],
      ['Snelvriezen', 'Snelvriesknop'],
      ['Extra', 'Ingebouwde ijsblokjeshouder'],
      ['Verlichting', 'LED']
    ],
    photos: [
      { src: 'assets/photos-vriezer/smeg-ff18en2hx/01-gesloten.webp', label: 'Dicht' },
      { src: 'assets/photos-vriezer/smeg-ff18en2hx/02-open.jpg', label: 'Open — indeling' }
    ],
    photoCredit: 'Productfoto: Smeg, via Expert.nl.',
    photoUrl: 'https://www.smeg.com/nl',
    photoLabel: 'Smeg.com',
    expertUrl: 'https://www.expert.nl/smeg-ff18en2hx-rvs-372588180'
  },
  {
    id: 'beko-rfne448e35w',
    brand: 'Beko',
    model: 'RFNE448E35W',
    series: 'ProSmart',
    kleur: 'Wit',
    group: 'vriezer',
    accent: '#e2001a',
    source: 'expert',
    price: 849,
    priceNote: 'prijs en specificaties van de productpagina op Expert.nl, 9 augustus 2026',
    cheaper: {
      shop: 'Bol.com',
      price: 699,
      savings: 150,
      url: 'https://www.bol.com/nl/p/beko-rfne448e35w-vrieskast-nofrost/9300000010315248/'
    },
    reviews: {
      status: 'found',
      score: 9.0,
      scale: 10,
      count: 13,
      source: 'Coolblue.nl',
      url: 'https://www.coolblue.nl/product/900412/beko-rfne448e35w.html',
      pros: [
        'Groot, zuinig en stil ten opzichte van oudere vriezers',
        'Rustige werking (geluidsscore 8,0/10 bij Coolblue)',
        'Handige deurgreep met klik-systeem',
        'Overzichtelijke indeling van de lades en fijn digitaal display'
      ],
      cons: [
        'Eén reviewer noemde de bezorging tot aan de deur, niet naar binnen gedragen'
      ],
      note: 'Kleine steekproef (13 reviews) die opvallend positief is — geen enkele review onder de 4 sterren.',
      checked: '10 augustus 2026'
    },
    buildQuality: {
      scope: 'Merkbreed (Beko-vriezers) — niet apart getest voor dit model',
      drawers: 'De bouwkwaliteit wordt als middenklasse en robuust voor dagelijks gebruik omschreven; deur en lades worden wel aangeraden voorzichtig te behandelen.',
      shelves: 'Geen specifieke klachten gevonden over vakken of platen.',
      plastic: 'Eén gebruiker meldde dat een Beko-vriezer na 3 jaar kapotging, met problemen bij het registreren van de garantie — geen structurele klacht over plastic onderdelen specifiek.',
      note: 'Overwegend positieve ervaringen over prijs-kwaliteitverhouding; geen klachten specifiek voor dit model gevonden.',
      checked: '10 augustus 2026'
    },
    energy: 'E',
    energyKwh: 292,
    heightCm: 192,
    widthCm: 70,
    depthCm: 77,
    noiseDb: 38,
    capacityL: 404,
    tagline: 'Verreweg de grootste: 404 liter, ook breder en dieper dan de rest.',
    highlights: [
      '404 liter — veruit de meeste inhoud',
      'ProSmart-invertercompressor, stil en zuinig voor dit formaat',
      '8 lades + 2 glazen platen',
      'Freezer Guard — werkt door tot -15°C omgevingstemperatuur'
    ],
    description:
      'De Beko RFNE448E35W is met 404 liter ruim de grootste vrieskast in dit overzicht — ook merkbaar breder (70 cm) en dieper (77 cm) dan de andere modellen, die allemaal rond de 59-65 cm blijven. De ProSmart-invertercompressor houdt het geluidsniveau met 38 dB toch laag voor dit formaat. Acht lades en twee glazen platen bieden veel indeelbare ruimte, en Freezer Guard-technologie laat hem ook in een onverwarmde garage of schuur tot -15°C werken.',
    specs: [
      ['Type', 'Vrijstaande vrieskast'],
      ['Netto inhoud', '404 liter'],
      ['Afmetingen (h×b×d)', '192 × 70 × 77 cm'],
      ['Energielabel', 'E — 292 kWh/jaar'],
      ['Geluidsniveau', '38 dB(A)'],
      ['Lades', '8 + 2 glazen platen'],
      ['Compressor', 'ProSmart-inverter'],
      ['Omgevingstemperatuur', 'Tot -15°C (Freezer Guard)'],
      ['Ontdooiing', 'NoFrost']
    ],
    photos: [
      { src: 'assets/photos-vriezer/beko-rfne448e35w/01-gesloten.webp', label: 'Dicht' },
      { src: 'assets/photos-vriezer/beko-rfne448e35w/02-open.jpg', label: 'Open — indeling' }
    ],
    photoCredit: 'Productfoto: Beko, via Expert.nl.',
    photoUrl: 'https://www.beko.com/nl-nl/producten/vrijstaande-vriezers/404-l-rechtop-diepvriezer-rfne448e35w',
    photoLabel: 'Foto’s op Beko.com',
    expertUrl: 'https://www.expert.nl/beko-rfne448e35w-372579133'
  },
  {
    id: 'inventum-vr1850w',
    brand: 'Inventum',
    model: 'VR1850W',
    series: '',
    kleur: 'Wit',
    group: 'vriezer',
    accent: '#2b2d42',
    source: 'expert',
    price: 699,
    priceNote: 'prijs en specificaties van de productpagina op Expert.nl, 9 augustus 2026',
    cheaper: {
      shop: 'Keukenloods.nl',
      price: 600,
      savings: 99,
      url: 'https://www.keukenloods.nl/vr1850w.html'
    },
    reviews: {
      status: 'found',
      score: 4.3,
      scale: 5,
      count: 25,
      source: 'bol.com',
      url: 'https://www.bol.com/nl/nl/p/inventum-vr1850w-vrijstaande-vriezer-kastmodel-no-frost-272-liter-8-lades-vakken-wit/9300000170962043/',
      pros: [
        'Bereikt de ingestelde temperatuur snel',
        'Lades en deur schuiven soepel',
        'Werkt rustig',
        'Goede LED-verlichting, oogt ruim van binnen'
      ],
      cons: [
        'Bijgeleverd ijsblokjesbakje is breekbaar — meldingen dat het brak bij het uithalen van blokjes'
      ],
      checked: '10 augustus 2026'
    },
    buildQuality: {
      scope: 'Gebaseerd op vergelijkbare Inventum-modellen (VR1680, VR550/VR550B) — niet apart bevestigd voor de VR1850-serie zelf, al is deze bouwkundig vergelijkbaar',
      drawers: 'Reviews van vergelijkbare modellen noemen de lades consistent stevig — "geen goedkoop plastic" — met een luxe ogende transparante uitvoering.',
      shelves: 'Geen aparte legplanken bij dit type (volledig ladesysteem); geen klachten gevonden.',
      plastic: 'Los van het bijgeleverde ijsblokjesbakje (zie hierboven) geen klachten gevonden over kunststof onderdelen; gebruikers benadrukken juist de prijs-kwaliteitverhouding.',
      note: 'Voor déze modellen (VR1850W/B) is vooral het ijsblokjesbakje een terugkerend puntje; de algemene ladekwaliteit van het merk wordt in reviews van verwante modellen steevast positief genoemd.',
      checked: '10 augustus 2026'
    },
    energy: 'C',
    energyKwh: 157,
    heightCm: 185,
    widthCm: 59.5,
    depthCm: 64.4,
    noiseDb: 39,
    capacityL: 272,
    tagline: 'Beste energielabel van de vergelijking: C bij 157 kWh/jaar.',
    highlights: [
      'Energielabel C — geen ander model komt hoger',
      'Laagste jaarverbruik: 157 kWh',
      '5 jaar fabrieksgarantie van Inventum',
      'Digitaal display, 5 lades + 2 deurvakken'
    ],
    description:
      'De Inventum VR1850W springt eruit met energielabel C en 157 kWh per jaar — merkbaar zuiniger dan alle andere modellen in dit overzicht, die allemaal op D of E zitten. Met 272 liter, 3 glazen platen, 5 transparante lades en 2 deurvakken is de indeling vergelijkbaar met de andere modellen rond de 185-186 cm. Inventum geeft er 5 jaar fabrieksgarantie op.',
    specs: [
      ['Type', 'Vrijstaande vrieskast'],
      ['Netto inhoud', '272 liter'],
      ['Afmetingen (h×b×d)', '185 × 59,5 × 64,4 cm'],
      ['Energielabel', 'C — 157 kWh/jaar'],
      ['Geluidsniveau', '39 dB(A)'],
      ['Lades', '5 transparante lades + 3 glazen platen + 2 deurvakken'],
      ['Snelvriezen', 'Supervriezen'],
      ['Ontdooiing', 'Low Frost'],
      ['Garantie', '5 jaar fabrieksgarantie']
    ],
    photos: [
      { src: 'assets/photos-vriezer/inventum-vr1850w/01-gesloten.webp', label: 'Dicht' },
      { src: 'assets/photos-vriezer/inventum-vr1850w/02-open.jpg', label: 'Open — indeling' }
    ],
    photoCredit: 'Productfoto: Inventum, via Expert.nl.',
    photoUrl: 'https://www.inventum.eu/vrijstaande-apparaten/koelen-vriezen/vr1850w/',
    photoLabel: 'Foto’s op Inventum.eu',
    expertUrl: 'https://www.expert.nl/inventum-vr1850w-372636897'
  },
  {
    id: 'inventum-vr1850b',
    brand: 'Inventum',
    model: 'VR1850B',
    series: '',
    kleur: 'Zwart',
    group: 'vriezer',
    accent: '#2b2d42',
    source: 'expert',
    price: 665,
    priceNote: 'prijs en specificaties van de productpagina op Expert.nl, 9 augustus 2026',
    cheaper: {
      shop: 'Keukenloods.nl',
      price: 600,
      savings: 65,
      url: 'https://www.keukenloods.nl/vr1850b.html'
    },
    reviews: {
      status: 'found',
      score: 4.3,
      scale: 5,
      count: 25,
      source: 'bol.com',
      url: 'https://www.bol.com/nl/nl/p/inventum-vr1850b-vrijstaande-vriezer-kastmodel-no-frost-272-liter-8-lades-vakken-zwart-rvs/9300000170962041/',
      pros: [
        'Zuinig in gebruik (~0,5 kWh per dag bij -20°C, volgens een reviewer)',
        'NoFrost werkt effectief',
        'Fraaie zwarte afwerking',
        'Deur/handgreep opent met weinig kracht'
      ],
      cons: [
        'Zelfde breekbare ijsblokjesbakje als de witte VR1850W'
      ],
      note: 'Exact dezelfde score en 25 reviews als de witte VR1850W — mogelijk een gedeelde reviewpool, met enige onzekerheid over het exacte aantal.',
      checked: '10 augustus 2026'
    },
    buildQuality: {
      scope: 'Gebaseerd op vergelijkbare Inventum-modellen (VR1680, VR550/VR550B) — niet apart bevestigd voor de VR1850-serie zelf, al is deze bouwkundig vergelijkbaar',
      drawers: 'Reviews van vergelijkbare modellen noemen de lades consistent stevig — "geen goedkoop plastic" — met een luxe ogende transparante uitvoering.',
      shelves: 'Geen aparte legplanken bij dit type (volledig ladesysteem); geen klachten gevonden.',
      plastic: 'Los van het bijgeleverde ijsblokjesbakje (zie hierboven) geen klachten gevonden over kunststof onderdelen; gebruikers benadrukken juist de prijs-kwaliteitverhouding.',
      note: 'Voor déze modellen (VR1850W/B) is vooral het ijsblokjesbakje een terugkerend puntje; de algemene ladekwaliteit van het merk wordt in reviews van verwante modellen steevast positief genoemd.',
      checked: '10 augustus 2026'
    },
    energy: 'C',
    energyKwh: 157,
    heightCm: 185,
    widthCm: 59.5,
    depthCm: 64.4,
    noiseDb: 39,
    capacityL: 272,
    tagline: 'Zelfde zuinige C-label als de witte VR1850W, nu in zwart staal — en goedkoper.',
    highlights: [
      'Energielabel C — geen ander model komt hoger',
      'Goedkoper dan de witte versie: € 665',
      'Zwart roestvrijstaal design',
      '5 jaar fabrieksgarantie van Inventum'
    ],
    description:
      'De Inventum VR1850B is technisch gelijk aan de witte VR1850W — energielabel C, 157 kWh, 272 liter, 39 dB — maar in zwart roestvrijstaal en met een lagere prijs (€ 665 tegenover € 699). Zelfde 5 transparante lades, Low Frost-technologie en 5 jaar fabrieksgarantie.',
    specs: [
      ['Type', 'Vrijstaande vrieskast'],
      ['Netto inhoud', '272 liter'],
      ['Afmetingen (h×b×d)', '185 × 59,5 × 64,4 cm'],
      ['Energielabel', 'C — 157 kWh/jaar'],
      ['Geluidsniveau', '39 dB(A)'],
      ['Lades', '5 transparante lades + 2 deurvakken'],
      ['Snelvriezen', 'Supervriezen'],
      ['Ontdooiing', 'Low Frost'],
      ['Kleur', 'Zwart roestvrijstaal'],
      ['Garantie', '5 jaar fabrieksgarantie']
    ],
    photos: [
      { src: 'assets/photos-vriezer/inventum-vr1850b/01-gesloten.webp', label: 'Dicht' },
      { src: 'assets/photos-vriezer/inventum-vr1850b/02-open.jpg', label: 'Open — indeling' }
    ],
    photoCredit: 'Productfoto: Inventum, via Expert.nl.',
    photoUrl: 'https://www.inventum.eu/vrijstaande-apparaten/vriezers/vr1850b/',
    photoLabel: 'Foto’s op Inventum.eu',
    expertUrl: 'https://www.expert.nl/inventum-vr1850b-zwart-372636896'
  },
  {
    id: 'beko-b5rfne315g',
    brand: 'Beko',
    model: 'B5RFNE315G',
    series: 'ProSmart',
    kleur: 'Zwart',
    group: 'vriezer',
    accent: '#e2001a',
    source: 'expert',
    price: 649,
    priceNote: 'prijs en specificaties van de productpagina op Expert.nl, 9 augustus 2026',
    cheaper: null,
    reviews: {
      status: 'insufficient',
      score: 8.5,
      scale: 10,
      count: 1,
      source: 'Coolblue.nl',
      url: 'https://www.coolblue.nl/product/968692/beko-b5rfne315g.html',
      checked: '10 augustus 2026'
    },
    buildQuality: {
      scope: 'Merkbreed (Beko-vriezers) — niet apart getest voor dit model',
      drawers: 'De bouwkwaliteit wordt als middenklasse en robuust voor dagelijks gebruik omschreven; deur en lades worden wel aangeraden voorzichtig te behandelen.',
      shelves: 'Geen specifieke klachten gevonden over vakken of platen.',
      plastic: 'Eén gebruiker meldde dat een Beko-vriezer na 3 jaar kapotging, met problemen bij het registreren van de garantie — geen structurele klacht over plastic onderdelen specifiek.',
      note: 'Overwegend positieve ervaringen over prijs-kwaliteitverhouding; geen klachten specifiek voor dit model gevonden.',
      checked: '10 augustus 2026'
    },
    energy: 'D',
    energyKwh: 200,
    heightCm: 186.5,
    widthCm: 59.7,
    depthCm: 70.9,
    noiseDb: 34,
    capacityL: 286,
    tagline: 'Goedkoopste model dat ook nog eens tot de stilste behoort: € 649, 34 dB.',
    highlights: [
      'Laagste prijs van alle twaalf modellen op Expert.nl: € 649',
      'Stilst samen met de Whirlpool 6312-serie: 34 dB',
      'SmoothFit-deur opent 90° zonder uit te steken — ideaal in een hoek',
      '3 geharde glazen platen, elk tot 25 kg'
    ],
    description:
      'De Beko B5RFNE315G is met € 649 het goedkoopste model in de hele vergelijking, en met 34 dB tegelijk een van de stilste — dankzij de ProSmart-invertercompressor. De SmoothFit-deur opent tot 90° zonder voor de kast uit te steken, handig bij plaatsing in een hoek. Drie geharde glazen platen dragen elk tot 25 kg, en de deur is omkeerbaar naar de andere kant.',
    specs: [
      ['Type', 'Vrijstaande vrieskast'],
      ['Netto inhoud', '286 liter'],
      ['Afmetingen (h×b×d)', '186,5 × 59,7 × 70,9 cm'],
      ['Energielabel', 'D — 200 kWh/jaar'],
      ['Geluidsniveau', '34 dB(A)'],
      ['Compressor', 'ProSmart-inverter'],
      ['Platen', '3 geharde glazen platen, 25 kg per stuk'],
      ['Deur', 'Omkeerbaar, SmoothFit tot 90°'],
      ['Ontdooiing', 'NoFrost']
    ],
    photos: [
      { src: 'assets/photos-vriezer/beko-b5rfne315g/01-gesloten.webp', label: 'Dicht' },
      { src: 'assets/photos-vriezer/beko-b5rfne315g/02-open.jpg', label: 'Open — indeling' }
    ],
    photoCredit: 'Productfoto: Beko, via Expert.nl.',
    photoUrl: 'https://www.beko.com/nl-nl/producten/vrijstaande-vriezers/plaats-instellingen-vrijstaand-afwasmachine-b5rfne315g',
    photoLabel: 'Foto’s op Beko.com',
    expertUrl: 'https://www.expert.nl/beko-b5rfne315g-zwart-372649839'
  },
  {
    id: 'etna-vv172nrvs',
    brand: 'ETNA',
    model: 'VV172NRVS',
    series: 'Multi Flow 360',
    kleur: 'Rvs',
    group: 'vriezer',
    accent: '#0f6e5c',
    source: 'expert',
    price: 694,
    priceNote: 'prijs en specificaties van de productpagina op Expert.nl, 9 augustus 2026',
    cheaper: {
      shop: 'Keukenloods.nl',
      price: 613,
      savings: 81,
      url: 'https://www.keukenloods.nl/product/etna-vv172nrvs-vriezer-etna/'
    },
    award: 'Hoogst beoordeeld door de Consumentenbond',
    reviews: {
      status: 'found',
      score: 9.3,
      scale: 10,
      count: 59,
      source: 'Kieskeurig.nl',
      url: 'https://www.kieskeurig.nl/vriezer/product/50903015-etna-vv172nrvs-diepvriezer-vrieskast-vrijstaand-240-l-roestvrijstaal/reviews',
      pros: [
        'Bijna geluidloos in gebruik',
        'Geen handmatig ontdooien nodig',
        'Ruime, overzichtelijke lades',
        'Fast Freeze-functie werkt goed',
        'Sterke prijs-kwaliteitverhouding, bevestigd door de Consumentenbond-titels'
      ],
      cons: [
        'Sommige kunststof onderdelen voelen minder premium aan',
        'Deur vraagt net iets meer kracht om direct na sluiten weer te openen',
        'Kort aansluitsnoer',
        'Geen los temperatuuralarm',
        'Lades kunnen lastig te bewegen zijn als de vriezer volgeladen is'
      ],
      note: 'Score en aantal ook bevestigd via een tweede bron (Coolblue.nl: 9,0/10 bij 44 reviews).',
      checked: '10 augustus 2026'
    },
    buildQuality: {
      scope: 'Combinatie van reviews voor dit model en vergelijkbare Etna-vriezers/koelkasten',
      drawers: 'Reviewers beschrijven de telescopische lades als stevig en soepel lopend op kleine wieltjes/lagers.',
      shelves: 'Enkele gebruikers van vergelijkbare Etna-modellen hadden liever iets stevigere glasplaten gezien — de enige concrete kritiek die gevonden is.',
      plastic: 'Materiaal maakt over het algemeen een stevige indruk, met een deur op zachte rubbers; dit sluit aan bij het "sommige kunststof onderdelen voelen minder premium aan" dat in de reviewsamenvatting hierboven staat.',
      note: 'Grotendeels in lijn met de reviewsamenvatting hierboven; aangevuld met bevindingen van vergelijkbare Etna-modellen voor de lades en legplanken.',
      checked: '10 augustus 2026'
    },
    energy: 'C',
    energyKwh: 150,
    heightCm: 172,
    widthCm: 59.5,
    depthCm: 60,
    noiseDb: 36,
    capacityL: 240,
    tagline: 'Als enige in dit overzicht getest en aanbevolen door de Consumentenbond.',
    highlights: [
      'Consumentenbond: Beste koop (jan 2026) én Beste uit de test (feb 2026)',
      'Duurzaamheidsscore 8,4 bij de Consumentenbond',
      'Zuinigste model: 150 kWh/jaar, label C',
      'Werkt door tot -15°C — ook geschikt voor de schuur'
    ],
    description:
      'De ETNA VV172NRVS is het enige model in dit overzicht met een Consumentenbond-test erbij: Beste koop in januari 2026 én Beste uit de test in februari 2026, met een duurzaamheidsscore van 8,4. Met 150 kWh per jaar bij energielabel C is het ook het zuinigste model van de twaalf. Multi Flow 360-technologie houdt de temperatuur gelijkmatig, FastFreeze vriest nieuwe boodschappen snel in, en dankzij de compressor die tot -15°C omgevingstemperatuur blijft werken kan hij ook in een onverwarmde schuur of garage staan. Met 240 liter over 5 lades en 2 schappen is de inhoud wel de kleinste van de vergelijking.',
    specs: [
      ['Type', 'Vrijstaande vrieskast'],
      ['Netto inhoud', '240 liter'],
      ['Afmetingen (h×b×d)', '172 × 59,5 × 60 cm'],
      ['Energielabel', 'C — 150 kWh/jaar'],
      ['Geluidsniveau', '36 dB(A)'],
      ['Lades', '5 lades + 2 schappen'],
      ['Snelvriezen', 'FastFreeze'],
      ['Luchtcirculatie', 'Multi Flow 360'],
      ['Omgevingstemperatuur', 'Tot -15°C'],
      ['Ontdooiing', 'NoFrost'],
      ['Test', 'Consumentenbond: Beste koop (jan 2026), Beste uit de test (feb 2026), duurzaamheidsscore 8,4 (feb 2026)']
    ],
    photos: [
      { src: 'assets/photos-vriezer/etna-vv172nrvs/01-gesloten.jpg', label: 'Dicht' },
      { src: 'assets/photos-vriezer/etna-vv172nrvs/02-open.jpg', label: 'Open — indeling' }
    ],
    photoCredit: 'Productfoto: ETNA, via Expert.nl.',
    photoUrl: 'https://etna.nl/keukenapparatuur/vv172nrvs/',
    photoLabel: 'Foto’s op Etna.nl',
    expertUrl: 'https://www.expert.nl/etna-vv172nrvs-rvs-372640470'
  }
];

const ENERGY_COLORS = {
  A: '#00a651',
  B: '#4cb847',
  C: '#bfd730',
  D: '#f7e400',
  E: '#f9b233',
  F: '#ef7d00',
  G: '#e30613'
};
