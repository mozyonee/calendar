import { IsString, IsNotEmpty, IsOptional, IsIn, Matches } from 'class-validator';

export class CreateTaskDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@Matches(/^\d{4}-\d{2}-\d{2}$/)
	date: string;

	@IsOptional()
	@IsIn(['green', 'blue', 'orange', 'red', 'purple'])
	color?: string;
}
