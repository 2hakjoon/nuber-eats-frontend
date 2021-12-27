import React from 'react';
import { useForm } from 'react-hook-form';

interface ILoignForm {
	email?: string;
	password?: string;
}

export const Login = () => {
	const {
		register,
		getValues,
		handleSubmit,
		formState: { errors },
	} = useForm<ILoignForm>();
	const onSubmit = (data: ILoignForm): void => {
		console.log(data);
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
					{errors.email && <span className="font-medium text-red-500">Email Error</span>}
					<input
						{...register('password', { required: true, minLength: 10 })}
						required
						type="password"
						placeholder="Password"
						className="input"
					/>
					{errors.password && <span className="font-medium text-red-500">Password must be more than 10 chars</span>}
					<button type="submit" className="button">
						Log In
					</button>
				</form>
			</div>
		</div>
	);
};
