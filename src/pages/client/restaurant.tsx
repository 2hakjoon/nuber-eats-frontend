import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import { queryRestaurant, queryRestaurantVariables } from '../../generated/queryRestaurant';
import { RESTAURANT_FRAGMENT } from '../../utils/fragments';

const RESTAURANT_QUERY = gql`
	query queryRestaurant($input: RestaurantInput!) {
		restaurant(input: $input) {
			ok
			error
			restaurant {
				...RestaurantParts
			}
		}
	}
	${RESTAURANT_FRAGMENT}
`;

function Restaurant() {
	const param = useParams();
	const { loading, data } = useQuery<queryRestaurant, queryRestaurantVariables>(RESTAURANT_QUERY, {
		variables: {
			input: {
				restaurantId: +(param.id || ''),
			},
		},
	});

	return <div>restaurnt</div>;
}

export default Restaurant;
