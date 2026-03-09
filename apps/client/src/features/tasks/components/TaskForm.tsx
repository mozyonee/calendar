'use client';

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
		<div className="mt-1 px-0.5">
			<input
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
				className="w-full text-xs border border-accent-400 rounded px-1.5 py-1 outline-none focus:ring-1 focus:ring-accent-400 bg-white"
			/>
		</div>
	);
}
