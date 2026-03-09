import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true, collection: 'tasks' })
export class Task {
	@Prop({ required: true })
	title: string;

	@Prop({ required: true })
	date: string;

	@Prop({ required: true, default: 0 })
	order: number;

	@Prop({ default: 'blue' })
	color: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.index({ date: 1, order: 1 });
