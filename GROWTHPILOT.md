# GrowthPilot — réception et fonctionnement

## État vérifié le 16 octobre 2026

Le cycle cloud a terminé une rédaction reprise depuis son résultat enregistré, sa relecture indépendante et ses contrôles. Le premier guide de 713 mots sur les horaires exceptionnels a ensuite été relu par Codex, publié et vérifié en HTTP 200. Le moteur courant est calibré ; les prochains guides peuvent être publiés automatiquement si leurs contrôles passent. Le guide a réellement été retiré (HTTP 404 et suppression du sitemap), puis restauré (HTTP 200 et retour dans le sitemap). Les autres générations refusées restent privées avec leurs motifs.

Guide : https://okko-digital.fr/guides/horaires-exceptionnels-fiche-google-guide-pratique

Les tests du bouton d'arrêt ont confirmé la suspension d'un cycle simulé identifié et nettoyé, puis le statut PAUSED d'un vrai lancement GitHub. La reprise a été enregistrée. L'audit public porte sur quatorze pages : HTTP, métadonnées, canonical, H1, données structurées, sitemap, robots, exclusions privées et vraie 404. Aucun résultat commercial ou classement n'est déduit de ces tests.

## Architecture et droits

Le site utilise Next.js 16 App Router, Prisma 6, Neon Postgres Free et Auth.js, sur Vercel. Son identité visuelle est conservée. Le code applicatif publié provient de refonte-agence-gmb-v2. La branche main contient encore une ancienne version du site : son déploiement automatique est désactivé dans vercel.json. Seuls le worker et son workflow y sont synchronisés pour la planification.

GitHub Actions appelle le serveur OKKO avec un jeton OIDC éphémère. Le backend exige le dépôt Rhegaaa/okko-digital, son identifiant numérique, main, l'audience et le chemin exact du workflow. Le worker ne reçoit ni la clé Gemini, ni le mot de passe Postgres, ni le secret Auth.js, ni de droit d'écriture Git. Le job séparé de sauvegarde dispose uniquement des droits nécessaires à son fichier chiffré.

La rédaction utilise gemini-3.6-flash avec l'API Interactions. La relecture indépendante utilise gemini-3.5-flash-lite avec GenerateContent et ses champs JSON classiques. La version du moteur est gemini36-free-20261016. Les deux modèles ont répondu à des appels réels avec la clé du propriétaire ; le cycle cloud utilisant leur combinaison a réussi. Le premier guide reste privé après chaque changement de moteur jusqu'à une calibration. Le worker ne peut pas s'accorder cette approbation. Changer un modèle après calibration impose une nouvelle version de moteur et une nouvelle calibration.

## Offre gratuite et secrets

Lorenzo a autorisé Google AI Studio en Free Tier uniquement et a confirmé dans le dashboard un projet sans compte de facturation associé. Aucune facturation, carte, recharge ou API de paiement n'est activée par GrowthPilot. Le backend ne vérifie pas le statut financier d'un projet Google : cette confirmation relève du propriétaire dans AI Studio. Un quota gratuit épuisé arrête la génération, sans repli payant.

La clé se saisit dans le dashboard privé. L'enregistrement vérifie l'accès au modèle par une lecture de métadonnées sans génération. La clé est chiffrée en AES-256-GCM avec contexte distinct et conservée dans GrowthCredential, une table exclue des exports et des sauvegardes éditoriales. Elle n'est jamais envoyée à GitHub ou au navigateur après enregistrement. Seuls les briefs et textes destinés au site sont transmis à Google, sans demandes de contact ou données des clients. Interactions reçoit store=false ; les conditions de traitement du Free Tier Google restent applicables.

Les quotas gratuits de Google, Vercel, Neon et GitHub restent ceux des comptes. Un incident ou un changement de quota peut interrompre un cycle. Aucun abonnement payant ni repli facturé n'est ajouté.

## Publication, reprise et contrôles

Le lancement quotidien est demandé à partir de 6 h Europe/Paris, avec gestion de l'heure d'été par la propriété timezone du workflow. GitHub peut retarder l'exécution. Les jours visés sont lundi, mercredi et vendredi, avec une publication par jour civil et trois par semaine au maximum, toutes versions confondues. Trois articles est un objectif conditionné à la qualité et à la disponibilité, jamais une garantie de classement ou de citation par un moteur IA.

Les sources Google officielles nécessaires au plan sont réellement téléchargées ; une source manquante interrompt la génération. Les sources citées sont encore contrôlées lors de l'enregistrement et de la calibration. Les textes reposent sur un corpus de faits approuvés. La relecture du modèle est complétée par des contrôles de format, longueurs, sources, URL, répétitions, similarité, faux chiffres, promesses, témoignages, ciblage géographique et exclusion du BTP. Les conseils de partage de mot de passe sont refusés ; les formulations négatives sûres telles que « sans partager » et « évitez de partager » sont reconnues. Ces contrôles réduisent les risques, sans prouver automatiquement la vérité de chaque phrase.

