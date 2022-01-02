import { render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Restaurant from '../restaurant';

describe('<Restaurant />', () => {
	const RESTAURANT_TEST_PROPS = {
		id: '1',
		coverImg: 'img',
		name: 'name',
		categoryName: 'category',
	};
	it('renders Ok with props', () => {
		const { getByText, container } = render(
			<Router>
				<Restaurant
					id={RESTAURANT_TEST_PROPS.id}
					coverImg={RESTAURANT_TEST_PROPS.coverImg}
					name={RESTAURANT_TEST_PROPS.name}
					categoryName={RESTAURANT_TEST_PROPS.categoryName}
				/>
			</Router>
		);
		getByText(RESTAURANT_TEST_PROPS.name);
		getByText(RESTAURANT_TEST_PROPS.categoryName);
		expect(container.firstChild).toHaveAttribute('href', `/restaurants/${RESTAURANT_TEST_PROPS.id}`);
	});
});
