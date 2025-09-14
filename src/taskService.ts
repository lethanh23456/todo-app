import { api } from './api';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: string;
  date: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  name: string;
  count: number;
  active: boolean;
}

class TaskService {
  // Tasks
  async getAllTasks(): Promise<Task[]> {
    return await api.get<Task[]>('/tasks');
  }

  async getTaskById(id: number): Promise<Task> {
    return await api.get<Task>(`/tasks/${id}`);
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const newTask = {
      ...task,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return await api.post<Task>('/tasks', newTask);
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const updatedTask = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return await api.patch<Task>(`/tasks/${id}`, updatedTask);
  }

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}`);
  }

  async toggleTask(id: number): Promise<Task> {
    const currentTask = await this.getTaskById(id);
    return await this.updateTask(id, {
      completed: !currentTask.completed
    });
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return await api.get<Category[]>('/categories');
  }
}

export const taskService = new TaskService();