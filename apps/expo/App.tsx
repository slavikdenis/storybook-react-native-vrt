import {
	SafeAreaProvider,
	SafeAreaView,
	initialWindowMetrics,
} from 'react-native-safe-area-context';
import StorybookUIRoot from './.storybook/index';

export default function App() {
	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>
			<SafeAreaView style={{ flex: 1 }}>
				<StorybookUIRoot />
			</SafeAreaView>
		</SafeAreaProvider>
	);
}
