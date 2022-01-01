import { gql, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { queryCategory, queryCategoryVariables } from '../../generated/queryCategory';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../utils/fragments';

const CATEGROY_QUERY = gql`
	query queryCategory($input: CategoryInput!) {
		category(input: $input) {
			error
			ok
			totalPages
			totalResults
			category {
				...CategoryParts
			}
			restaurant {
				...RestaurantParts
			}
		}
	}
	${RESTAURANT_FRAGMENT}
	${CATEGORY_FRAGMENT}
`;

function Category() {
	const param = useParams();
	const { data, loading } = useQuery<queryCategory, queryCategoryVariables>(CATEGROY_QUERY, {
		variables: {
			input: {
				page: 1,
				slug: param.slug || '',
			},
		},
	});
	console.log(data);

	return <h1>Category</h1>;
}

export default Category;
