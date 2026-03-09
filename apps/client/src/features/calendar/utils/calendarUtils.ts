export interface CalendarDay {
	date: string; // "YYYY-MM-DD"
	dayNumber: number;
	isCurrentMonth: boolean;
	isToday: boolean;
}

function pad(n: number) {
	return String(n).padStart(2, '0');
}

function toDateString(year: number, month: number, day: number): string {
	return `${year}-${pad(month)}-${pad(day)}`;
}

export function buildCalendarGrid(year: number, month: number): CalendarDay[] {
	const today = new Date();
	const todayStr = toDateString(today.getFullYear(), today.getMonth() + 1, today.getDate());

	const firstDay = new Date(year, month - 1, 1);
	const lastDay = new Date(year, month, 0);
	const daysInMonth = lastDay.getDate();
	// Sunday = 0
	const startDow = firstDay.getDay();

	const days: CalendarDay[] = [];

	// Padding from previous month
	if (startDow > 0) {
		const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
		const prevYear = month === 1 ? year - 1 : year;
		const prevMonth = month === 1 ? 12 : month - 1;
		for (let i = startDow - 1; i >= 0; i--) {
			const d = prevMonthLastDay - i;
			const date = toDateString(prevYear, prevMonth, d);
			days.push({ date, dayNumber: d, isCurrentMonth: false, isToday: date === todayStr });
		}
	}

	// Current month
	for (let d = 1; d <= daysInMonth; d++) {
		const date = toDateString(year, month, d);
		days.push({ date, dayNumber: d, isCurrentMonth: true, isToday: date === todayStr });
	}

	// Padding from next month
	const remaining = 42 - days.length;
	const nextYear = month === 12 ? year + 1 : year;
	const nextMonth = month === 12 ? 1 : month + 1;
	for (let d = 1; d <= remaining; d++) {
		const date = toDateString(nextYear, nextMonth, d);
		days.push({ date, dayNumber: d, isCurrentMonth: false, isToday: date === todayStr });
	}

	return days;
}

export const MONTH_NAMES = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December',
];

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
