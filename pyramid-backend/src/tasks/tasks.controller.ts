import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  async create(@Body() body: any, @Request() req: any) {
    return await this.tasksService.create({
      ...body,
      userId: req.user?.id || 'guest@pyramid.com',
    });
  }

  @Get()
  async findAll(@Query('projectId') projectId: string, @Request() req: any) {
    if (projectId) {
      return await this.tasksService.findByProject(projectId);
    }
    return await this.tasksService.findByUser(req.user?.id || 'guest@pyramid.com');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tasksService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return await this.tasksService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.tasksService.remove(id);
  }
}