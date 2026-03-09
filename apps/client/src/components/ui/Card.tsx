import { styled } from '@/lib/stitches';

export const Card = styled('div', {
	backgroundColor: '$white',
	borderRadius: '$lg',
	border: '1px solid $gray200',
	boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
	overflow: 'hidden',
	transition: 'box-shadow 150ms ease',

	'&:hover': {
		boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
	},

	variants: {
		bordered: {
			true: {
				borderColor: '$gray300',
			},
		},
	},

	defaultVariants: {
		bordered: true,
	},
});
