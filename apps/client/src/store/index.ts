import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import calendarReducer from '@/features/calendar/slices/calendarSlice';
import tasksReducer from '@/features/tasks/slices/tasksSlice';
import holidaysReducer from '@/features/tasks/slices/holidaysSlice';

export const store = configureStore({
	reducer: {
		calendar: calendarReducer,
		tasks: tasksReducer,
		holidays: holidaysReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector);
