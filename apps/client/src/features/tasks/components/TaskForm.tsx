'use client';

import { Flex, Input } from '@/components/ui';
import { keyframes, styled } from '@/lib/stitches';
import { useEffect, useRef, useState } from 'react';

const SlideIn = keyframes({
	from: { opacity: 0, transform: 'translateY(-4px)' },
	to: { opacity: 1, transform: 'translateY(0)' },
});

const FormRoot = styled(Flex, {
	animation: `${SlideIn.name} 150ms ease-out`,
});

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
		<FormRoot direction="column">
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
				css={{
					fontSize: '$xs',
				}}
				placeholder="Task name…"
			/>
		</FormRoot>
	);
}
