import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { useMe } from '../hooks/useMe';
import uberLogo from '../images/uber-eats-logo.svg';

function Header() {
	const { data, loading, error } = useMe();
	return (
		<header className="bg-red-500 py-4 flex items-center">
			<div className="w-full px-5 xl:px-20 bg-yellow-200 flex items-center">
				<img src={uberLogo} alt="uber-eats" className="w-30" />
				<span className="text-xs">
					<Link to="/my-profile">
						<FontAwesomeIcon icon={faUser} className="text-xl" />
					</Link>
				</span>
			</div>
		</header>
	);
}

export default Header;
