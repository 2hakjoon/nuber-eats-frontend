import { render } from '@testing-library/react';
import React from 'react';
import FormError from '../form-error';

describe('<FormError />', () => {
	const ERROR_MESSAGE = '테스트';
	it('renders OK with props', () => {
		const { getByText } = render(<FormError errorMessage={ERROR_MESSAGE} />);
		getByText(ERROR_MESSAGE);
	});
});
