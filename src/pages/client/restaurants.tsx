import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
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
	const { data, loading } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(RESTAURANT_QUERY, {
		variables: {
			input: {
				page: 1,
			},
		},
	});
	return (
		<>
			<Helmet title="Restaurants | Nuber Eats" />
			<div>
				<form className="bg-gray-800 flex items-center justify-center w-full py-40 ">
					<input className="input rounded-md border-0 w-3/12" type="Search" placeholder="Search restaurants..." />
				</form>
			</div>
			{!loading && (
				<div className="max-w-screen-2xl mx-auto mt-8">
					<div className="flex justify-between max-w-screen-sm mx-auto w-full">
						{data?.allCategories.categories?.map((category) => (
							<div className="flex flex-col items-center">
								<div
									className="w-20 h-20 rounded-full bg-red-500 bg-cover"
									style={{ backgroundImage: `url(${category.coverImg})` }}
								/>
								<span className="text-sm text-center font-medium mt-2">{category.name}</span>
							</div>
						))}
					</div>
					<div className="grid grid-cols-3 gap-x-5 gap-x-10">
						{data?.allRestaurants.restaurants?.map((restaurant) => (
							<div>
								<div
									style={{ backgroundImage: `url(${restaurant.coverImg})` }}
									className="bg-red-500 py-28 bg-cover bg-center"
								/>
								<h3 className="text-lg font-medium">{restaurant.name}</h3>
								<span className="border-t-2">{restaurant.category?.name}</span>
							</div>
						))}
					</div>
				</div>
			)}
			<div />
		</>
	);
}

export default Restaurants;
