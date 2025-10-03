import client from './axios';
import { Notification } from '@/types';

export const notificationApi = {
    send: (data: { userId: string; message: string; type: string; allowedRoles?: number[]; purpose: string; relatedId?: string; relatedModel?: string }) => client.post<{ message: string; notification: Notification }>('/notification', data),

    getAllNotifications: (query?: { userId?: string; includeUserData?: boolean; roles?: string; page?: number; limit?: number }) => client.get<{ notifications: Notification[] }>('/notification/all', { params: query }),
    getNotificationById: (id: string) => client.get<{ notification: Notification }>(`/notification/${id}`),

    getForUser: (userId: string) => client.get<{ notifications: Notification[] }>(`/notification/${userId}`),
    getForUserRoles: (userId: string, roles: string) => client.get<{ notifications: Notification[] }>(`/notification/${userId}/by-roles`, { params: { roles } }),

    updateAllowedRoles: (id: string, data: { allowedRoles?: number[] }) => client.patch<{ notification: Notification }>(`/notification/${id}`, data),

    deleteNotification: (id: string) => client.delete<{ message: string }>(`notification/${id}`),
};