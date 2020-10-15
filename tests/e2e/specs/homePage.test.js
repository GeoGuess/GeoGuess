describe('HomePage', () => {
    it('Langage Fr', () => {
        cy.visit('/', {
            onBeforeLoad: (win) => {
                Object.defineProperty(win.navigator, 'language', {
                    value: 'en-EN',
                });
            },
        });

        cy.get('.search-box__btns .v-btn.primary').contains('Single Player');
        cy.get('#languageBtn').click();
        cy.get('#menuLanguage').contains('English');
        cy.get('#menuLanguage').contains('Français');

        cy.get(
            '#menuLanguage .v-list-item__title:contains("Français")'
        ).click();

        cy.get('.search-box__btns .v-btn.primary').contains('Un joueur');

        cy.get('#languageBtn').click();
        cy.get('#menuLanguage .v-list-item__title:contains("English")').click();
        cy.get('.search-box__btns .v-btn.primary').contains('Single Player');
    });
});
