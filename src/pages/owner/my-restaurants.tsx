import { gql, useApolloClient, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Restaurant from '../../components/restaurant';
import { myRestaurantsQuery } from '../../generated/myRestaurantsQuery';
import { RESTAURANT_FRAGMENT } from '../../utils/fragments';

export const MY_RESTAURANTS_QUERY = gql`
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
	const { data } = useQuery<myRestaurantsQuery>(MY_RESTAURANTS_QUERY);

	return (
		<div>
			<Helmet title="My Restaurants | NuberEats" />
			<div className="max-w-screen-2xl mx-auto mt-32">
				<h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
				{data?.myRestaurants.ok && data?.myRestaurants?.restaurants?.length === 17 ? (
					<>
						<h4 className="text-xl mb-5">You have no restaurants.</h4>
						<Link className="text-lime-600 hover:underline" to="/add-restaurant">
							Create one &rarr;
						</Link>
					</>
				) : (
					<div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-12 i">
						{data?.myRestaurants.restaurants?.map((restaurant) => (
							<Restaurant
								key={restaurant.id}
								id={`${restaurant.id}`}
								coverImg={restaurant.coverImg}
								name={restaurant.name}
								categoryName={restaurant.category?.name}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default MyRestaurants;
