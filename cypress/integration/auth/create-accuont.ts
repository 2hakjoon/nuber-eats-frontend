describe('Create Account', () => {
	it('createaccount', () => {
		cy.visit('/');
		cy.intercept('http://localhost:4000/graphql', (req) => {
			const { operationName } = req.body;
			if (operationName && operationName === 'createAccountMutation') {
				req.reply((res) => {
					res.send({
						fixture: 'auth/create-account.json',
					});
				});
			}
		});
		cy.findByText(/create an account/i).click();
		cy.findByPlaceholderText(/email/i).type('3hakjoon@gmail.com');
		cy.findByPlaceholderText(/password/i).type('123456');
		cy.findByRole('button').click();
		cy.wait(2000);
		cy.findByPlaceholderText(/email/i).type('3hakjoon@gmail.com');
		cy.findByPlaceholderText(/password/i).type('123456');
		cy.findByRole('button').click();
		cy.assertLoggedIn();
	});
});
