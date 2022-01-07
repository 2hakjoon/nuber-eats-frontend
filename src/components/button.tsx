import React from 'react';

interface IButtonProps {
	canClick: boolean;
	loading: boolean;
	actionText: string;
	onClick?: () => void;
}

function Button({ canClick, loading, actionText, onClick }: IButtonProps) {
	return (
		<button
			type="submit"
			onClick={onClick}
			className={`mt-3 py-4 px-5  text-white font-medium text-lg rounded-md focus:outline-none transition-colors ${
				canClick ? 'bg-lime-700 hover:bg-lime-800' : 'bg-gray-300 pointer-events-none'
			}`}
		>
			{loading ? 'Loading...' : actionText}
		</button>
	);
}

Button.defaultProps = {
	onClick: () => {},
};

export default Button;
