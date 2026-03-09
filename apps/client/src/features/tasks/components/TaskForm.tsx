'use client';

import { Flex, Input } from '@/components/ui';
import { useEffect, useRef, useState } from 'react';

interface Props {
	onSubmit: (title: string) => void;
	onCancel: () => void;
}

export function TaskForm({ onSubmit, onCancel }: Props) {
	const [value, setValue] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			const trimmed = value.trim();
			if (trimmed) onSubmit(trimmed);
		} else if (e.key === 'Escape') {
			onCancel();
		}
	}

	return (
		<Flex direction="column">
			<Input
				ref={inputRef}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={handleKeyDown}
				onBlur={() => {
					const trimmed = value.trim();
					if (trimmed) onSubmit(trimmed);
					else onCancel();
				}}
				placeholder="Task name…"
			/>
		</Flex>
	);
}
