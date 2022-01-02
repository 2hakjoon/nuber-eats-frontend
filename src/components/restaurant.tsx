import React from 'react';
import { Link } from 'react-router-dom';

interface IRestauarntProps {
	id: string;
	coverImg: string;
	name: string;
	categoryName: string | undefined;
}

function Restaurant({ coverImg, name, categoryName, id }: IRestauarntProps) {
	return (
		<Link to={`/restaurants/${id}`}>
			<div className="flex flex-col">
				<div style={{ backgroundImage: `url(${coverImg})` }} className="bg-red-500 py-28 bg-cover bg-center" />
				<h3 className="text-lg font-medium">{name}</h3>
				{categoryName && <span className="border-t-2 mt-3 py-2 w-full text-xs opacity-50">{categoryName}</span>}
			</div>
		</Link>
	);
}

export default Restaurant;
