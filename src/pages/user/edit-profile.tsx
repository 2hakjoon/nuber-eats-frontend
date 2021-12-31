import { gql, useApolloClient, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import Button from '../../components/button';
import { editProfileMutation, editProfileMutationVariables } from '../../generated/editProfileMutation';
import { EditProfileInput } from '../../generated/globalTypes';
import { useMe } from '../../hooks/useMe';
import { regexEmail } from '../../utils/regex';

const EDIT_PROFILE_MUTATION = gql`
	mutation editProfileMutation($input: EditProfileInput!) {
		editProfile(input: $input) {
			ok
			error
		}
	}
`;

function EditProfile() {
	const { data: userData } = useMe();
	const client = useApolloClient();
	const { register, handleSubmit, formState, getValues } = useForm<EditProfileInput>({
		mode: 'onBlur',
		defaultValues: {
			email: userData?.me.email,
		},
	});
	const onCompleted = (data: editProfileMutation) => {
		const {
			editProfile: { ok },
		} = data;
		if (ok && userData) {
			const {
				me: { email: prevEmail },
			} = userData;
			const { email: newEmail } = getValues();
			if (prevEmail !== newEmail) {
				client.writeFragment({
					id: `User:${userData.me.id}`,
					fragment: gql`
						fragment EditedUSer on User {
							emailVerified
							email
						}
					`,
					data: {
						email: newEmail,
						emailVerified: false,
					},
				});
			}
		}
	};

	const [editProfile] = useMutation<editProfileMutation, editProfileMutationVariables>(EDIT_PROFILE_MUTATION, {
		onCompleted,
	});

	const onSubmit = ({ email, password }: EditProfileInput) => {
		editProfile({
			variables: {
				input: {
					email,
					...(password !== '' && { password }),
				},
			},
		});
	};

	return (
		<>
			<Helmet title="Edit Profile | Nuber Eats" />
			<div className="mt-52 flex flex-col justify-center items-center">
				<h4>Edit Profile</h4>
				<form className="grid gap-3 mt-5 w-full max-w-sm mb-5" onSubmit={handleSubmit(onSubmit)}>
					<input
						{...register('email', {
							pattern: { value: regexEmail, message: 'Please enter a valid email' },
						})}
						className="input"
						type="email"
						placeholder="Email"
					/>
					<input {...register('password')} className="input" type="password" placeholder="Password" />
					<Button loading={false} canClick={formState.isValid} actionText="Update Profile" />
				</form>
			</div>
		</>
	);
}

export default EditProfile;
