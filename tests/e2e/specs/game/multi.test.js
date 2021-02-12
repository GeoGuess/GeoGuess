// https://docs.cypress.io/api/introduction/api.html

describe('Multiplayer', () => {
    it('Play Multiplayer', () => {
        cy.createRoom();
        cy.visit('/', {
            onBeforeLoad: (win) => {
                Object.defineProperty(win.navigator, 'language', {
                    value: 'en-EN',
                });
            },
        });

        cy.get('.search-box__btns > .secondary > .v-btn__content').click();

        const card = cy.get('#card-roomname');
        card.get('.v-card__title span').contains(
            'Type a room name to create a new room or join a existing room'
        );
        card.get('#inputRoomName').type('cypress');

        card.get('#card-roomname .v-card__actions .v-btn:last-of-type').click();

        const cardPlayer = cy.get('#card-playername');
        cardPlayer.get('.v-card__title span').contains('Type a player name');
        cardPlayer.get('#inputPlayerName').type('Tata');

        cardPlayer
            .get('#card-playername .v-card__actions .v-btn:last-of-type')
            .click();

        cy.contains('#roundLabel', 1 + ' / 5');

        cy.get('#guess-button[disabled="disabled"]').should('be.visible');
        cy.get('#btnDown[disabled="disabled"]').should('not.exist');
        const btnDown = cy.get('#btnDown');
        btnDown.click();
        cy.setPositionGuess();
        cy.get('#guess-button:not([disabled="disabled"])').click();

        cy.get('.dialog-message__title')
            .contains('Waiting for other players...')
            .should('be.visible');

        cy.setPositionFirstPlayerFirebase();

        cy.get('.container-map--full').should('exist');
    });
});
