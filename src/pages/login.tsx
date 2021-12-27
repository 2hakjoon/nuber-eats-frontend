import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import FormError from '../components/form-error';
import { LoginMutation, LoginMutationVariables } from '../__generated__/LoginMutation';

const LOGIN_MUTATION = gql`
	mutation LoginMutation($email: String!, $password: String!) {
		login(input: { email: $email, password: $password }) {
			ok
			token
			error
		}
	}
`;

interface ILoignForm {
	email: string;
	password: string;
}

function Login() {
	const {
		register,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm<ILoignForm>({ mode: 'onBlur' });

	const [loginMutation, { loading, error, data }] = useMutation<LoginMutation, LoginMutationVariables>(LOGIN_MUTATION);

	const onSubmit = (formData: ILoignForm): void => {
		const { email, password } = formData;
		loginMutation({
			variables: {
				email,
				password,
			},
		});
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
				</form>
			</div>
		</div>
	);
}

export default Login;
