import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReorderTaskDto } from './dto/reorder-task.dto';

@Injectable()
export class TasksService {
	constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

	async findByMonth(year: number, month: number): Promise<Task[]> {
		const pad = (n: number) => String(n).padStart(2, '0');
		const from = `${year}-${pad(month)}-01`;
		const to = `${year}-${pad(month)}-31`;
		return this.taskModel.find({ date: { $gte: from, $lte: to } }).sort({ date: 1, order: 1 }).lean().exec();
	}

	async create(dto: CreateTaskDto): Promise<Task> {
		const last = await this.taskModel.findOne({ date: dto.date }).sort({ order: -1 }).lean().exec();
		const order = last ? last.order + 1 : 0;
		const task = new this.taskModel({ ...dto, order });
		return task.save();
	}

	async update(id: string, dto: UpdateTaskDto): Promise<Task> {
		const task = await this.taskModel.findByIdAndUpdate(id, dto, { new: true }).lean().exec();
		if (!task) throw new NotFoundException('Task not found');
		return task;
	}

	async reorder(id: string, dto: ReorderTaskDto): Promise<Task[]> {
		const task = await this.taskModel.findById(id).exec();
		if (!task) throw new NotFoundException('Task not found');

		const oldDate = task.date;
		const newDate = dto.date;
		const newOrder = dto.order;

		if (oldDate !== newDate) {
			// Remove from old date: compact remaining tasks
			const oldSiblings = await this.taskModel.find({ date: oldDate, _id: { $ne: id } }).sort({ order: 1 }).exec();
			await Promise.all(oldSiblings.map((t, i) => this.taskModel.updateOne({ _id: t._id }, { order: i })));
		}

		// Insert into new date at target position
		const siblings = await this.taskModel
			.find({ date: newDate, _id: { $ne: id } })
			.sort({ order: 1 })
			.exec();

		// Shift tasks at or after target position
		const clamped = Math.min(newOrder, siblings.length);
		await Promise.all(
			siblings.map((t, i) => {
				const currentIndex = i;
				if (currentIndex >= clamped) {
					return this.taskModel.updateOne({ _id: t._id }, { order: currentIndex + 1 });
				}
				return this.taskModel.updateOne({ _id: t._id }, { order: currentIndex });
			}),
		);

		task.date = newDate;
		task.order = clamped;
		await task.save();

		// Return all tasks for affected dates
		const affectedDates = oldDate !== newDate ? [oldDate, newDate] : [newDate];
		return this.taskModel.find({ date: { $in: affectedDates } }).sort({ date: 1, order: 1 }).lean().exec();
	}

	async remove(id: string): Promise<void> {
		const task = await this.taskModel.findByIdAndDelete(id).lean().exec();
		if (!task) throw new NotFoundException('Task not found');
		// Compact remaining tasks for that date
		const siblings = await this.taskModel.find({ date: task.date }).sort({ order: 1 }).exec();
		await Promise.all(siblings.map((t, i) => this.taskModel.updateOne({ _id: t._id }, { order: i })));
	}
}
