import { finishRound, setPosition, startGame } from '../../utils/gameTestUtils';

// https://docs.cypress.io/api/introduction/api.html

describe('SinglePlayer', () => {
    it('Play SinglePlayer with timeout', () => {
        startGame(cy, 5);

        for (const round of [1, 2, 3, 4, 5]) {
            cy.contains('#countdown-text', new RegExp('00:0([0-5])'));
            cy.contains('#roundLabel', round + ' / 5');

            if (round < 2) {
                cy.get('#guess-button[disabled="disabled"]').should('exist');
                cy.wait(5000);
            } else {
                setPosition(cy);
                cy.get('#guess-button:not([disabled="disabled"])').click();
            }

            if (round !== 5) {
                cy.get('#next-button').click();
            } else {
                cy.get('#summary-button').click();
            }
        }
        finishRound(cy);
    });
});
