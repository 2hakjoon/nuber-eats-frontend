import React from 'react';

interface IDishOptionProps {
	dishId: number;
	isSelected: boolean;
	name: string;
	extra: number | null;
	addOptionToItem: (dishId: number, option: any) => void;
	removeOptionFromItem: (dishId: number, option: any) => void;
}

function DishOption({ dishId, isSelected, name, extra, addOptionToItem, removeOptionFromItem }: IDishOptionProps) {
	const onClickOption = (e: any, id: number, option: any) => {
		e.stopPropagation();
		if (!isSelected && addOptionToItem) {
			addOptionToItem(id, option);
		} else if (isSelected && removeOptionFromItem) {
			removeOptionFromItem(id, option);
		}
	};

	return (
		<div
			role="presentation"
			onClick={(e) => {
				onClickOption(e, dishId, { name, extra });
			}}
			className={`flex items-center border ${isSelected ? 'border-gray-800' : ''} `}
		>
			<h6 className="mr-2">{name}</h6>
			{extra && <h6 className="text-sm opacity-75">(${extra})</h6>}
		</div>
	);
}

export default DishOption;
