import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { useMe } from '../hooks/useMe';
import uberLogo from '../images/uber-eats-logo.svg';

function Header() {
	const { data } = useMe();
	console.log(data);
	return (
		<>
			{!data?.me.emailVerified && (
				<div className="py-1 px-3 text-center text-sm bg-red-300">
					<span>Please verify your email.</span>
				</div>
			)}
			<header className="py-4 flex items-center">
				<div className="w-full px-5 xl:px-20 flex items-center justify-between">
					<Link to="/">
						<img src={uberLogo} alt="uber-eats" className="w-30" />
					</Link>
					<span className="text-xs">
						<Link to="/edit-profile">
							<FontAwesomeIcon icon={faUser} className="text-xl" />
						</Link>
					</span>
				</div>
			</header>
		</>
	);
}

export default Header;
