import { CreateAgentDto } from '@/types/dto';
import client from './axios';

export const agentApi = {
  createAgent: (adminUserId: string, createAgentDto: CreateAgentDto) =>
    client.post<{ message: string; agent: any }>('/agent/create', { adminUserId, ...createAgentDto }),
  requestAgent: (userId: string, createAgentDto: CreateAgentDto) =>
    client.post<{ message: string; agent: any }>('/agent/request', { userId, ...createAgentDto }),
  uploadDocument: (file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    return client.post<{ data: string }>('/agent/upload-document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};