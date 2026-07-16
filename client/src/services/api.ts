import axios from 'axios';

// Create a centralized Axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Inject tokens here later if we add Auth
api.interceptors.request.use(
    (config) => {
        // e.g., config.headers.Authorization = `Bearer ${token}`
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle global errors centrally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'An unexpected error occurred';
        console.error('[API Error]:', message);
        // We can hook this up to a global toast notification system later
        return Promise.reject(new Error(message));
    }
);

export default api;