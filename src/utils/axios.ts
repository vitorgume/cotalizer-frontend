import axios, { AxiosError, type InternalAxiosRequestConfig  } from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true, 
});

let accessToken: string | null = null;

export function setAccessToken(token?: string) {
  accessToken = token ?? null;
  if (accessToken) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

// —— Interceptor 401 → tenta refresh e repete a chamada uma vez ——
let isRefreshing = false;
let queue: Array<() => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (status === 401 && !original?._retry) {
      original._retry = true;

      // garante 1 refresh por vez
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // seu backend retorna ResponseDto<AcessTokenResponseDto>
          const r = await api.post("/auth/refresh");
          const access =
            // tenta achar o token em diferentes formatos
            (r.data as any)?.dado?.accessToken ??
            (r.data as any)?.accessToken;

          if (access) setAccessToken(access);
        } catch {
          setAccessToken(undefined);
          queue = [];
          // opcional: redirecionar para /login aqui
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
          queue.forEach((resume) => resume());
          queue = [];
        }
      }

      // espera o refresh terminar e re-tenta a request original
      return new Promise((resolve, reject) => {
        queue.push(async () => {
          try {
            resolve(api.request(original));
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    return Promise.reject(error);
  }
);

// —— Hidrata access token ao iniciar o app (chame em main.tsx) ——
export async function hydrateAccessToken() {
  try {
    const r = await api.post("/auth/refresh");
    const access =
      (r.data as any)?.dado?.accessToken ??
      (r.data as any)?.accessToken;
    if (access) setAccessToken(access);
  } catch {
    setAccessToken(undefined);
  }
}