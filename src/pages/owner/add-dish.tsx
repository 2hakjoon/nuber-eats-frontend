import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
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
interface IForm {
	name: string;
	price: string;
	description: string;
	[key: string]: string;
}

export function AddDish() {
	const { restaurantId } = useParams();
	const navigate = useNavigate();
	const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
	const onAddOptionClick = () => {
		setOptionsNumber((current) => [...current, Date.now()]);
	};
	const { register, handleSubmit, formState, getValues, setValue } = useForm<IForm>({
		mode: 'onBlur',
	});
	const onDeleteClick = (idToDelete: number) => {
		setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
	};
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
	const onSubmit = async ({ name, price, description, ...rest }: IForm) => {
		const optionObjects = optionsNumber.map((theId) => ({
			name: rest[`${theId}-optionName`],
			extra: +rest[`${theId}-optionExtra`],
		}));
		if (restaurantId) {
			createDishMutation({
				variables: {
					input: {
						name,
						price: +price,
						description,
						restaurantId: +restaurantId,
						options: optionObjects,
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
					<div className="my-10">
						<h4 className="font-medium  mb-3 text-lg">Dish Options</h4>
						<button
							type="button"
							onClick={() => onAddOptionClick()}
							className=" cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-"
						>
							Add Dish Option
						</button>
						{optionsNumber.length !== 0 &&
							optionsNumber.map((id) => (
								<div key={id} className="mt-5">
									<input
										// @ts-ignore
										{...register(`${id}-optionName`)}
										className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
										type="text"
										placeholder="Option Name"
									/>
									<input
										// @ts-ignore
										{...register(`${id}-optionExtra`)}
										className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
										type="number"
										min={0}
										placeholder="Option Extra"
									/>
									<button
										className="cursor-pointer text-white bg-red-500 py-1 px-2 mt-5 ml-4"
										type="button"
										onClick={() => onDeleteClick(id)}
									>
										Delete Option
									</button>
								</div>
							))}
					</div>
					<Button loading={loading} canClick={formState.isValid} actionText="Create Dish" />
				</form>
			</div>
		</>
	);
}
