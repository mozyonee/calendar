import { styled } from '@/lib/stitches';

export const Flex = styled('div', {
	display: 'flex',
	boxSizing: 'border-box',

	variants: {
		direction: {
			row: { flexDirection: 'row' },
			column: { flexDirection: 'column' },
		},
		align: {
			start: { alignItems: 'flex-start' },
			center: { alignItems: 'center' },
			end: { alignItems: 'flex-end' },
			stretch: { alignItems: 'stretch' },
		},
		justify: {
			start: { justifyContent: 'flex-start' },
			center: { justifyContent: 'center' },
			end: { justifyContent: 'flex-end' },
			between: { justifyContent: 'space-between' },
			around: { justifyContent: 'space-around' },
		},
		wrap: {
			no: { flexWrap: 'nowrap' },
			wrap: { flexWrap: 'wrap' },
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
		flex: {
			none: { flex: '0 0 auto' },
			1: { flex: 1 },
			2: { flex: 2 },
			3: { flex: 3 },
		},
	},

	defaultVariants: {
		direction: 'row',
		align: 'stretch',
		justify: 'start',
		wrap: 'no',
		gap: 0,
	},
});
