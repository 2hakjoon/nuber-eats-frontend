import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

function AllTheProviders({ children }: any) {
	return (
		<HelmetProvider>
			<Router>{children}</Router>
		</HelmetProvider>
	);
}

const customRender = (ui: React.ReactElement, options?: any) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
