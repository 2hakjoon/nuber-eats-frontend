import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/button';
import { createDish, createDishVariables } from '../../generated/createDish';
import { CreateDishInput } from '../../generated/globalTypes';
import { MY_RESTAURANT_QUERY } from './my-restaurant';

const CREATE_DISH_MUTATION = gql`
	mutation createDish($input: CreateDishInput!) {
		createDish(input: $input) {
			ok
			error
		}
	}
`;

export function AddDish() {
	const { restaurantId } = useParams();
	const navigate = useNavigate();
	const [createDishMutation, { loading }] = useMutation<createDish, createDishVariables>(CREATE_DISH_MUTATION, {
		refetchQueries: [
			{
				query: MY_RESTAURANT_QUERY,
				variables: {
					input: {
						restaurantId: Number(restaurantId),
					},
				},
			},
		],
	});
	const { register, handleSubmit, formState, getValues } = useForm<CreateDishInput>({
		mode: 'onBlur',
	});
	const onSubmit = async () => {
		const { name, price, description } = getValues();
		if (restaurantId) {
			createDishMutation({
				variables: {
					input: {
						name,
						price: +price,
						description,
						restaurantId: +restaurantId,
					},
				},
			});
		}
		navigate(-1);
	};
	return (
		<>
			<Helmet title="Add Dish | Nuber Eats">
				<title>Add Dish | Nuber Eats</title>
			</Helmet>
			<div className="container flex flex-col items-center mt-52 mx-auto">
				<h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
				<form onSubmit={handleSubmit(onSubmit)} className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5">
					<input
						className="input"
						type="text"
						placeholder="Name"
						{...register('name', { required: 'Name is required.' })}
					/>
					<input
						className="input"
						type="number"
						min={0}
						placeholder="Price"
						{...register('price', { required: 'Price is required.' })}
					/>
					<input
						className="input"
						type="text"
						placeholder="Description"
						{...register('description', { required: 'Description is required.' })}
					/>
					<Button loading={loading} canClick={formState.isValid} actionText="Create Dish" />
				</form>
			</div>
		</>
	);
}
