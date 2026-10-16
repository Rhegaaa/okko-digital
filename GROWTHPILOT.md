# GrowthPilot — fonctionnement et audit

## Audit du 16 octobre 2026

Source : `work/okko-repository`, Next.js 16 App Router, Prisma 6 / Postgres Neon, Auth.js, dépôt public Rhegaaa/okko-digital. L'application publiée utilise la branche `refonte-agence-gmb-v2`. Le domaine principal est servi par Vercel. La branche par défaut GitHub est `main` ; elle contient encore une ancienne version du site et ne doit pas être redéployée. `vercel.json` désactive le déploiement automatique de main. Le workflow seul et son worker sont également installés sur main pour permettre les événements planifiés.

Les treize pages publiques initiales répondent, ont un titre, une description, un H1 et un canonical. Robots autorise les pages publiques et exclut control et api. Le sitemap comporte les treize URL ; les guides automatiques publiés y sont ajoutés dynamiquement. L'espace privé est noindex. Les données structurées existantes ne présentent aucun faux avis ni résultat client. Les dates des guides automatiques sont celles effectivement enregistrées. Le site conserve sa palette, ses photos, sa police et sa navigation.

Le formulaire préparait un mailto sans enregistrer la demande. Il enregistre désormais la demande dans ContactSubmission et Prospect, avec une notification privée et un compteur agrégé. Honeypot, validation, idempotence et limitation de fréquence sont appliqués. Aucun email ni campagne n'est envoyé par ce nouveau parcours. Les mentions de confidentialité sont adaptées. Les clics CTA sont des événements sans cookie, pas des visiteurs uniques ou des ventes attribuées.

## Architecture

GitHub Actions → jeton OIDC éphémère → API worker limitée à GrowthPilot → tables Growth* → routes publiques dynamiques du site. Le worker ne reçoit ni le mot de passe Postgres, ni le secret Auth.js, ni un droit d'écriture Git. Le backend exige le dépôt, l'identifiant numérique, le workflow, la branche et l'audience exacts. Aucun token n'est écrit dans les fichiers ou journaux.

Le modèle Qwen3.5-9B, quantification GGUF publiée par bartowski sous licence Apache-2.0 s'exécute sur le runner standard Ubuntu gratuit du dépôt public avec llama.cpp. Fichiers et binaires sont épinglés par révision et SHA-256. Il n'y a aucune API d'inférence facturée. GitHub Models n'est pas utilisé : sa documentation annonce son arrêt au 30 juillet 2026. Aucun service payant ni palier supérieur n'est activé. Une indisponibilité du modèle ou un changement de quota fait échouer le cycle ; aucun repli payant.

La génération utilise les paramètres de raisonnement recommandés par Qwen (température 1, top-p 0,95, top-k 20), avec un budget de raisonnement borné et une pénalité de présence de 1,5 contre les répétitions. Un plan distinct par thème répartit les sources pertinentes entre les sections. Les sorties sont contraintes par un schéma JSON, puis recontrôlées côté serveur ; ces contraintes ne remplacent pas la vérification factuelle. La reprise réécrit depuis le brief et ses erreurs, sans recopier le texte refusé. Le plafond quotidien de reprise est de cinq tentatives ; les cycles terminés sont idempotents.

Le lancement quotidien est demandé à 06:00 Europe/Paris, avec la propriété timezone GitHub Actions. Le service peut retarder un lancement ; l'heure exacte n'est pas garantie. Les contenus visent lundi, mercredi et vendredi avec un maximum de trois publications par semaine. L'absence d'activité d'un dépôt public pendant soixante jours peut désactiver sa planification GitHub : le dernier signal est affiché. Une sauvegarde éditoriale réelle est versionnée chaque semaine dans ce dépôt, ce qui maintient une activité utile. Si un échec prolongé empêche cette activité et que GitHub désactive le workflow, il faut le réactiver depuis Actions.

## Recherche, rédaction et contrôles

Les sujets éditoriaux initiaux sont des hypothèses orientées vers les services réels d'OKKO. Les sujets issus de Search Console sont identifiés comme données mesurées. Volumes de mots-clés et scores de faible concurrence ne sont jamais fabriqués. Le moteur tente une recherche Google publique limitée : s'il rencontre une page inaccessible, un challenge ou une réponse non exploitable, il le journalise sans le contourner. Les résultats observés sont des données, pas des instructions et pas des preuves de faible concurrence.

La rédaction utilise un corpus de faits approuvés et des sources Google officielles, recontrôlées avant publication. Les extraits de pages externes ne commandent aucune action et ne remplacent pas les faits autorisés. Un second passage du modèle révise les affirmations. Le serveur valide indépendamment la structure, les sources, les URL, les longueurs, les répétitions, les faux témoignages, les promesses et la similarité avec les pages existantes. Ces contrôles réduisent les risques ; ils ne prouvent pas mathématiquement la vérité de chaque phrase. Un refus garde un brouillon et le motif. Les titres, paragraphes et listes sont rendus comme texte React, jamais comme HTML fourni par le modèle.

