'use client';

import { useEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task, TaskColor } from '@calendar/types';

const COLOR_MAP: Record<TaskColor, string> = {
	green: 'bg-green-400',
	blue: 'bg-blue-500',
	orange: 'bg-orange-400',
	red: 'bg-red-400',
	purple: 'bg-purple-500',
};

const COLORS: TaskColor[] = ['green', 'blue', 'orange', 'red', 'purple'];

interface Props {
	task: Task;
	onEdit: (title: string, color: TaskColor) => void;
	onRemove: () => void;
	isDragOverlay?: boolean;
}

export function TaskCard({ task, onEdit, onRemove, isDragOverlay = false }: Props) {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(task.title);
	const [editColor, setEditColor] = useState<TaskColor>(task.color);
	const inputRef = useRef<HTMLInputElement>(null);

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: task._id,
		disabled: isEditing,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	useEffect(() => {
		if (isEditing) inputRef.current?.focus();
	}, [isEditing]);

	function commitEdit() {
		const trimmed = editValue.trim();
		if (trimmed && (trimmed !== task.title || editColor !== task.color)) {
			onEdit(trimmed, editColor);
		}
		setIsEditing(false);
	}

	function handleKeyDown(e: React.KeyboardEvent) {
		if (e.key === 'Enter') { e.preventDefault(); commitEdit(); }
		else if (e.key === 'Escape') { setEditValue(task.title); setEditColor(task.color); setIsEditing(false); }
	}

	if (isDragging && !isDragOverlay) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className="bg-white rounded shadow border border-dashed border-gray-300 opacity-40 mb-1.5 h-12"
			/>
		);
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`bg-white rounded shadow-sm border border-gray-100 mb-1.5 overflow-hidden ${isDragOverlay ? 'shadow-md rotate-1' : 'hover:shadow-md'} ${isDragging ? 'opacity-50' : ''}`}
		>
			{/* Colour label bar */}
			<div className="flex gap-0.5 px-1.5 pt-1.5 pb-0.5">
				{isEditing
					? COLORS.map((c) => (
							<button
								key={c}
								type="button"
								onClick={() => setEditColor(c)}
								className={`h-1.5 w-6 rounded-full ${COLOR_MAP[c]} ${editColor === c ? 'ring-2 ring-offset-1 ring-gray-400' : 'opacity-60'}`}
							/>
					  ))
					: <div className={`h-1.5 w-8 rounded-full ${COLOR_MAP[task.color]}`} />
				}
			</div>

			{/* Title / edit input */}
			<div
				className="px-1.5 pb-1.5 pt-0.5 cursor-pointer"
				{...(!isEditing ? { ...attributes, ...listeners } : {})}
				onClick={() => { if (!isEditing) setIsEditing(true); }}
			>
				{isEditing ? (
					<div className="flex items-center gap-1">
						<input
							ref={inputRef}
							value={editValue}
							onChange={(e) => setEditValue(e.target.value)}
							onKeyDown={handleKeyDown}
							onBlur={commitEdit}
							className="flex-1 text-xs outline-none border-b border-blue-400 bg-transparent py-0.5"
						/>
						<button
							type="button"
							onMouseDown={(e) => { e.preventDefault(); onRemove(); }}
							className="text-gray-400 hover:text-red-500 text-xs leading-none"
						>
							✕
						</button>
					</div>
				) : (
					<p className="text-xs text-gray-800 leading-snug">{task.title}</p>
				)}
			</div>
		</div>
	);
}
