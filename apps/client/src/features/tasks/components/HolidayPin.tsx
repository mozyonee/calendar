import { Card } from '@/components/ui';
import { styled } from '@/lib/stitches';
import type { PublicHoliday } from '@calendar/types';

const Pin = styled(Card, {
	fontSize: '$xs',
	fontWeight: '$medium',
	color: '$emerald700',
	backgroundColor: '$emerald50',
	borderRadius: '$sm',
	padding: '$1',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	lineHeight: '1.25',
	marginTop: '$1',
	userSelect: 'none',
	border: 'none',
	boxShadow: 'none',
});

interface Props {
	holiday: PublicHoliday;
}

export function HolidayPin({ holiday }: Props) {
	return <Pin>{holiday.name}</Pin>;
}
