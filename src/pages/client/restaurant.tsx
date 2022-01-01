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

	return (
		<div>
			<div
				className="bg-center bg-cover py-48"
				style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})` }}
			>
				<div className="bg-white w-3/12 py-4 pl-44">
					<h4 className="text-4xl mb-4">{data?.restaurant.restaurant?.name}</h4>
					<h5 className="text-sm">{data?.restaurant.restaurant?.category?.name}</h5>
				</div>
				<h6 className="text-sm">{data?.restaurant.restaurant?.address}</h6>
			</div>
		</div>
	);
}

export default Restaurant;
