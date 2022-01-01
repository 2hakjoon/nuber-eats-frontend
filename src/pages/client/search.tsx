import React from 'react';
import { useLocation } from 'react-router-dom';

function Search() {
	const location = useLocation();
	const query = decodeURI(location.search).split('?query=')[1];
	console.log(query);
	return <div>search page</div>;
}

export default Search;
