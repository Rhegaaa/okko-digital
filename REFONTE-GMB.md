# Refonte OKKO : agence de fiches Google

Version 2 du 14 octobre 2026. Palette vert et crème conservée. Composition éditoriale, grandes photographies du dépôt, liens textuels sans boutons encadrés, animations discrètes et fiche Google interactive fictive. Aucun tarif ni aucune niche ne sont considérés comme validés. Les illustrations ne sont pas des résultats clients.

## Modifier le site

- `gmb-site/index.html` : textes et structure de la nouvelle vitrine.
- `gmb-site/styles.css` : présentation ordinateur et mobile.
- `gmb-site/interactions.js` : onglets accessibles de la fiche fictive, menu mobile, animations avec réduction des mouvements et préparation de l’email. `site.js` est généré pour l’aperçu statique.
- `components/site/gmb-contact.tsx` : initialisation des mêmes interactions sur le site Next.js, avec nettoyage lors des changements de page.
- `gmb-site/mentions-legales.html` et `app/(site)/mentions-legales/page.tsx` : informations légales. L’identité est reprise du dépôt existant et doit être confirmée avant mise en production, ainsi que l’hébergement réel.

Après modification de la vitrine, exécuter `node scripts/sync-gmb.mjs`, puis `npm run build` et `npx tsc --noEmit`. L’installation initiale nécessite `npm install --legacy-peer-deps` à cause de dépendances historiques dont les contraintes de versions React divergent.

Les anciennes routes publiques redirigent vers les rubriques de la nouvelle page. Le code des comptes, du CRM et des API d’administration est conservé. Leur fonctionnement nécessite leurs services et variables d’environnement existants et n’est pas validé par les essais de cette refonte.

## Contact

Le formulaire ouvre une messagerie avec un email prérempli vers contact@okko-digital.fr. Le visiteur doit l’envoyer. Aucun envoi, paiement ou enregistrement dans le CRM n’est simulé. Pour recevoir directement les demandes via un formulaire, une intégration serveur doit être configurée et vérifiée.

## Aperçu et publication

L’aperçu statique est déployé sur le projet Vercel existant `okko-digital` et ne modifie pas le domaine OVH. Il porte une directive noindex. Pour publier définitivement la vitrine statique, retirer cette directive et ajouter une URL canonique après vérification du domaine. Pour publier l’application complète, déployer le dépôt Next.js depuis la bonne branche avec les variables de l’application existante.

Le dépôt source est `https://github.com/Rhegaaa/okko-digital`. L’identité Git locale `rhegaa` reçoit un refus d’écriture (403), mais le connecteur GitHub ajouté par Lorenzo possède désormais l’autorisation d’écriture. La version 2 est enregistrée via ce connecteur sur une branche dédiée. Le domaine okko-digital.fr n’apparaît pas dans les domaines associés au projet Vercel retrouvé ; son raccordement reste distinct de la publication de l’aperçu.

## Vérifications réalisées

- Compilation de production Next.js réussie et contrôle TypeScript sans erreur.
- Page affichée dans Chrome sur 1440, 390 et 320 pixels ; pas de débordement horizontal.
- Questions dépliantes, liens internes, images et page légale vérifiés.
- Préparation d’email vérifiée avec des données de test ; aucun email envoyé.
- Pas de témoignage, note, nombre de clients ou résultat commercial inventé.
- Les anciennes offres de sites web, automatisation et solutions métier ne figurent plus dans la vitrine.
- Les données de « Le Café des Tilleuls », sa note, le nombre d’avis et les commentaires sont fictifs et signalés comme démonstration. Aucune action de ce module ne contacte un établissement réel.
- Photos utilisées : images présentes dans le dépôt d’origine, présentées comme illustrations et non comme clients OKKO.

Sources de référence pour la rédaction :
- https://support.google.com/business/answer/7091?hl=fr
- https://support.google.com/business/answer/3474122?hl=fr
