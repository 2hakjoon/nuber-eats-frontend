import React from 'react';

interface IRestauarntProps {
	id: string;
	coverImg: string;
	name: string;
	categoryName: string | undefined;
}

function Restaurant({ coverImg, name, categoryName, id }: IRestauarntProps) {
	return (
		<div className="flex flex-col">
			<span>{id}</span>
			<div style={{ backgroundImage: `url(${coverImg})` }} className="bg-red-500 py-28 bg-cover bg-center" />
			<h3 className="text-lg font-medium">{name}</h3>
			{categoryName && <span className="border-t-2 mt-3 py-2 w-full text-xs opacity-50">{categoryName}</span>}
		</div>
	);
}

export default Restaurant;
