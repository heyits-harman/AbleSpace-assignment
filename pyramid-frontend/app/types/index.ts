export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Project {
  id: string;
  title: string;
  priority: 'No Priority' | 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Archived';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  leadId?: string;
  user: User;
  lead?: User;
  tasks: Task[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'To Do' | 'Doing' | 'Completed' | 'On Hold' | 'Backlog';
  priority: 'No Priority' | 'Urgent' | 'High' | 'Medium' | 'Low';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  userId: string;
  project: Project;
  user: User;
}