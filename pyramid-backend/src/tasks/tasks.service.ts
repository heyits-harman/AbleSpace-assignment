import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../websocket/events.gateway';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway,
  ) {}

  // Create task
  async create(data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: Date;
    projectId: string;
    userId: string;
  }) {
    const task = await this.prisma.task.create({
      data,
      include: {
        project: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });

    // Broadcast to project room
    this.eventsGateway.emitProjectUpdate(data.projectId, task);
    this.eventsGateway.emitTaskChange('created', task);
    return task;
  }

  // Get all tasks for a project
  async findByProject(projectId: string) {
    return await this.prisma.task.findMany({
      where: { projectId },
      include: {
        project: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });
  }

  // Get all tasks for a user
  async findByUser(userId: string) {
    return await this.prisma.task.findMany({
      where: { userId },
      include: {
        project: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });
  }

  // Get single task
  async findOne(id: string) {
    return await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });
  }

  // Update task
  async update(id: string, data: any) {
    const task = await this.prisma.task.update({
      where: { id },
      data,
      include: {
        project: true,
        user: { select: { id: true, email: true, name: true } },
      },
    });

    // Broadcast updates
    this.eventsGateway.emitProjectUpdate(task.projectId, task);
    this.eventsGateway.emitTaskChange('updated', task);
    return task;
  }

  // Delete task
  async remove(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    
    await this.prisma.task.delete({ where: { id } });

    // Broadcast deletion
    this.eventsGateway.emitProjectUpdate(task!.projectId, task);
    this.eventsGateway.emitTaskChange('deleted', task);
    return task;
  }
}