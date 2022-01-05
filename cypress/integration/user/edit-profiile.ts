describe('Edit Profile', () => {
	beforeEach(() => {
		cy.login('3hakjoon@gmail.com', '123456');
	});
	it('can go to /edit-profile using the header', () => {
		cy.wait(1000);
		cy.get('a[href="/edit-profile"]').click();
		cy.assertTitle('Edit Profile | Nuber Eats');
	});
	it('can change email', () => {
		cy.intercept('Post', 'http://localhost:3000/graphql', (req) => {});
		cy.wait(1000);
		cy.get('a[href="/edit-profile"]').click();
	});
});
