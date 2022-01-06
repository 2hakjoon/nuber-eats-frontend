import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/button';
import FormError from '../../components/form-error';
import { createRestaurant, createRestaurantVariables } from '../../generated/createRestaurant';
import { CreateRestaurantInput } from '../../generated/globalTypes';
import { MY_RESTAURANTS_QUERY } from './my-restaurants';

const CREATE_RESTAURANT_MUTATION = gql`
	mutation createRestaurant($input: CreateRestaurantInput!) {
		createRestaurant(input: $input) {
			error
			ok
			restaurantId
		}
	}
`;

export function AddRestaurant() {
	const client = useApolloClient();
	const [uploading, setUploading] = useState(false);
	const [imgUrl, setImageUrl] = useState('');
	const navigate = useNavigate();
	const { register, getValues, formState, handleSubmit } = useForm<CreateRestaurantInput>({
		mode: 'onBlur',
	});
	const onCompleted = (data: createRestaurant) => {
		const {
			createRestaurant: { ok, restaurantId },
		} = data;
		if (ok) {
			const { name, categoryName, address } = getValues();
			setUploading(false);
			const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
			client.writeQuery({
				query: MY_RESTAURANTS_QUERY,
				data: {
					myRestaurants: {
						...queryResult.myRestaurants,
						restaurants: [
							{
								address,
								category: { name: categoryName, __typename: 'Category' },
								name,
								coverImg: imgUrl,
								id: restaurantId,
								isPromoted: false,
								__typename: 'Restaurant',
							},
						],
					},
				},
			});
			navigate('/');
		}
	};
	const [createRestaurantMutation, { loading, data }] = useMutation<createRestaurant, createRestaurantVariables>(
		CREATE_RESTAURANT_MUTATION,
		{
			onCompleted,
			refetchQueries: [{ query: MY_RESTAURANTS_QUERY }],
		}
	);
	const onSubmit = async (formData: CreateRestaurantInput) => {
		const { coverImg } = formData;
		const formBody = new FormData();
		formBody.append('file', coverImg[0]);
		const { url } = await (
			await fetch('/uploads', {
				method: 'POST',
				body: formBody,
			})
		).json();
		setImageUrl(url);
		createRestaurantMutation({
			variables: {
				input: {
					name: formData.name,
					categoryName: formData.categoryName,
					address: formData.address,
					coverImg: url,
				},
			},
		});
	};
	return (
		<>
			<Helmet>
				<title>Add Restaurant | Nuber Eats</title>
			</Helmet>
			<div className="container mx-auto mt-14">
				<h1 className="mb-4 font-bold">Add Restaurant</h1>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center w-6/12">
					<input
						className="input w-full mb-4"
						type="text"
						placeholder="Name"
						{...register('name', { required: 'Name is required.' })}
					/>
					<input
						className="input w-full mb-4"
						type="text"
						placeholder="Address"
						{...register('address', { required: 'Address is required.' })}
					/>
					<input
						className="input w-full mb-4"
						type="text"
						placeholder="Category Name"
						{...register('categoryName', { required: 'Category Name is required.' })}
					/>
					<input type="file" accept="image/*" {...register('coverImg')} />
					<Button loading={uploading} canClick={formState.isValid} actionText="Create Restaurant" />
					{data?.createRestaurant?.error && <FormError errorMessage={data.createRestaurant.error} />}
				</form>
			</div>
		</>
	);
}
