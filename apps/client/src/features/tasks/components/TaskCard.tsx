'use client';

import { Button, Card, Flex, Input } from '@/components/ui';
import { TASK_COLORS } from '@/features/tasks/lib/taskColors';
import { keyframes, styled } from '@/lib/stitches';
import type { Task, TaskColor } from '@calendar/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const slideUp = keyframes({
	from: { opacity: 0, transform: 'translateY(10px)' },
	to: { opacity: 1, transform: 'translateY(0)' },
});

const TaskCardRoot = styled(Card, {
	padding: '$2',
	width: '100%',
	borderRadius: '$md',
	minHeight: '2rem',
	position: 'relative',
	userSelect: 'none',
	willChange: 'transform',
	transition: 'none !important',

	animation: `${slideUp.name} 300ms ease-out backwards`,

	variants: {
		isOverlay: {
			true: {
				animation: 'none',
				boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
				cursor: 'grabbing',
				opacity: 1,
				zIndex: 1000,
				backgroundColor: '$white',
			},
		},
		isDragging: {
			true: {
				animation: 'none',
				opacity: 0,
				transition: 'none !important',
				pointerEvents: 'none',
			},
		},
		isEditing: {
			false: {
				cursor: 'pointer',
			},
		},
	},
});

const ColorDot = styled('div', {
	height: '0.375rem',
	width: '1.5rem',
	borderRadius: '$full',
	border: 'none',
	padding: 0,
	transition: 'opacity 150ms ease, box-shadow 150ms ease, margin 150ms ease',
	boxShadow: '0 0 0 0px transparent',

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
				boxShadow: '0 0 0 1px $colors$white, 0 0 0 3px $colors$gray400',
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
	index?: number;
}

export function TaskCard({ task, onEdit, onRemove, isDragOverlay = false, index = 0 }: Props) {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(task.title);
	const [editColor, setEditColor] = useState<TaskColor>(task.color);
	const inputRef = useRef<HTMLInputElement>(null);

	// No sortable logic needed for overlay - it's handled by dnd-kit's DragOverlay
	const sortable = useSortable({
		id: task._id,
		disabled: isEditing || isDragOverlay,
		data: {
			type: 'Task',
			task,
		},
	});

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable;

	const style = {
		transform: isDragOverlay ? undefined : CSS.Translate.toString(transform),
		transition: isDragging || isDragOverlay ? 'none !important' : transition,
		animationDelay: `${index * 50}ms`,
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
			ref={isDragOverlay ? undefined : setNodeRef}
			style={style}
			isOverlay={isDragOverlay}
			isDragging={isDragging}
			isEditing={isEditing}
			onClick={(e) => {
				e.stopPropagation();
				if (!isEditing) setIsEditing(true);
			}}
			{...(!isEditing && !isDragOverlay ? { ...attributes, ...listeners } : {})}
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
			<Flex>
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
							variant="danger"
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
							<Trash2 size={15} />
						</Button>
					</Flex>
				) : (
					<Title>{task.title}</Title>
				)}
			</Flex>
		</TaskCardRoot>
	);
}
