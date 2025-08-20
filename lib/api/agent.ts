import { CreateAgentDto } from '@/types/dto';
import client from './axios';

export const agentApi = {
    createAgent: (adminUserId: string, createAgentDto: CreateAgentDto) =>
        client.post<{ message: string; agent: any }>('/agent/create', { adminUserId, ...createAgentDto }),
    requestAgent: (userId: string, createAgentDto: CreateAgentDto) =>
        client.post<{ message: string; agent: any }>('/agent/request', { userId, ...createAgentDto }),
    approveAgent: (id: string) => client.post<{ message: string }>(`/agent/${id}/approve`),
    rejectAgent: (id: string) => client.post<{ message: string }>(`/agent/${id}/reject`),

    getAgents: () => client.get<{ message: string; agents: any[] }>('/agent'),
    getPendingRequests: () => client.get<{ message: string; agents: any[] }>('/agent/requests'),
    uploadDocument: (file: File) => {
        const formData = new FormData();
        formData.append('document', file);
        return client.post<{ data: string }>('/agent/upload-document', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};