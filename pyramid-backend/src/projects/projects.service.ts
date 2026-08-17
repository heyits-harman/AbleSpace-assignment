import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../websocket/events.gateway';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private eventsGateway: EventsGateway
  ) {}

  // Create project
  async create(data: {
    title: string;
    priority?: string;
    dueDate?: Date;
    userId: string;
    leadId?: string;
  }) {
    const project = await this.prisma.project.create({
      data,
      include: {
        user: { select: { id: true, email: true, name: true } },
        lead: { select: { id: true, email: true, name: true } },
        tasks: true,
      },
    });

    // Broadcast to all clients
    this.eventsGateway.emitProjectChange('created', project);
    return project;
  }

  // Get all projects for a user
  async findAll(userId: string) {
    return await this.prisma.project.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, email: true, name: true } },
        lead: { select: { id: true, email: true, name: true } },
        tasks: true,
      },
    });
  }

  // Get single project
  async findOne(id: string) {
    return await this.prisma.project.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, name: true } },
        lead: { select: { id: true, email: true, name: true } },
        tasks: {
          include: {
            user: { select: { id: true, email: true, name: true } },
          },
        },
      },
    });
  }

  // Update project
  async update(id: string, data: any) {
    const project = await this.prisma.project.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, email: true, name: true } },
        lead: { select: { id: true, email: true, name: true } },
        tasks: true,
      },
    });

    // Broadcast to all clients
    this.eventsGateway.emitProjectChange('updated', project);
    return project;
  }

  // Delete project
  async remove(id: string) {
    const project = await this.prisma.project.delete({
      where: { id },
    });

    // Broadcast to all clients
    this.eventsGateway.emitProjectChange('deleted', project);
    return project;
  }
}