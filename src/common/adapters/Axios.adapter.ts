import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from '../interfaces/http-adapter.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AxiosAdapter implements HttpAdapter {
  private axios: AxiosInstance = axios;

  async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    try {
      const response = await this.axios.get<T>(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error in AxiosAdapter.get:', error);
      throw new Error('Error in AxiosAdapter.get');
    }
  }

  async post<T>(
    url: string,
    body: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    try {
      const response = await this.axios.post<T>(url, body, { headers });
      return response.data;
    } catch (error) {
      console.error('Error in AxiosAdapter.post:', error);
      throw new Error('Error in AxiosAdapter.post');
    }
  }

  async put<T>(
    url: string,
    body: any,
    headers?: Record<string, string>,
  ): Promise<T> {
    try {
      const response = await this.axios.put<T>(url, body, { headers });
      return response.data;
    } catch (error) {
      console.error('Error in AxiosAdapter.put:', error);
      throw new Error('Error in AxiosAdapter.put');
    }
  }

  async delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
    try {
      const response = await this.axios.delete<T>(url, { headers });
      return response.data;
    } catch (error) {
      console.error('Error in AxiosAdapter.delete:', error);
      throw new Error('Error in AxiosAdapter.delete');
    }
  }
}
