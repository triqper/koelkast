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

Voor de **Siemens KI81RNSE0** staan echte productfoto's in de repo, opgehaald bij
Siemens Home (BSH Home Appliances) via de officiële productpagina: vier
fabrieksfoto's plus de officiële maatschets, in `assets/photos/siemens-ki81rnse0/`.

Voor de overige modellen is nog geen fotomateriaal opgehaald. Die kaarten tonen
een schematische tekening **op schaal** — de verhouding breedte/hoogte volgt de
werkelijke buitenmaten, de indeling van plateaus, lades en vriesvakken volgt de
datasheet. Elk detailvenster linkt door naar de productpagina van de fabrikant.

De tekeningen blijven overal staan: bij een model mét foto's komen ze in de
galerij achter de foto's.

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

De foto's verschijnen vóór de tekeningen in de galerij en de eerste foto komt
op de kaart in het overzicht te staan. Laat de array leeg om alleen tekeningen
te tonen.

## Bestanden

```
index.html                 pagina-opbouw
assets/style.css           styling, licht + donker thema
assets/data.js             de dataset (specs, prijzen, features, beschrijvingen)
assets/illustrations.js    SVG-tekeningen, op schaal per model
assets/app.js              kaarten, filters, sortering, detailvenster
assets/photos/<model-id>/  productfoto's per model
```

Geen build-stap, geen dependencies, geen externe requests — open `index.html`
of serveer de map statisch.

## Publiceren

GitHub Pages serveert de branch `gh-pages`. De workflow
`.github/workflows/pages.yml` synchroniseert die branch automatisch bij elke
push naar de standaardbranch.
