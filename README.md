# Koelkast-keuzehulp

Visueel overzicht van zeven inbouwmodellen: per koelkast een kaart met tekening,
prijs, energielabel, hoogte, geluidsniveau en unieke features. Klik op een kaart
voor een korte beschrijving, alle afbeeldingen en de volledige specificatielijst.

**Live:** https://triqper.github.io/koelkast/

## Modellen

**Volledig koelkast**

| Model | Prijs | Label | Hoogte | Geluid | Bron |
|---|---|---|---|---|---|
| Siemens KI81RNSE0 | € 869 | E · 114 kWh | 177,5 cm | 35 dB | indicatie |
| Bosch KIR81NSE0 | € 949 | E · 114 kWh | 177 cm | 35 dB | indicatie |
| Liebherr IRBSd 5120 | € 1.649 | D · 125 kWh | 177 cm | 33 dB | indicatie |
| AEG TK6FS181DS | € 1.049 | D · **91 kWh** | 177,2 cm | **32 dB** | offerte |

**Koelvries combi**

| Model | Prijs | Label | Hoogte | Geluid | Bron |
|---|---|---|---|---|---|
| AEG NSC7C191DS | € 1.329 | D · 172 kWh | 188,4 cm | 34 dB | offerte |
| AEG NSC6M191ES | € 1.069 | E · 215 kWh | 188,4 cm | 37 dB | offerte |
| AEG OSC7C181DS | € 1.099 | D · 173 kWh | 177,2 cm | 34 dB | offerte |

## Herkomst van de gegevens

- **AEG (4 modellen) — geverifieerd.** Prijzen uit de offerte van Expert Twello
  (nr. 2601004099, 6 augustus 2026, incl. btw). Specificaties rechtstreeks uit
  de AEG-productdatasheets. Deze dragen het label *offerte*.
- **Siemens, Bosch, Liebherr — niet geverifieerd.** Staan niet op de offerte;
  specificaties uit publieke productinformatie, prijs is een indicatieve
  straatprijs. Label *indicatie*. Niet één-op-één met de offerteprijzen te
  vergelijken.

## Afbeeldingen

Er zijn geen productfoto's als bestand opgenomen: het uitgaande netwerk van de
bouwomgeving blokkeert expert.nl, aeg.nl, bsh-group.com en bosch-home.com
(403 policy denial). Elke kaart bevat daarom een tekening **op schaal** — de
verhouding breedte/hoogte volgt de werkelijke buitenmaten. Elk detailvenster
linkt door naar de productpagina van de fabrikant voor de echte foto's.

### Siemens KI81RNSE0: natekend van de officiële foto's

Voor dit model waren de officiële productfoto's beschikbaar (interieur, deur
open, detail van de bedieningsstrook, ledverlichting). De indeling is daarvan
overgenomen in plaats van uit de specificatietabel afgeleid, en het model heeft
een extra aanzicht **Deur open**. Uit de foto's komen:

- 6 plateaus van veiligheidsglas boven twee vershoudlades met `Fresh`-opdruk en
  een pictogramstrook *fruit & vegetables*;
- het **PowerVentilation**-paneel midden op de achterwand, direct onder de
  bedieningsstrook;
- de bedieningsstrook `super · > · 2 / 3 / 4 / 6 / 8 °C · uit na 3 sec.` —
  vaste standen met led-indicatie, géén cijferdisplay (de generieke tekening
  liet eerder een display met cijfers zien, dat klopte niet);
- 5 deurvakken die naar onderen toe dieper worden, met het flessenvak onderaan;
  deurscharnier rechts.

De vastgelegde indeling staat in `PHOTO_LAYOUT` in `assets/illustrations.js`.
Een model daarin krijgt automatisch de natekende interieur- en
bedieningsaanzichten plus het aanzicht *Deur open*; modellen zonder invoer
houden de schematische tekeningen.

### Zelf foto's toevoegen

1. Zet de bestanden in `assets/photos/`, bijvoorbeeld
   `assets/photos/siemens-ki81rnse0-1.jpg`.
2. Vul in `assets/data.js` de `photos`-array van het model:

   ```js
   photos: [
     'assets/photos/siemens-ki81rnse0-1.jpg',
     'assets/photos/siemens-ki81rnse0-2.jpg'
   ],
   ```

De foto's verschijnen dan vóór de tekeningen in de galerij; de tekeningen
blijven als extra weergaven staan. Laat de array leeg om alleen tekeningen te
tonen. Een bestand dat niet bestaat wordt overgeslagen — een verkeerd pad levert
dus geen kapot plaatje op, alleen een 404 in de console.

## Bestanden

```
index.html                 pagina-opbouw
assets/style.css           styling, licht + donker thema
assets/data.js             de dataset (specs, prijzen, features, beschrijvingen)
assets/illustrations.js    SVG-tekeningen op schaal + PHOTO_LAYOUT (natekend)
assets/app.js              kaarten, filters, sortering, detailvenster
```

Geen build-stap, geen dependencies, geen externe requests — open `index.html`
of serveer de map statisch.

## Publiceren

GitHub Pages serveert de branch `gh-pages`. De workflow
`.github/workflows/pages.yml` synchroniseert die branch automatisch bij elke
push naar de standaardbranch.
