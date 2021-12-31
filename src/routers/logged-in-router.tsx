import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { isLoggedInVar } from '../apollo';
import { meQuery } from '../generated/meQuery';

const ME_QUERY = gql`
	query meQuery {
		me {
			id
			email
			role
			emailVerified
		}
	}
`;

function LoggedInRouter() {
	const { data, loading, error } = useQuery<meQuery>(ME_QUERY);
	console.log(error);
	if (!data || loading || error) {
		return (
			<div className="h-screen flex justify-center items-center">
				<span className="font-medium text-xl tracking-wide">loading</span>
			</div>
		);
	}
	return (
		<div>
			<h1>LoggedInRouter</h1>
			<button type="button" onClick={() => isLoggedInVar(false)}>
				Log Out
			</button>
		</div>
	);
}

export default LoggedInRouter;
