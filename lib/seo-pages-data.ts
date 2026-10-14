export type SeoPage = {
  path: string;
  title: string;
  description: string;
  kicker: string;
  heading: string;
  intro: string;
  image: string;
  sections: Array<{ heading: string; paragraphs: string[]; items?: string[] }>;
  faq: Array<{ question: string; answer: string }>;
  related: string[];
  kind: 'service' | 'guide';
};

export const SEO_PAGES: SeoPage[] = [
  {
    path: '/audit-fiche-google',
    title: 'Audit de fiche Google Business Profile | OKKO',
    description: 'Un audit de votre fiche Google pour repérer les informations à corriger, les accès à vérifier et les priorités utiles. Un plan clair avec OKKO.',
    kicker: 'Comprendre avant d’agir',
    heading: 'Votre fiche Google mérite un vrai état des lieux.',
    intro: 'Une catégorie approximative, des horaires oubliés ou un lien qui mène au mauvais endroit : les détails comptent pour les personnes qui découvrent votre entreprise. L’audit de fiche Google permet de comprendre ce qui est déjà solide, ce qui manque et ce qui mérite une correction.',
    image: '/gmb-assets/cafe-interieur.jpg',
    kind: 'service',
    sections: [
      { heading: 'Un regard précis sur votre présence actuelle', paragraphs: ['Nous examinons la fiche telle qu’un visiteur peut la découvrir sur Google et Google Maps. Le nom, l’activité principale, les coordonnées, les horaires et les liens doivent raconter la même entreprise. Nous vérifions également que les photos et les services présentés correspondent à votre activité réelle.', 'L’audit distingue une information incorrecte d’une information simplement incomplète. Une fiche peu renseignée ne prouve pas que vous perdez des clients. Elle indique des points à examiner, à confirmer avec vous puis à traiter dans un ordre raisonnable.'], items: ['Informations essentielles et cohérence avec votre site.', 'Catégorie principale, catégories complémentaires et services.', 'Photos, avis, réponses et parcours de prise de contact.', 'Accès à la fiche, propriété et éventuels doublons visibles.'] },
      { heading: 'Des priorités, pas une liste de reproches', paragraphs: ['Le compte rendu classe les observations selon leur utilité pour votre entreprise. Une fermeture exceptionnelle non indiquée peut passer avant une nouvelle photo. Un lien de rendez-vous erroné peut être plus urgent qu’une description à réécrire. Chaque recommandation explique le problème observé, la correction proposée et les informations nécessaires.', 'Lorsque certaines données sont accessibles dans votre compte, nous pouvons examiner les interactions disponibles avec leur période de mesure. Une demande d’itinéraire ou un clic ne constitue pas une vente : nous conservons cette distinction dans l’analyse.'] },
      { heading: 'Un point de départ pour la suite', paragraphs: ['Vous pouvez utiliser les recommandations pour agir vous-même ou demander à OKKO de réaliser les corrections. L’audit et l’optimisation ont deux objectifs distincts : le premier établit le diagnostic ; la seconde met en œuvre les changements convenus. Le périmètre et le devis sont définis avant toute intervention.', 'Nous ne garantissons aucune position dans les résultats Google. La recherche locale dépend notamment de la pertinence, de la distance et de la notoriété. Un état des lieux sérieux sert à améliorer les éléments sur lesquels vous pouvez réellement agir.'] },
    ],
    faq: [
      { question: 'Faut-il nous donner votre mot de passe Google ?', answer: 'Non. La première lecture peut porter sur les informations publiques. Si un accès est nécessaire pour approfondir l’audit, vous invitez OKKO comme gestionnaire et restez propriétaire de votre fiche.' },
      { question: 'L’audit comprend-il les corrections ?', answer: 'Le diagnostic et les modifications sont distingués dans le devis. Vous savez quels éléments seront examinés et si leur correction fait partie de la prestation.' },
      { question: 'Une fiche Google est-elle payante ?', answer: 'La fiche Google Business Profile est gratuite. Une prestation OKKO rémunère le travail d’analyse, de préparation et d’accompagnement, selon le périmètre convenu.' },
    ],
    related: ['/optimisation-fiche-google', '/gestion-fiche-google', '/guides/optimiser-fiche-google'],
  },
  {
    path: '/optimisation-fiche-google',
    title: 'Optimisation de fiche Google Business Profile | OKKO',
    description: 'Optimisez votre fiche Google avec des informations exactes, des catégories adaptées et des photos utiles. OKKO prépare et réalise les corrections convenues.',
    kicker: 'Mettre les bonnes informations au bon endroit',
    heading: 'Une fiche qui présente vraiment votre entreprise.',
    intro: 'L’optimisation de fiche Google consiste à rendre votre activité plus facile à comprendre et votre établissement plus simple à contacter. Nous travaillons sur vos informations réelles, avec des choix cohérents et un contenu utile aux visiteurs.',
    image: '/gmb-assets/cafe-barista.jpg',
    kind: 'service',
    sections: [
      { heading: 'Clarifier ce que vous faites', paragraphs: ['Nous commençons par votre activité principale. La catégorie doit correspondre à ce que vous proposez réellement ; les catégories complémentaires servent à préciser votre offre, sans transformer la fiche en catalogue de métiers. Les services sont rédigés avec des intitulés compréhensibles et des descriptions concrètes.', 'Le nom de l’entreprise reste son nom réel. Nous n’ajoutons pas de mots-clés artificiels dans ce champ. La description explique votre travail, vos particularités et la façon de vous contacter, sans accumuler les expressions de recherche.'] },
      { heading: 'Faciliter les prochaines étapes du visiteur', paragraphs: ['Un visiteur doit pouvoir vérifier vos horaires, trouver le bon numéro et accéder à la page qui répond à son besoin. Nous reprenons les coordonnées et les liens avec vous, y compris les horaires particuliers lorsqu’ils sont connus. Une information pratique correcte vaut mieux qu’un discours commercial compliqué.', 'Les photos doivent aider à reconnaître l’établissement ou à comprendre le service. Nous vous indiquons les images utiles à préparer : entrée, intérieur, équipe ou réalisations, selon votre situation. Les photographies publiées représentent votre entreprise et sont utilisées avec les autorisations nécessaires.'], items: ['Catégories adaptées à l’activité.', 'Coordonnées, horaires et liens vérifiés.', 'Description claire et services structurés.', 'Sélection de photos pertinentes pour les visiteurs.'] },
      { heading: 'Des changements suivis et expliqués', paragraphs: ['Les interventions sont convenues avant publication. Vous restez propriétaire de la fiche et OKKO intervient avec un accès de gestionnaire. Certaines modifications peuvent faire l’objet d’un examen ou d’une nouvelle vérification par Google ; leur affichage ne dépend donc pas uniquement de notre intervention.', 'L’objectif est une fiche exacte, complète et cohérente. Nous ne promettons ni première place ni volume de demandes. Après la remise à niveau, un suivi peut être envisagé pour entretenir les horaires, les photos et les avis. Cette gestion régulière est définie séparément, selon votre besoin.'] },
    ],
    faq: [
      { question: 'Optimisation et gestion mensuelle, quelle différence ?', answer: 'L’optimisation remet la fiche à niveau à un moment donné. La gestion régulière accompagne ensuite les changements de votre activité et les nouveaux avis, avec une fréquence convenue.' },
      { question: 'Pouvez-vous optimiser une fiche déjà existante ?', answer: 'Oui, après avoir vérifié son état et vos accès. Nous privilégions la fiche de l’établissement existant ; créer une autre fiche pour la même activité peut provoquer un doublon.' },
      { question: 'Quel est le tarif de l’optimisation ?', answer: 'Le tarif est établi sur devis après examen du travail nécessaire. Le nombre de fiches, leur état et les éléments à préparer déterminent le périmètre.' },
    ],
    related: ['/audit-fiche-google', '/gestion-fiche-google', '/guides/optimiser-fiche-google'],
  },
  {
    path: '/gestion-fiche-google',
    title: 'Gestion de fiche Google au quotidien | OKKO',
    description: 'Confiez le suivi de votre fiche Google à OKKO : informations à jour, photos, avis et compte rendu selon un périmètre clair. Vous gardez la propriété.',
    kicker: 'Une présence qui suit votre activité',
    heading: 'Votre entreprise bouge. Votre fiche doit suivre.',
    intro: 'Une fiche Google n’est pas terminée le jour où elle est créée. Horaires exceptionnels, nouveaux services, photos récentes et avis clients : la gestion de fiche Google organise ces mises à jour sans vous demander d’y penser chaque jour.',
    image: '/gmb-assets/comptoir.jpg',
    kind: 'service',
    sections: [
      { heading: 'Un suivi adapté à votre rythme', paragraphs: ['Nous définissons ensemble ce qui doit être suivi et la fréquence adaptée. Certaines entreprises changent souvent leurs horaires ou leurs services ; d’autres ont surtout besoin de surveiller les avis et de renouveler leurs photos. Le suivi part de votre fonctionnement, plutôt que d’un nombre de publications imposé.', 'Vous nous transmettez les changements réels : congés, fermeture exceptionnelle, nouvelle prestation ou coordonnées modifiées. Nous préparons leur mise à jour dans le cadre convenu. Une information que nous ne connaissons pas ne peut pas être publiée correctement : un interlocuteur identifié facilite ce travail.'] },
      { heading: 'Entretenir une fiche fiable', paragraphs: ['La gestion comprend les tâches retenues dans le devis : contrôle des informations, traitement des mises à jour, sélection de photos fournies et suivi des avis. Une publication peut être utile lorsqu’elle annonce quelque chose de concret. Nous évitons de publier uniquement pour remplir un calendrier.', 'Les réponses aux avis doivent rester proches de votre façon de parler. Nous convenons du ton et des situations nécessitant votre validation, notamment lorsqu’une réclamation implique des faits que nous ne pouvons pas vérifier seuls.'], items: ['Un périmètre écrit et une fréquence de suivi.', 'Un canal simple pour transmettre vos changements.', 'Des réponses et contenus adaptés à votre activité.', 'Un compte rendu des interventions et observations.'] },
      { heading: 'Voir le travail réalisé', paragraphs: ['Le compte rendu décrit les modifications effectuées et les sujets à décider. Lorsque les données Google sont disponibles, nous pouvons suivre les interactions sur des périodes comparables. Leur évolution apporte un éclairage, mais ne permet pas d’attribuer automatiquement des ventes au suivi de la fiche.', 'Vous restez propriétaire de Google Business Profile. Notre accès de gestionnaire peut être retiré ; votre fiche n’est pas un actif détenu par l’agence. Le tarif et les modalités de l’accompagnement sont précisés sur devis. Une optimisation initiale peut être nécessaire avant d’installer une routine de gestion.'] },
    ],
    faq: [
      { question: 'Dois-je publier tous les jours ?', answer: 'Non. Nous privilégions des informations utiles et exactes. La fréquence dépend des actualités de votre entreprise et du périmètre défini ensemble.' },
      { question: 'Les réponses aux avis sont-elles incluses ?', answer: 'Elles peuvent faire partie de l’accompagnement. Le devis précise les tâches prises en charge et les situations dans lesquelles votre validation est nécessaire.' },
      { question: 'Pouvez-vous assurer une position fixe sur Google Maps ?', answer: 'Non. Google décide du classement, qui varie notamment selon la recherche et la position de l’utilisateur. Nous suivons des actions concrètes, sans garantie de classement.' },
    ],
    related: ['/optimisation-fiche-google', '/gestion-avis-google', '/audit-fiche-google'],
  },
  {
    path: '/gestion-avis-google',
    title: 'Gestion des avis Google et réponses clients | OKKO',
    description: 'Organisez vos demandes d’avis Google et vos réponses avec OKKO. Des retours authentiques, un ton adapté et un suivi des réclamations sans faux avis.',
    kicker: 'Prendre soin de la conversation',
    heading: 'Des avis authentiques. Des réponses qui vous ressemblent.',
    intro: 'Les avis Google racontent des expériences vécues avec votre entreprise. Nous vous aidons à demander des retours simplement, à répondre avec justesse et à repérer les sujets qui méritent votre attention.',
    image: '/gmb-assets/cafe-barista.jpg',
    kind: 'service',
    sections: [
      { heading: 'Demander un retour sans orienter la note', paragraphs: ['Une demande d’avis peut s’intégrer naturellement après une prestation ou un achat. Nous préparons un message neutre et un accès direct à la bonne fiche. Le client reste libre de donner son opinion, de choisir sa note ou de ne pas répondre.', 'Nous ne vendons pas d’avis. Nous ne proposons ni récompense, ni réduction, ni tri préalable pour envoyer uniquement les clients satisfaits vers Google. La collecte doit concerner des expériences réelles et ne pas imposer une note positive. Un support NFC ou un QR code facilite simplement l’accès.'] },
      { heading: 'Répondre sans copier-coller votre réputation', paragraphs: ['Un remerciement peut être court et précis. Une réponse à une critique demande davantage de recul : comprendre le problème évoqué, vérifier les faits auprès de vous et proposer une suite utile lorsque cela est possible. Nous adaptons le ton à votre entreprise et définissons les réponses que vous souhaitez valider.', 'Une réponse publique s’adresse aussi aux lecteurs qui découvrent l’échange. Elle ne doit pas exposer un dossier client, des coordonnées personnelles ou des informations confidentielles. Les discussions détaillées peuvent être poursuivies par un canal privé.'], items: ['Message de demande d’avis neutre.', 'Lien direct, QR code ou support NFC selon votre besoin.', 'Réponses personnalisées et validation des cas sensibles.', 'Repérage des questions et réclamations récurrentes.'] },
      { heading: 'Traiter les avis problématiques avec discernement', paragraphs: ['Une critique négative ne suffit pas à justifier une suppression. Lorsqu’un contenu paraît enfreindre les règles de Google, nous pouvons examiner les éléments et vous accompagner dans un signalement. La décision de modération appartient à Google ; aucun retrait ne peut être garanti.', 'Le suivi vous permet de comprendre ce qui revient dans les retours et de décider des actions internes utiles. Le nombre d’avis et la note restent des observations, pas une promesse de résultat. Le périmètre de collecte, de réponse et de reporting est établi sur devis.'] },
    ],
    faq: [
      { question: 'Pouvez-vous effacer un mauvais avis ?', answer: 'Nous ne pouvons pas retirer un avis parce qu’il est négatif. Un contenu contraire aux règles peut être signalé à Google, qui décide de le conserver ou de le supprimer.' },
      { question: 'Peut-on offrir un cadeau en échange d’un avis ?', answer: 'Non. Nous écartons toute récompense liée à la publication, à la modification ou à la suppression d’un avis Google.' },
      { question: 'Les réponses doivent-elles toutes être différentes ?', answer: 'Elles doivent surtout répondre à l’expérience décrite. Un ton cohérent est utile ; une série de textes identiques peut donner l’impression que le commentaire n’a pas été lu.' },
    ],
    related: ['/carte-nfc-avis-google', '/gestion-fiche-google', '/guides/repondre-avis-google'],
  },
  {
    path: '/carte-nfc-avis-google',
    title: 'Carte NFC et QR code pour avis Google | OKKO',
    description: 'Facilitez l’accès aux avis Google avec une carte NFC ou un QR code relié à votre fiche. Configuration, placement et prise en main avec OKKO.',
    kicker: 'Un geste simple après une vraie expérience',
    heading: 'Le chemin vers votre fiche, à portée de téléphone.',
    intro: 'Une carte NFC pour avis Google ouvre le lien de votre fiche sur un téléphone compatible. Un QR code offre un autre accès au même parcours. Le support facilite la demande ; il laisse toujours au client le choix de publier son avis.',
    image: '/gmb-assets/plaque-google.jpg',
    kind: 'service',
    sections: [
      { heading: 'Réduire les étapes, pas influencer l’avis', paragraphs: ['Sans lien direct, un client doit rechercher votre entreprise et retrouver la bonne fiche avant de raconter son expérience. Le support NFC ou QR code raccourcit ce chemin. Il ne rédige pas de texte et ne sélectionne pas de note à sa place.', 'Le client doit disposer d’un compte Google pour publier. La lecture NFC dépend du téléphone et de ses réglages ; le QR code permet un accès alternatif. Nous vérifions le lien de destination et prévoyons un usage compréhensible pour votre équipe.'] },
      { heading: 'Une configuration pour votre établissement', paragraphs: ['Nous identifions la fiche concernée avant de préparer le support. En présence de plusieurs établissements, chacun doit renvoyer vers sa propre fiche. Cela évite d’envoyer les retours d’une expérience vers une autre entreprise ou un autre point d’accueil.', 'L’emplacement compte autant que la technologie. Un support placé à un moment pertinent, avec une demande simple, est plus compréhensible qu’une invitation répétée sans contexte. Nous choisissons avec vous un usage adapté au parcours client, sans gêner le service.'], items: ['Vérification de la fiche et du lien de demande d’avis.', 'Configuration du support retenu.', 'Contrôle du parcours NFC et QR code avant remise.', 'Conseils de placement et explication à l’équipe.'] },
      { heading: 'Un support au service d’une démarche honnête', paragraphs: ['La demande reste neutre : elle invite à partager une expérience, sans exiger cinq étoiles. Elle n’est pas conditionnée à une réduction ou à un cadeau. Nous ne filtrons pas les clients selon leur satisfaction avant de leur donner le lien Google.', 'La carte ne garantit ni nombre d’avis ni progression de votre classement. Sa valeur est pratique : rendre la demande plus facile à comprendre et à effectuer. Elle peut compléter une gestion des avis avec réponses et suivi, mais ne remplace pas la qualité de l’expérience client. Le support, sa préparation et l’éventuel accompagnement sont précisés sur devis.'] },
    ],
    faq: [
      { question: 'Le client a-t-il besoin d’une application spéciale ?', answer: 'La lecture du lien NFC dépend de son téléphone et de ses réglages. Le QR code peut être lu avec un appareil compatible. Un compte Google reste nécessaire pour déposer un avis.' },
      { question: 'La carte ajoute-t-elle automatiquement cinq étoiles ?', answer: 'Non. Le client choisit sa note et écrit son propre commentaire. Le support ouvre seulement le parcours vers la fiche.' },
      { question: 'Peut-on utiliser le support pour plusieurs fiches ?', answer: 'Un lien de demande d’avis correspond à une fiche précise. Pour plusieurs établissements, nous préparons un parcours distinct afin que les avis concernent le bon établissement.' },
    ],
    related: ['/gestion-avis-google', '/gestion-fiche-google', '/guides/repondre-avis-google'],
  },
  {
    path: '/guides/optimiser-fiche-google',
    title: 'Comment optimiser sa fiche Google : guide pratique | OKKO',
    description: 'Les étapes pour améliorer votre fiche Google : accès, catégories, horaires, services, photos et suivi. Une méthode pratique, sans promesse de classement.',
    kicker: 'Le guide OKKO',
    heading: 'Optimiser sa fiche Google, dans le bon ordre.',
    intro: 'Google Business Profile est le nom actuel de l’outil souvent appelé Google My Business ou GMB. La fiche est gratuite. Pour la rendre utile, commencez par les informations qui permettent de comprendre votre activité et de vous contacter, puis installez une routine simple.',
    image: '/gmb-assets/cafe-interieur.jpg',
    kind: 'guide',
    sections: [
      { heading: '1. Vérifier la fiche et conserver ses accès', paragraphs: ['Recherchez votre entreprise sur Google et Google Maps avant de créer quoi que ce soit. Une fiche peut déjà exister, même si vous ne l’avez pas ouverte vous-même. Identifiez celle qui correspond réellement à votre établissement. Une nouvelle fiche créée inutilement peut provoquer un doublon et compliquer les futures mises à jour.', 'Assurez-vous de connaître le compte propriétaire et de pouvoir y accéder. Lorsque vous travaillez avec une agence, invitez-la avec un rôle de gestionnaire plutôt que de communiquer votre mot de passe. Votre entreprise doit conserver la propriété de sa fiche. Si une vérification est demandée, suivez la procédure proposée par Google avec des éléments véridiques.'] },
      { heading: '2. Décrire l’activité avec précision', paragraphs: ['Choisissez une catégorie principale proche de votre activité réelle. Les catégories complémentaires doivent expliquer des activités effectivement exercées, pas multiplier les possibilités d’apparaître dans des recherches. Utilisez le nom réel de l’entreprise dans le champ prévu, sans y ajouter une liste de services ou de mots-clés.', 'Exemple fictif : un café qui sert du café et une petite restauration peut décrire ces services clairement. Il n’a pas besoin de se présenter comme une succession de métiers qu’il n’exerce pas. Dans la description, expliquez ce que le visiteur trouvera, ce qui caractérise votre accueil et comment préparer sa visite.'] },
      { heading: '3. Corriger les informations pratiques', paragraphs: ['Comparez le téléphone, le site et les horaires de votre fiche avec vos informations actuelles. Vérifiez que les liens mènent à la bonne page et fonctionnent sur téléphone. Indiquez les horaires exceptionnels lorsque vous les connaissez, notamment pendant les congés ou les fermetures prévues.', 'Votre activité doit également être représentée selon son fonctionnement réel. Les règles ne sont pas les mêmes pour un établissement accueillant des visiteurs et une entreprise se déplaçant chez ses clients. Ne créez pas de présence à une adresse où vous n’exercez pas. Une information exacte est plus utile qu’une couverture géographique artificielle.'], items: ['Tester le numéro et les liens.', 'Vérifier les horaires habituels et particuliers.', 'Relire les services et retirer ceux qui ne sont plus proposés.', 'Comparer la fiche aux informations affichées sur votre site.'] },
      { heading: '4. Choisir des photos qui répondent aux questions', paragraphs: ['Publiez des images récentes de votre propre activité : entrée reconnaissable, espace d’accueil, équipe ou réalisations selon le contexte. Leur rôle est de montrer ce que le visiteur découvrira. Des images décoratives ou sans rapport avec votre entreprise n’apportent pas cette information.', 'Vérifiez les droits d’utilisation et l’accord des personnes reconnaissables. Préférez des photographies lisibles, correctement cadrées et fidèles à la réalité. Il n’est pas nécessaire de publier tous les jours : ajoutez de nouveaux visuels lorsque quelque chose a effectivement changé ou mérite d’être montré.'] },
      { heading: '5. Suivre les avis et mesurer avec prudence', paragraphs: ['Invitez vos clients à partager une expérience réelle, sans avantage en échange et sans réserver la demande aux personnes satisfaites. Répondez aux commentaires avec un ton cohérent, puis utilisez les retours pour identifier des questions récurrentes. Le support NFC ou QR code facilite l’accès, mais ne doit jamais orienter la note.', 'Google décrit le classement local à travers la pertinence, la distance et la notoriété. Compléter une fiche ne garantit donc pas une première position. Notez les modifications réalisées et examinez les interactions disponibles sur des périodes comparables. Un clic, un appel enregistré dans les données ou une demande d’itinéraire ne sont pas des ventes confirmées. Pour aller plus loin, un audit peut aider à décider des prochaines actions.'] },
    ],
    faq: [
      { question: 'Google My Business et Google Business Profile sont-ils différents ?', answer: 'Google Business Profile est le nom actuel du service. Les expressions fiche Google, Google My Business et GMB restent utilisées pour désigner cette présence sur Google et Maps.' },
      { question: 'Faut-il mettre des mots-clés partout ?', answer: 'Non. Présentez votre activité avec des termes précis et naturels. Le nom, les catégories et les autres champs doivent rester conformes à la réalité de votre entreprise.' },
      { question: 'Comment savoir quelles corrections faire en premier ?', answer: 'Commencez par les accès et les erreurs qui empêchent de comprendre ou de contacter votre entreprise. Travaillez ensuite les services, les photos et la routine de suivi.' },
    ],
    related: ['/audit-fiche-google', '/optimisation-fiche-google', '/guides/repondre-avis-google'],
  },
  {
    path: '/guides/repondre-avis-google',
    title: 'Répondre aux avis Google : méthode et exemples | OKKO',
    description: 'Comment répondre à un avis Google positif ou négatif ? Méthode, exemples fictifs et conseils pour garder un ton professionnel sans réponses automatiques.',
    kicker: 'Le guide OKKO',
    heading: 'Répondre aux avis Google avec les bons mots.',
    intro: 'Une réponse ne sert pas seulement à remercier son auteur. Elle montre aussi aux futurs visiteurs comment vous écoutez vos clients. Le bon texte dépend de l’expérience racontée : quelques lignes adaptées valent mieux qu’un long message standard.',
    image: '/gmb-assets/cafe-barista.jpg',
    kind: 'guide',
    sections: [
      { heading: 'Lire le commentaire avant de rédiger', paragraphs: ['Repérez ce que le client décrit réellement : un accueil apprécié, un service particulier, une attente ou une difficulté. Ne répondez pas seulement à la note. Un commentaire de quatre étoiles peut contenir une suggestion utile ; une note basse sans texte ne donne pas assez d’informations pour expliquer les faits.', 'Définissez votre ton habituel. Vous pouvez être chaleureux sans devenir familier et professionnel sans écrire comme un courrier administratif. Évitez les phrases identiques répétées sous chaque avis. Votre réponse doit montrer que ce retour précis a été lu, sans y ajouter des arguments publicitaires sans rapport.'] },
      { heading: 'Répondre à un avis positif', paragraphs: ['Remerciez le client et reprenez un élément concret de son message si cela convient. Une réponse courte suffit souvent. Vous n’avez pas besoin d’y glisser toutes vos prestations ou de répéter le nom de l’entreprise plusieurs fois.', 'Exemple entièrement fictif : un client écrit « Très bon accueil et de bons conseils pour choisir ». Réponse possible : « Merci pour votre retour ! Nous sommes heureux que nos conseils vous aient aidé à faire votre choix. Au plaisir de vous accueillir à nouveau. » Ce modèle doit être adapté à votre activité et au commentaire ; ce n’est pas un témoignage concernant OKKO.'] },
      { heading: 'Répondre à une expérience négative', paragraphs: ['Prenez le temps de vérifier les faits avec la personne qui connaît la situation. Reconnaissez le problème exprimé sans inventer une explication ni admettre des faits non établis. Une réponse publique n’est pas le lieu pour détailler un dossier client ou publier des informations personnelles.', 'Exemple entièrement fictif : un visiteur critique une attente prolongée. Réponse possible : « Merci de nous avoir signalé cette attente. Nous comprenons votre déception et souhaitons examiner ce qui s’est passé. Vous pouvez nous contacter directement en précisant le jour de votre visite afin que nous puissions reprendre la situation avec vous. » N’annoncez une correction ou un geste que s’il a réellement été décidé.', 'Si une erreur est confirmée, décrivez la suite concrète et appropriée. Si vous ne reconnaissez pas l’expérience, restez factuel et proposez un contact privé. Contredire agressivement le client ou chercher à gagner un débat risque de détourner l’attention du problème initial.'] },
      { heading: 'Distinguer une critique d’un contenu à signaler', paragraphs: ['Un avis défavorable n’est pas automatiquement contraire aux règles. Il peut refléter une expérience insatisfaisante, même si vous la percevez autrement. Le signalement concerne les contenus susceptibles d’enfreindre les règles de Google, par exemple certains contenus injurieux ou sans expérience réelle identifiable ; l’évaluation dépend des faits et de la politique applicable.', 'Conservez les éléments utiles sans exposer de données privées dans une réponse. Utilisez la procédure Google lorsque le signalement est justifié et évitez de promettre sa suppression. L’agence ne décide pas de la modération. Vous pouvez continuer à répondre avec mesure lorsque cela aide les lecteurs à comprendre votre démarche.'] },
      { heading: 'Organiser une routine qui reste humaine', paragraphs: ['Désignez une personne pour vérifier les nouveaux avis et préciser qui valide les réponses délicates. Préparez quelques repères de ton, plutôt qu’un texte unique à copier partout. Une routine simple aide à ne pas laisser une réclamation sans examen et à remercier les clients avec régularité.', 'Pour demander de nouveaux retours, utilisez une invitation neutre après une expérience réelle. Ne proposez pas de cadeau ou de réduction et ne réservez pas le lien aux clients satisfaits. Vous pouvez faciliter l’accès avec un QR code ou une carte NFC. Le client choisit librement sa note et son texte. Une gestion des avis peut vous accompagner dans cette organisation, sans fabriquer ni acheter des commentaires.'] },
    ],
    faq: [
      { question: 'Faut-il répondre à un avis sans commentaire ?', answer: 'Vous pouvez remercier l’auteur ou lui proposer de préciser son expérience si cela est utile. Ne cherchez pas à décrire une prestation que vous ne pouvez pas identifier.' },
      { question: 'Peut-on utiliser une aide à la rédaction ?', answer: 'Oui, mais le texte doit être relu, adapté à l’avis et vérifié par une personne qui connaît les faits. Une suggestion ne doit jamais inventer une explication ou un engagement.' },
      { question: 'Doit-on demander au client de supprimer son avis ?', answer: 'Privilégiez la résolution du problème. Ne proposez aucune contrepartie pour modifier ou supprimer un avis. L’auteur reste libre de faire évoluer son commentaire.' },
    ],
    related: ['/gestion-avis-google', '/carte-nfc-avis-google', '/gestion-fiche-google'],
  },
  {
    path: '/guides/demander-avis-google',
    title: 'Comment demander un avis Google à ses clients | OKKO',
    description: 'Demandez des avis Google avec une méthode simple, un lien direct et trois exemples de messages. Des retours authentiques, sans récompense ni filtrage.',
    kicker: 'Le guide OKKO',
    heading: 'Demander un avis, simplement et sans pression.',
    intro: 'Votre client vient de vivre une expérience avec votre entreprise. Une invitation courte peut lui permettre de la raconter sur Google. Le principe est simple : faciliter l’accès, rester neutre et respecter son choix de répondre ou non.',
    image: '/gmb-assets/plaque-google.jpg',
    kind: 'guide',
    sections: [
      { heading: 'Choisir un moment cohérent avec l’expérience', paragraphs: ['Une demande est plus compréhensible lorsque la prestation ou l’achat a réellement eu lieu. Évitez de solliciter une note avant que le client ait pu utiliser le service. Identifiez un moment naturel dans votre parcours : fin de rendez-vous, remise d’un produit ou échange de suivi déjà prévu.', 'Présentez la demande comme une possibilité, jamais comme une obligation. Le client peut ne pas avoir de compte Google, manquer de temps ou préférer ne pas publier. Cette liberté fait partie d’une démarche respectueuse. Votre équipe doit pouvoir proposer le lien sans insister et poursuivre normalement la relation si le client refuse.'] },
      { heading: 'Préparer le bon lien', paragraphs: ['Récupérez le lien de demande d’avis correspondant à votre fiche et testez sa destination sur téléphone. Vérifiez le nom de l’établissement et évitez les liens copiés depuis une autre entreprise. Si vous gérez plusieurs fiches, chaque expérience doit être rattachée au bon établissement.', 'Vous pouvez transmettre ce lien dans un échange adapté, ou le rendre accessible sur un support QR code ou NFC. Le support ne publie rien à la place du client. Il raccourcit uniquement le parcours jusqu’à Google ; l’auteur garde le contrôle de la note et du commentaire.'] },
      { heading: 'Trois messages à adapter à votre entreprise', paragraphs: ['Les textes suivants sont des exemples fictifs de demandes, pas des messages envoyés ni des retours clients obtenus. Remplacez le lien et adaptez le contexte avant de les utiliser. Ne mentionnez une prestation que si elle a bien eu lieu.', 'Après une prestation : « Merci pour votre confiance. Si vous souhaitez partager votre expérience, vous pouvez laisser un avis sur notre fiche Google ici : [lien vers votre fiche]. Votre retour nous aide à comprendre ce qui fonctionne et ce que nous pouvons améliorer. »', 'À l’accueil ou au comptoir : « Si vous souhaitez donner votre avis sur votre visite, ce QR code ouvre notre fiche Google. Vous êtes libre de partager votre expérience. »', 'Dans un message de suivi pertinent : « Merci pour notre échange. Vous pouvez, si vous le souhaitez, raconter votre expérience avec notre entreprise sur Google : [lien vers votre fiche]. Merci pour le temps consacré à votre retour. »'] },
      { heading: 'Garder la même invitation pour tous', paragraphs: ['Ne demandez pas d’abord au client s’il est satisfait pour ensuite envoyer uniquement les réponses positives vers Google. Un retour critique fait aussi partie d’une expérience authentique. La demande ne doit pas exiger cinq étoiles ni fournir un commentaire positif prêt à publier.', 'N’offrez ni réduction, ni cadeau, ni participation à un tirage au sort en échange d’un avis. N’achetez pas de commentaires et ne demandez pas à des personnes sans expérience réelle de publier. Un volume obtenu artificiellement ne construit pas une relation de confiance.'] },
      { heading: 'Prévoir ce qui se passe après la demande', paragraphs: ['Vérifiez régulièrement les nouveaux avis et préparez une réponse adaptée au contenu. Un remerciement précis ou un traitement sérieux d’une réclamation montre que les retours sont lus. Repérez les questions récurrentes qui pourraient justifier une meilleure information sur votre fiche ou dans votre accueil.', 'La collecte ne garantit pas un nombre d’avis, une note ou un classement. Commencez avec un parcours simple et compréhensible pour votre équipe. Si vous souhaitez être accompagné, OKKO peut préparer le lien, le support et la routine de réponse dans un périmètre défini sur devis.'] },
    ],
    faq: [
      { question: 'Peut-on demander uniquement aux clients satisfaits ?', answer: 'Non. Nous recommandons une invitation neutre, sans tri selon la satisfaction ni parcours qui détourne les retours négatifs de Google.' },
      { question: 'Le client doit-il écrire un long commentaire ?', answer: 'Il choisit librement la note et le contenu de son retour. Vous pouvez l’inviter à partager son expérience sans imposer de longueur ni de formulation.' },
      { question: 'Que faire si le lien ne fonctionne pas ?', answer: 'Vérifiez la fiche de destination et récupérez à nouveau le lien depuis les outils de votre fiche. Testez-le avant de remettre un support ou de l’intégrer à un message.' },
    ],
    related: ['/carte-nfc-avis-google', '/gestion-avis-google', '/guides/repondre-avis-google'],
  },
];

export function getSeoPage(path: string): SeoPage | undefined {
  return SEO_PAGES.find((page) => page.path === path);
}
