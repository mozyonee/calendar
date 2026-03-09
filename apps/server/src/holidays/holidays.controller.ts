import { Controller, Get, Query } from '@nestjs/common';
import { HolidaysService } from './holidays.service';

@Controller('holidays')
export class HolidaysController {
	constructor(private readonly holidaysService: HolidaysService) {}

	@Get()
	getHolidays(@Query('year') year: string, @Query('countryCode') countryCode: string) {
		return this.holidaysService.getHolidays(Number(year), countryCode ?? 'US');
	}
}
