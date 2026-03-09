import { Injectable } from '@nestjs/common';
import type { PublicHoliday } from '@calendar/types';

@Injectable()
export class HolidaysService {
	private cache = new Map<string, PublicHoliday[]>();

	async getHolidays(year: number, countryCode: string): Promise<PublicHoliday[]> {
		const key = `${year}-${countryCode}`;
		if (this.cache.has(key)) return this.cache.get(key)!;

		const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`;
		const response = await fetch(url);

		if (!response.ok) return [];

		const raw = (await response.json()) as Array<{ date: string; localName: string; name: string }>;
		const shaped: PublicHoliday[] = raw.map((h) => ({
			date: h.date,
			name: h.localName || h.name,
			countryCode,
		}));

		this.cache.set(key, shaped);
		return shaped;
	}
}
