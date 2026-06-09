import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Your Laravel Backend URL
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// 🛡️ THE FRONTEND BOUNCER (Interceptor)
// Right before any request leaves the frontend, this intercepts it and adds the token.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;