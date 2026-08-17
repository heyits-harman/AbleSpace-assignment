import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  async create(@Body() body: any, @Request() req: any) {
    return await this.projectsService.create({
      ...body,
      userId: req.user?.id || 'guest@pyramid.com', // Get from JWT or guest
    });
  }

  @Get()
  async findAll(@Request() req: any) {
    return await this.projectsService.findAll(req.user?.id || 'guest@pyramid.com');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.projectsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return await this.projectsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.projectsService.remove(id);
  }
}