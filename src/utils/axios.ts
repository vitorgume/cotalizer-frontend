import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    const rotasPublicas = ['/usuarios/cadastro', '/login'];

    const isRotaPublica = rotasPublicas.some((rota) => config.url?.includes(rota));

    if (token && !isRotaPublica) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});


api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // localStorage.removeItem("token");
            // localStorage.removeItem("id-usuario");
            // window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default api;