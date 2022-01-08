import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Restaurants from '../pages/client/restaurants';
import NotFound from '../pages/404';
import Header from '../components/header';
import { useMe } from '../hooks/useMe';
import ConfirmEmail from '../pages/user/confirm-email';
import EditProfile from '../pages/user/edit-profile';
import Search from '../pages/client/search';
import Category from '../pages/client/category';
import Restaurant from '../pages/client/restaurant';
import MyRestaurants from '../pages/owner/my-restaurants';
import { AddRestaurant } from '../pages/owner/add-restaurants';
import { MyRestaurant } from '../pages/owner/my-restaurant';
import { AddDish } from '../pages/owner/add-dish';
import Order from '../pages/user/order';
import DashBoard from '../pages/delivery/dashboard';
import { UserRole } from '../generated/globalTypes';

function LoggedInRouter() {
	const { data, loading, error } = useMe();
	if (!data || loading || error) {
		return (
			<div className="h-screen flex justify-center items-center">
				<span className="font-medium text-xl tracking-wide">loading</span>
			</div>
		);
	}
	return (
		<Router>
			<Header />
			<Routes>
				<Route path="/confirm" element={<ConfirmEmail />} />
				<Route path="/edit-profile" element={<EditProfile />} />
				<Route path="/orders/:id" element={<Order />} />
				{data.me.role === UserRole.Client && (
					<>
						<Route path="/" element={<Restaurants />} />
						<Route path="/search" element={<Search />} />
						<Route path="/category/:sulg" element={<Category />} />
						<Route path="/restaurants/:id" element={<Restaurant />} />
					</>
				)}
				{data.me.role === UserRole.Owner && (
					<>
						<Route path="/" element={<MyRestaurants />} />
						<Route path="/add-restaurant" element={<AddRestaurant />} />
						<Route path="/restaurants/:id" element={<MyRestaurant />} />
						<Route path="/restaurants/:restaurantId/add-dishes" element={<AddDish />} />
					</>
				)}
				{data.me.role === UserRole.Delivery && <Route path="/" element={<DashBoard />} />}
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
}

export default LoggedInRouter;