L'accès public HTTP, le titre, les données structurées et l'indexabilité sont vérifiés après publication. Une page non vérifiée est retirée (HELD). Une reprise de cycle revient sur l'article existant plutôt que d'en publier un second. L'arrêt d'urgence est contrôlé avant les actions et au sein de la transaction de publication. Les dates civiles et semaines utilisent Europe/Paris. Un bail évite les cycles concurrents et expire après une interruption. Les tentatives sont plafonnées.

## Search Console

GSC Wizard est accessible depuis Codex, ce qui ne fournit pas automatiquement un accès serveur durable. Aucun credential du connecteur n'est extrait. La synchronisation cloud accepte, si le propriétaire le configure, `GROWTH_GSC_CREDENTIALS` contenant un compte de service Google autorisé sur la propriété. Le périmètre est lecture seule ; les données sont filtrées pour le domaine principal et excluent capbusiness. Sans cette variable, le dashboard et les journaux indiquent la connexion cloud manquante, sans chiffres inventés. Le moteur fonctionne avec ses pistes éditoriales.

## Backlinks

Les pistes initiales France Num et CCI ne sont pas des liens obtenus ni une preuve d'éligibilité. Le module stocke la pertinence, une proposition, l'état de vérification et l'ancre/rel réellement constatés. La vérification exige un lien HTML vers le domaine exact OKKO et un HTTP 200. Un lien nofollow est indiqué comme tel ; aucun bénéfice de classement n'est affirmé. Un échec réseau ne devient jamais un lien acquis.

Aucun annuaire, partenariat ou formulaire n'est soumis automatiquement dans cette version : aucune plateforme avec permission explicite d'automatisation n'est configurée. Aucun envoi d'email, achat ou campagne ne peut être commandé par le worker. Ajouter une plateforme requiert une permission documentée et un adaptateur séparé. Les téléchargements externes du backend utilisent HTTPS, des adresses IPv4 publiques épinglées à la résolution, une limite de taille, un délai et une revalidation de chaque redirection pour prévenir les accès au réseau privé.

## Sauvegarde, retrait et restauration

Le propriétaire peut exporter toutes les tables GrowthPilot via le dashboard privé. Ce fichier ne contient aucun secret d'authentification. Les versions d'articles sont conservées avant remplacement ou retrait. Le bouton Retirer masque immédiatement la page des lecteurs et du sitemap. Restaurer remet la dernière version publiée ; aucune nouvelle génération n'est nécessaire. La sauvegarde éditoriale hebdomadaire est chiffrée en AES-256-GCM avant d’être envoyée au dépôt public. Elle ne contient aucune clé. Une clé de récupération privée est conservée sur le PC de Lorenzo ; la restauration peut également utiliser AUTH_SECRET tant qu’il n’a pas changé. La restauration éditoriale est disponible avec `npx tsx --env-file=.env.local scripts/growth-restore.ts backup.json` (simulation), puis `--apply` (écriture explicite). Elle suspend l'automatisation et restaure les contenus en brouillon pour revalidation. Les sauvegardes de base Neon restent distinctes du suivi éditorial.

## Limites à conserver dans la communication

Trois guides hebdomadaires sont un objectif sous réserve de qualité et de disponibilité, pas une garantie de publication ou de classement. La citabilité par les moteurs IA n'est pas garantie. Pas de pages géographiques artificielles, faux chiffres ou témoignages, ni prix non validés. Les secteurs BTP restent exclus suivant la décision de Lorenzo.

## Sources techniques vérifiées

- https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows
- https://docs.github.com/en/billing/concepts/product-billing/github-actions
- https://docs.github.com/en/github-models
- https://huggingface.co/Qwen/Qwen3-4B-GGUF
- https://huggingface.co/Qwen/Qwen3-4B
- https://github.com/ggml-org/llama.cpp/releases/tag/b11696
- https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- https://developers.google.com/search/docs/essentials/spam-policies

## Calibration après les essais cloud

Les premiers essais Qwen3-4B ont validé la chaîne technique (publication HTTP, sitemap et données structurées), mais une relecture a relevé des restrictions de rôle non fondées et un français insuffisant. Le guide de test a été retiré et conservé en refusé avec son historique. Il ne constitue ni un résultat SEO, ni un exemple de contenu final approuvé.

Un essai intermédiaire utilisait Qwen3.5-4B, poids GGUF Q4_K_M de bartowski, révision 4168f45a16a1290d65a4ec0fa312ae917a4c15d6, SHA-256 13c16f426047e2de38cd075bdade4a7bcbc8c774384876f677740cda65f8a983. La licence et l’origine du modèle sont contrôlées ; aucun code tiers du dépôt de poids n’est exécuté. Le binaire llama.cpp reste épinglé séparément. Les instructions /no_think ne sont plus utilisées ; le mode est contrôlé par le template du modèle.

