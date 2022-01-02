import { ApolloProvider } from '@apollo/client';
import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import React from 'react';
import userEvent from '@testing-library/user-event';
import CreateAccount, { CREATE_ACCOUNT_MUTATION } from '../create-account';
import { render, waitFor, RenderResult } from '../../utils/test-utils';
import { UserRole } from '../../generated/globalTypes';

// Todo useNaviation 목킹해서 url변경하는부분 확인 및 에러메세지 출력확인

describe('<CreateAccount />', () => {
	let mockedClient: MockApolloClient;
	let renderResult: RenderResult;
	beforeEach(async () => {
		await waitFor(() => {
			mockedClient = createMockClient();
			renderResult = render(
				<ApolloProvider client={mockedClient}>
					<CreateAccount />
				</ApolloProvider>
			);
		});
	});
	it('renders OK', async () => {
		await waitFor(() => expect(document.title).toBe('Create Account | NuberEats'));
	});
	it('renders validation errors', async () => {
		const { getByRole, getByPlaceholderText } = renderResult;
		const email = getByPlaceholderText(/email/i);
		const button = getByRole('button');
		await waitFor(() => {
			userEvent.type(email, 'wont@work');
		});
		const errorMessage = getByRole('alert');
		expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
		await waitFor(() => {
			userEvent.clear(email);
		});
		await waitFor(() => {
			userEvent.type(email, 'working@email.com');
			userEvent.click(button);
		});
	});
	it('submits mutation with form values', async () => {
		const { getByRole, getByPlaceholderText } = renderResult;
		const email = getByPlaceholderText(/email/i);
		const password = getByPlaceholderText(/password/i);
		const button = getByRole('button');
		const formData = {
			email: 'working@mail.com',
			password: '12345',
			role: UserRole.Client,
		};
		const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
			data: {
				createAccount: {
					ok: true,
					error: 'mutation-error',
				},
			},
		});
		mockedClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, mockedLoginMutationResponse);
		jest.spyOn(window, 'alert').mockImplementation(() => null);
		await waitFor(() => {
			userEvent.type(email, formData.email);
			userEvent.type(password, formData.password);
			userEvent.click(button);
		});
		expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
		expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
			createAccountInput: {
				email: formData.email,
				password: formData.password,
				role: formData.role,
			},
		});
	});
	afterAll(() => {
		jest.clearAllMocks();
	});
});
