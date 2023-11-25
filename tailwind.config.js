/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");

module.exports = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors:{
				customYellow: '#FDBC17',
				customGray: '#36394A'
			}
		},
	},
	darkMode: "class",
	plugins: [nextui()],
};
