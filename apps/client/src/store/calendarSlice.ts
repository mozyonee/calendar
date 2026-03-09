import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CalendarState {
	year: number;
	month: number; // 1-12
	searchQuery: string;
}

const now = new Date();

const initialState: CalendarState = {
	year: now.getFullYear(),
	month: now.getMonth() + 1,
	searchQuery: '',
};

const calendarSlice = createSlice({
	name: 'calendar',
	initialState,
	reducers: {
		prevMonth(state) {
			if (state.month === 1) {
				state.month = 12;
				state.year -= 1;
			} else {
				state.month -= 1;
			}
		},
		nextMonth(state) {
			if (state.month === 12) {
				state.month = 1;
				state.year += 1;
			} else {
				state.month += 1;
			}
		},
		setSearchQuery(state, action: PayloadAction<string>) {
			state.searchQuery = action.payload;
		},
	},
});

export const { prevMonth, nextMonth, setSearchQuery } = calendarSlice.actions;
export default calendarSlice.reducer;
