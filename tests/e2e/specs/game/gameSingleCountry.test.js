import { finishRound, startGame } from '../../utils/gameTestUtils';

// https://docs.cypress.io/api/introduction/api.html

describe('SinglePlayer', () => {
    it('Play SinglePlayer', () => {
        startGame(cy, 5, 'country');

        cy.get('div#container-map').should(
            'have.class',
            'container-map--size-2'
        );

        cy.get('#btnDown[disabled="disabled"]').should('not.exist');
        const btnDown = cy.get('#btnDown');
        btnDown.click();

        cy.get('#btnDown[disabled="disabled"]').should('exist');

        for (const round of [1, 2, 3, 4, 5]) {
            cy.contains('#roundLabel', round + ' / 5');
            cy.get('.map-label').should('not.exist');

            cy.get('#guess-button[disabled="disabled"]').should('exist');
            cy.wait(4000);
            cy.wait('@getReverse');

            cy.get('.container-map--full').should('exist');

            cy.get('.map-label .map-label__country-name').should(
                'have.class',
                'green'
            );
            if (round !== 5) {
                cy.get('#next-button').click();
            } else {
                cy.get('#summary-button').click();
            }
        }
        finishRound(cy);
    });
});
