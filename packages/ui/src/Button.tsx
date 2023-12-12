import * as React from 'react';
import {
	StyleSheet,
	GestureResponderEvent,
	Text,
	StyleProp,
	Pressable,
	ViewStyle,
	TextStyle,
} from 'react-native';

export type ButtonProps = {
	readonly text: string;
	readonly textStyle?: StyleProp<TextStyle>;
	readonly onPress?: (event: GestureResponderEvent) => void;
	readonly style?: StyleProp<ViewStyle>;
	readonly disabled?: boolean;
};

export const Button = ({
	text,
	onPress,
	style,
	textStyle,
	disabled = false,
}: ButtonProps) => (
	<Pressable
		disabled={disabled}
		style={[styles.button, style, disabled && styles.disabledButton]}
		onPress={onPress}
	>
		<Text style={[styles.text, textStyle]}>{text}</Text>
	</Pressable>
);

const styles = StyleSheet.create({
	button: {
		maxWidth: 200,
		borderRadius: 12,
		paddingTop: 14,
		paddingBottom: 14,
		paddingLeft: 30,
		paddingRight: 30,
		fontSize: 15,
		backgroundColor: '#2f80ed',
		alignItems: 'center',
	},
	disabledButton: {
		backgroundColor: '#b3b3b3',
	},
	text: {
		color: 'white',
	},
});
