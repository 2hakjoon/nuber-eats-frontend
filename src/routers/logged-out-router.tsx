import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CreateAccount } from '../pages/create-account';
import { Login } from '../pages/login';

export const LoggedOutRouter = () => {
	return (
		<Router>
			<Routes>
				<Route path="/create-account" element={<CreateAccount />} />
				<Route path="/" element={<Login />} />
			</Routes>
		</Router>
	);
};
