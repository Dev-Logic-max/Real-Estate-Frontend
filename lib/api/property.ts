import client from './axios';
import { AddProperty, Property } from '@/types';

export const propertyApi = {
    create: (data: Partial<AddProperty>) => client.post<{ message: string; property: Property }>('/property', data),
    getById: (id: string) => client.get<{ property: Property }>(`/property/${id}`),
    update: (id: string, data: Partial<Property>) => client.patch(`/property/${id}`, data),
    delete: (id: string) => client.delete(`/property/${id}`),
    search: (params?: { type?: string; priceMin?: number; priceMax?: number }) => client.get<{ properties: Property[] }>('/property', { params }),
    getByOwnerId: (userId: string) => client.get<{ properties: Property[]; total: number }>(`/property/user/${userId}`),
    uploadImage: (id: string, formData: FormData) => {
        return client.post<{ image: string[] }>(`/property/upload-property-images/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    deleteImage: (propertyId: string, imageUrl: string) => client.delete(`/property/${propertyId}/images/${encodeURIComponent(imageUrl)}`),
    requestInquiry: (id: string, data: { name: string; email: string; message: string }) => client.post(`/property/${id}/request`, data),
    dealRequest: (id: string, data: { commissionRate: number; terms: string }) => client.post(`/property/${id}/deal-request`, data),
    acceptDeal: (id: string, data: { agentId: string }) => client.post(`/property/${id}/accept-deal`, data),
};