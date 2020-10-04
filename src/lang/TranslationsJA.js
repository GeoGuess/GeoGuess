export default {
    ja: {
        Home: {
            record: 'ベストスコア',
            // historyBtn: 'HISTORY',
            about: 'このサイトについて',
            // searchBar: {
            //   customLoaded: 'Custom map has been loaded',
            //   enterCity: 'Enter city, state or country',
            // },
            aboutDescriptions: {
                1: 'Geoguess は無料で気軽に遊べる地図を使ったゲームです。\
        プレーヤーは5ラウンドでランダムに出された場所の正確な場所を推測して競います。\
        友達と遊ぶ時は最初に部屋を作る人が部屋の名前を決めて部屋を作り、他の人が部屋に入るだけで一緒に遊ぶことができます。',
                // 2:'This game was forked from '
            },
            // customMap: 'CUSTOMS MAP',
            // customMapDescriptions: {
            //     1: "You can limit random locations to city, state, or country with the search bar.",
            //     2: "In the multiplayer, the first player fixes the location.",
            //     3: "Furthermore, you can make your customs map with ",
            //     4: "file.",
            //     5: "Insert the content of the GeoJson map with the button :",
            //     6: "Customs Map selection : "
            // },
            limitation: '制限',
            limitationDescription:
                '地図とストリートビューを表示させるのにお金がかかるため制限をかけています。\
        1日の制限を超えると地図が正しくロードされなくなります。 \
        制限は太平洋標準時での深夜にリセットされます。\
        このサイトはオープンソースなので制限なく遊びたい方は自分でゲームをセットアップすることもできます。',
        },
        StreetView: {
            // nearby: {
            //   title: 'Nearby Position',
            //   message: 'Unfortunately, we were unable to find a random position in the defined location. However, we have found one nearby 😉',
            // },
            waitForOtherPlayers: '他のプレーヤーを待っています...',
            redirectToHomePage: 'ホーム画面にリダイレクトします...',
            exitGame: 'ゲームを強制終了しました。5秒後にリダイレクトします...',
            waitForOtherPlayersToFinish:
                '他のプレーヤーが終了するのを待っています...',
        },
        Maps: {
            makeGuess: '推測する',
            guess: '決定',
            nextRound: '進む',
            viewSummary: '結果を見る',
            exit: '終了する',
            playAgain: 'もう一度遊ぶ',
            // 'reset': 'RESET',
            // infoWindow: {
            //   'Distance': 'Distance',
            //   'Points': 'Points',
            // }
        },
        Header: {
            language: '言語',
            about: 'このサイトについて',
            limitation: '制限',
            contact: 'お問い合わせ',
        },
        HeaderGame: {
            round: 'ラウンド',
            score: 'スコア',
            // distance: 'DISTANCE',
            // kmaway: '{value} km away',
            // score: 'SCORE',
        },
        next: '進む',
        cancel: 'キャンセル',
        // DialogCustomMap: {
        //   title: 'Custom Map',
        //   invalid: 'Invalid GeoJSON',
        //   'text': 'Text',
        //   url: 'Url',
        //   file: 'File',
        //   edit: 'Edit Map',
        //   'fileLabel': 'Select GeoJSON file'
        // },
        // History: {
        //   title: 'History',
        //   date: 'Date',
        //   mode: 'Mode',
        //   time: 'Time',
        //   distance: 'Distance',
        //   points: 'Points',
        //   rank: 'Rank',
        //   search: 'Search',
        // },

        DialogRoom: {
            singlePlayer: '一人で遊ぶ',
            withFriends: '友達と遊ぶ',
            invalidRoomName: '無効な名前です。別の名前を入力して下さい。',
            inProgress:
                '最初のプレーヤーが部屋を作っています。再度試して下さい。',
            roomIsFull: 'この部屋は既に満員です。',
        },
        CardRoomName: {
            title: '部屋の名前を入力して下さい。',
        },
        CardRoomPlayerName: {
            title: 'プレーヤーの名前を入力して下さい。',
        },
        CardRoomSize: {
            title: '部屋の人数を選択して下さい。',
        },
        CardRoomTime: {
            title: '1ラウンドの制限時間を選択して下さい。',
            infinite: '無制限',
        },
        // CardRoomDifficulty: {
        //   title: 'Set a difficulty level.',
        //   easy: 'easy (world)',
        //   medium: 'medium (country)',
        //   hard: 'hard (city)',
        // },
        // DialogSummary: {
        //   summaryMsgSingle: 'You are <strong>{distance}</strong> km away! Your score is <strong>{points}</strong> points!',
        //   summaryMsgMulti: '<strong>{playerName}</strong> score is <strong>{points}</strong> ! (<strong>{distance}</strong> kmaway)',
        //   viewDetails: 'View details',
        // },
        Footer: {
            // under: 'under',
            privacyPolicy: 'プライバシーポリシー',
        },
    },
};
