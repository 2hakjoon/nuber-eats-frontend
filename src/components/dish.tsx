/* eslint-disable camelcase */
import React, { ReactChild } from 'react';
import { queryRestaurant_restaurant_restaurant_menus_options } from '../generated/queryRestaurant';

interface IDishProps {
	id: number;
	description: string;
	name: string;
	price: number;
	isCustomer?: boolean;
	options?: queryRestaurant_restaurant_restaurant_menus_options[] | null;
	orderStarted?: boolean;
	addItemToOrder?: (dishId: number) => void;
	isSelected?: boolean;
	removeFromOrder?: (dishId: number) => void;
	children?: React.ReactNode;
}

function Dish({
	id,
	description,
	name,
	price,
	isCustomer,
	options,
	orderStarted,
	addItemToOrder,
	isSelected,
	removeFromOrder,
	children,
}: IDishProps) {
	const onClickMenu = () => {
		if (orderStarted) {
			if (!isSelected && addItemToOrder) {
				addItemToOrder(id);
			}
			if (isSelected && removeFromOrder) {
				removeFromOrder(id);
			}
		}
		return () => {};
	};

	return (
		<div
			role="presentation"
			onClick={onClickMenu}
			className={`px-8 py-4 border cursor-pointer hover:border-gray-800 transition-all ${
				isSelected ? 'border-gray-800' : 'hover:border-gray-800'
			}`}
		>
			<div className="mb-5">
				<h3 className="text-lg font-medium ">{name}</h3>
				<h4 className="font-medium">{description}</h4>
			</div>
			<span>${price}</span>
			{isCustomer && options && options.length !== 0 && (
				<div>
					<h5 className="my-3 font-medium">Dish Options: </h5>
					{children}
				</div>
			)}
		</div>
	);
}

Dish.defaultProps = {
	isCustomer: false,
	options: null,
	orderStarted: false,
	addItemToOrder: () => {},
	removeFromOrder: () => {},
	isSelected: false,
	children: null,
};

export default Dish;
