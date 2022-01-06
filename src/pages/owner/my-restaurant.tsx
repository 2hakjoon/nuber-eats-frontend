import { gql, useLazyQuery, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Dish from '../../components/dish';
import { myRestaurantQuery, myRestaurantQueryVariables } from '../../generated/myRestaurantQuery';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../utils/fragments';

export const MY_RESTAURANT_QUERY = gql`
	query myRestaurantQuery($input: RestaurantInput!) {
		restaurant(input: $input) {
			ok
			error
			restaurant {
				...RestaurantParts
				menu {
					...DishParts
				}
			}
		}
	}
	${RESTAURANT_FRAGMENT}
	${DISH_FRAGMENT}
`;

export function MyRestaurant() {
	const navigate = useNavigate();
	const { id } = useParams();
	const [queryReadyToStart, { loading, data, called }] = useLazyQuery<myRestaurantQuery, myRestaurantQueryVariables>(
		MY_RESTAURANT_QUERY
	);
	useEffect(() => {
		if (id) {
			queryReadyToStart({
				variables: {
					input: {
						restaurantId: +id,
					},
				},
			});
		} else {
			navigate('/');
		}
	}, []);
	console.log(data);

	return (
		<div>
			<div
				className="  bg-gray-700  py-28 bg-center bg-cover"
				style={{
					backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
				}}
			/>
			<div className="container items-start mt-10">
				<h2 className="text-4xl font-medium mb-10">{data?.restaurant.restaurant?.name || 'Loading...'}</h2>
				<div className="flex w-full">
					<Link to={`/restaurants/${id}/add-dishes`} className=" mr-8 text-white bg-gray-800 py-3 px-10">
						Add Dish &rarr;
					</Link>
					<Link to="/dfasdfsdfasf" className=" text-white bg-lime-700 py-3 px-10">
						Buy Promotion &rarr;
					</Link>
				</div>
				<div className="mt-10">
					{data?.restaurant?.restaurant?.menu?.length === 0 ? (
						<h4 className="text-xl mb-5">Please upload a dish!</h4>
					) : (
						<div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
							{data?.restaurant?.restaurant?.menu?.map((dish) => (
								<Dish name={dish.name} description={dish.description} price={dish.price} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
