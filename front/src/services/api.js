import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Endereço do Django
});

// Interceptor (Critério 18): Adiciona o Token automaticamente em toda requisição
api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
