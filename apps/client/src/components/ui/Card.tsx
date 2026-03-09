import { styled } from '@/lib/stitches';

export const Card = styled('div', {
	backgroundColor: '$white',
	borderRadius: '$md',
	boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
	overflow: 'hidden',
	transition: 'box-shadow 150ms ease',

	variants: {
		bordered: {
			true: {
				border: '1px solid $gray300',
			},
			false: {
				border: 'none',
			},
		},
	},

	defaultVariants: {
		bordered: false,
	},
});
