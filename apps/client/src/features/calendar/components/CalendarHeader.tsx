'use client';

import { Button, Flex, IconButton, Input } from '@/components/ui';
import { goToToday, nextMonth, prevMonth, setSearchQuery } from '@/features/calendar/slices/calendarSlice';
import { MONTH_NAMES } from '@/features/calendar/utils/calendarUtils';
import { useDebounce } from '@/hooks/useDebounce';
import { styled } from '@/lib/stitches';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect, useState } from 'react';

const Title = styled('h1', {
	fontSize: '$lg',
	fontWeight: '$semibold',
});

const Search = styled('div', {
	position: 'relative',
});

const SearchIcon = styled('svg', {
	width: '1rem',
	height: '1rem',
	position: 'absolute',
	left: '0.625rem',
	top: '50%',
	transform: 'translateY(-50%)',
	color: 'inherit',
});

const SearchInput = styled(Input, {
	paddingLeft: '2rem',
	width: '12rem',
	backgroundColor: '$accent600',
	color: '$white',

	'&::placeholder': {
		color: '$white',
		opacity: 0.6,
	},

	'&:focus': {
		boxShadow: '0 0 0 2px $accent200',
		borderColor: '$accent400',
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
				padding: '$3 $4',
				borderBottom: '1px solid $gray200',
				backgroundColor: '$accent500',
				color: '$white',
				'@sm': {
					flexDirection: 'column',
				},
			}}
		>
			<Flex align="center" gap={2}>
				<Button variant="secondary" size="sm" type="button" onClick={() => dispatch(goToToday())}>
					Today
				</Button>
				<IconButton type="button" onClick={() => dispatch(prevMonth())} aria-label="Previous month">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
				</IconButton>
				<IconButton type="button" onClick={() => dispatch(nextMonth())} aria-label="Next month">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				</IconButton>
			</Flex>

			<Title>
				{MONTH_NAMES[month - 1]} {year}
			</Title>

			<Search>
				<SearchIcon fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</SearchIcon>
				<SearchInput
					type="text"
					placeholder="Search tasks…"
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
				/>
			</Search>
		</Flex>
	);
}
