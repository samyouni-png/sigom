# Site Sig'Om

Prototype statique premium pour le site officiel Sig'Om.

## Structure

- `index.html` : page principale, SEO, sections et schema.org.
- `assets/styles/main.css` : direction artistique, responsive, accessibilite et animations sobres.
- `assets/scripts/app.js` : navigation mobile, progress bar, reveal au scroll, et contenu CMS-ready.
- `assets/data/content.js` : donnees remplaçables par un CMS headless.
- `assets/images/coupe-reseau-collectif.svg` : coupe technique vectorielle du réseau collectif d'immeuble.
- `assets/images/coupe-reseau-collectif-mobile.svg` : version mobile simplifiée pour conserver la lisibilité sans scroll horizontal.

## CMS-ready

Les collections `expertises`, `sectors`, `references` et `news` sont centralisees dans `assets/data/content.js`. En production, elles peuvent etre remplacees par un CMS headless comme Sanity, Strapi, Directus, Contentful ou Prismic.

## Visuels

La coupe réseau collectif est une création vectorielle technique, non générée comme image IA. Les images architecturales de démonstration doivent idéalement être remplacées par des photographies réelles de projets Sig'Om ou par une banque d'images licenciée pour la production.
