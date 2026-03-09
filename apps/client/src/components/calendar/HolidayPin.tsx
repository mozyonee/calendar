import type { PublicHoliday } from '@calendar/types';

interface Props {
	holiday: PublicHoliday;
}

export function HolidayPin({ holiday }: Props) {
	return (
		<div className="text-xs font-medium text-emerald-700 bg-emerald-50 rounded px-1.5 py-0.5 truncate leading-tight mb-0.5 select-none">
			{holiday.name}
		</div>
	);
}
