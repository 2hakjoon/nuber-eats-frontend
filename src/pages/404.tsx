import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

function NotFound() {
	return (
		<>
			<Helmet title="Not Found | Nuber Eats" />
			<div className="h-screen flex items-center justify-center flex-col">
				<h2 className="font-semibold text-xl mb-3">Page not found</h2>
				<h2 className="font-medium text-base mb-5">The page you are looking for does not exis or has moved</h2>
				<Link className="hover:underline text-lime-600" to="/">
					Go back home &rarr;
				</Link>
			</div>
		</>
	);
}

export default NotFound;
