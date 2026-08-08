# Koelkast-keuzehulp

Visueel overzicht van zeven inbouwmodellen: per koelkast een kaart met een
coverfoto van 640 px hoog, prijs, energielabel, hoogte, geluidsniveau en unieke
features. De pagina toont alles tegelijk, opgedeeld in drie secties. Klik op de
foto van een kaart om hem op volledige schermgrootte te bekijken; klik ergens
anders op de kaart voor de fotogalerij, de beschrijving en de volledige
specificatielijst.

**Live:** https://triqper.github.io/koelkast/

## Secties

| Sectie | Wat erin staat |
|---|---|
| Volledig koelkast | Geen vriesvak — 4 modellen op 3 kaarten |
| Koelvries combi — hoog | Nis 189,4 cm, plank moet verzet worden — 2 modellen |
| Koelvries combi — huidige maat | Nis 178 cm, past direct — alleen de AEG OSC7C181DS |

De secties komen uit het veld `group` in `assets/data.js`. Het sorteermenu
sorteert binnen elke sectie afzonderlijk. De teller bij een sectiekop telt
modellen, niet kaarten.

## Twee merken op één kaart

De Siemens KI81RNSE0 en de Bosch KIR81NSE0 komen van dezelfde BSH-band: gelijke
inhoud (310 l), label E, 114 kWh/jaar en 35 dB. Ze delen daarom één kaart met een
merkschakelaar; de kaart wisselt dan van foto, prijs, model, nishoogte en
features. Dit staat in `TWINS` in `assets/data.js`:

```js
const TWINS = [
  {
    id: 'bsh-310',
    members: ['siemens-ki81rnse0', 'bosch-kir81nse0'],
    shared: 'Wat de twee gemeen hebben.',
    differs: 'Waarin ze verschillen.'
  }
];
```

Het eerste lid staat standaard op de kaart. De vergelijktabel onderaan de pagina
toont beide modellen altijd, ongeacht wat de schakelaar doet.

## Inhoud tegenover de huidige kast

Elke kaart toont de netto inhoud in liters — bij een koelvries combi gesplitst
in koel en vries — met daarnaast het verschil met de kast die er nu staat. Die
referentie staat in `HUIDIG` in `assets/data.js`:

```js
const HUIDIG = { fridge: 210, freezer: 70 };
```

Groen is meer dan nu, rood is minder. Dat is een verschil, geen oordeel: minder
vriesruimte weegt anders als er een losse vriezer staat.

| Model | Koel | Vries | Totaal |
|---|---|---|---|
| Siemens KI81RNSE0 | 310 l (+100) | geen (−70) | 310 l (+30) |
| Bosch KIR81NSE0 | 310 l (+100) | geen (−70) | 310 l (+30) |
| Liebherr IRBSd 5120 | 294 l (+84) | geen (−70) | 294 l (+14) |
| AEG TK6FS181DS | 307 l (+97) | geen (−70) | 307 l (+27) |
| AEG NSC7C191DS | 207 l (−3) | 62 l (−8) | 269 l (−11) |
| AEG NSC6M191ES | 207 l (−3) | 62 l (−8) | 269 l (−11) |
| AEG OSC7C181DS | 186 l (−24) | 62 l (−8) | 248 l (−32) |

Opvallend: alle drie de combi's zijn kleiner dan wat er nu staat, terwijl de
volledige koelkasten fors meer koelruimte geven maar geen vriesvak hebben.

De tekst in de kolom *Inhoud* van de vergelijktabel wordt uit `capacityFridge`
en `capacityFreezer` afgeleid in plaats van apart genoteerd; de losse tekst gaf
voor de OSC7C181DS 249 l totaal terwijl 186 + 62 = 248.

## Eigen notities

Onderin elke kaart staat een blok *Mijn notities*: typ een regel, kies `+` of
`−`, en hij komt in het lijstje te staan. Enter in het invoerveld voegt de
notitie toe met het gekozen teken. Met het kruisje achter een regel gooi je hem
weg. Klikken in dit blok opent de kaart niet.

De notities staan per model — de Siemens en de Bosch hebben dus elk hun eigen
lijstje, ook al delen ze een kaart.

Ze worden bewaard in `localStorage` onder de sleutel `koelkast-notities-v1`:

```json
{ "aeg-tk6fs181ds": { "pro": ["Stilste model"], "con": ["Geen vriesvak"] } }
```

Dat betekent: per browser en per apparaat, niet gedeeld en niet in de repo. Een
andere browser of een leeggemaakte cache begint met een leeg lijstje. Staat
`localStorage` niet toe (privémodus, `file://`), dan werkt het blok gewoon, maar
is het weg zodra het tabblad sluit. Notitietekst wordt bij het tonen ge-escaped,
dus HTML in een notitie komt als tekst terug.

## Modellen

**Volledig koelkast**

| Model | Prijs | Label | Hoogte | Geluid | Bron |
|---|---|---|---|---|---|
| Siemens KI81RNSE0 | € 905 | E · 114 kWh | 177,5 cm | 35 dB | expert.nl |
| Bosch KIR81NSE0 | € 949 | E · 114 kWh | 177 cm | 35 dB | indicatie |
| Liebherr IRBSd 5120 | € 1.649 | D · 125 kWh | 177 cm | 33 dB | expert.nl |
| AEG TK6FS181DS | € 1.049 | D · **91 kWh** | 177,2 cm | **32 dB** | offerte |

