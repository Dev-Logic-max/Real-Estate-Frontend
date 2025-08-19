import client from './axios';
import { AuthResponse, LoginCredentials, RegisterData, VerifyResponse } from '@/types/auth';

export const authApi = {
  login: (data: LoginCredentials) => client.post<AuthResponse>('/auth/email/login', data),
  register: (data: RegisterData) => client.post<AuthResponse>('/auth/email/register', data),
  verify: () => client.get<VerifyResponse>('/auth/verify'),
  refresh: (refreshToken: string) => client.post<{ access_token: string }>('/auth/refresh', { refreshToken }),
  logout: () => client.post('/auth/logout'),

  changePassword: (data: { oldPassword: string; newPassword: string }) => client.patch('/auth/change-password', data),
  forgotPassword: (data: { email: string }) => client.post('/auth/forgot-password', data),
};