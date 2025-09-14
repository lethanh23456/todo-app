import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

class ApiBase {
  async get<T>(url: string): Promise<T> {
    const response = await apiClient.get<T>(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await apiClient.post<T>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await apiClient.put<T>(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await apiClient.patch<T>(url, data);
    return response.data;
  }

  async delete(url: string): Promise<void> {
    await apiClient.delete(url);
  }
}

export const api = new ApiBase();