import { render } from '@testing-library/react';
import React from 'react';
import Button from '../button';

const BUTTON_TEXT = '테스트';

describe('<Button />', () => {
	it('should render OK with props', () => {
		const { getByText, container } = render(<Button canClick loading={false} actionText={BUTTON_TEXT} />);
		getByText(BUTTON_TEXT);
		expect(container.firstChild).toHaveClass('bg-lime-700 hover:bg-lime-800');
	});
	it('should display Loading', () => {
		const { getByText, container } = render(<Button canClick={false} loading actionText={BUTTON_TEXT} />);
		getByText('Loading...');
		expect(container.firstChild).toHaveClass('bg-gray-300 pointer-events-none');
	});
});
