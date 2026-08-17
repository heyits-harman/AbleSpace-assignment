import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // Create project
  async create(data: {
    title: string;
    priority?: string;
    dueDate?: Date;
    userId: string;
    leadId?: string;
  }) {
    return await this.prisma.project.create({
      data,
      include: {
        user: { select: { id: true, email: true, name: true } },
        lead: { select: { id: true, email: true, name: true } },
        tasks: true,
      },
    });
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
    return await this.prisma.project.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, email: true, name: true } },
        lead: { select: { id: true, email: true, name: true } },
        tasks: true,
      },
    });
  }

  // Delete project
  async remove(id: string) {
    return await this.prisma.project.delete({
      where: { id },
    });
  }
}