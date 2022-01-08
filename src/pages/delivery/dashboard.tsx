import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { FULL_ORDER_FRAGMENT } from '../../utils/fragments';
import { coockedOrders } from '../../generated/coockedOrders';
import { takeOrder, takeOrderVariables } from '../../generated/takeOrder';

const COOCKED_ORDERS_SUBSCRIPTION = gql`
	subscription coockedOrders {
		cookedOrders {
			...FullOrderParts
		}
	}
	${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER_MUTATION = gql`
	mutation takeOrder($input: TakeOrderInput!) {
		takeOrder(input: $input) {
			ok
			error
		}
	}
`;

interface ICoords {
	lat: number;
	lng: number;
}

interface IDriverProps {
	lat: number;
	lng: number;
	$hover: any;
}

function Driver({ lat, lng, $hover }: IDriverProps) {
	return (
		<div
			// @ts-ignore
			lat={lat}
			lng={lng}
			className="h-8 w-8 rounded-full bg-white flex items-start justify-center text-lg"
		>
			🚗
		</div>
	);
}

function DashBoard() {
	const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
	const navigate = useNavigate();
	const [map, setMap] = useState<any>();
	const [maps, setMaps] = useState<any>();
	const onSucces = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
		setDriverCoords({ lat: latitude, lng: longitude });
	};
	const onError = (error: any) => {};
	useEffect(() => {
		navigator.geolocation.watchPosition(onSucces, onError, { enableHighAccuracy: true });
	}, []);
	useEffect(() => {
		if (map && maps) {
			map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
			const geocoder = new google.maps.Geocoder();
			geocoder.geocode(
				{
					location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
				},
				(result, status) => {
					console.log(status, result);
				}
			);
		}
	}, [driverCoords.lat, driverCoords.lng]);
	const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
		setMap(map);
		setMaps(maps);
	};
	const onGetRoute = () => {
		if (map) {
			const directionsService = new google.maps.DirectionsService();
			const directionRenderer = new google.maps.DirectionsRenderer();
			directionRenderer.setMap(map);
			directionsService.route(
				{
					origin: {
						location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
					},
					destination: {
						location: new google.maps.LatLng(driverCoords.lat - 0.01, driverCoords.lng - 0.01),
					},
					travelMode: google.maps.TravelMode.TRANSIT,
				},
				(result, status) => {
					console.log(status);
					directionRenderer.setDirections(result);
				}
			);
		}
	};

	const { data: coockedOrdersData } = useSubscription<coockedOrders>(COOCKED_ORDERS_SUBSCRIPTION);
	useEffect(() => {
		if (coockedOrdersData?.cookedOrders.id) {
			onGetRoute();
		}
	}, [coockedOrdersData]);

	const onCompletedTakeOrder = (data: takeOrder) => {
		if (data.takeOrder.ok) {
			navigate(`/orders/${coockedOrdersData?.cookedOrders.id}`);
		}
	};

	const [takeOrderMuataion] = useMutation<takeOrder, takeOrderVariables>(TAKE_ORDER_MUTATION, {
		onCompleted: onCompletedTakeOrder,
	});

	const triggerMutation = (id: number) => {
		takeOrderMuataion({
			variables: {
				input: {
					id,
				},
			},
		});
	};
	return (
		<div className="h-screen">
			<div className="bg-gray-800 h-3/6">
				<GoogleMapReact
					yesIWantToUseGoogleMapApiInternals
					onGoogleApiLoaded={onApiLoaded}
					defaultZoom={15}
					defaultCenter={{
						lat: 35.85,
						lng: 127.15,
					}}
					bootstrapURLKeys={{ key: `${process.env.REACT_APP_GOOGLE_MAP_API}` }}
				>
					<Driver
						// @ts-ignore
						lat={driverCoords.lat}
						lng={driverCoords.lng}
						$hover=""
					/>
				</GoogleMapReact>
			</div>
			{coockedOrdersData?.cookedOrders ? (
				<div className="max-w-screen-sm mx-auto">
					<h1>New Cooked Order</h1>
					<h4>Pick it up soon</h4>
					<button type="button" onClick={() => triggerMutation(coockedOrdersData.cookedOrders.id)}>
						<span>Accept Delivery</span>
					</button>
				</div>
			) : (
				<h1>No Order yet...</h1>
			)}
		</div>
	);
}

export default DashBoard;
