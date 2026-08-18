import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = () => {
  if (socket) return socket;

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket');
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    initializeSocket();
  }
  return socket;
};

export const joinProject = (projectId: string) => {
  const sock = getSocket();
  sock?.emit('join:project', projectId);
};

export const leaveProject = (projectId: string) => {
  const sock = getSocket();
  sock?.emit('leave:project', projectId);
};

export const onProjectChange = (callback: (data: any) => void) => {
  const sock = getSocket();
  sock?.on('project:change', callback);
};

export const onTaskChange = (callback: (data: any) => void) => {
  const sock = getSocket();
  sock?.on('task:change', callback);
};

export const onTaskUpdated = (callback: (data: any) => void) => {
  const sock = getSocket();
  sock?.on('task:updated', callback);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};