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
		return this.taskModel
			.find({ date: { $gte: from, $lte: to } })
			.sort({ date: 1, order: 1 })
			.lean()
			.exec();
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

		// Compact source date (excludes the moving task)
		await this.compactDate(oldDate, id);

		// Shift siblings at target date to make room (excludes the moving task)
		const siblings = await this.taskModel
			.find({ date: newDate, _id: { $ne: id } })
			.sort({ order: 1 })
			.exec();

		const insertAt = Math.min(newOrder, siblings.length);
		await Promise.all(
			siblings.map((t, i) => this.taskModel.updateOne({ _id: t._id }, { order: i < insertAt ? i : i + 1 })),
		);

		task.date = newDate;
		task.order = insertAt;
		await task.save();

		const affectedDates = oldDate !== newDate ? [oldDate, newDate] : [newDate];
		return this.taskModel
			.find({ date: { $in: affectedDates } })
			.sort({ date: 1, order: 1 })
			.lean()
			.exec();
	}

	async remove(id: string): Promise<void> {
		const task = await this.taskModel.findByIdAndDelete(id).lean().exec();
		if (!task) throw new NotFoundException('Task not found');
		await this.compactDate(task.date, null);
	}

	private async compactDate(date: string, excludeId: string | null): Promise<void> {
		const query = excludeId ? { date, _id: { $ne: excludeId } } : { date };
		const tasks = await this.taskModel.find(query).sort({ order: 1 }).exec();
		await Promise.all(tasks.map((t, i) => this.taskModel.updateOne({ _id: t._id }, { order: i })));
	}
}
