import { styled } from '@/lib/stitches';

export const Button = styled('button', {
	appearance: 'none',
	border: 'none',
	borderRadius: '$md',
	padding: '$1 $3',
	fontSize: '$sm',
	fontWeight: '$medium',
	cursor: 'pointer',
	transition: 'background-color 150ms ease, transform 150ms ease, box-shadow 150ms ease',
	backgroundColor: '$gray100',
	color: '$gray900',

	'&:focus-visible': {
		outline: '2px solid $accent400',
		outlineOffset: '2px',
	},

	'&:disabled': {
		opacity: 0.5,
		cursor: 'not-allowed',
	},

	variants: {
		variant: {
			primary: {
				backgroundColor: '$accent500',
				color: '$white',
				'&:hover': { backgroundColor: '$accent400' },
			},
			secondary: {
				backgroundColor: '$gray100',
				color: '$gray900',
				'&:hover': { backgroundColor: '$gray200' },
			},
			ghost: {
				backgroundColor: 'transparent',
				color: '$gray900',
				'&:hover': { backgroundColor: '$gray200' },
			},
		},
		size: {
			sm: { padding: '$1 $2', fontSize: '$xs' },
			md: { padding: '$1 $3', fontSize: '$sm' },
		},
	},

	defaultVariants: {
		variant: 'primary',
		size: 'md',
	},
});
