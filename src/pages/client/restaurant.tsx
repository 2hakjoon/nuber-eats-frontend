import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/button';
import Dish from '../../components/dish';
import DishOption from '../../components/dish-option';
import { createOrder, createOrderVariables } from '../../generated/createOrder';
import { CreateOrderItemInput } from '../../generated/globalTypes';
import { queryRestaurant, queryRestaurantVariables } from '../../generated/queryRestaurant';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../utils/fragments';

const RESTAURANT_QUERY = gql`
	query queryRestaurant($input: RestaurantInput!) {
		restaurant(input: $input) {
			ok
			error
			restaurant {
				...RestaurantParts
				menus {
					...DishParts
				}
			}
		}
	}
	${RESTAURANT_FRAGMENT}
	${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
	mutation createOrder($input: CreateOrderInput!) {
		createOrder(input: $input) {
			ok
			error
			orderId
		}
	}
`;

function Restaurant() {
	const param = useParams();
	const navigate = useNavigate();
	const { loading, data } = useQuery<queryRestaurant, queryRestaurantVariables>(RESTAURANT_QUERY, {
		variables: {
			input: {
				restaurantId: +(param.id || ''),
			},
		},
	});
	const onCompletedOrder = (mutationData: createOrder) => {
		const {
			createOrder: { ok, orderId },
		} = mutationData;
		if (ok) {
			navigate(`/orders/${orderId}`);
		}
	};
	const [createOrderMutation, { loading: placingOrder }] = useMutation<createOrder, createOrderVariables>(
		CREATE_ORDER_MUTATION,
		{
			onCompleted: onCompletedOrder,
		}
	);
	const [orderStarted, setOrderStarted] = useState(false);
	const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);

	const triggerStartOrder = () => {
		setOrderStarted(true);
	};

	const getItem = (dishId: number) => {
		return orderItems.find((order) => order.dishId === dishId);
	};

	const isSelected = (dishId: number) => {
		return Boolean(getItem(dishId));
	};

	const addItemToOrder = (dishId: number) => {
		if (isSelected(dishId)) {
			return;
		}
		setOrderItems((current) => [{ dishId, options: [] }, ...current]);
	};

	const removeFromOrder = (dishId: number) => {
		setOrderItems((current) => current.filter((dish) => dish.dishId !== dishId));
	};

	const addOptionToItem = (dishId: number, option: any) => {
		const oldItem = getItem(dishId);
		if (oldItem) {
			const hasOption = Boolean(oldItem.options?.find((aOption) => aOption.name === option.name));
			if (!hasOption) {
				removeFromOrder(dishId);
				setOrderItems((current) => [{ dishId, options: [option, ...oldItem.options!] }, ...current]);
			}
		}
	};

	const getOptionFromItem = (item: CreateOrderItemInput, optionName: string) => {
		return item?.options?.find((option) => {
			return option?.name === optionName;
		});
	};

	const isOptionSelected = (dishId: number, optionName: string) => {
		const item = getItem(dishId);
		if (item) {
			return Boolean(getOptionFromItem(item, optionName));
		}
		return false;
	};

	const removeOptionFromItem = (dishId: number, option: any) => {
		const oldItem = getItem(dishId);
		if (oldItem) {
			removeFromOrder(dishId);
			setOrderItems((current) => [
				{ dishId, options: oldItem?.options?.filter((aOption) => aOption.name !== option.name) },
				...current,
			]);
			return oldItem.options?.filter((aOption) => aOption.name !== option.name);
		}
		return undefined;
	};

	const triggerCancleOrder = () => {
		setOrderStarted(false);
		setOrderItems([]);
	};

	const triggerConfirmOrder = () => {
		if (orderItems.length === 0) {
			alert("Can't create order");
		} else {
			const ok = window.confirm('You are about to place an order');
			if (ok) {
				createOrderMutation({
					variables: {
						input: {
							restaurantId: +(param.id || ''),
							items: orderItems,
						},
					},
				});
			}
		}
	};

	console.log(orderItems);
	return (
		<div>
			<div
				style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})` }}
				className="bg-center bg-cover py-48"
			>
				<div className="bg-white w-3/12 py-4 pl-44">
					<h4 className="text-4xl mb-4">{data?.restaurant.restaurant?.name}</h4>
					<h5 className="text-sm">{data?.restaurant.restaurant?.category?.name}</h5>
				</div>
				<h6 className="text-sm">{data?.restaurant.restaurant?.address}</h6>
			</div>
			<div className="container">
				{!orderStarted && <Button onClick={triggerStartOrder} canClick loading={false} actionText="Start Order" />}
				{orderStarted && (
					<div className="flex items-center">
						<Button onClick={triggerConfirmOrder} canClick loading={false} actionText="Confrim Order" />
						<Button onClick={triggerCancleOrder} canClick loading={false} actionText="Cancle Order" />
					</div>
				)}
				<div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
					{data?.restaurant?.restaurant?.menus?.map((dish) => (
						<Dish
							id={dish.id}
							orderStarted={orderStarted}
							name={dish.name}
							description={dish.description}
							price={dish.price}
							isCustomer
							options={dish.options}
							isSelected={isSelected(dish.id)}
							addItemToOrder={addItemToOrder}
							removeFromOrder={removeFromOrder}
						>
							{dish.options?.map((option, idx) => (
								<DishOption
									dishId={dish.id}
									isSelected={isOptionSelected(dish.id, option.name)}
									name={option.name}
									extra={option.extra}
									addOptionToItem={addOptionToItem}
									removeOptionFromItem={removeOptionFromItem}
								/>
							))}
						</Dish>
					))}
				</div>
			</div>
		</div>
	);
}

export default Restaurant;
