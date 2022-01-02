/* eslint-disable no-promise-executor-return */
import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from '../header';
import { ME_QUERY } from '../../hooks/useMe';

describe('<Header />', () => {
	const ME_QUERY_RESULT = {
		id: 1,
		email: 'test@test.com',
		role: 'Client',
		emailVerified: true,
	};

	it('renders verify banner', async () => {
		await waitFor(async () => {
			const { getByText } = render(
				<MockedProvider
					mocks={[
						{
							request: {
								query: ME_QUERY,
							},
							result: {
								data: {
									me: {
										id: ME_QUERY_RESULT.id,
										email: ME_QUERY_RESULT.email,
										role: ME_QUERY_RESULT.role,
										emailVerified: false,
									},
								},
							},
						},
					]}
				>
					<Router>
						<Header />
					</Router>
				</MockedProvider>
			);
			await new Promise((resolve) => setTimeout(resolve, 0));
			getByText('Please verify your email.');
		});
	});

	it('renders without verify banner', async () => {
		await waitFor(async () => {
			const { queryByText } = render(
				<MockedProvider
					mocks={[
						{
							request: {
								query: ME_QUERY,
							},
							result: {
								data: {
									me: {
										id: ME_QUERY_RESULT.id,
										email: ME_QUERY_RESULT.email,
										role: ME_QUERY_RESULT.role,
										emailVerified: ME_QUERY_RESULT.emailVerified,
									},
								},
							},
						},
					]}
				>
					<Router>
						<Header />
					</Router>
				</MockedProvider>
			);
			await new Promise((resolve) => setTimeout(resolve, 5));
			expect(queryByText('Please verify your email.')).toBeNull();
		});
	});
});
