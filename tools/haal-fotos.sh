#!/usr/bin/env bash
#
# Haalt de productfoto's van de Expert-productpagina's op en zet ze in
# assets/photos/. Draai dit vanaf een machine die expert.nl kan bereiken.
#
#   tools/haal-fotos.sh              alles ophalen en de index bijwerken
#   tools/haal-fotos.sh --list       alleen tonen welke afbeeldingen gevonden zijn
#   tools/haal-fotos.sh --index      niets ophalen, alleen assets/photos.js
#                                    opnieuw opbouwen uit assets/photos/
#   tools/haal-fotos.sh aeg-tk6fs181ds [id...]    beperk tot deze modellen
#
# De modellen en hun Expert-URL's komen uit assets/data.js, zodat er maar één
# plek is waar die staan.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA="$ROOT/assets/data.js"
PHOTO_DIR="$ROOT/assets/photos"
INDEX="$ROOT/assets/photos.js"
MAX_PER_MODEL="${MAX_PER_MODEL:-4}"
UA='Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

mode="fetch"
only=()
for arg in "$@"; do
  case "$arg" in
    --list)  mode="list" ;;
    --index) mode="index" ;;
    -h|--help) sed -n '2,20p' "${BASH_SOURCE[0]}"; exit 0 ;;
    -*) echo "Onbekende optie: $arg" >&2; exit 2 ;;
    *) only+=("$arg") ;;
  esac
done

# id<TAB>expertUrl, in de volgorde waarin ze in data.js staan.
models() {
  awk -v q="'" '
    $1 == "id:"        { split($0, p, q); id = p[2] }
    $1 == "expertUrl:" { split($0, p, q); if (id != "") print id "\t" p[2]; id = "" }
  ' "$DATA"
}

wanted() {
  local id="$1"
  [ ${#only[@]} -eq 0 ] && return 0
  local pick
  for pick in "${only[@]}"; do [ "$pick" = "$id" ] && return 0; done
  return 1
}

# Kandidaat-afbeeldingen uit de HTML vissen. Expert rendert de galerij deels in
# JavaScript, dus we pakken drie bronnen: de og:image-tag, de JSON-LD van het
# product en losse absolute image-URL's in de opgehaalde HTML.
extract_images() {
  local html="$1"
  {
    grep -o '<meta[^>]*property="og:image"[^>]*>' "$html" 2>/dev/null |
      grep -o 'content="[^"]*"' | cut -d'"' -f2
    grep -o '"image"[[:space:]]*:[[:space:]]*\[[^]]*\]' "$html" 2>/dev/null |
      grep -o 'https\?://[^",]*'
    grep -o 'https\?://[^"'\''<> ]*\.\(jpg\|jpeg\|png\|webp\)\(?[^"'\''<> ]*\)\?' "$html" 2>/dev/null
  } |
    sed 's/&amp;/\&/g' |
    # Logo's, iconen, spinners en betaal-badges zijn geen productfoto's.
    grep -viE 'logo|icon|sprite|favicon|placeholder|spinner|banner|betaal|payment|social' |
    awk '!seen[$0]++'
}

fetch_model() {
  local id="$1" url="$2"
  local html; html="$(mktemp)"
  trap 'rm -f "$html"' RETURN

  case "$url" in
    *'/zoeken?'*)
      echo "  ~ dit is een zoekpagina, geen productpagina — controleer de foto's" \
           "en zet de directe product-URL in assets/data.js" >&2 ;;
  esac

  if ! curl -fsSL --compressed -A "$UA" --max-time 45 "$url" -o "$html"; then
    echo "  ! kon $url niet ophalen" >&2
    return 0
  fi

  local urls; urls="$(extract_images "$html" | head -n "$MAX_PER_MODEL")"
  if [ -z "$urls" ]; then
    echo "  ! geen afbeeldingen gevonden op $url" >&2
    return 0
  fi

  local n=0
  while IFS= read -r img; do
    [ -n "$img" ] || continue
    n=$((n + 1))
    if [ "$mode" = "list" ]; then
      echo "  $n. $img"
      continue
    fi
    local ext="${img##*.}"; ext="${ext%%\?*}"
    case "$ext" in jpg|jpeg|png|webp) ;; *) ext="jpg" ;; esac
    local out="$PHOTO_DIR/$id-$n.$ext"
    if curl -fsSL --compressed -A "$UA" --referer "$url" --max-time 45 "$img" -o "$out"; then
      echo "  $n. $(basename "$out")  ←  $img"
    else
      rm -f "$out"
      echo "  ! download mislukt: $img" >&2
    fi
  done <<< "$urls"
}

# assets/photos.js opbouwen uit wat er daadwerkelijk in assets/photos/ staat,
# zodat handmatig toegevoegde bestanden er ook in belanden.
build_index() {
  {
    echo "/* Automatisch gegenereerd door tools/haal-fotos.sh — niet met de hand bijwerken."
    echo " * Bevat per model de foto's die in assets/photos/ staan; app.js zet ze vóór"
    echo " * de schematische tekeningen in de galerij. */"
    echo
    echo "const PHOTOS = {"
    while IFS=$'\t' read -r id _; do
      local files=()
      while IFS= read -r f; do [ -n "$f" ] && files+=("$f"); done < <(
        find "$PHOTO_DIR" -maxdepth 1 -type f -name "$id-*" 2>/dev/null | sort -V
      )
      [ ${#files[@]} -eq 0 ] && continue
      echo "  '$id': ["
      local f
      for f in "${files[@]}"; do echo "    'assets/photos/$(basename "$f")',"; done
      echo "  ],"
    done < <(models)
    echo "};"
  } > "$INDEX"
  echo "assets/photos.js bijgewerkt."
}

mkdir -p "$PHOTO_DIR"

if [ "$mode" != "index" ]; then
  while IFS=$'\t' read -r id url; do
    wanted "$id" || continue
    echo "$id — $url"
    fetch_model "$id" "$url"
  done < <(models)
fi

[ "$mode" = "list" ] || build_index
