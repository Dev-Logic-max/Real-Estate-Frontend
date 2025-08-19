import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010/api';

const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Add token except for public endpoints
client.interceptors.request.use(
    (config) => {
        const publicEndpoints = [
            '/auth/email/login',
            '/auth/email/register',
            '/auth/refresh',
            '/auth/forgot-password',
        ];
        if (!publicEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        toast.error('Request failed!');
        return Promise.reject(error);
    }
);

// Response interceptor: Handle errors globally
client.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong!';
        toast.error(message);
        return Promise.reject(error);
    }
);

export default client;