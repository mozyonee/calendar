import { styled } from '@/lib/stitches';

export const Grid = styled('div', {
	display: 'grid',
	width: '100%',
	boxSizing: 'border-box',

	variants: {
		cols: {
			1: { gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' },
			2: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
			3: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
			4: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
			5: { gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' },
			6: { gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' },
			7: { gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' },
			8: { gridTemplateColumns: 'repeat(8, minmax(0, 1fr))' },
		},
		gap: {
			0: { gap: 0 },
			1: { gap: '$1' },
			2: { gap: '$2' },
			3: { gap: '$3' },
			4: { gap: '$4' },
			6: { gap: '$6' },
			8: { gap: '$8' },
		},
		rows: {
			auto: { gridAutoRows: 'minmax(0, auto)' },
			fr: { gridAutoRows: 'minmax(0, 1fr)' },
		},
	},

	defaultVariants: {
		cols: 1,
		gap: 0,
		rows: 'auto',
	},
});