**Koelvries combi — hoog** (nis 189,4 cm)

| Model | Prijs | Label | Hoogte | Geluid | Bron |
|---|---|---|---|---|---|
| AEG NSC7C191DS | € 1.329 | D · 172 kWh | 188,4 cm | 34 dB | offerte |
| AEG NSC6M191ES | € 1.069 | E · 215 kWh | 188,4 cm | 37 dB | offerte |

**Koelvries combi — huidige maat** (nis 178 cm)

| Model | Prijs | Label | Hoogte | Geluid | Bron |
|---|---|---|---|---|---|
| AEG OSC7C181DS | € 1.099 | D · 173 kWh | 177,2 cm | 34 dB | offerte |

## Herkomst van de gegevens

- **AEG (4 modellen) — geverifieerd.** Prijzen uit de offerte van Expert Twello
  (nr. 2601004099, 6 augustus 2026, incl. btw). Specificaties rechtstreeks uit
  de AEG-productdatasheets. Deze dragen het label *offerte*.
- **Siemens en Liebherr — prijs nagekeken op expert.nl** (8 augustus 2026,
  incl. btw). Label *expert.nl*. De Siemens KI81RNSE0 kost daar € 905; de
  eerdere schatting van € 869 was te laag. De Liebherr staat er voor € 1.649
  onder de naam IRBSd 5120-22, gelijk aan de eerdere schatting. Specificaties
  komen uit publieke productinformatie. Dit zijn webshopprijzen, geen
  offerteprijzen.
- **Bosch — niet verkrijgbaar bij Expert.** Expert voert de KIR41NSE0 en de
  KIR81VFE0, maar niet de KIR81NSE0. De prijs van € 949 blijft een indicatie,
  label *indicatie*.

## Afbeeldingen

Alle zeven modellen hebben echte productfoto's van de fabrikant, in
`assets/photos/<model-id>/`. Ze zijn teruggebracht tot maximaal 1200 px, als webp
opgeslagen en van hun witte canvasranden ontdaan; samen ongeveer 2,3 MB.

| Model | Foto's | Bron |
|---|---|---|
| Siemens KI81RNSE0 | 5 | mediaserver BSH Home Appliances |
| Bosch KIR81NSE0 | 5 | mediaserver BSH Home Appliances |
| Liebherr IRBSd 5120 | 11 | Liebherr-CDN (cover) + vakhandel (details) |
| AEG TK6FS181DS | 7 | AEG-beeld via Expert.nl |
| AEG OSC7C181DS | 8 | AEG-beeld via Expert.nl |
| AEG NSC7C191DS | 7 | AEG-beeld via de vakhandel |
| AEG NSC6M191ES | 4 | AEG-beeld via de vakhandel |

`aeg.nl` en `media.aeg.nl` zijn vanuit de bouwomgeving niet bereikbaar (de proxy
geeft een policy denial), vandaar de omweg via Expert en de vakhandel voor AEG.
Van de NSC7C191DS is weinig schone productfotografie beschikbaar; een deel van
die beelden draagt AEG's eigen tekst in de afbeelding.

De foto's zijn auteursrechtelijk beschermd materiaal van de fabrikanten en staan
hier alleen als keuzehulp. De schematische SVG-tekeningen die de pagina eerder
gebruikte zijn vervallen, samen met `assets/illustrations.js`.

### Foto vergroten

Er zijn twee ingangen:

- **Vanaf het overzicht** — klik op de foto van een kaart. De vergroting opent
  meteen bij de eerste foto van dat model, zonder het detailvenster.
- **Vanuit het detailvenster** — klik op de grote foto (of druk Enter als hij
  focus heeft).

In beide gevallen blader je met de pijlen of de pijltjestoetsen door de reeks.
Escape sluit alleen de vergroting; stond het detailvenster open, dan blijft dat
staan. De focus keert terug naar waar je vandaan kwam.

### Zelf foto's toevoegen

1. Zet de bestanden in `assets/photos/<model-id>/`, bijvoorbeeld
   `assets/photos/aeg-nsc7c191ds/01-productfoto.webp`.
2. Vul in `assets/data.js` de `photos`-array van het model. Een pad volstaat;
   een object geeft de foto een eigen bijschrift in de galerij:

   ```js
   photos: [
     { src: 'assets/photos/aeg-nsc7c191ds/01-productfoto.webp', label: 'Productfoto' },
     'assets/photos/aeg-nsc7c191ds/02-interieur.webp'
   ],
   photoCredit: 'Productfoto’s: AEG.',
   ```

   `photoCredit` is optioneel en wordt achter de kleine lettertjes in het
   detailvenster gezet.

De eerste foto uit de array is het kaartbeeld in het overzicht; de rest volgt in
de galerij. Een model zonder foto's krijgt een lege kaart — de galerij kent geen
terugvaloptie meer.

## Bestanden

```
index.html                 pagina-opbouw
assets/style.css           styling, licht + donker thema
assets/data.js             de dataset (specs, prijzen, features, beschrijvingen)
assets/app.js              secties, merkschakelaar, sortering, detailvenster,
                           vergroting, notities
assets/photos/<model-id>/  productfoto's per model
```

Geen build-stap, geen dependencies, geen externe requests — open `index.html`
of serveer de map statisch.

## Publiceren

GitHub Pages serveert de branch `gh-pages`. De workflow
`.github/workflows/pages.yml` synchroniseert die branch automatisch bij elke
push naar de standaardbranch.
