import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFound from '../pages/404';
import CreateAccount from '../pages/create-account';
import Login from '../pages/login';

function LoggedOutRouter() {
	return (
		<Router>
			<Routes>
				<Route path="/create-account" element={<CreateAccount />} />
				<Route path="/" element={<Login />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
}

export default LoggedOutRouter;
