import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Emit when a project is created/updated
  emitProjectChange(type: string, project: any) {
    this.server.emit('project:change', { type, project });
  }

  // Emit when a task is created/updated
  emitTaskChange(type: string, task: any) {
    this.server.emit('task:change', { type, task });
  }

  // Broadcast to specific project room
  emitProjectUpdate(projectId: string, task: any) {
    this.server.to(`project:${projectId}`).emit('task:updated', task);
  }

  @SubscribeMessage('join:project')
  joinProject(client: Socket, projectId: string) {
    client.join(`project:${projectId}`);
    console.log(`Client ${client.id} joined project:${projectId}`);
  }

  @SubscribeMessage('leave:project')
  leaveProject(client: Socket, projectId: string) {
    client.leave(`project:${projectId}`);
    console.log(`Client ${client.id} left project:${projectId}`);
  }
}