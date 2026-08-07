# Productfoto's

Zet hier de foto's die je bij de fabrikant hebt gedownload. Ze worden
automatisch in de galerij getoond, vóór de SVG-tekeningen: `galleryItems()`
in `assets/app.js` leest de `photos`-array van elk model.

## Naamgeving

Gebruik de `id` uit `assets/data.js`, gevolgd door een volgnummer:

    siemens-ki81rnse0-1.jpg
    siemens-ki81rnse0-2.jpg
    bosch-kir81nse0-1.jpg
    liebherr-irbsd-5120-1.jpg
    aeg-tk6fs181ds-1.jpg
    aeg-nsc7c191ds-1.jpg
    aeg-nsc6m191es-1.jpg
    aeg-osc7c181ds-1.jpg

De volgorde van de nummers is de volgorde in de galerij. Nummer 1 wordt als
eerste getoond, dus gebruik daarvoor het vooraanzicht.

## Formaat

- JPG voor foto's, PNG alleen als er transparantie in zit.
- Ongeveer 1200 px aan de lange zijde is ruim genoeg; de stage toont maximaal
  420 px hoog.
- Houd bestanden onder ~300 kB per stuk, anders wordt de pagina traag.

## Daarna

Vul de paden in de `photos`-array van het bijbehorende model in `data.js`:

    photos: ['assets/photos/siemens-ki81rnse0-1.jpg',
             'assets/photos/siemens-ki81rnse0-2.jpg'],

## Let op: rechten

Dit zijn foto's van de fabrikant. Voor een privépagina om een keuze te maken is
dat prima, maar zet ze niet zomaar op een openbare site zonder toestemming.
