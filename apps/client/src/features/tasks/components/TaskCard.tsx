'use client';

import { Card, Flex, IconButton, Input } from '@/components/ui';
import { TASK_COLORS } from '@/features/tasks/lib/taskColors';
import { styled } from '@/lib/stitches';
import type { Task, TaskColor } from '@calendar/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useRef, useState } from 'react';

const TaskCardRoot = styled(Card, {
	marginBottom: '$1_5',
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
	},

	compoundVariants: [
		{
			isOverlay: true,
			isDragging: true,
			css: {
				boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
			},
		},
	],
});

const ColorDot = styled('button', {
	height: '0.375rem',
	width: '1.5rem',
	borderRadius: '$full',
	border: 'none',
	padding: 0,
	cursor: 'pointer',
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
				boxShadow: '0 0 0 2px $gray400',
				opacity: 1,
			},
			false: {
				opacity: 0.6,
			},
		},
	},
});

const InlineInput = styled(Input, {
	flex: 1,
	minWidth: 0,
	background: 'transparent',
	borderBottom: '1px solid transparent',
	paddingY: '$0.5',

	'&:focus': {
		borderBottomColor: '$accent400',
	},
});

const RemoveButton = styled(IconButton, {
	fontSize: '$xs',
	color: '$gray400',
	padding: 0,

	'&:hover': {
		color: '$rose500',
	},
});

const Title = styled('p', {
	fontSize: '$xs',
	color: '$gray800',
	lineHeight: 1.2,
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
			onClick={(e) => e.stopPropagation()}
		>
			{/* Colour label bar */}
			<Flex gap={1} css={{ padding: '$1_5 $1_5 $0.5' }}>
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
						/>
					))
				) : (
					<ColorDot color={task.color} selected />
				)}
			</Flex>

			{/* Title / edit input */}
			<Flex
				{...(!isEditing ? { ...attributes, ...listeners } : {})}
				onClick={() => {
					if (!isEditing) setIsEditing(true);
				}}
				css={{
					padding: '$1_5 $1_5 $1_5',
					cursor: 'pointer',
					'&:focus-within': {
						outline: 'none',
					},
				}}
			>
				{isEditing ? (
					<Flex align="center" gap={1} css={{ flex: 1 }}>
						<InlineInput
							ref={inputRef}
							value={editValue}
							onChange={(e) => setEditValue(e.target.value)}
							onKeyDown={handleKeyDown}
							onBlur={commitEdit}
						/>
						<RemoveButton
							type="button"
							onMouseDown={(e) => {
								e.preventDefault();
								onRemove();
							}}
						>
							✕
						</RemoveButton>
					</Flex>
				) : (
					<Title>{task.title}</Title>
				)}
			</Flex>
		</TaskCardRoot>
	);
}
