// api/notificationApi.ts
import client from './axios';
import { AppNotification, RoleEnum } from '@/types';

export const NotificationApi = {
  getNotificationsByUserIDAndModelAndRole: async (
    userId: string,
    model: string,
    role: RoleEnum
  ): Promise<AppNotification[]> => {
    const response = await client.get<AppNotification[]>(
      `/notification/${userId}/by-roles/${model}?roles=${role}`
    );
    return response.data;
  },
  getAllNotifications: async (): Promise<AppNotification[]> => {
    const response = await client.get<AppNotification[]>('/notification');
    return response.data;
  }
};
