import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';

const token = localStorage.getItem('token');

export const isLoggedInVar = makeVar(Boolean(token));
export const authToken = makeVar(token);

export const client = new ApolloClient({
	uri: 'http://localhost:4000/graphql',
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					isLoggedInVar: {
						read() {
							return isLoggedInVar();
						},
					},
					token: {
						read() {
							return authToken();
						},
					},
				},
			},
		},
	}),
});
