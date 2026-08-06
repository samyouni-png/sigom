# Site Sig’Om

Site vitrine statique pour Sig’Om, bureau d’études techniques spécialisé dans la rénovation et la performance énergétique des bâtiments existants.

## Structure

- `index.html` : page unique, contenus SEO, sections sémantiques et données structurées.
- `assets/styles/main.css` : direction artistique, typographies Newsreader et Manrope, responsive, accessibilité et animations sobres.
- `assets/scripts/app.js` : navigation mobile, ancres, état actif, révélations progressives, validation du formulaire et affichage conditionnel des réalisations.
- `assets/data/content.js` : structure prête pour les réalisations, qualifications et contenus éditoriaux futurs.
- `assets/images/` : visuels architecturaux, coupe technique SVG, favicon et variantes WebP/PNG.

## Réalisations

Les réalisations publiques sont pilotées par `assets/data/content.js`.

Chaque projet publié doit comporter :

- `title`
- `typology`
- `location`
- `mission`
- `context`
- `deliverables`
- `status`
- `image`
- `imageAlt`
- `published`

Le site affiche uniquement les projets dont `published` vaut `true`. Tant qu'aucun projet validé n'est renseigné, la section "Nos réalisations" et son lien de navigation restent masqués.

## Formulaire

Le formulaire utilise une validation front-end accessible et prépare un e-mail vers `contact@sigom.fr`. Pour un envoi direct depuis le site, raccorder un service d'envoi côté serveur ou une fonction serverless, puis remplacer l'action `mailto:`.

## Mise en ligne

La page est conçue pour une publication statique, notamment sur GitHub Pages à l'adresse :

`https://samyouni-png.github.io/sigom/`
