import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { verifyEmail, verifyEmailVariables } from '../../generated/verifyEmail';
import { useMe } from '../../hooks/useMe';

const VERIFY_EMAIL_MUTATION = gql`
	mutation verifyEmail($input: VerifyEmailInput!) {
		verifyEmail(input: $input) {
			ok
			error
		}
	}
`;

function ConfirmEmail() {
	const { data: userData } = useMe();
	const client = useApolloClient();

	const onCompleted = (data: verifyEmail) => {
		const {
			verifyEmail: { ok },
		} = data;

		if (ok && userData?.me.id) {
			client.writeFragment({
				id: `User:${userData.me.id}`,
				fragment: gql`
					fragment VerifiedUser on User {
						emailVerified
					}
				`,
				data: {
					emailVerified: true,
				},
			});
		}
	};

	const [VerifyEmail, { loading: verifyingEmail }] = useMutation<verifyEmail, verifyEmailVariables>(
		VERIFY_EMAIL_MUTATION,
		{
			onCompleted,
		}
	);

	const location = useLocation();
	const code = location.search.split('code=')[1];

	useEffect(() => {
		VerifyEmail({
			variables: {
				input: {
					code,
				},
			},
		});
	}, []);

	return (
		<>
			<Helmet title="Verify Email | Nuber Eats" />
			<div className="mt-50 flex flex-col items-center justify-center ">
				{verifyingEmail && (
					<>
						<h2 className="text-xl mb-2 font-semibold">Confirming email...</h2>
						<h4 className="text-gray-700 text-sm">Please wait, do not close this page...</h4>
					</>
				)}
			</div>
		</>
	);
}

export default ConfirmEmail;
