export default {
    fr: {
        Home: {
            record: 'Record',
            historyBtn: 'Historique',
            about: 'A PROPOS',
            searchBar: {
                customLoaded: 'Une carte personnalisée a été chargé',
                enterCity: 'Saisissez une ville, une région ou un pays',
            },
            aboutDescriptions: {
                1: "Geoguess est un jeu gratuit sans publicité.  \
                Les joueurs s'affrontent en 5 manches pour deviner la plus proche position d'où ils ont été placé aléatoirement. \
                Vous pouvez partager votre score sur les réseaux Sociaux comme Facebook et Twitter. \
                Vous pouvez jouer avec vos amis en multijoueurs. \
                Le premier joueur créé une salle et décide de sa taille. Une fois créés, les autres joueurs pourront rejoindre la salle à partir de son nom et joueur tous ensemble.",
                2: 'Ce jeu est issu de ',
            },
            customMap: 'CARTE PERSONNALISÉE',
            customMapDescriptions: {
                1: 'Vous pouvez limiter les positions aléatoires à une ville, région ou pays via la barre de recherche.',
                2: "Dans le mode multijoueur, le premier joueurs définit l'emplacement.",
                3: 'Par ailleurs, il vous est possible de créer vos propres cartes avec ',
                4: 'fichier.',
                5: 'Insérer le contenu du fichier via le bouton :',
                6: 'Une sélection de maps personnalisés : ',
            },
            limitation: 'LIMITATION',
            limitationDescription:
                "Actuellement, j'ai fixé un quota par jour afin que le coût du jeu ne soit pas élevé.\
            Si la carte ne se charge pas, cela signifie que le quota a été dépassé.\
            Il est réinitialisé à minuit (heure du pacifique). Désolé pour le dérangement. \
            Le jeu est open source, ainsi il vous est possible de créer votre propre jeu pour y jouer sans limite.",
            play: 'Jouer',
        },
        StreetView: {
            nearby: {
                title: 'Position Proche',
                message:
                    "Malheureusement, nous n'avons pu trouver une position à l'emplacement défini. Toutefois, nous en avons trouvé une proche 😉",
            },
            waitForOtherPlayers: 'En attente des autres joueurs',
            redirectToHomePage: "Redirection vers la page d'accueil...",
            exitGame:
                "Vous êtes forcé de quitter le jeu. Redirection vers la page d'accueil dans 5 secondes...",
            waitForOtherPlayersToFinish:
                'En attente des autres joueurs pour finir la partie...',
        },
        Maps: {
            makeGuess: 'MAKE GUESS',
            guess: 'DEVINER',
            nextRound: 'MANCHE SUIVANTE',
            viewSummary: 'VOIR LE RÉSUMÉ',
            exit: 'QUITTER',
            reset: 'RÉINIT.',
            playAgain: 'REJOUER',
            infoWindow: {
                Distance: 'Distance',
                Points: 'Points',
            },
        },
        Header: {
            language: 'Langue',
            about: 'A propos',
            limitation: 'Limitation',
            contact: 'Contact',
        },
        HeaderGame: {
            room: 'SALLE',
            round: 'MANCHE',
            distance: 'DISTANCE',
            kmaway: '{value} km',
            score: 'SCORE',
        },
        next: 'SUIVANT',
        cancel: 'ANNULER',
        DialogCustomMap: {
            title: 'Carte personnalisée',
            invalid: 'GeoJSON invalide',
            text: 'Texte',
            url: 'Lien',
            file: 'Fichier',
            edit: 'Editer la carte',
            fileLabel: 'Selectionner un fichier GeoJSON',
        },
        History: {
            title: 'Historique',
            date: 'Date',
            mode: 'Mode',
            time: 'Temps',
            distance: 'Distance',
            points: 'Points',
            rank: 'Classement',
            search: 'Rechercher',
        },
        DialogRoom: {
            singlePlayer: 'Un joueur',
            withFriends: 'Avec des amis',
            invalidRoomName: 'Nom invalide. Veuillez en choisir un autre.',
            inProgress:
                'Le premier joueur est en train de créer la salle. Veuillez patienter puis recommencer.',
            roomIsFull: 'La salle est déjà pleine. Essayer une autre.',
        },

        CardRoomName: {
            title: 'Saisir le nom de la salle.',
        },
        CardRoomPlayerName: {
            title: 'Saisir votre pseudo.',
            anonymousPlayerName: 'Anonyme 🕵',
        },
        CardRoomSize: {
            title: 'Saisir la taille de la salle.',
        },
        CardRoomTime: {
            title: 'Saisir le temps maximum par manche.',
            infinite: 'Infini',
        },
        CardRoomSettings: {
            title: 'Paramétre de la partie',
        },
        CardRoomDifficulty: {
            title: 'Saisir la difficulté.',
            easy: 'Facile (monde)',
            medium: 'Moyen (pays)',
            hard: 'Difficile (ville)',
        },
        DialogSummary: {
            summaryMsgSinglePoints:
                'Votre score est de <strong>{points}</strong> points!',
            summaryMsgSingleDistance:
                'Vous êtes à <strong>{distance}</strong> km !',
            summaryMsgMultiPoints:
                '<strong>{playerName}</strong> marque <strong>{points}</strong> points ! ',
            summaryMsgMultiDistance: '(<strong>{distance}</strong> km)',
            viewDetails: 'Voir les détails',
        },
        Footer: {
            under: 'sous',
            privacyPolicy: 'Politique de confidentialité',
        },
        urlCopied: 'Url copiée',
        DetailsMap: {
            moreInfo: 'En savoir plus',
        },
        modes: {
            classic: 'Classique',
            country: 'Pays',
        },
        Demo: {
            message:
                'Tu souhaites contribuer au projet et le rendre meilleur, ton aide est la bienvenue :  Traduction 🔠, Créateur de carte 🌍, Code 💻, Idée 💡, Beta test 👀.',
            btn: 'Rejoins-nous',
        },
    },
};
