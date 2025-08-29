import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_URL = (import.meta as any)?.env?.VITE_API_URL ?? 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
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

let isRefreshing = false;
let queue: Array<() => void> = [];

function isMutating(method?: string) {
  const m = (method || '').toLowerCase();
  return m === 'post' || m === 'put' || m === 'patch' || m === 'delete';
}

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([$?*|{}\]\\^\[\]\+\-])/g, '\\$1') + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}

async function primeCsrfCookie() {
  try {
    await api.get('/csrf', { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
  } catch {
    // Se não existir /csrf, ignore silenciosamente
  }
}

api.interceptors.request.use(async (config) => {
  if (accessToken && !config.headers?.Authorization) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${accessToken}`;
  }

  if (isMutating(config.method)) {
    const token = getCookie('XSRF-TOKEN');
    if (token && !(config.headers as any)?.['X-XSRF-TOKEN']) {
      config.headers = config.headers ?? {};
      (config.headers as any)['X-XSRF-TOKEN'] = token;
    }
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean; _csrfRetry?: boolean });

    if (status === 401 && !original?._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const r = await api.post('/auth/refresh');
          const access = (r.data as any)?.dado?.accessToken ?? (r.data as any)?.accessToken;
          if (access) setAccessToken(access);
        } catch {
          setAccessToken(undefined);
          queue = [];
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
          queue.forEach((resume) => resume());
          queue = [];
        }
      }

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

    if (
      status === 403 &&
      isMutating(original?.method) &&
      !original?._csrfRetry
    ) {
      const hasHeader = !!(original.headers as any)?.['X-XSRF-TOKEN'];
      const hasCookie = !!getCookie('XSRF-TOKEN');

      if (!hasCookie || !hasHeader) {
        try {
          await primeCsrfCookie(); 
          original._csrfRetry = true;

          const token = getCookie('XSRF-TOKEN');
          if (token) {
            original.headers = original.headers ?? {};
            (original.headers as any)['X-XSRF-TOKEN'] = token;
          }

          return api.request(original);
        } catch {
          // cai para o reject padrão
        }
      }
    }

    return Promise.reject(error);
  }
);

export async function hydrateAccessToken() {
  try {
    const r = await api.post('/auth/refresh');
    const access =
      (r.data as any)?.dado?.accessToken ?? (r.data as any)?.accessToken;
    if (access) setAccessToken(access);
  } catch {
    setAccessToken(undefined);
  }
}
