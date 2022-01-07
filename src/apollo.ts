import { ApolloClient, createHttpLink, InMemoryCache, makeVar, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { LOCALSTORAGE_TOKEN } from './utils/constants';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const authTokenVar = makeVar(token);
const authLink = setContext((_, { headers }) => {
	return {
		headers: {
			...headers,
			'x-jwt': authTokenVar() || '',
		},
	};
});

const wsLink = new WebSocketLink({
	uri: 'ws://localhost:4000/graphql',
	options: {
		reconnect: true,
		connectionParams: {
			'x-jwt': authTokenVar() || '',
		},
	},
});
const httpLink = createHttpLink({
	uri: 'http://localhost:4000/graphql',
});

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
	},
	wsLink,
	authLink.concat(httpLink)
);

export const isLoggedInVar = makeVar(Boolean(token));

export const client = new ApolloClient({
	link: splitLink,
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
							return authTokenVar();
						},
					},
				},
			},
		},
	}),
});
