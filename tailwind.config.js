/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors');

module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				lime: colors.lime,
			},
		},
	},
	plugins: [],
};
