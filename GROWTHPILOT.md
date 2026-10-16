# GrowthPilot — fonctionnement et audit

## Audit du 16 octobre 2026

Source : `work/okko-repository`, Next.js 16 App Router, Prisma 6 / Postgres Neon, Auth.js, dépôt public Rhegaaa/okko-digital. L'application publiée utilise la branche `refonte-agence-gmb-v2`. Le domaine principal est servi par Vercel. La branche par défaut GitHub est `main` ; elle contient encore une ancienne version du site et ne doit pas être redéployée. `vercel.json` désactive le déploiement automatique de main. Le workflow seul et son worker sont également installés sur main pour permettre les événements planifiés.

Les treize pages publiques initiales répondent, ont un titre, une description, un H1 et un canonical. Robots autorise les pages publiques et exclut control et api. Le sitemap comporte les treize URL ; les guides automatiques publiés y sont ajoutés dynamiquement. L'espace privé est noindex. Les données structurées existantes ne présentent aucun faux avis ni résultat client. Les dates des guides automatiques sont celles effectivement enregistrées. Le site conserve sa palette, ses photos, sa police et sa navigation.

Le formulaire préparait un mailto sans enregistrer la demande. Il enregistre désormais la demande dans ContactSubmission et Prospect, avec une notification privée et un compteur agrégé. Honeypot, validation, délai minimal, idempotence et limitation de fréquence sont appliqués. Aucun email ni campagne n'est envoyé par ce nouveau parcours. Les mentions de confidentialité sont adaptées. Les clics CTA sont des événements sans cookie, pas des visiteurs uniques ou des ventes attribuées.

## Architecture

GitHub Actions → jeton OIDC éphémère → API worker limitée à GrowthPilot → tables Growth* → routes publiques dynamiques du site. Le worker ne reçoit ni le mot de passe Postgres, ni le secret Auth.js, ni un droit d'écriture Git. Le backend exige le dépôt, l'identifiant numérique, le workflow, la branche et l'audience exacts. Aucun token n'est écrit dans les fichiers ou journaux.

Le modèle Qwen3-4B-GGUF sous licence Apache-2.0 s'exécute sur le runner standard Ubuntu gratuit du dépôt public avec llama.cpp. Fichiers et binaires sont épinglés par révision et SHA-256. Il n'y a aucune API d'inférence facturée. GitHub Models n'est pas utilisé : sa documentation annonce son arrêt au 30 juillet 2026. Aucun service payant ni palier supérieur n'est activé. Une indisponibilité du modèle ou un changement de quota fait échouer le cycle ; aucun repli payant.

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
- https://github.com/ggml-org/llama.cpp/releases/tag/b11696
- https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- https://developers.google.com/search/docs/essentials/spam-policies
