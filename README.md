# Koelkast-keuzehulp

Visueel overzicht van zes inbouwmodellen: per koelkast een kaart met tekening,
prijs, energielabel, hoogte, geluidsniveau en unieke features. Klik op een kaart
voor een korte beschrijving, alle tekeningen en de volledige specificatielijst.

**Live:** https://triqper.github.io/koelkast/

## Modellen

**Volledig koelkast (178 cm nis)**

| Model | Label | Hoogte | Geluid | Bijzonder |
|---|---|---|---|---|
| Siemens KI81RNSE0 | E · 114 kWh | 177,5 cm | 35 dB | superCooling, 2 vershoudlades |
| Bosch KIR81NSE0 | E · 114 kWh | 177,2 cm | 35 dB | 2 MultiBox-lades, autom. ontdooiing |
| Liebherr IRBSd 5120 | D · 125 kWh | 177 cm | 33 dB | BioFresh 0 °C op telescooprails |
| AEG TK6FS181DS | D · 91 kWh | 177,2 cm | 32 dB | CustomFlex®, stilst én zuinigst |

**Koelvries combi (190 cm nis)**

| Model | Label | Hoogte | Geluid | Bijzonder |
|---|---|---|---|---|
| AEG NSC7C191DS | D · 172 kWh | 189,4 cm | 34 dB | NoFrost + AI CoolAssist, ExtraChill |
| AEG NSC6M191ES | E · 215 kWh | 188,3 cm | 37 dB | TwinTech® No Frost, 2 circuits |

## Bestanden

```
index.html                 pagina-opbouw
assets/style.css           styling, licht + donker thema
assets/data.js             de dataset (specs, features, beschrijvingen)
assets/illustrations.js    SVG-tekeningen, op schaal per model
assets/app.js              kaarten, filters, sortering, detailvenster
```

Geen build-stap, geen dependencies, geen externe requests — open `index.html`
of serveer de map statisch.

## Over de gegevens

- **Afbeeldingen.** De omgeving waarin dit is gebouwd kan expert.nl en de sites
  van de fabrikanten niet bereiken (uitgaand netwerk geblokkeerd), dus er zijn
  geen productfoto's opgehaald. In plaats daarvan is elke kaart een schematische
  tekening **op schaal**: de verhouding breedte/hoogte volgt de werkelijke
  buitenmaten, en de indeling van plateaus, lades en vriesvakken volgt de
  specificaties. Elke kaart linkt door naar Expert.nl voor de echte foto's.
- **Specificaties** komen uit productinformatiebladen van de fabrikanten en uit
  de Nederlandse witgoedhandel, verzameld in augustus 2026.
- **Prijzen zijn indicatief** — gangbare Nederlandse straatprijzen, niet van
  expert.nl afgelezen. Per model staat de herkomst vermeld.

## Aanpassen

Alle inhoud staat in `assets/data.js`. Een model toevoegen of een prijs
bijwerken kan daar; de kaarten, de vergelijktabel en het detailvenster worden
automatisch opnieuw opgebouwd.
