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

Er zijn nog **geen** productfoto's opgehaald: het uitgaande netwerk van de
bouwomgeving laat alleen pakketregisters en GitHub door en blokkeert expert.nl,
ep.nl, aeg.nl en bsh-group.com (403 policy denial op de CONNECT). Zolang de
foto's ontbreken toont elke kaart een schematische tekening **op schaal** — de
verhouding breedte/hoogte volgt de werkelijke buitenmaten, de indeling van
plateaus, lades en vriesvakken volgt de datasheet.

Zodra er wél foto's zijn nemen die automatisch de plek van de tekening op de
kaart in; de tekeningen blijven als extra weergaven in de galerij staan. Laadt
een foto niet, dan valt de tekening terug op zijn plek — nooit een leeg vlak.

### Foto's ophalen van Expert

Draai dit vanaf een machine die expert.nl wél kan bereiken:

```sh
tools/haal-fotos.sh --list    # eerst kijken wat er gevonden wordt
tools/haal-fotos.sh           # ophalen naar assets/photos/ + index bijwerken
```

Het script leest de modellen en hun `expertUrl` uit `assets/data.js`, vist de
afbeeldingen uit de productpagina (`og:image`, de JSON-LD van het product en
losse image-URL's) en schrijft `assets/photos.js`. Beperken tot één model kan
met `tools/haal-fotos.sh aeg-tk6fs181ds`.

> Let op: het script is geschreven zonder de live pagina te kunnen inspecteren,
> want de bouwomgeving kan expert.nl niet bereiken. Controleer met `--list` of
> de gevonden URL's kloppen. Vier modellen hebben nog een `/zoeken?q=`-URL in
> plaats van een directe productpagina — daar levert het script de plaatjes van
> de zoekresultaten op. Vervang die `expertUrl` door de echte product-URL voor
> een betrouwbaar resultaat.

### Zelf foto's toevoegen

Zet de bestanden in `assets/photos/` met de model-`id` als prefix, bijvoorbeeld
`assets/photos/aeg-nsc7c191ds-1.jpg` en `-2.jpg`, en draai daarna:

```sh
tools/haal-fotos.sh --index   # bouwt assets/photos.js uit de map
```

## Bestanden

```
index.html                 pagina-opbouw
assets/style.css           styling, licht + donker thema
assets/data.js             de dataset (specs, prijzen, features, beschrijvingen)
assets/photos.js           gegenereerd: welke foto's er per model zijn
assets/photos/             de productfoto's zelf (nu nog leeg)
assets/illustrations.js    SVG-tekeningen, op schaal per model
assets/app.js              kaarten, filters, sortering, detailvenster
tools/haal-fotos.sh        foto's ophalen van Expert + photos.js bijwerken
```

Geen build-stap, geen dependencies, geen externe requests — open `index.html`
of serveer de map statisch.

## Publiceren

GitHub Pages serveert de branch `gh-pages`. De workflow
`.github/workflows/pages.yml` synchroniseert die branch automatisch bij elke
push naar de standaardbranch.
