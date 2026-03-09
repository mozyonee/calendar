'use client';

import { Button, Card, Flex, Input } from '@/components/ui';
import { TASK_COLORS } from '@/features/tasks/lib/taskColors';
import { styled } from '@/lib/stitches';
import type { Task, TaskColor } from '@calendar/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const TaskCardRoot = styled(Card, {
	padding: '$2',
	width: '100%',
	borderRadius: '$md',
	minHeight: '2rem',

	variants: {
		isOverlay: {
			true: {
				boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
				transform: 'rotate(1deg)',
			},
		},
		isDragging: {
			true: {
				opacity: 0.5,
			},
		},
		isEditing: {
			false: {
				cursor: 'pointer',
			},
		},
	},

	compoundVariants: [
		{
			isOverlay: true,
			isDragging: true,
			isEditing: false,
			css: {
				boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
			},
		},
	],
});

const ColorDot = styled('div', {
	height: '0.375rem',
	width: '1.5rem',
	borderRadius: '$full',
	border: 'none',
	padding: 0,
	transition: 'opacity 150ms ease',

	'&:hover': {
		opacity: 1,
	},

	variants: {
		color: {
			green: { backgroundColor: '$green400' },
			blue: { backgroundColor: '$sky400' },
			orange: { backgroundColor: '$amber400' },
			red: { backgroundColor: '$rose400' },
			purple: { backgroundColor: '$purple400' },
		},
		selected: {
			true: {
				outline: '2px solid $gray400',
				outlineOffset: '1px',
				opacity: 1,
				margin: '0 0 $2 0',
			},
			false: {
				margin: '0 0 $1 0',
			},
		},
	},
	defaultVariants: {
		selected: false,
	},
});

const Title = styled('p', {
	fontSize: '$xs',
	color: '$gray800',
	margin: 0,
});

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
		if (e.key === 'Enter') {
			e.preventDefault();
			commitEdit();
		} else if (e.key === 'Escape') {
			setEditValue(task.title);
			setEditColor(task.color);
			setIsEditing(false);
		}
	}

	if (isDragging && !isDragOverlay) {
		return <TaskCardRoot ref={setNodeRef} style={style} isDragging isOverlay={false} />;
	}

	return (
		<TaskCardRoot
			ref={setNodeRef}
			style={style}
			isOverlay={isDragOverlay}
			isDragging={isDragging}
			isEditing={isEditing}
			onClick={(e) => e.stopPropagation()}
		>
			{/* Colour label bar */}
			<Flex gap={1}>
				{isEditing ? (
					TASK_COLORS.map((c) => (
						<ColorDot
							key={c}
							color={c}
							selected={editColor === c}
							onMouseDown={(e) => {
								e.preventDefault();
								setEditColor(c);
							}}
							css={{
								cursor: 'pointer',
								flex: 1,
							}}
						/>
					))
				) : (
					<ColorDot color={task.color} selected={false} />
				)}
			</Flex>

			{/* Title / edit input */}
			<Flex
				{...(!isEditing ? { ...attributes, ...listeners } : {})}
				onClick={() => {
					if (!isEditing) setIsEditing(true);
				}}
			>
				{isEditing ? (
					<Flex align="center" gap={1} css={{ width: '100%' }}>
						<Input
							ref={inputRef}
							value={editValue}
							onChange={(e) => setEditValue(e.target.value)}
							onKeyDown={handleKeyDown}
							onBlur={commitEdit}
							css={{
								fontSize: '$xs',
								color: '$gray800',
							}}
						/>
						<Button
							type="button"
							onMouseDown={(e) => {
								e.preventDefault();
								onRemove();
							}}
							css={{
								padding: '$1',
								height: '100%',
							}}
						>
							<X size={15} />
						</Button>
					</Flex>
				) : (
					<Title>{task.title}</Title>
				)}
			</Flex>
		</TaskCardRoot>
	);
}
