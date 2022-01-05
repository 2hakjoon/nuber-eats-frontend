describe('first test', () => {
	it('should go to homepage', () => {
		cy.visit('/').title().should('eq', 'Login | NuberEats');
	});
	it('can not login', () => {
		cy.visit('/');
		cy.findByPlaceholderText(/email/i).type('3hakjoon@gmail.com');
		cy.findByPlaceholderText(/password/i).type('123456545678678645678');
		cy.findByRole('button').should('not.have.class', 'bg-gray-300 pointer-events-none').click();
		cy.findByRole('alert').should('have.text', 'Wrong password');
		// to do (can log in)
	});
	it('can fill out the form', () => {
		cy.login('3hakjoon@gmail.com', '123456');
		// to do (can log in)
	});
});
