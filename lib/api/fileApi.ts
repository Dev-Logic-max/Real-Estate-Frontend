import api from './axios';
import { AxiosResponse } from 'axios';

export const fileApi = {
  uploadFile: (file: File): Promise<AxiosResponse<{ file: { id: string; path: string } }>> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadImage: (image: File): Promise<AxiosResponse<{ image: { id: string; path: string } }>> => {
    const formData = new FormData();
    formData.append('image', image); // Adjust field name if needed
    return api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};