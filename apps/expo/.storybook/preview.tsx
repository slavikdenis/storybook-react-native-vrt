import { View } from 'react-native';

export const decorators = [
	(Story) => (
		<View style={{ padding: 15 }}>
			<Story />
		</View>
	),
];
export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};
