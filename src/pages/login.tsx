import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import FormError from '../components/form-error';
import { loginMutation, loginMutationVariables } from '../generated/loginMutation';
import { LoginInput } from '../generated/globalTypes';

const LOGIN_MUTATION = gql`
	mutation loginMutation($LoginInput: LoginInput!) {
		login(input: $LoginInput) {
			ok
			token
			error
		}
	}
`;

function Login() {
	const {
		register,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInput>({ mode: 'onBlur' });

	const onCompleted = (data: loginMutation) => {
		const {
			login: { ok, token },
		} = data;
		if (ok) {
			console.log(token);
		}
	};

	const [LoginMutation, { loading, error, data: loginMutationResult }] = useMutation<
		loginMutation,
		loginMutationVariables
	>(LOGIN_MUTATION, {
		onCompleted,
	});

	const onSubmit = (formData: LoginInput): void => {
		const { email, password } = formData;
		if (!loading) {
			LoginMutation({
				variables: {
					LoginInput: {
						email,
						password,
					},
				},
			});
		}
	};

	return (
		<div className="h-screen flex items-center justify-center bg-gray-800">
			<div className="bg-white w-full max-w-lg py-10 rounded-lg text-center">
				<h3 className="text-2xl text-gary-800">Log In</h3>
				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 px-5">
					<input
						{...register('email', { required: true })}
						required
						type="email"
						placeholder="Email"
						className="input"
					/>
					{errors.email && <FormError errorMessage={errors.email?.message} />}
					<input
						{...register('password', { required: true })}
						required
						type="password"
						placeholder="Password"
						className="input"
					/>
					{errors.password?.type === 'minLength' && <FormError errorMessage={errors.password?.message} />}
					<button type="submit" className="button">
						Log In
					</button>
					{loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error} />}
				</form>
			</div>
		</div>
	);
}

export default Login;
