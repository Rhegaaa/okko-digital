# Référencement OKKO — version du 14 octobre 2026

## Architecture et intentions

| Page | Intention principale |
| --- | --- |
| `/` | Agence Google My Business / agence de fiches Google |
| `/services` | Choisir une prestation Google Business Profile |
| `/audit-fiche-google` | Audit de fiche Google |
| `/optimisation-fiche-google` | Optimisation de fiche Google Business Profile |
| `/gestion-fiche-google` | Gestion et mise à jour d’une fiche Google |
| `/gestion-avis-google` | Gestion des avis Google et réponses aux clients |
| `/carte-nfc-avis-google` | Carte NFC / QR code pour avis Google |
| `/guides` | Conseils Google Business Profile |
| `/guides/optimiser-fiche-google` | Comment optimiser sa fiche Google |
| `/guides/repondre-avis-google` | Comment répondre aux avis Google |
| `/guides/demander-avis-google` | Comment demander des avis authentiques |
| `/a-propos` | Présentation et approche d’OKKO |
| `/contact` | Demande de contact et échange sur la fiche |

Les intentions commerciales et pédagogiques sont distinguées. Les mots-clés sont des choix sémantiques, pas des volumes de recherche ni des difficultés de classement mesurés. Aucune niche, aucun tarif ni aucune ville ne sont ajoutés comme décision acquise.

## Contenu et liens

Les pages de prestations expliquent le travail, les limites et la suite possible. Les guides donnent des étapes et des exemples signalés comme fictifs. Le maillage relie les prestations et les guides correspondants, avec une navigation principale limitée à Prestations, Guides, Agence et Contact.

La fiche Google est gratuite. Les prestations rémunèrent le diagnostic, l’optimisation et la gestion. Le client conserve la propriété et ses accès. La maquette Google de l’accueil reste fictive ; aucune note, aucun avis ni aucun résultat de cette maquette ne décrit OKKO ou un client réel.

## Technique

- 13 pages publiques indexables en production ; mentions légales hors sitemap et en noindex.
- HTML produit au build pour les pages publiques ; administration et API restent dynamiques.
- Titre, description, H1 et canonical propres à chaque page. Base canonique fixée sur `https://okko-digital.fr`, indépendante des variables d’authentification.
- Sitemap avec URLs canoniques et dates de modification réelles ; robots pointe vers ce sitemap.
- Aperçus Vercel explicitement en noindex ; protection Vercel conservée.
- Organization et WebSite communs, BreadcrumbList sur les sous-pages, Service sur les prestations, Article sur les guides.
- Aucun AggregateRating ni Review artificiel. FAQ visible sans balisage FAQPage : les résultats enrichis FAQ ont été retirés par Google en mai 2026.
- `/services/presence-locale` redirige en 308 vers `/optimisation-fiche-google`. Anciennes prestations sans équivalent et slugs inconnus répondent 404.
- Police Inter locale pour le site public ; polices spécifiques à Control limitées à son layout.

## Vérifications

Compilation et TypeScript, réponses HTTP, H1, métadonnées distinctes, canonical, JSON-LD, sitemap, liens internes, redirections et 404 sont contrôlés. Des vérifications navigateur couvrent ordinateur, tablette/petits mobiles et navigation mobile après changement de page. Aucun email ni aucune donnée CRM ne sont créés pour ces tests.

## Publication et suivi

Le domaine public sert encore l’ancienne version au moment de cette intervention. Les contrôles de la nouvelle version portent sur le dépôt et l’aperçu Vercel, pas sur un résultat de positionnement déjà obtenu. Avant publication sur le domaine, vérifier les paramètres DNS et la cible d’hébergement ; ne pas modifier les enregistrements de messagerie.

Une fois publiée : vérifier que les pages commerciales du domaine ne portent aucun noindex, contrôler le sitemap et les réponses HTTP, puis utiliser la propriété Search Console du domaine pour soumettre le sitemap et inspecter les pages prioritaires. Suivre les impressions, clics, requêtes et prises de contact réellement reçues. Les changements de classement ne sont pas garantis et ne se déduisent pas de la seule mise en ligne.

Sources officielles utilisées pour les décisions :

- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/essentials/spam-policies?hl=fr
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/updates
- https://support.google.com/business/answer/7091?hl=fr
- https://support.google.com/business/answer/7353941?hl=fr
- https://support.google.com/business/answer/7163406?hl=fr
