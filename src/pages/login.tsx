import React from 'react';
import { Helmet } from 'react-helmet-async';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import FormError from '../components/form-error';
import { loginMutation, loginMutationVariables } from '../generated/loginMutation';
import { LoginInput } from '../generated/globalTypes';
import uberLogo from '../images/uber-eats-logo.svg';
import Button from '../components/button';
import regexEmail from '../utils/regex';
import { authTokenVar, isLoggedInVar } from '../apollo';
import LOCALSTORAGE_TOKEN from '../utils/constants';

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
	const { register, getValues, handleSubmit, formState } = useForm<LoginInput>({ mode: 'onChange' });

	const onCompleted = (data: loginMutation) => {
		const {
			login: { ok, token },
		} = data;
		if (ok && token) {
			localStorage.setItem(LOCALSTORAGE_TOKEN, token);
			authTokenVar(token);
			isLoggedInVar(true);
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
		<div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
			<Helmet title="Login | NuberEats" />
			<div className="w-full max-w-screen-sm flex flex-col item-center px-5">
				<img src={uberLogo} alt="uber-eats" className="w-56 mb-5 mx-auto" />
				<h4 className="text-2xl mb-5 font-semibold">Welcome Back</h4>
				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5">
					<input
						{...register('email', {
							required: true,
							pattern: { value: regexEmail, message: 'Please enter a valid email' },
						})}
						required
						type="email"
						placeholder="Email"
						className="input"
					/>
					{formState.errors.email && <FormError errorMessage={formState.errors.email?.message} />}
					<input
						{...register('password', { required: true, minLength: 3 })}
						required
						type="password"
						placeholder="Password"
						className="input"
					/>
					{formState.errors.password?.type === 'minLength' && (
						<FormError errorMessage={formState.errors.password?.message} />
					)}
					<Button canClick={formState.isValid} loading={loading} actionText="Log In" />
					{loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error} />}
				</form>
				<div className="mx-auto mt-6">
					New to Nuber?{' '}
					<Link to="/create-account" className=" text-lime-600 hover:underline ">
						Create an Account
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Login;