Chaque version de moteur possède son cycle daté et conserve l’historique des versions précédentes. Les publications sont limitées à une par jour civil de Paris et trois par semaine, toutes versions confondues. Une nouvelle version garde son premier guide valide en DRAFT, même si les contrôles automatiques passent. Une relecture du propriétaire ou de Codex est nécessaire avant d’approuver ce guide et d’activer les publications suivantes de ce moteur. Cette calibration concerne l’installation et les changements de moteur, pas chaque publication courante. Le worker ne peut pas s’accorder cette approbation. La revue factuelle et sa justification sont désormais conservées dans les contrôles de chaque guide.

Sources : https://huggingface.co/Qwen/Qwen3.5-4B et https://huggingface.co/bartowski/Qwen_Qwen3.5-4B-GGUF

## Moteur renforcé pour la fidélité factuelle

La calibration 4B a montré ses limites : certaines formulations sur le partage des accès restaient incorrectes malgré la revue. La version courante utilise Qwen3.5-9B, quantification Q4_K_M de bartowski, révision 182be2fd6c7bc44887d88a91cb03ff009cc9f549 et SHA-256 d784ce9eda1a5a7b51e8f705a9e6310844bf4f173654d115823c775fdea56d43. Le raisonnement est activé avec un budget borné de 256 jetons. Aucun changement de moteur ne peut publier avant sa calibration privée. Les anciennes versions de worker sont refusées au démarrage.

Le runner possède une échéance globale de cinquante minutes, le bail expire après cinquante-cinq minutes et GitHub arrête le job après une heure. Ces durées sont des plafonds de sécurité pour l’exécution CPU gratuite, pas une promesse de latence. Une correction bornée reste possible. Les titres sont ajustés mécaniquement (première proposition et ajout du contexte Google au besoin), puis les contrôles SEO et la revue portent sur le texte réellement publié. Le contrôleur évalue uniquement l’article à partir du corpus validé, sans auditer les références ni les idées futures comme du contenu publié.

Le solde AI Gateway du compte a été consulté en lecture seule : zéro crédit et zéro consommation. Aucun crédit acheté, aucune inférence Gateway et aucun moyen de paiement ajouté.

Sources : https://huggingface.co/Qwen/Qwen3.5-9B et https://huggingface.co/bartowski/Qwen_Qwen3.5-9B-GGUF

## Connexion Gemini gratuite autorisée le 16 octobre 2026

Lorenzo a autorisé Google AI Studio en Free Tier uniquement, sans activer la facturation. Les deux générations Qwen3.5-9B ont été refusées après contrôle et relecture ; aucune n'a été autorisée. Les détails des modèles locaux ci-dessus restent l'historique des essais, pas le moteur courant.

Le moteur courant est gemini-3.8-flash via l'API Interactions officielle et la version gemini38-free-20261016. La clé se saisit uniquement dans le dashboard privé, après création d'un projet Free Tier sans compte de facturation associé. L'enregistrement exige la confirmation du propriétaire et vérifie l'accès au modèle par une requête de métadonnées sans génération. Le backend ne peut pas activer la facturation Google : aucune API de facturation, carte ou repli payant n'est intégré. Le statut financier du projet est confirmé par le propriétaire dans AI Studio ; un solde de crédits ou une estimation de consommation ne constitue pas cette vérification.

La clé est chiffrée en AES-256-GCM avec contexte distinct et conservée dans GrowthCredential. Cette table est exclue des exports et des sauvegardes éditoriales. GitHub ne reçoit jamais la clé ; le runner utilise son identité OIDC pour demander une rédaction au serveur OKKO. Seuls les briefs et contenus destinés au site sont envoyés à Google, sans données des clients ou demandes de contact. store=false est envoyé à l'API ; cela n'annule pas les conditions de traitement du Free Tier de Google.

Quatre étapes d'inférence au maximum sont prévues par tentative : rédaction, revue, correction éventuelle, seconde revue. Chaque étape est réservée et son résultat mis en cache. Une réponse réseau perdue ne provoque pas une seconde requête silencieuse. Un HTTP 429 arrête la tentative sans repli payant. Les requêtes durent au maximum cinquante secondes ; le runner a une échéance de dix minutes, le job et le bail de quinze minutes. Une nouvelle calibration privée est toujours obligatoire avant d'activer les publications de ce moteur.

Les tests simulés couvrent le chiffrement et sa résistance à une modification, le format de réponse officiel, l'idempotence, l'arrêt sur quota et l'absence de clé. Ces tests ne sont pas une preuve de qualité d'un article réel. La réception finale indique séparément si la connexion et la calibration réelles ont été effectuées.

Sources vérifiées : https://ai.google.dev/gemini-api/docs/billing ; https://ai.google.dev/gemini-api/docs/pricing ; https://ai.google.dev/api/interactions-api ; https://ai.google.dev/gemini-api/docs/structured-output ; https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash
