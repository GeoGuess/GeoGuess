export default {
    de: {
        Home: {
            record: 'Aufzeichnung',
            historyBtn: 'Historisch',
            about: 'ÜBER',
            searchBar: {
                customLoaded: 'Eine personalisierte Karte wurde geladen',
                enterCity: 'Geben Sie eine Stadt, Region oder ein Land ein',
            },
            aboutDescriptions: {
                1: 'Geoguess ist ein kostenloses Spiel ohne Werbung.  \
                Die Spieler treten in 5 Runden gegeneinander an, um die nächstgelegene Position zu erraten, an der sie zufällig platziert wurden. Wir können Ihre Punktzahl in sozialen Netzwerken wie Facebook und Twitter teilen.\
                Sie können Ihre Punktzahl in sozialen Netzwerken wie Facebook und Twitter teilen.\
                Sie können mit Ihren Freunden im Mehrspielermodus spielen.\
                Der erste Spieler erstellt einen Raum und entscheidet über seine Größe. Nach der Erstellung können andere Spieler den Raum mit ihrem Namen und ihrem Spieler gemeinsam betreten.',
                2: 'Dieses Spiel ist aus',
            },
            customMap: 'CARTE PERSONNALISÉE',
            customMapDescriptions: {
                1: 'Sie können die zufälligen Positionen über die Suchleiste auf eine Stadt, eine Region oder ein Land beschränken.',
                2: 'Im Mehrspielermodus legt der erste Spieler den Ort fest.',
                3: 'Außerdem können Sie mit Ihre eigenen Karten erstellen :',
                4: 'datei.',
                5: 'Fügen Sie den Inhalt der Datei mit der Schaltfläche ein:',
                6: 'Eine Auswahl an benutzerdefinierten Karten:',
            },
            limitation: 'EINSCHRÄNKUNG',
            limitationDescription:
                'Derzeit habe ich eine Quote pro Tag festgelegt, damit die Kosten des Spiels nicht hoch sind.\
            Wenn die Karte nicht geladen wird, bedeutet dies, dass das Kontingent überschritten wurde.\
            Es wird um Mitternacht (pazifische Zeit) zurückgesetzt. Entschuldigung für die Unannehmlichkeiten.\
            Das Spiel ist Open Source, so dass Sie Ihr eigenes Spiel erstellen können, um ohne Grenzen zu spielen.',
        },
        StreetView: {
            nearby: {
                title: 'Position schließen',
                message:
                    'Leider konnten wir am definierten Ort keine Stelle finden. Wir haben jedoch einen engen gefunden 😉',
            },
            waitForOtherPlayers: 'Warten auf andere Spieler',
            redirectToHomePage: 'Weiterleitung zur Homepage ...',
            exitGame:
                'Sie müssen das Spiel beenden. Umleitung zur Startseite in 5 Sekunden ...',
            waitForOtherPlayersToFinish:
                'Warten auf andere Spieler, um das Spiel zu beenden ...',
        },
        Maps: {
            makeGuess: 'RATET MAL',
            guess: 'RATEN',
            nextRound: 'NÄCHSTE RUNDE',
            viewSummary: 'SIEHE ZUSAMMENFASSUNG',
            exit: 'VERLASSEN',
            reset: 'RESET.',
            playAgain: 'WIEDERHOLUNG',
            infoWindow: {
                Distance: 'Entfernung',
                Points: 'Punkte',
            },
        },
        Header: {
            language: 'Sprache',
            about: 'Über',
            limitation: 'Einschränkung',
            contact: 'Kontakt',
        },
        HeaderGame: {
            room: 'ZIMMER',
            round: 'GRIFF',
            distance: 'ENTFERNUNG',
            kmaway: '{value} km',
            score: 'ERGEBNIS',
        },
        next: 'FOLGENDES',
        cancel: 'ABBRECHEN',
        DialogCustomMap: {
            title: 'Personalisierte Karte',
            invalid: 'Ungültiger GeoJSON',
            text: 'Text',
            url: 'Verknüpfung',
            file: 'Datei',
            edit: 'Karte bearbeiten',
            fileLabel: 'Wählen Sie eine GeoJSON-Datei aus',
        },
        History: {
            title: 'Historisch',
            date: 'Datiert',
            mode: 'Mode',
            time: 'Zeit',
            distance: 'Entfernung',
            points: 'Punkte',
            rank: 'Rangfolge',
            search: 'Suche',
        },
        DialogRoom: {
            singlePlayer: 'Ein Spieler',
            withFriends: 'Mit Freunden',
            invalidRoomName: 'Ungültiger Name. Bitte wählen Sie einen anderen.',
            inProgress:
                'Der erste Spieler erstellt den Raum. Bitte warten Sie und beginnen Sie erneut.',
            roomIsFull: 'Der Raum ist schon voll. Versuche einen anderen.',
        },

        CardRoomName: {
            title: 'Geben Sie den Namen des Raums ein.',
        },
        CardRoomPlayerName: {
            title: 'Trage deinen Spitznamen ein.',
        },
        CardRoomSize: {
            title: 'Geben Sie die Größe des Raums ein.',
        },
        CardRoomTime: {
            title: 'Geben Sie die maximale Zeit pro Runde ein.',
            infinite: 'Unendlich',
        },
        CardRoomDifficulty: {
            title: 'Erfassen Sie die Schwierigkeit.',
            easy: 'Einfach (Welt)',
            medium: 'Mittel (Land)',
            hard: 'Schwierig (Stadt)',
        },
        DialogSummary: {
            summaryMsgSinglePoints:
                'Dein Ergebnis ist<strong>{points}</strong> Punkte! ',
            summaryMsgSingleDistance:
                'Du bist bei<strong>{distance}</strong> km !',
            summaryMsgMultiPoints:
                '<strong>{playerName}</strong> erhält  <strong>{points}</strong> Punkte ! ',
            summaryMsgMultiDistance: '(<strong>{distance}</strong> km)',
            viewDetails: 'Siehe die Details',
        },
        Footer: {
            under: 'unter',
            privacyPolicy: 'Datenschutz-Bestimmungen',
        },
        urlCopied: 'URL kopiert',
    },
};
