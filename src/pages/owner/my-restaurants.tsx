import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { myRestaurantsQuery } from '../../generated/myRestaurantsQuery';
import { RESTAURANT_FRAGMENT } from '../../utils/fragments';

const MY_RESTAURANT_QUERY = gql`
	query myRestaurantsQuery {
		myRestaurants {
			ok
			error
			restaurants {
				...RestaurantParts
			}
		}
	}
	${RESTAURANT_FRAGMENT}
`;
function MyRestaurants() {
	const { data } = useQuery<myRestaurantsQuery>(MY_RESTAURANT_QUERY);
	console.log(data);
	return (
		<div>
			<Helmet title="My Restaurants | NuberEats" />
			<div className="max-w-screen-2xl mx-auto mt-32">
				<h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
				{data?.myRestaurants.ok && data?.myRestaurants?.restaurants?.length === 0 && (
					<>
						<h4 className="text-xl mb-5">You have no restaurants.</h4>
						<Link className="text-lime-600 hover:underline" to="/add-restaurant">
							Create one &rarr;
						</Link>
					</>
				)}
			</div>
		</div>
	);
}

export default MyRestaurants;
