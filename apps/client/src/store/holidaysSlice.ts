import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PublicHoliday } from '@calendar/types';
import { holidayApi } from '@/lib/holidayApi';

interface HolidaysState {
	byDate: Record<string, PublicHoliday[]>;
	countryCode: string;
	fetchedYears: number[];
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: HolidaysState = {
	byDate: {},
	countryCode: 'US',
	fetchedYears: [],
	status: 'idle',
};

export const fetchHolidaysForYear = createAsyncThunk(
	'holidays/fetchForYear',
	({ year, countryCode }: { year: number; countryCode: string }) => holidayApi.fetch(year, countryCode),
	{
		condition: ({ year, countryCode }, { getState }) => {
			const state = getState() as { holidays: HolidaysState };
			// Skip if already fetched for this year/country
			return !(state.holidays.fetchedYears.includes(year) && state.holidays.countryCode === countryCode);
		},
	},
);

const holidaysSlice = createSlice({
	name: 'holidays',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchHolidaysForYear.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const year = action.meta.arg.year;
				if (!state.fetchedYears.includes(year)) state.fetchedYears.push(year);
				for (const holiday of action.payload) {
					if (!state.byDate[holiday.date]) state.byDate[holiday.date] = [];
					// Avoid duplicates
					if (!state.byDate[holiday.date].some((h) => h.name === holiday.name)) {
						state.byDate[holiday.date].push(holiday);
					}
				}
			})
			.addCase(fetchHolidaysForYear.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchHolidaysForYear.rejected, (state) => {
				state.status = 'failed';
			});
	},
});

export default holidaysSlice.reducer;
