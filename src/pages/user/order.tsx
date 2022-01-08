import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder, getOrderVariables } from '../../generated/getOrder';
import { orderUpdates } from '../../generated/orderUpdates';
import { editOrder, editOrderVariables } from '../../generated/editOrder';
import { useMe } from '../../hooks/useMe';
import { FULL_ORDER_FRAGMENT } from '../../utils/fragments';
import { OrderStatus, UserRole } from '../../generated/globalTypes';

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

const EDIT_ORDER = gql`
	mutation editOrder($input: EditOrderInput!) {
		editOrder(input: $input) {
			ok
			error
		}
	}
`;

function Order() {
	const params = useParams();
	const { data: userData } = useMe();
	const [editOrderMutation] = useMutation<editOrder, editOrderVariables>(EDIT_ORDER);
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
				updateQuery: (prev, { subscriptionData: { data } }: { subscriptionData: { data: orderUpdates } }) => {
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

	const onButtonClick = (newStatus: OrderStatus) => {
		editOrderMutation({
			variables: {
				input: {
					id: +(params.id || 0),
					status: newStatus,
				},
			},
		});
	};

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
					{userData?.me.role === UserRole.Client && (
						<span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
							Status: {getOrderdata?.getOrder.order?.status}
						</span>
					)}
					{userData?.me.role === UserRole.Owner && getOrderdata?.getOrder.order?.status === OrderStatus.Pending && (
						<button onClick={() => onButtonClick(OrderStatus.Cooking)} type="button">
							Accept Order
						</button>
					)}
					{userData?.me.role === UserRole.Owner && getOrderdata?.getOrder.order?.status === OrderStatus.Cooking && (
						<button onClick={() => onButtonClick(OrderStatus.Cooked)} type="button">
							Order Cooked
						</button>
					)}
					{userData?.me.role === UserRole.Owner &&
						getOrderdata?.getOrder.order?.status !== OrderStatus.Cooking &&
						getOrderdata?.getOrder.order?.status !== OrderStatus.Pending && (
							<span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
								Status: {getOrderdata?.getOrder.order?.status}
							</span>
						)}
				</div>
			</div>
		</div>
	);
}

export default Order;