Chaque tentative comporte au maximum une rédaction, une revue, une correction et une seconde revue. Une étape réussie peut être réutilisée si la signature de son brief, ses faits et son modèle correspondent. Une modification du texte demandé refuse la réutilisation. La date technique d'observation Google est exclue de cette signature. Une requête en double renvoie son résultat enregistré. Les HTTP 502, 503 et 504 disposent d'un seul nouvel essai borné ; les HTTP 429 ne sont pas réessayés. Chaque appel dure au maximum cinquante secondes ; la fonction accepte cent vingt secondes et le client cent vingt-cinq. Le runner est borné à dix minutes, le job et le bail à quinze minutes. Cinq tentatives quotidiennes maximum par version sont conservées avec tout leur historique.

Une page publiée doit répondre avec son titre, ses données structurées et sans noindex. Un échec la retire. Le bouton d'arrêt est vérifié avant les actions et au sein de la transaction de publication. Les contenus sont rendus comme texte React, sans HTML fourni par le modèle. Les téléchargements externes utilisent HTTPS, une résolution IPv4 publique épinglée, des limites de taille/durée et la revalidation des redirections ; les adresses privées sont refusées.

## Recherche, Search Console et backlinks

Les sujets initiaux et les idées futures sont des hypothèses éditoriales. Aucun volume ni score de faible concurrence n'est fabriqué. La recherche Google publique actuellement non exploitable est signalée dans les journaux, sans contournement ni classement inventé.

GSC Wizard fonctionne dans Codex, mais ne fournit pas au serveur un accès autonome. La synchronisation cloud reste à configurer avec GROWTH_GSC_CREDENTIALS, un compte de service autorisé en lecture seule. Les données sont filtrées sur le domaine principal et www ; capbusiness est exclu. Aucun credential du connecteur n'est extrait. Sans connexion cloud, le dashboard le dit et ne crée pas de statistiques.

France Num et CCI sont des pistes, pas des liens obtenus ni une preuve d'éligibilité. Le module conserve les propositions, les contrôles, l'ancre et le rel observés. Il exige un lien HTML réellement présent vers le domaine exact OKKO, sur une page externe HTTP 200. Un problème réseau ne devient ni un lien acquis ni un faux lien perdu. Aucune inscription, campagne ou soumission automatique n'est activée : aucune plateforme autorisant explicitement cette automatisation n'est configurée.

## Contacts et sauvegardes

Le formulaire enregistre la demande dans ContactSubmission et Prospect, une notification privée et un compteur agrégé. Validation, honeypot, idempotence et limitation de fréquence sont appliqués. Aucun email ou campagne n'est envoyé par ce parcours. Les clics CTA sont des événements agrégés sans cookie, pas des visiteurs uniques ou des ventes attribuées. Les demandes simulées ont été identifiées puis nettoyées.

Les versions des articles sont conservées. Le propriétaire peut retirer un guide et restaurer sa dernière version publiée. Le dashboard propose un export privé des tables éditoriales, sans clé. Une sauvegarde éditoriale AES-256-GCM est versionnée dans le dépôt chaque semaine et lors des mises à jour du worker. Le job peut sauvegarder les journaux même lorsque la rédaction échoue ; en pause, il n'écrit pas de nouvelle sauvegarde. Cette activité utile contribue au maintien de la planification GitHub, qui peut être désactivée après une longue inactivité du dépôt.

La clé de récupération est conservée séparément sur le PC du propriétaire. Ne jamais la publier. Restauration : npx tsx --env-file=.env.local scripts/growth-restore.ts backup.json (simulation), puis --apply pour l'écriture explicite. La restauration suspend l'automatisation et remet les contenus en brouillon pour revalidation. La clé Gemini se reconnecte séparément, puisqu'elle est exclue des sauvegardes éditoriales.

## Historique des essais

Les petits modèles Qwen locaux ont montré des erreurs factuelles ; leurs textes ont été refusés. Un ancien guide de test brièvement publié a été retiré après relecture et ne constitue pas un contenu final approuvé. Gemini3.8 et3.7 ont rencontré des HTTP503 ; Gemini2.5 n'était pas disponible pour les nouveaux comptes. Ces essais ne sont pas effacés des journaux.

Le premier writer3.6 a produit le texte réel avant l'ajout des signatures de reprise. Une récupération ponctuelle documentée a conservé son résultat original et permis sa réutilisation après vérification du même sujet, modèle, corpus et plan. Cette récupération n'accordait aucune approbation éditoriale. La revue Flash-Lite a ensuite réellement été exécutée par le cycle cloud, puis le guide a été relu par Codex avant calibration et publication.

## Références techniques

- https://ai.google.dev/gemini-api/docs/pricing
- https://ai.google.dev/gemini-api/docs/billing
- https://ai.google.dev/api/interactions-api
- https://ai.google.dev/api/generate-content
- https://vercel.com/docs/functions/configuring-functions/duration
- https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows
- https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- https://developers.google.com/search/docs/essentials/spam-policies
