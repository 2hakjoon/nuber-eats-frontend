/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql, useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchRestaurant, searchRestaurantVariables } from '../../generated/searchRestaurant';
import { RESTAURANT_FRAGMENT } from '../../utils/fragments';

const SEARCH_RESTAURANT = gql`
	query searchRestaurant($input: SearchRestaurantInput!) {
		searchRestaurant(input: $input) {
			ok
			error
			restaurants {
				...RestaurantParts
			}
			totalPages
			totalResults
		}
	}
	${RESTAURANT_FRAGMENT}
`;

function Search() {
	const location = useLocation();
	const navigate = useNavigate();
	const [queryReadyToStart, { loading, data, called }] = useLazyQuery<searchRestaurant, searchRestaurantVariables>(
		SEARCH_RESTAURANT
	);
	const query = decodeURI(location.search).split('?query=')[1];
	useEffect(() => {
		if (!query) {
			navigate('/', { replace: true });
		}
		queryReadyToStart({
			variables: {
				input: {
					page: 1,
					query,
				},
			},
		});
		console.log(query);
	}, []);
	return <div>search page</div>;
}

export default Search;
