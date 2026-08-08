# Productfoto's

De pagina verwijst naar de bestanden hieronder. Zolang een bestand ontbreekt,
valt die plek automatisch terug op de schematische tekening — er verschijnt dus
nooit een gebroken afbeelding.

## Bosch KIR81NSE0

| Bestand | Foto |
|---|---|
| `bosch-kir81nse0-koelkast.jpg` | De volledige koelkast met geopende deur — **coverfoto op de kaart** |
| `bosch-kir81nse0-interieur.jpg` | Interieur met plateaus en deurvakken |
| `bosch-kir81nse0-multibox.jpg` | Close-up van de twee MultiBox XXL-lades |
| `bosch-kir81nse0-bediening.jpg` | Bedieningspaneel met PowerVentilation |

De volgorde in de galerij volgt de volgorde van de `photos`-array in
`assets/data.js`; het eerste item is altijd de coverfoto.

## Een model toevoegen

Zet de bestanden in deze map en vul de `photos`-array van het model in
`assets/data.js`:

```js
photos: [
  { src: 'assets/photos/merk-model-koelkast.jpg', label: 'Koelkast open' },
  { src: 'assets/photos/merk-model-interieur.jpg', label: 'Interieur' }
],
```

Een kaal pad zonder label mag ook (`'assets/photos/foo.jpg'`); het label wordt
dan `Foto 1`, `Foto 2`, enzovoort.
