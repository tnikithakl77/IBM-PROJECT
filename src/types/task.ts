export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

export type TaskFilter = 'all' | 'completed' | 'pending';
export type TaskPriority = 'high' | 'medium' | 'low';