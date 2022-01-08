import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

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
	return (
		<div className="h-screen">
			<div className="bg-gray-800 h-3/6">
				<GoogleMapReact
					yesIWantToUseGoogleMapApiInternals
					onGoogleApiLoaded={onApiLoaded}
					defaultZoom={15}
					defaultCenter={{
						lat: 35.85,
						lng: 127.16,
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
		</div>
	);
}

export default DashBoard;
