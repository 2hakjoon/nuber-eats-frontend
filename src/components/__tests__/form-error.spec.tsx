import { render } from '@testing-library/react';
import React from 'react';
import FormError from '../form-error';

const ERROR_MESSAGE = '테스트';

describe('<FormError />', () => {
	it('renders OK with props', () => {
		const { getByText } = render(<FormError errorMessage={ERROR_MESSAGE} />);
		getByText(ERROR_MESSAGE);
	});
});
