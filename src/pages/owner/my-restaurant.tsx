import { gql, useLazyQuery, useSubscription } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
	VictoryAxis,
	VictoryChart,
	VictoryLabel,
	VictoryLine,
	VictoryTheme,
	VictoryTooltip,
	VictoryVoronoiContainer,
} from 'victory';
import Dish from '../../components/dish';
import { myRestaurantVariables } from '../../generated/myRestaurant';
import { myRestaurantQuery } from '../../generated/myRestaurantQuery';
import { pendingOrders } from '../../generated/pendingOrders';
import { DISH_FRAGMENT, FULL_ORDER_FRAGMENT, ORDER_FRAGMENT, RESTAURANT_FRAGMENT } from '../../utils/fragments';

export const MY_RESTAURANT_QUERY = gql`
	query myRestaurantQuery($input: MyRestaurantInput!) {
		myRestaurant(input: $input) {
			ok
			error
			restaurant {
				...RestaurantParts
				menus {
					...DishParts
				}
				orders {
					...OrderParts
				}
			}
		}
	}
	${RESTAURANT_FRAGMENT}
	${DISH_FRAGMENT}
	${ORDER_FRAGMENT}
`;

const PENDING_ORDERS_SUBSCRIPTION = gql`
	subscription pendingOrders {
		pendingOrders {
			...FullOrderParts
		}
	}
	${FULL_ORDER_FRAGMENT}
`;

type ChartData = {
	[k: string]: number;
};

export function MyRestaurant() {
	const navigate = useNavigate();
	const [chartData, setChartData] = useState<ChartData>({});
	const { id } = useParams();
	const onCompleted = (data: myRestaurantQuery) => {
		const orderData: ChartData = {};
		console.log(data);
		const orders = data.myRestaurant.restaurant?.orders;
		console.log(orders);
		orders?.forEach((order) => {
			orderData[`${order.createdAt.split('T')[0]}`] =
				(orderData[`${order.createdAt.split('T')[0]}`] || 0) + (order?.total || 0);
		});
		setChartData(orderData);
	};
	const [queryReadyToStart, { loading, data, called }] = useLazyQuery<myRestaurantQuery, myRestaurantVariables>(
		MY_RESTAURANT_QUERY,
		{ onCompleted }
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
	const { data: subscriptionData } = useSubscription<pendingOrders>(PENDING_ORDERS_SUBSCRIPTION);

	useEffect(() => {
		if (subscriptionData?.pendingOrders.id) {
			navigate(`/orders/${subscriptionData.pendingOrders.id}`);
		}
	}, [subscriptionData]);

	return (
		<div>
			<div
				className="  bg-gray-700  py-28 bg-center bg-cover"
				style={{
					backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
				}}
			/>
			<div className="container items-start mt-10">
				<h2 className="text-4xl font-medium mb-10">{data?.myRestaurant.restaurant?.name || 'Loading...'}</h2>
				<div className="flex w-full">
					<Link to={`/restaurants/${id}/add-dishes`} className=" mr-8 text-white bg-gray-800 py-3 px-10">
						Add Dish &rarr;
					</Link>
					<Link to="/dfasdfsdfasf" className=" text-white bg-lime-700 py-3 px-10">
						Buy Promotion &rarr;
					</Link>
				</div>
				<div className="mt-10">
					{data?.myRestaurant?.restaurant?.menus?.length === 0 ? (
						<h4 className="text-xl mb-5">Please upload a dish!</h4>
					) : (
						<div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
							{data?.myRestaurant?.restaurant?.menus?.map((dish) => (
								<Dish id={dish.id} name={dish.name} description={dish.description} price={dish.price} />
							))}
						</div>
					)}
				</div>
			</div>
			<div className="mt-20">
				<h4 className="text-center text-2xl font-medium">Sales</h4>
				<div className="w-full mx-auto">
					{Object.keys(chartData).length && (
						<div className="  mt-10">
							<VictoryChart
								height={500}
								theme={VictoryTheme.material}
								width={window.innerWidth}
								domainPadding={50}
								containerComponent={<VictoryVoronoiContainer />}
							>
								<VictoryLine
									labels={({ datum }) => `$${datum.y}`}
									labelComponent={<VictoryTooltip style={{ fontSize: 18 } as any} renderInPortal dy={-20} />}
									data={Object.keys(chartData).map((date) => ({
										x: date,
										y: chartData?.[date],
									}))}
									interpolation="natural"
									style={{
										data: {
											strokeWidth: 5,
										},
									}}
								/>
								<VictoryAxis
									tickLabelComponent={<VictoryLabel renderInPortal />}
									style={{
										tickLabels: {
											fontSize: 20,
										} as any,
									}}
									tickFormat={(tick) => new Date(tick).toLocaleDateString('ko')}
								/>
							</VictoryChart>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
