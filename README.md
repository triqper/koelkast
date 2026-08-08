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

Elke kaart heeft een schematische tekening **op schaal** — de verhouding
breedte/hoogte volgt de werkelijke buitenmaten, de indeling van plateaus, lades
en vriesvakken volgt de datasheet. Staan er productfoto's bij een model, dan is
de eerste foto de coverfoto op de kaart en komen de foto's vóór de tekeningen in
de galerij; de tekeningen blijven als extra weergaven staan.

Voor de **Bosch KIR81NSE0** staan vier foto's ingesteld: de volledige koelkast
met geopende deur als cover, plus interieur, MultiBox XXL-lades en het
bedieningspaneel. De bestanden horen in `assets/photos/` — zie
[`assets/photos/README.md`](assets/photos/README.md) voor de exacte
bestandsnamen. Zolang een bestand ontbreekt valt die plek automatisch terug op
de tekening, dus de pagina toont nooit een gebroken afbeelding.

De overige modellen hebben nog geen foto's: het uitgaande netwerk van de
bouwomgeving blokkeert bol.com, expert.nl, aeg.nl en bosch-home.com
(403 policy denial), dus die zijn niet op te halen. Elk detailvenster linkt door
naar de productpagina van de fabrikant.

### Zelf foto's toevoegen

1. Zet de bestanden in `assets/photos/`, bijvoorbeeld
   `assets/photos/aeg-nsc7c191ds-koelkast.jpg`.
2. Vul in `assets/data.js` de `photos`-array van het model:

   ```js
   photos: [
     { src: 'assets/photos/aeg-nsc7c191ds-koelkast.jpg', label: 'Koelkast open' },
     { src: 'assets/photos/aeg-nsc7c191ds-interieur.jpg', label: 'Interieur' }
   ],
   ```

Het eerste item is de coverfoto. Een kaal pad zonder label mag ook
(`'assets/photos/foo.jpg'`); het label wordt dan `Foto 1`, `Foto 2`, enzovoort.
Laat de array leeg om alleen tekeningen te tonen.

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
