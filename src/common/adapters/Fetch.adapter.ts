import { Injectable } from '@nestjs/common';
import { HttpAdapter } from '../interfaces/http-adapter.interface';

@Injectable()
export class FetchAdapter implements HttpAdapter {
  async get(url: string, headers?: Record<string, string>): Promise<any> {
    try {
      const response = await fetch(url, { method: 'GET', headers });
      return response.json();
    } catch (error) {
      console.error('Error in FetchAdapter.get:', error);
      throw new Error('Error in FetchAdapter.get');
    }
  }

  async post<T>(
    url: string,
    body: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as T;
      return data;
    } catch (error) {
      console.error('Error in FetchAdapter.post:', error);
      throw new Error('Error in FetchAdapter.post');
    }
  }

  async put<T>(
    url: string,
    body: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as T;
      return data;
    } catch (error) {
      console.error('Error in FetchAdapter.put:', error);
      throw new Error('Error in FetchAdapter.put');
    }
  }

  async delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });
      const data = (await response.json()) as T;
      return data;
    } catch (error) {
      console.error('Error in FetchAdapter.delete:', error);
      throw new Error('Error in FetchAdapter.delete');
    }
  }
}
