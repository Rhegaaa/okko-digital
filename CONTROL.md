# OKKO Control

Espace privé `/control`, avec Auth.js et Postgres Neon. Les inscriptions publiques sont fermées ; aucun paiement ni publication Google n'est déclenché par l'inscription d'un client.

## Parcours

1. Inscrire un client : coordonnées, lien Maps, début du suivi, accès gestionnaire et fréquences.
2. Les tâches initiales et récurrentes sont enregistrées en base. Le calendrier utilise Europe/Paris ; les dates de tâches sont des dates civiles, stockées à midi UTC.
3. L'accueil présente les actions dues et en retard, à venir, en attente et les 100 dernières actions terminées.
4. L'ouverture d'un lien ne termine pas la tâche. Le bouton « Terminé » enregistre l'historique et prépare la prochaine occurrence à compter du jour de réalisation. La référence unique `previousId` et la transition conditionnelle empêchent une double occurrence lors de clics simultanés.
5. Une mise en pause conserve les données et retire les actions de la vue du jour. La reprise conserve les échéances antérieures.

## Liens Google et avis

Les liens doivent être Google et utiliser HTTPS. Le dossier permet de coller le lien de gestion, celui des avis et celui des photos depuis le compte qui gère effectivement l'établissement. Le lien Maps sert de repli. Les droits d'accès Google restent ceux du compte connecté dans le navigateur.

Cette version ne synchronise pas l'API Google Business Profile. Les tâches de contrôle sont planifiées ; les quantités affichées sont explicitement saisies manuellement. Aucune quantité, réponse, photo ou synchronisation fictive n'est présentée comme provenant de Google. Une future synchronisation nécessitera un projet Google Cloud approuvé pour Business Profile, OAuth avec le scope approprié et des fiches gérées par le compte autorisé.

## Déploiement

Variables requises : `DATABASE_URL` et `AUTH_SECRET`. Migration initiale dans `prisma/migrations`; `scripts/db-migrate.cjs` charge `.env.local` et utilise la connexion directe pour `prisma migrate deploy`. En CI, fournir directement les variables et exécuter `prisma migrate deploy` avec une connexion directe.

Le compte propriétaire est créé hors de l'API publique. Ne jamais publier son mot de passe, les secrets d'authentification ou `.env.local`. Un changement de mot de passe est disponible dans le dashboard.

Le contrôle de rôle admin est appliqué sur les API. Les nouvelles pages vérifient également la session avant lecture. Auth.js gère la connexion et les protections CSRF ; la connexion par mot de passe est limitée après huit échecs sur quinze minutes par compte. L'ancien endpoint de vérification de mot de passe indépendant est fermé.

## Vérification réalisée

Build et TypeScript, connexion réelle admin, rejet invité, création du client et de huit tâches, rechargement persistant, rejet des liens non Google, saisie de cinq avis observés, double clic de clôture, occurrence suivante unique, remise à zéro du compteur observé dans la nouvelle occurrence, attente client, pause/reprise, affichage mobile. Le client de test est supprimé en fin de vérification.
