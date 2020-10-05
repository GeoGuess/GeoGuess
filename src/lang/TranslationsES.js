export default {
    es: {
        Home: {
            record: 'Grabar',
            historyBtn: 'HISTORIA',
            about: 'ACERCA DE',
            searchBar: {
                customLoaded: 'Se ha cargado el mapa personalizado',
                enterCity: 'Ingrese ciudad, estado o país',
            },
            aboutDescriptions: {
                1: 'Geoguess es un juego de geoguess gratuito y perezoso sin anuncios. \
                    Los jugadores compiten qué tan cerca el jugador puede adivinar ubicaciones aleatorias en cinco rondas. \
                    Puede compartir la puntuación con otras personas a través de redes sociales como Facebook o Twitter. \
                    Puedes jugar juegos multijugador con tus amigos hasta cinco amigos. \
                    El primer jugador crea una habitación y decide el tamaño de la habitación. Otros jugadores escriben el mismo nombre de sala que el primer jugador creado y el juego comenzará.',
                2: 'Este juego fue bifurcado de ',
            },
            customMap: 'MAPA ADUANERO',
            customMapDescriptions: {
                1: 'Puede limitar las ubicaciones aleatorias a la ciudad, el estado o el país con la barra de búsqueda.',
                2: 'En el modo multijugador, el primer jugador fija la ubicación.',
                3: 'Además, puedes hacer tu mapa de aduanas con',
                4: 'expediente.',
                5: 'Inserte el contenido del mapa GeoJson con el botón:',
                6: 'Selección del mapa de aduanas:',
            },
            limitation: 'LIMITACIÓN',
            limitationDescription:
                'Actualmente establezco cuotas por día para que el costo de ejecutar este juego no sea demasiado alto. \
              Si el mapa no se carga, significa que se excedieron las cuotas del día.\
              Se reiniciará a la medianoche, hora del Pacífico. Disculpe las molestias.\
              Este juego es de código abierto, por lo que puedes crear tu propio servidor de juegos y jugarlo de forma ilimitada.',
        },
        StreetView: {
            nearby: {
                title: 'Posición cercana',
                message:
                    'Desafortunadamente, no pudimos encontrar una posición aleatoria en la ubicación definida. Sin embargo, hemos encontrado uno cerca 😉',
            },
            waitForOtherPlayers: 'Esperando a otros jugadores ...',
            redirectToHomePage: 'Redirigir a la página de inicio ...',
            exitGame:
                'Estás obligado a salir del juego. Redirigir a la página de inicio después de 5 segundos ...',
            waitForOtherPlayersToFinish:
                'Esperando a que otros jugadores terminen el juego ...',
        },
        Maps: {
            makeGuess: 'HAZ ADIVINAR',
            guess: 'ADIVINAR',
            nextRound: 'PROXIMA RONDA',
            viewSummary: 'VER RESUMEN',
            exit: 'SALIDA',
            reset: 'REINICIAR',
            playAgain: 'JUEGA DE NUEVO',
            infoWindow: {
                Distance: 'Distancia',
                Points: 'Puntos',
            },
        },
        Header: {
            language: 'Idioma',
            about: 'Acerca de',
            limitation: 'Limitación',
            contact: 'Contacto',
        },
        HeaderGame: {
            room: 'HABITACIÓN',
            round: 'REDONDO',
            distance: 'DISTANCIA',
            kmaway: '{value} km de distancia',
            score: 'PUNTUACIÓN',
        },
        next: 'SIGUIENTE',
        cancel: 'CANCELAR',
        DialogCustomMap: {
            title: 'Mapa personalizado',
            invalid: 'GeoJSON no válido',
            text: 'Texto',
            url: 'Url',
            file: 'Expediente',
            edit: 'Editar mapa',
            fileLabel: 'Seleccione el archivo GeoJSON',
        },
        History: {
            title: 'Historia',
            date: 'Fecha',
            mode: 'Modo',
            time: 'Tiempo',
            distance: 'Distancia',
            points: 'Puntos',
            rank: 'Rango',
            search: 'Buscar',
        },

        DialogRoom: {
            singlePlayer: 'Un jugador',
            withFriends: 'Con amigos',
            invalidRoomName: 'Nombre inválido. Intente con otro.',
            inProgress:
                'El primer jugador está creando la sala ahora mismo. Espere y vuelva a intentarlo.',
            roomIsFull: 'Esta sala ya está llena. Intente con otro.',
        },

        CardRoomName: {
            title: 'Escriba el nombre de una habitación.',
        },
        CardRoomPlayerName: {
            title: 'Escribe un nombre de jugador.',
        },
        CardRoomSize: {
            title: 'Establece un tamaño de habitación.',
        },
        CardRoomTime: {
            title: 'Establece una limitación de tiempo.',
            infinite: 'Infinito',
        },
        CardRoomDifficulty: {
            title: 'Establece un nivel de dificultad.',
            easy: 'fácil (mundo)',
            medium: 'medio (país)',
            hard: 'duro (ciudad)',
        },
        DialogSummary: {
            summaryMsgSingle:
                '¡Estás a <strong>{distance}</strong> km away! ¡Tu puntuación es de <strong>{points}</strong> puntos!',
            summaryMsgMulti:
                '¡La puntuación de <strong>{playerName}</strong> es <strong>{points}</strong> ! (<strong>{distance}</strong> km de distancia)',
            viewDetails: 'Ver detalles',
        },
        Footer: {
            under: 'debajo',
            privacyPolicy: 'Política de privacidad',
        },
        urlCopied: 'URL copiada',
    },
};
