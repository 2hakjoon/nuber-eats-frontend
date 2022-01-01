import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Restaurant from '../../components/restaurant';
import { restaurantsPageQuery, restaurantsPageQueryVariables } from '../../generated/restaurantsPageQuery';

const RESTAURANT_QUERY = gql`
	query restaurantsPageQuery($input: RestaurantsInput!) {
		allCategories {
			ok
			error
			categories {
				id
				name
				coverImg
				slug
				restaurantCount
			}
		}
		allRestaurants(input: $input) {
			ok
			error
			totalPages
			totalResults
			restaurants {
				id
				name
				coverImg
				category {
					name
				}
				address
				isPromoted
			}
		}
	}
`;

function Restaurants() {
	const [page, setPage] = useState(1);
	const navigate = useNavigate();
	const { data, loading } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(RESTAURANT_QUERY, {
		variables: {
			input: {
				page,
			},
		},
	});

	const onNextPageClick = () => {
		setPage((prev) => prev + 1);
	};

	const onPrevPageClick = () => {
		setPage((prev) => prev - 1);
	};

	interface IFormProps {
		query: string;
	}

	const { register, handleSubmit } = useForm<IFormProps>();
	const onSearchSubmit = ({ query }: IFormProps) => {
		navigate(`/search?query=${query}`);
	};

	return (
		<>
			<Helmet title="Restaurants | Nuber Eats" />
			<div>
				<form
					onSubmit={handleSubmit(onSearchSubmit)}
					className="bg-gray-800 flex items-center justify-center w-full py-40 "
				>
					<input
						{...register('query', { required: true, min: 3 })}
						className="input rounded-md border-0 w-3/4 md:w-3/12"
						type="Search"
						placeholder="Search restaurants..."
					/>
				</form>
			</div>
			{!loading && (
				<div className="max-w-screen-2xl mx-auto mt-8">
					<div className="flex justify-between max-w-screen-sm mx-auto w-full">
						{data?.allCategories.categories?.map((category) => (
							<div key={category.id} className="flex flex-col items-center">
								<div
									className="w-20 h-20 rounded-full bg-red-500 bg-cover"
									style={{ backgroundImage: `url(${category.coverImg})` }}
								/>
								<span className="text-sm text-center font-medium mt-2">{category.name}</span>
							</div>
						))}
					</div>
					<div className="grid md:grid-cols-3 gap-x-5 gap-x-10 mt-12 i">
						{data?.allRestaurants.restaurants?.map((restaurant) => (
							<Restaurant
								key={restaurant.id}
								id={`${restaurant.id}`}
								coverImg={restaurant.coverImg}
								name={restaurant.name}
								categoryName={restaurant.category?.name}
							/>
						))}
					</div>
					<div className="grid grid-cols-3 max-w-sm mx-auto justify-center">
						{page > 1 ? (
							<button type="button" onClick={onPrevPageClick} className="text-2xl font-bold">
								&larr;
							</button>
						) : (
							<div />
						)}
						<span className="text-center">
							Page {page} of {data?.allRestaurants.totalPages}
						</span>
						{page !== data?.allRestaurants.totalPages ? (
							<button type="button" onClick={onNextPageClick} className="text-2xl font-bold">
								&rarr;
							</button>
						) : (
							<div />
						)}
					</div>
				</div>
			)}
			<div />
		</>
	);
}

export default Restaurants;
