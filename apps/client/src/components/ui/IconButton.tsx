import { styled } from '@/lib/stitches';

export const IconButton = styled('button', {
	appearance: 'none',
	border: 'none',
	padding: '$1',
	borderRadius: '$md',
	backgroundColor: 'transparent',
	color: 'inherit',
	cursor: 'pointer',
	transition: 'background-color 150ms ease, transform 150ms ease',

	'&:hover': {
		backgroundColor: '$gray200',
	},

	'&:focus-visible': {
		outline: '2px solid $accent400',
		outlineOffset: '2px',
	},
});
