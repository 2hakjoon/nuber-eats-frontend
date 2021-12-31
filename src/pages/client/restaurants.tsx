import { gql, useQuery } from '@apollo/client';
import React from 'react';
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
	console.log(data);
	return <div>레스토랑들</div>;
}

export default Restaurants;
