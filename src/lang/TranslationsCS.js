export default {
    cs: {
        Home: {
            record: 'Rekord',
            historyBtn: 'HISTORIE',
            about: 'O HŘE',
            searchBar: {
                customLoaded: 'Vlastní mapa byla úspěšně načtena',
                enterCity: 'Napiš název města, regionu nebo státu (anglicky)',
            },
            aboutDescriptions: {
                1: 'Geoguess je jednoduchá geoguess hra zdarma a bez reklam. \
                  Hráči jsou umístěni na náhodné místo na světě a musí se pokusit podle svého okolí uhádnout, kde se nachází na mapě. \
                  Hra se skládá z pěti kol. \
                  Své skóre můžeš sdílet s ostatními na sociálních sítích Facebook a Twitter. \
                  Můžeš hrát sám, nebo s dalšími až pěti kamarády. \
                  Při hře více hráčů vytvoří jeden hráč místnost, do které se ostatní hráči připojí, aby mohli hrát spolu.',
                2: 'Tato hra je fork ',
            },
            customMap: 'Vlastní mapy',
            customMapDescriptions: {
                1: 'Hru můžeš omezit na města, regiony nebo státy, aby jsi nemusel hrát po celém světě.',
                2: 'Ve hře více hráčů toto omezení zvolí první hráč.',
                3: 'Kromě toho můžeš definovat herní oblast pomocí souboru ve formátu ',
                4: '.',
                5: 'Obsah souboru GeoJSON vlož pomocí tlačítka :',
                6: 'Na výběr je také z několika předpřipravených map : ',
            },
            limitation: 'OMEZENÍ',
            limitationDescription:
                'Tato hra má nastavená omezení počtu her za den, abych snížil náklady na provoz. \
            Pokud se mapa nenačítá, nebo se načte v režimu negativu (špatné barvy), znamená to, že dnešení limit her byl již naplněn. \
            Limit se resetuje o půlnoci amerického času (Pacific Time - tj. v 8 hodin ráno našeho zimního času, popř. 9 hodin ráno našeho letního času). Za tuto nepříjemnost se omlouvám. \
            Hra je poskytována open source, takže je možné hostovat vlastní kopii a hrát bez jakýchkoliv denních omezení.',
        },
        StreetView: {
            nearby: {
                title: 'Kousek vedle',
                message:
                    'Bohužel se nám nepodařilo najít vhodné místo na žádaných souřadnicích. Ale našli jsme vhodné místo o kousek vedle :-)',
            },
            waitForOtherPlayers: 'Čekám na ostatní hráče...',
            redirectToHomePage: 'Přesměruji na úvodní stránku...',
            exitGame:
                'Byl jsi přinucen ukončit hru (jeden z hráčů pravděpodovně odešel). Za 5 sekund přesměruji na úvodní stranu...',
            waitForOtherPlayersToFinish:
                'Počkej prosím, až ostatní hráči dokončí hru...',
        },
        Maps: {
            makeGuess: 'HÁDEJ POLOHU',
            guess: 'POTVRDIT',
            nextRound: 'DALŠÍ KOLO',
            viewSummary: 'ZOBRAZ VÝSLEDKY',
            exit: 'UKONČIT',
            reset: 'RESET',
            playAgain: 'HREJ ZNOVU',
            infoWindow: {
                Distance: 'Vzdálenost',
                Points: 'Skóre',
            },
        },
        Header: {
            language: 'Jazyk',
            about: 'O Hře',
            limitation: 'Omezení',
            contact: 'Kontakt',
        },
        HeaderGame: {
            room: 'MÍSTNOST',
            round: 'KOLO',
            distance: 'VZDÁLENOST',
            kmaway: '{value} km daleko',
            score: 'SKÓRE',
        },
        next: 'DAŠÍ',
        cancel: 'ZRUŠIT',
        DialogCustomMap: {
            title: 'Vlastní Mapa',
            invalid: 'Neplatný GeoJSON',
            text: 'Text',
            url: 'Url',
            file: 'Soubor',
            edit: 'Upravit Mapu',
            fileLabel: 'Zvol GeoJSON soubor',
        },
        History: {
            title: 'Historie',
            date: 'Datum',
            mode: 'Typ hry',
            time: 'Časový limit',
            distance: 'Vzdálenost',
            points: 'Skóre',
            rank: 'Umístění',
            search: 'Vyhledávání',
        },

        DialogRoom: {
            singlePlayer: 'Jeden hráč',
            withFriends: 'Více hráčů',
            invalidRoomName: 'Nevhodné jméno. Zkus se prosím pojmenovat jinak.',
            inProgress:
                'První hráč právě nastavuje hru. Vydrž prosím a za chvíli to zkus znovu.',
            roomIsFull:
                'Tato místnost je již plná. Zkus to prosím znovu později.',
        },

        CardRoomName: {
            title: 'Napiš název herní místnostni.',
        },
        CardRoomPlayerName: {
            title: 'Jak se chceš jmenovat?',
        },
        CardRoomSize: {
            title: 'Zvol počet hráčů.',
        },
        CardRoomTime: {
            title: 'Zvol časový limit kola.',
            infinite: 'Bez omezení',
        },
        CardRoomDifficulty: {
            title: 'Zvol obtížnost hry (ovlivňuje bodování).',
            easy: 'lehká (celý svět)',
            medium: 'střední (stát)',
            hard: 'těžká (město)',
        },
        DialogSummary: {
            summaryMsgSinglePoints:
                'Obdržel jsi <strong>{points}</strong> bodů! ',
            summaryMsgSingleDistance:
                'Byl jsi <strong>{distance}</strong> km daleko!',
            summaryMsgMultiPoints:
                '<strong>{playerName}</strong> skóroval(a) <strong>{points}</strong> bodů ! ',
            summaryMsgMultiDistance: '(<strong>{distance}</strong> km daleko)',
            viewDetails: 'Zobraz podrobnosti',
        },
        Footer: {
            under: 'licence:',
            privacyPolicy: 'Zásady ochrany osobních údajů (Anglicky)',
        },
        urlCopied: 'Adresa zkopírována',
        DetailsMap: {
            moreInfo: 'Více informací',
        },
    },
};
