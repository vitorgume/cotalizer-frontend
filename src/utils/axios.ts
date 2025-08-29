import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

const refreshApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
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

function isMutating(method?: string) {
  const m = (method || '').toLowerCase();
  return m === 'post' || m === 'put' || m === 'patch' || m === 'delete';
}

// opcional: prime o cookie de CSRF no boot da app
export async function primeCsrfCookie() {
  try { await api.get('/csrf'); } catch {}
}

// ÚNICA promise de refresh em andamento (evita corrida)
let refreshPromise: Promise<string | undefined> | null = null;
async function refreshAccessToken(): Promise<string | undefined> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const r = await refreshApi.post('/auth/refresh'); // se não tiver cookie → 401 aqui
      const access =
        (r.data as any)?.dado?.accessToken ?? (r.data as any)?.accessToken;
      if (access) setAccessToken(access);
      return access;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// Interceptor de request: injeta Authorization e header XSRF quando precisar
api.interceptors.request.use((config) => {
  if (accessToken && !config.headers?.Authorization) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${accessToken}`;
  }

  // axios já usa xsrfCookieName/xsrfHeaderName, então isso é opcional
  return config;
});

// Interceptor de response: tenta refresh só quando apropriado
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean });
    const url = (original?.url || '') as string;

    // Nunca tente refresh no próprio refresh/login/csrf
    const isAuthRoute = url.includes('/auth/refresh') || url.includes('/auth/login') || url.includes('/csrf');

    if (status === 401 && !original?._retry && !isAuthRoute) {
      original._retry = true;
      try {
        const access = await refreshAccessToken(); // sem cookie → 401 → cai no catch
        if (!access) {
          setAccessToken(undefined);
          return Promise.reject(error);
        }
        return api.request(original);
      } catch {
        setAccessToken(undefined);
        return Promise.reject(error);
      }
    }

    // CSRF: se deu 403 em mutação, busca cookie e repete UMA vez
    if (status === 403 && isMutating(original?.method) && !original?._retry) {
      try {
        original._retry = true;
        await primeCsrfCookie();
        return api.request(original);
      } catch {
        // segue para o reject normal
      }
    }

    return Promise.reject(error);
  }
);

// No boot da app, você pode só *tentar* hidratar sem quebrar a UI:
export async function hydrateAccessToken() {
  try {
    const access = await refreshAccessToken(); // usa refreshApi (sem loops)
    if (!access) setAccessToken(undefined);
  } catch {
    setAccessToken(undefined);
  }
}
