import React from 'react';
import { Helmet } from 'react-helmet-async';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import FormError from '../components/form-error';
import uberLogo from '../images/uber-eats-logo.svg';
import Button from '../components/button';
import { CreateAccountInput, UserRole } from '../generated/globalTypes';
import { regexEmail } from '../utils/regex';
import { createAccountMutation, createAccountMutationVariables } from '../generated/createAccountMutation';

export const CREATE_ACCOUNT_MUTATION = gql`
	mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
		createAccount(input: $createAccountInput) {
			ok
			error
		}
	}
`;

function CreateAccount() {
	const navigate = useNavigate();
	const { register, handleSubmit, formState } = useForm<CreateAccountInput>({
		mode: 'onChange',
		defaultValues: { role: UserRole.Client },
	});
	const onCompleted = (data: createAccountMutation) => {
		const {
			createAccount: { ok },
		} = data;
		if (ok) {
			navigate('/');
		}
	};
	const [CreateAccountMutation, { loading, data: createAccountMutationResult }] = useMutation<
		createAccountMutation,
		createAccountMutationVariables
	>(CREATE_ACCOUNT_MUTATION, { onCompleted });

	const onSubmit = (formData: CreateAccountInput): void => {
		if (!loading) {
			CreateAccountMutation({
				variables: {
					createAccountInput: {
						...formData,
					},
				},
			});
		}
	};

	return (
		<div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
			<Helmet title="Create Account | NuberEats" />
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
					{formState.errors?.email?.message && <FormError errorMessage={formState.errors.email?.message} />}
					<input
						{...register('password', { required: true, minLength: 3 })}
						required
						type="password"
						placeholder="Password"
						className="input"
					/>
					<select {...register('role')} className="input">
						{Object.keys(UserRole).map((role) => (
							<option key={role}>{role}</option>
						))}
					</select>
					{formState.errors.password?.type === 'minLength' && (
						<FormError errorMessage={formState.errors.password?.message} />
					)}
					<Button canClick={formState.isValid} loading={loading} actionText="Create Acount" />
					{createAccountMutationResult?.createAccount.error && (
						<FormError errorMessage={createAccountMutationResult.createAccount.error} />
					)}
				</form>
				<div className="mx-auto mt-6">
					Already have an account?{' '}
					<Link to="/login" className=" text-lime-600 hover:underline ">
						Log in now
					</Link>
				</div>
			</div>
		</div>
	);
}

export default CreateAccount;
