/** @type {import('tailwindcss').Config} */
export default {
	content: [],
	theme: {
		fontFamily: {
			inter: 'Inter, sans-serif'
		},
		extend: {
			colors: {
				primary: {
					DEFAULT: '#FF843D',
					50: '#FFF8F5',
					100: '#FFEBE0',
					200: '#FFD2B7',
					300: '#FFB88F',
					400: '#FF9E66',
					500: '#FF843D',
					600: '#FF6005',
					700: '#CC4B00',
					800: '#943600',
					900: '#5C2200',
					950: '#401700'
				},
				secondary: {
					DEFAULT: '#22194C',
					50: '#D6D0F0',
					100: '#C8C1EB',
					200: '#ADA2E0',
					300: '#9283D6',
					400: '#7765CC',
					500: '#5C46C2',
					600: '#4B37A8',
					700: '#3D2D89',
					800: '#30236B',
					900: '#22194C',
					950: '#191237'
				}
			},
			keyframes: {
				drain: {
					'0%': {width: '100%'},
					'100%': {width: '0%'},
				}
			}
		},
	},
	plugins: [
		require('@tailwindcss/container-queries'),
	],
}
