// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
    it('Visits the app root url', () => {
        cy.visit('/', {
            onBeforeLoad: (win) => {
                Object.defineProperty(win.navigator, 'language', {
                    value: 'en-EN',
                });
            },
        });
        const btnWithFriends = cy.get('.search-box__btns .v-btn.secondary');
        btnWithFriends.contains('With Friends');

        const btnSinglePlayer = cy.get('.search-box__btns .v-btn.primary');
        btnSinglePlayer.contains('Single Player');
        btnSinglePlayer.click();

        const card = cy.get('.v-card');
        card.contains('.v-card__title', 'Set a time limitation.');
        card.get('.v-card__actions .v-btn:last-of-type')
            .contains('NEXT')
            .click();
        cy.url().should('include', '/street-view');
    });
});
