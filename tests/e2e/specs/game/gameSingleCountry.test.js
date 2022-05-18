// https://docs.cypress.io/api/introduction/api.html

describe('SinglePlayer', () => {
    it('Play SinglePlayer Mode Country Time 10s', () => {
        cy.startGame(10, 'country', 'Albi');

        cy.get('div#container-map').should(
            'have.class',
            'container-map--size-2'
        );

        for (const round of [1, 2, 3, 4, 5]) {
            cy.contains('#roundLabel', round + ' / 5');
            cy.get('.map-label').should('not.exist');

            cy.get('#guess-button[disabled="disabled"]').should('exist');
            cy.wait(10000);

            cy.get('.container-map--full').should('exist');

            cy.get('.map-label .map-label__country-name').should(
                'have.class',
                'green'
            );
            cy.get('.map-label .map-label__country-name').contains('France');
            if (round !== 5) {
                cy.get('#next-button').click();
            } else {
                cy.get('#summary-button').click();
            }
        }
        cy.finishRound();
    });
});
