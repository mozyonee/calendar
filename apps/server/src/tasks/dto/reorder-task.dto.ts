import { IsInt, Matches, Min } from 'class-validator';

export class ReorderTaskDto {
	@Matches(/^\d{4}-\d{2}-\d{2}$/)
	date: string;

	@IsInt()
	@Min(0)
	order: number;
}
