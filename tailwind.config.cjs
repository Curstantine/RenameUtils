/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

const labelPlugin = plugin(({ addUtilities }) => {
	addUtilities({
		".label-sm": {
			fontFamily: "Rubik",
			fontSize: "0.85rem",
			"user-select": "none",
		},
		".label-md": {
			fontFamily: "Rubik",
			fontSize: "1rem",
			"user-select": "none",
		},
	});
});

const displayPlugin = plugin(({ addUtilities }) => {
	addUtilities({
		".display-lg": {
			fontFamily: "Rubik",
			fontSize: "2rem",
			fontWeight: "500",
			lineHeight: "1.2",
			"user-select": "none",
		},
	});
});

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		fontFamily: {
			sans: ["Nunito Sans", "sans-serif"],
			fancy: ["Rubik", "sans-serif"],
		},
		colors: {
			transparent: "transparent",
			current: "currentColor",
			neutral: colors.neutral,
			white: colors.white,
			black: colors.black,
			red: colors.red,
			yellow: colors.amber,
		},
	},
	plugins: [labelPlugin, displayPlugin],
};
