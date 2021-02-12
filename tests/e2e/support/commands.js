// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
    apiKey: Cypress.env('VUE_APP_FIREBASE_API_KEY'),
    authDomain:
        Cypress.env('VUE_APP_FIREBASE_AUTH_DOMAIN') ||
        Cypress.env('VUE_APP_FIREBASE_PROJECT_ID') + '.firebaseapp.com',
    databaseURL:
        Cypress.env('VUE_APP_FIREBASE_DATABASE_URL') ||
        'https://' +
            Cypress.env('VUE_APP_FIREBASE_PROJECT_ID') +
            '.firebaseio.com',
    projectId: Cypress.env('VUE_APP_FIREBASE_PROJECT_ID'),
    storageBucket:
        Cypress.env('VUE_APP_STORAGE_BUCKET') ||
        Cypress.env('VUE_APP_FIREBASE_PROJECT_ID') + '.appspot.com',
    messagingSenderId: Cypress.env('VUE_APP_FIREBASE_MESSAGING_SENDER_ID'),
    appId: Cypress.env('VUE_APP_FIREBASE_APP_ID'),
    measurementId: Cypress.env('VUE_APP_FIREBASE_MEASUREMENT_ID'),
};
firebase.initializeApp(firebaseConfig);

Cypress.Commands.add('startGame', (time, mode, place) => {
    cy.visit('/', {
        onBeforeLoad: (win) => {
            Object.defineProperty(win.navigator, 'language', {
                value: 'en-EN',
            });
        },
    });

    if (place) {
        cy.get('#search-input').type(place);
    }

    const btnWithFriends = cy.get('.search-box__btns .v-btn.secondary');
    btnWithFriends.contains('With Friends');

    const btnSinglePlayer = cy.get('.search-box__btns .v-btn.primary');
    btnSinglePlayer.contains('Single Player');
    btnSinglePlayer.click();

    expect(cy.get('#modeClassicBtn')).to.exist;
    expect(cy.get('#modeCountryBtn')).to.exist;
    if (mode === 'country') {
        cy.get('#modeCountryBtn').click();
    }
    const card = cy.get('.v-card');
    card.contains('.card_settings__time__label', 'Set a time limitation.');

    if (time) {
        cy.get('.time-picker .v-slider--horizontal').click('center');
        cy.get('.time-input__second input')
            .should('have.value', 0)
            .type('{backspace}' + time);
        cy.get('.time-input__minute input')
            .should('have.value', 5)
            .type('{backspace}0{enter}');
    }

    card.get('.v-card__actions .v-btn:last-of-type').contains('NEXT').click();

    cy.url().should('include', '/street-view');
});

Cypress.Commands.add('setPositionGuess', (isMobile) => {
    if (isMobile) {
        cy.get('#make-guess-button').click();
    }

    // if panel Dev mode Google
    cy.get('div#container-map').then(($body) => {
        if ($body.find('.dismissButton').length > 0) {
            cy.get('div#container-map .dismissButton').click();
        }
    });
    cy.get('div#container-map').click('center');
    cy.get('map').should('exist');
});

Cypress.Commands.add('finishRound', () => {
    cy.get('#play-again-button').contains('View details').click();

    cy.url().should('eq', Cypress.config().baseUrl + 'history');

    cy.get('.v-data-table__wrapper tbody').children().should('have.length', 2);
    cy.get('.v-data-table__expanded').should('exist');
});

Cypress.Commands.add('createRoom', (time = 0, mode = 'classic') => {
    const room = firebase.database().ref('cypress');
    cy.log('created new room cypress', firebase.database.ServerValue.TIMESTAMP);
    room.update({
        test: true,
        playerName: {
            player1: 'Toto',
        },
        timeLimitation: time,
        difficulty: 2000,
        mode: mode,
        size: 2,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        round1: {
            player1: 0,
        },
        streetView: {
            round1: {
                latitude: -47.17523906165908,
                longitude: -66.1606798240516,
                roundInfo: null,
                warning: false,
            },
        },
    });
});

Cypress.Commands.add('setPositionFirstPlayerFirebase', (nbround = 1) => {
    const round = firebase.database().ref('cypress/round' + nbround);
    round.update({
        player1: {
            distance: 13896482,
            latitude: -12.936520604248104,
            longitude: 161.80768899999998,
            points: 5,
        },
    });
    const guess = firebase.database().ref('cypress/guess');

    guess.update({
        player1: {
            latitude: -12.936520604248104,
            longitude: 161.80768899999998,
        },
    });
});
