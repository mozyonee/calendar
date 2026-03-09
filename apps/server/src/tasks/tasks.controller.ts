import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ReorderTaskDto } from './dto/reorder-task.dto';

@Controller('tasks')
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get()
	findByMonth(@Query('year') year: string, @Query('month') month: string) {
		return this.tasksService.findByMonth(Number(year), Number(month));
	}

	@Post()
	create(@Body() dto: CreateTaskDto) {
		return this.tasksService.create(dto);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
		return this.tasksService.update(id, dto);
	}

	@Patch(':id/reorder')
	reorder(@Param('id') id: string, @Body() dto: ReorderTaskDto) {
		return this.tasksService.reorder(id, dto);
	}

	@Delete(':id')
	@HttpCode(204)
	remove(@Param('id') id: string) {
		return this.tasksService.remove(id);
	}
}
