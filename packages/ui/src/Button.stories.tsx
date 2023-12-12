import React from 'react';
import { Meta, StoryObj } from '@storybook/react-native';
import { Button, type ButtonProps } from './Button';

const MetaData: Meta<ButtonProps> = {
	title: 'Components/Button',
	component: Button,
};

export default MetaData;

const storyArgs: StoryObj<ButtonProps> = {
	render: (props) => <Button {...props} />,
	args: {
		text: 'Press me',
		disabled: false,
		style: undefined,
		textStyle: undefined,
	},
	argTypes: {
		text: { control: 'text' },
		onPress: { action: 'pressed' },
		disabled: { control: 'boolean' },
		style: { control: 'object' },
	},
};

export const Default: StoryObj<ButtonProps> = {
	...storyArgs,
};

export const Disabled: StoryObj<ButtonProps> = {
	...storyArgs,
	args: {
		...storyArgs.args,
		disabled: true,
	},
};

export const CustomText: StoryObj<ButtonProps> = {
	...storyArgs,
	args: {
		...storyArgs.args,
		text: 'Click me',
	},
};

export const CustomStyle: StoryObj<ButtonProps> = {
	...storyArgs,
	args: {
		...storyArgs.args,
		style: {
			backgroundColor: 'green',
		},
		textStyle: {
			color: 'yellow',
		}
	},
};
