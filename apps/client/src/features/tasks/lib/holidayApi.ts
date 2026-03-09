import type { PublicHoliday } from '@calendar/types';
import api from '@/lib/api';

export const holidayApi = {
	fetch: (year: number, countryCode: string) =>
		api.get<PublicHoliday[]>('/holidays', { params: { year, countryCode } }).then((r) => r.data),
};
