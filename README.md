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

Heeft een model foto's, dan is de **eerste foto de coverfoto** op de kaart in
het overzicht en staan de overige foto's vooraan in de galerij van het
detailvenster. Modellen zonder foto's tonen een schematische tekening **op
schaal** — de verhouding breedte/hoogte volgt de werkelijke buitenmaten, de
indeling van plateaus, lades en vriesvakken volgt de datasheet. De tekeningen
blijven altijd als extra weergaven in de galerij staan, en elk detailvenster
linkt door naar de productpagina van de fabrikant.

Ontbreekt een fotobestand, dan valt die plek terug op het
vooraanzicht-tekeningetje; de pagina blijft dus heel.

### Zelf foto's toevoegen

1. Zet de bestanden in `assets/photos/`, bijvoorbeeld
   `assets/photos/aeg-nsc7c191ds-1.jpg`.
2. Vul in `assets/data.js` de `photos`-array van het model. Een pad volstaat,
   met `{ src, label }` bepaal je het bijschrift in de galerij zelf:

   ```js
   photos: [
     { src: 'assets/photos/aeg-nsc7c191ds-1.jpg', label: 'Deur open' },
     'assets/photos/aeg-nsc7c191ds-2.jpg'
   ],
   ```

Laat de array leeg om alleen tekeningen te tonen.

De Siemens KI81RNSE0 verwacht vier bestanden; welke dat zijn staat in
[`assets/photos/README.md`](assets/photos/README.md). De bouwomgeving kan die
foto's niet zelf ophalen — het uitgaande netwerk blokkeert bsh-group.com,
bol.com en expert.nl (403 policy denial) — dus die vier JPG's moeten er met de
hand bij.

## Bestanden

```
index.html                 pagina-opbouw
assets/style.css           styling, licht + donker thema
assets/data.js             de dataset (specs, prijzen, features, beschrijvingen)
assets/illustrations.js    SVG-tekeningen, op schaal per model
assets/app.js              kaarten, filters, sortering, detailvenster
```

Geen build-stap, geen dependencies, geen externe requests — open `index.html`
of serveer de map statisch.

## Publiceren

GitHub Pages serveert de branch `gh-pages`. De workflow
`.github/workflows/pages.yml` synchroniseert die branch automatisch bij elke
push naar de standaardbranch.
