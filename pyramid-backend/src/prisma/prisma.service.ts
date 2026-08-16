import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
const { PrismaClient } = require('@prisma/client');

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await super.$connect();
  }

  async onModuleDestroy() {
    await super.$disconnect();
  }
}