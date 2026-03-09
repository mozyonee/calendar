import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class UpdateTaskDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	title?: string;

	@IsOptional()
	@IsIn(['green', 'blue', 'orange', 'red', 'purple'])
	color?: string;
}
