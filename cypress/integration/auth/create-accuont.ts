describe('Create Account', () => {
	it('createaccount', () => {
		cy.visit('/');
		cy.intercept('http://localhost:4000/graphql', (req) => {
			req.reply((res) => {
				res.send({
					data: {
						createAccount: {
							ok: true,
							error: null,
							__typename: 'CreateAccountOutpit',
						},
					},
				});
			});
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
