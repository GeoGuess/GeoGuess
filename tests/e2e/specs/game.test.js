// https://docs.cypress.io/api/introduction/api.html

describe('SinglePlayer', () => {
    it('Play SinglePlayer', () => {
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

        expect(cy.get('#modeClassicBtn')).to.exist;
        expect(cy.get('#modeCountryBtn')).to.exist;
        const card = cy.get('.v-card');
        card.contains('.card_settings__time__label', 'Set a time limitation.');
        card.get('.v-card__actions .v-btn:last-of-type')
            .contains('NEXT')
            .click();

        cy.url().should('include', '/street-view');

        cy.get('div#container-map').should(
            'have.class',
            'container-map--size-2'
        );
        const btnDown = cy.get('#btnDown');
        btnDown.click();
        btnDown.should('be.disabled');
        cy.get('#btnUp').click().click();
        // containerMap.should('have.class', 'container-map--size-1');
        for (const round of [1, 2, 3, 4, 5]) {
            cy.wait(500);
            cy.contains('#roundLabel', round + ' / 5');
            cy.get('div#container-map').click('center');
            cy.get('map').should('exist');
            cy.wait(500);
            cy.get('#guess-button:not([disabled="disabled"])').click();

            cy.wait(500);
            cy.get('.container-map--full').should('exist');
            if (round !== 5) {
                cy.get('#next-button').click();
            } else {
                cy.get('#summary-button').click();
            }
        }

        cy.get('#play-again-button').contains('View details').click();

        cy.url().should('eq', Cypress.config().baseUrl + 'history');

        cy.get('.v-data-table__wrapper tbody')
            .children()
            .should('have.length', 2);
        cy.get('.v-data-table__expanded').should('exist');
    });
});
