@AGENTS.md

# Barres de navigation

Toute barre de navigation (nouvelle ou modifiée) suit ces règles, puis se vérifie avec `npm run check:nav -- http://localhost:<port>` (site lancé en local ; `PAGES=/x WIDTHS=390 LANGS=fr` pour cibler) :

- la rangée porte `data-nav-row="<nom>"` et aligne ses éléments avec `items-center` (jamais `items-baseline`) ;
- les textes (titres, liens) portent la classe `trim-cap`, qui réduit leur boîte aux majuscules pour que le centrage soit visuel ;
- un titre qui doit être au centre de la page porte `data-nav-center` et vit dans une grille `grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]` ;
- les logos et icônes sont des éléments bloc (`flex`), pas `inline-block`, pour ne pas se caler sur la ligne de base ;
- ajouter la page à la liste `PAGES` de `scripts/check-nav-alignment.mjs` si elle est nouvelle.
