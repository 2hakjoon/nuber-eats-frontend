import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { isLoggedInVar } from './apollo';

const LOGGED_OUT_TEXT = '로그아웃 컴포넌트 텍스트';
const LOGGED_IN_TEXT = '로그인 컴포넌트 텍스트';

jest.mock('./routers/logged-out-router', () => {
	return function () {
		return <div>{LOGGED_OUT_TEXT}</div>;
	};
});

jest.mock('./routers/logged-in-router', () => {
	return function () {
		return <div>{LOGGED_IN_TEXT}</div>;
	};
});

describe('<App />', () => {
	it('renders LoggedOutRouter', () => {
		const { getByText } = render(<App />);
		getByText(LOGGED_OUT_TEXT);
	});
	it('renders LoggedInRouter', async () => {
		const { getByText } = render(<App />);
		await waitFor(() => {
			isLoggedInVar(true);
		});
		getByText(LOGGED_IN_TEXT);
	});
});
