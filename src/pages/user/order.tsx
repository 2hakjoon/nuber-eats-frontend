import { gql, useQuery, useSubscription } from '@apollo/client';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder, getOrderVariables } from '../../generated/getOrder';
import { orderUpdates, orderUpdatesVariables } from '../../generated/orderUpdates';
import { FULL_ORDER_FRAGMENT } from '../../utils/fragments';

const GET_ORDER = gql`
	query getOrder($input: GetOrderInput!) {
		getOrder(input: $input) {
			ok
			error
			order {
				...FullOrderParts
			}
		}
	}
	${FULL_ORDER_FRAGMENT}
`;

const ORDER_SUBSCRIPTION = gql`
	subscription orderUpdates($input: OrderUpdatesInput!) {
		orderUpdates(input: $input) {
			...FullOrderParts
		}
	}
	${FULL_ORDER_FRAGMENT}
`;

function Order() {
	const params = useParams();
	const { data: getOrderdata, subscribeToMore } = useQuery<getOrder, getOrderVariables>(GET_ORDER, {
		variables: {
			input: {
				id: +(params.id || 0),
			},
		},
	});
	useEffect(() => {
		if (getOrderdata?.getOrder.ok) {
			subscribeToMore({
				document: ORDER_SUBSCRIPTION,
				variables: {
					input: {
						id: +(params.id || 0),
					},
				},
				updateQuery: (prev, { subscriptiondata: { data } }: { subscriptionData: { data: orderUpdates } }) => {
					if (!data) return prev;
					return {
						getOrder: {
							...prev.getOrder,
							order: {
								...data.orderUpdates,
							},
						},
					};
				},
			});
		}
	}, [getOrderdata]);

	return (
		<div className="mt-32 container flex justify-center">
			<div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
				<h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">Order #{params.id}</h4>
				<h5 className="p-5 pt-10 text-3xl text-center ">${getOrderdata?.getOrder.order?.total}</h5>
				<div className="p-5 text-xl grid gap-6">
					<div className="border-t pt-5 border-gray-700">
						Prepared By: <span className="font-medium">{getOrderdata?.getOrder.order?.restaurant?.name}</span>
					</div>
					<div className="border-t pt-5 border-gray-700 ">
						Deliver To: <span className="font-medium">{getOrderdata?.getOrder.order?.customer?.email}</span>
					</div>
					<div className="border-t border-b py-5 border-gray-700">
						Driver: <span className="font-medium">{getOrderdata?.getOrder.order?.driver?.email || 'Not yet.'}</span>
					</div>
					<span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
						Status: {getOrderdata?.getOrder.order?.status}
					</span>
				</div>
			</div>
		</div>
	);
}

export default Order;
