import { styled } from '@/lib/stitches';

export const Input = styled('input', {
	width: '100%',
	padding: '$1',
	fontSize: '$sm',
	border: '1px solid $gray200',
	borderRadius: '$sm',
	backgroundColor: '$white',
	color: '$gray900',
	outline: 'none',
	transition: 'border-color 150ms ease, box-shadow 150ms ease',

	'&:focus': {
		borderColor: '$accent400',
		boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.25)',
	},

	'&::placeholder': {
		color: '$gray500',
	},

	'&:disabled': {
		opacity: 0.5,
		cursor: 'not-allowed',
	},
});
