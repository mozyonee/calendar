'use client';

import { Button, Flex, Input } from '@/components/ui';
import { goToToday, nextMonth, prevMonth, setSearchQuery } from '@/features/calendar/slices/calendarSlice';
import { MONTH_NAMES } from '@/features/calendar/utils/calendarUtils';
import { useDebounce } from '@/hooks/useDebounce';
import { styled } from '@/lib/stitches';
import { useAppDispatch, useAppSelector } from '@/store';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const Title = styled('h1', {
	fontSize: '$lg',
	fontWeight: '$semibold',
});

const SearchInput = styled(Input, {
	width: '12rem',
	fontSize: '$sm',
	padding: '0.5rem 0.5rem 0.5rem 2rem', // left padding for icon
	backgroundColor: '$accent600',
	color: '$white',
	backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 2a8 8 0 105.292 14.292l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"/></svg>')`,
	backgroundRepeat: 'no-repeat',
	backgroundPosition: '0.5rem center',
	backgroundSize: '1rem 1rem',

	'&::placeholder': {
		color: '$white',
		opacity: 0.6,
	},

	'&:focus': {
		boxShadow: '0 0 0 2px $accent200',
		borderColor: '$accent400',
	},
});

const IconButton = styled(Button, {
	backgroundColor: 'transparent',
	borderRadius: '$sm',
	padding: '$1 !important',
	'&:hover': {
		backgroundColor: 'color-mix(in srgb, $gray300 50%, transparent)',
	},
	'&:focus-visible': {
		outline: '2px solid $accent400',
		outlineOffset: '2px',
	},
});

export function CalendarHeader() {
	const dispatch = useAppDispatch();
	const { year, month } = useAppSelector((s) => s.calendar);
	const [searchValue, setSearchValue] = useState('');
	const debouncedSearch = useDebounce(searchValue, 300);

	useEffect(() => {
		dispatch(setSearchQuery(debouncedSearch));
	}, [debouncedSearch, dispatch]);

	return (
		<Flex
			direction="row"
			align="center"
			justify="between"
			gap={3}
			css={{
				padding: '$2 $4',
				borderBottom: '1px solid $gray200',
				backgroundColor: '$accent500',
				color: '$white',
				'@sm': {
					flexDirection: 'column',
				},
			}}
		>
			<Flex align="center" gap={2}>
				<IconButton type="button" onClick={() => dispatch(goToToday())}>
					Today
				</IconButton>
				<IconButton type="button" onClick={() => dispatch(prevMonth())} aria-label="Previous month">
					<ChevronLeft size={20} />
				</IconButton>
				<IconButton type="button" onClick={() => dispatch(nextMonth())} aria-label="Next month">
					<ChevronRight size={20} />
				</IconButton>
			</Flex>

			<Title>
				{MONTH_NAMES[month - 1]} {year}
			</Title>

			<Flex align="center" gap={2}>
				<SearchInput
					type="text"
					placeholder="Search tasks…"
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
				/>
			</Flex>
		</Flex>
	);
}
