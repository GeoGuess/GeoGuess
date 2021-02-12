describe('SinglePlayer', () => {
    it('Play SinglePlayer Classic on IPhone 6', () => {
        cy.viewport('iphone-6');
        cy.startGame(5);

        cy.get('div#container-map').should(
            'not.have.class',
            'container-map--active'
        );
        cy.get('#make-guess-button').click();
        cy.get('#make-guess-button').should('not.exist');
        cy.get('div#container-map').should(
            'have.class',
            'container-map--active'
        );

        cy.get('#hide-map-button').click();
        cy.get('div#container-map').should(
            'not.have.class',
            'container-map--active'
        );

        for (const round of [1, 2, 3, 4, 5]) {
            cy.contains('#roundLabel', round + ' / 5');

            if (round < 2) {
                cy.wait(5000);
            } else {
                cy.setPositionGuess(true);
                cy.get('#guess-button:not([disabled="disabled"])').click();
            }

            if (round !== 5) {
                cy.get('#next-button').click();
            } else {
                cy.get('#summary-button').click();
            }
        }
        cy.finishRound();
    });
});
