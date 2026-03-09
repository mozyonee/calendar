import { holidayApi } from '@/features/tasks/lib/holidayApi';
import type { PublicHoliday } from '@calendar/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HolidaysState {
	byDate: Record<string, PublicHoliday[]>;
	countryCode: string;
	fetchedKeys: string[]; // "YYYY-CC"
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: HolidaysState = {
	byDate: {},
	countryCode: 'UA',
	fetchedKeys: [],
	status: 'idle',
};

export const fetchHolidaysForYear = createAsyncThunk(
	'holidays/fetchForYear',
	({ year, countryCode }: { year: number; countryCode: string }) => holidayApi.fetch(year, countryCode),
	{
		condition: ({ year, countryCode }, { getState }) => {
			const state = getState() as { holidays: HolidaysState };
			return !state.holidays.fetchedKeys.includes(`${year}-${countryCode}`);
		},
	},
);

const holidaysSlice = createSlice({
	name: 'holidays',
	initialState,
	reducers: {
		setCountryCode(state, action: PayloadAction<string>) {
			state.countryCode = action.payload;
			state.byDate = {};
			state.fetchedKeys = [];
			state.status = 'idle';
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchHolidaysForYear.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchHolidaysForYear.fulfilled, (state, action) => {
				state.status = 'succeeded';
				const { year, countryCode } = action.meta.arg;
				const key = `${year}-${countryCode}`;
				if (!state.fetchedKeys.includes(key)) state.fetchedKeys.push(key);
				for (const holiday of action.payload) {
					if (!state.byDate[holiday.date]) state.byDate[holiday.date] = [];
					if (!state.byDate[holiday.date].some((h) => h.name === holiday.name)) {
						state.byDate[holiday.date].push(holiday);
					}
				}
			})
			.addCase(fetchHolidaysForYear.rejected, (state) => {
				state.status = 'failed';
			});
	},
});

export const { setCountryCode } = holidaysSlice.actions;
export default holidaysSlice.reducer;
