export default {
    en: {
        Home: {
            record: 'Record',
            historyBtn: 'HISTORY',
            about: 'ABOUT',
            searchBar: {
                customLoaded: 'Custom map has been loaded',
                enterCity: 'Enter city, state or country',
            },
            aboutDescriptions: {
                1: 'Geoguess is a free and lazy geoguess game with no ads.  \
                Players compete how close the player can guess random locations in five rounds. \
                You can share the score with other people via social media like Facebook or Twitter. \
                You can play multiplayer game with your friends up to five friends.  \
                The first player creates a room and decide the room size. Other players type the same room name as the first player created and the game will start.',
                2: 'This game was forked from ',
            },
            customMap: 'CUSTOMS MAP',
            customMapDescriptions: {
                1: 'You can limit random locations to city, state, or country with the search bar.',
                2: 'In the multiplayer, the first player fixes the location.',
                3: 'Furthermore, you can make your customs map with ',
                4: 'file.',
                5: 'Insert the content of the GeoJson map with the button :',
                6: 'Customs Map selection : ',
            },
            limitation: 'LIMITATION',
            limitationDescription:
                "Currently I set quotas per day so the cost to run this game can't get too high. \
            If the map doesn't load, it means the quotas has been exceeded on the day. \
            It will reset at midnight Pacific Time. Sorry for inconvenience. \
            This game is open source so you can build your own game server and play this game unlimitedly.",
            play: 'Play',
        },
        StreetView: {
            nearby: {
                title: 'Nearby Position',
                message:
                    'Unfortunately, we were unable to find a random position in the defined location. However, we have found one nearby 😉',
            },
            waitForOtherPlayers: 'Waiting for other players...',
            redirectToHomePage: 'Redirect to Home Page...',
            exitGame:
                'You are forced to exit the game. Redirect to home page after 5 seconds...',
            waitForOtherPlayersToFinish:
                'Waiting for other players to finish the game...',
        },
        Maps: {
            makeGuess: 'MAKE GUESS',
            guess: 'GUESS',
            nextRound: 'NEXT ROUND',
            viewSummary: 'VIEW SUMMARY',
            exit: 'EXIT',
            reset: 'RESET',
            playAgain: 'PLAY AGAIN',
            infoWindow: {
                Distance: 'Distance',
                Points: 'Points',
            },
        },
        Header: {
            language: 'Language',
            about: 'About',
            limitation: 'Limitation',
            contact: 'Contact',
        },
        HeaderGame: {
            room: 'ROOM',
            round: 'ROUND',
            distance: 'DISTANCE',
            kmaway: '{value} km away',
            score: 'SCORE',
        },
        next: 'NEXT',
        cancel: 'CANCEL',
        DialogCustomMap: {
            title: 'Custom Map',
            invalid: 'Invalid GeoJSON',
            text: 'Text',
            url: 'Url',
            file: 'File',
            edit: 'Edit Map',
            fileLabel: 'Select GeoJSON file',
        },
        History: {
            title: 'History',
            date: 'Date',
            mode: 'Mode',
            time: 'Time',
            distance: 'Distance',
            points: 'Points',
            rank: 'Rank',
            search: 'Search',
        },
        DialogRoom: {
            singlePlayer: 'Single Player',
            withFriends: 'With Friends',
            invalidRoomName: 'Invalid name. Please try another.',
            inProgress:
                'The first player is creating the room right now. Please wait and try again.',
            roomIsFull: 'This room is already full. Please try another.',
        },
        CardRoomName: {
            title: 'Type a room name.',
        },
        CardRoomPlayerName: {
            title: 'Type a player name.',
            anonymousPlayerName: 'Anonymous 🕵',
        },
        CardRoomSize: {
            title: 'Set a room size.',
        },
        CardRoomTime: {
            title: 'Set a time limitation.',
            infinite: 'Infinite',
        },
        CardRoomSettings: {
            title: 'Game Settings',
            modeLabel: 'Select game mode',
        },
        CardRoomDifficulty: {
            title: 'Set a difficulty level.',
            easy: 'easy (world)',
            medium: 'medium (country)',
            hard: 'hard (city)',
        },
        DialogSummary: {
            summaryMsgSinglePoints:
                'Your score is <strong>{points}</strong> points! ',
            summaryMsgSingleDistance:
                'You are <strong>{distance}</strong> km away!',
            summaryMsgMultiPoints:
                '<strong>{playerName}</strong> score is <strong>{points}</strong> ! ',
            summaryMsgMultiDistance: '(<strong>{distance}</strong> km away)',
            viewDetails: 'View details',
        },
        Footer: {
            under: 'under',
            privacyPolicy: 'Privacy Policy',
        },
        urlCopied: 'Url copied',
        DetailsMap: {
            moreInfo: 'More information',
        },
        modes: {
            classic: 'Classic',
            country: 'Pick country',
        },
        Demo: {
            message:
                'If you want to contribute to a project and make it better, your help is very welcome :  Translation 🔠, Mapper 🌍, Code 💻, Idea 💡, Beta test 👀.',
            btn: 'Join Us',
        },
    },
};
