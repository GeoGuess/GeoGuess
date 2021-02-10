import { finishRound, setPosition, startGame } from '../../utils/gameTestUtils';

// https://docs.cypress.io/api/introduction/api.html

describe('SinglePlayer', () => {
    it('Play SinglePlayer Classic', () => {
        startGame(cy);

        cy.get('div#container-map').should(
            'have.class',
            'container-map--size-2'
        );
        const btnDown = cy.get('#btnDown');
        btnDown.click();
        btnDown.should('be.disabled');
        cy.get('#btnUp').click().click();

        cy.get('#roundLabel').click();

        cy.get('div#container-map').should(
            'not.have.class',
            'container-map--active'
        );
        cy.get('#btnPin').click();
        cy.get('div#container-map').should(
            'have.class',
            'container-map--active'
        );

        for (const round of [1, 2, 3, 4, 5]) {
            cy.contains('#roundLabel', round + ' / 5');
            setPosition(cy);
            cy.get('#guess-button:not([disabled="disabled"])').click();

            if (round !== 5) {
                cy.get('#next-button').click();
            } else {
                cy.get('#summary-button').click();
            }
        }
        finishRound(cy);
    });
});
