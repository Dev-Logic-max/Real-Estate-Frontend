import client from './axios';
import { User } from '@/types';

export const userApi = {
    create: (data: { email: string; password: string; firstName: string; lastName?: string; phone?: string }) =>
        client.post<{ message: string; user: User; id: string }>('/users/create', data),
    updateProfile: (data: Partial<User>) => client.patch('/users/update/profile', data),
    usersList: () => client.get<{ users: User[] }>('/users'),
    uploadProfile: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return client.post<string>('/users/profile-image-upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    updateEmail: (data: { email: string }) => client.patch('/users/email', data),
    updateById: (id: string, data: Partial<User>) => client.patch(`/users/${id}`, data),
    requestRole: (data: { role: number }) => client.post('/users/role-request', data), // Assume body { role: RoleEnum }
    upgradeRole: (id: string, data: { role: number; approve: boolean }) => client.patch(`/users/${id}/upgrade-role`, data),
    deleteUser: (id: string) => client.delete(`/users/${id}`),
};