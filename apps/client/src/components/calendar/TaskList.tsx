'use client';

import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskColor } from '@calendar/types';
import { TaskCard } from './TaskCard';

interface Props {
	tasks: Task[];
	onEdit: (id: string, title: string, color: TaskColor) => void;
	onRemove: (id: string) => void;
}

export function TaskList({ tasks, onEdit, onRemove }: Props) {
	return (
		<SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
			{tasks.map((task) => (
				<TaskCard
					key={task._id}
					task={task}
					onEdit={(title, color) => onEdit(task._id, title, color)}
					onRemove={() => onRemove(task._id)}
				/>
			))}
		</SortableContext>
	);
}
