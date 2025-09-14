const API_BASE_URL = 'http://localhost:3000'; 

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

export interface Project {
  id: number;
  name: string;
  color: string;
}

class TaskService {
  // CRUD cho Tasks
  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async getTaskById(id: number): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
      if (!response.ok) throw new Error('Failed to fetch task');
      return await response.json();
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    try {
      const newTask = {
        ...task,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) throw new Error('Failed to create task');
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    try {
      const updatedTask = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error('Failed to update task');
      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async toggleTask(id: number): Promise<Task> {
    try {
      // Lấy task hiện tại
      const currentTask = await this.getTaskById(id);
      
      // Toggle completed status
      return await this.updateTask(id, {
        completed: !currentTask.completed
      });
    } catch (error) {
      console.error('Error toggling task:', error);
      throw error;
    }
  }

  // CRUD cho Categories
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async updateCategory(id: number, updates: Partial<Category>): Promise<Category> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update category');
      return await response.json();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  // CRUD cho Projects
  async getAllProjects(): Promise<Project[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) throw new Error('Failed to create project');
      return await response.json();
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update project');
      return await response.json();
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete project');
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  }

  // Utility methods
  async searchTasks(query: string): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search tasks');
      return await response.json();
    } catch (error) {
      console.error('Error searching tasks:', error);
      throw error;
    }
  }

  async getTasksByCategory(category: string): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks?category=${encodeURIComponent(category)}`);
      if (!response.ok) throw new Error('Failed to fetch tasks by category');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks by category:', error);
      throw error;
    }
  }

  async getTasksByPriority(priority: string): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks?priority=${encodeURIComponent(priority)}`);
      if (!response.ok) throw new Error('Failed to fetch tasks by priority');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks by priority:', error);
      throw error;
    }
  }

  async getCompletedTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks?completed=true`);
      if (!response.ok) throw new Error('Failed to fetch completed tasks');
      return await response.json();
    } catch (error) {
      console.error('Error fetching completed tasks:', error);
      throw error;
    }
  }

  async getActiveTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks?completed=false`);
      if (!response.ok) throw new Error('Failed to fetch active tasks');
      return await response.json();
    } catch (error) {
      console.error('Error fetching active tasks:', error);
      throw error;
    }
  }
}

export const taskService = new TaskService();