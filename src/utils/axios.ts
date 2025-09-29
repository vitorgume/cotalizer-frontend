// utils/api.ts
import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { notificarErro } from '../utils/notificacaoUtils';

const API_URL = import.meta.env.VITE_API_URL;

/** ==============================
 * Cliente padrão para a API
 * ============================== */
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

/** Cliente “limpo” para o refresh, evitando interceptors em loop */
const refreshApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

/** ==============================
 * Access Token
 * ============================== */
let accessToken: string | null = null;

export function setAccessToken(token?: string) {
  accessToken = token ?? null;
  if (accessToken) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

/** ==============================
 * CSRF Token (em memória)
 * ============================== */
let csrfToken: string | null = null;
let csrfPromise: Promise<string | null> | null = null;

async function fetchCsrfToken(): Promise<string | null> {
  if (!csrfPromise) {
    csrfPromise = api
      .get('/csrf') 
      .then((r) => {
        const t = (r.data as any)?.token ?? null;
        csrfToken = t;
        return t;
      })
      .catch(() => {
        csrfToken = null;
        return null;
      })
      .finally(() => {
        csrfPromise = null;
      });
  }
  return csrfPromise;
}

/** ==============================
 * Helpers
 * ============================== */
function isMutating(method?: string) {
  const m = (method || '').toLowerCase();
  return m === 'post' || m === 'put' || m === 'patch' || m === 'delete';
}

/** ==============================
 * Refresh de Access Token (única promise)
 * ============================== */
let refreshPromise: Promise<string | undefined> | null = null;

async function refreshAccessToken(): Promise<string | undefined> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const r = await refreshApi.post('/auth/refresh'); // CSRF ignorado no backend
      const access = (r.data as any)?.dado?.accessToken ?? (r.data as any)?.accessToken;
      if (access) setAccessToken(access);
      return access;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/** ==============================
 * Normalização de erros + notificação
 * ============================== */
export type ApiError = {
  status?: number;
  code?: string;
  message: string;
  details?: unknown;
  url?: string;
  method?: string;
};

function normalizeAxiosError(err: AxiosError): ApiError {
  const status = err.response?.status;
  const data: any = err.response?.data;
  const messageFromServer =
    (typeof data === 'object' && (data?.mensagem || data?.message || data?.erro)) ||
    (typeof data === 'string' ? data : undefined);

  const msg =
    messageFromServer ||
    (status ? `Erro ${status}: ${err.message}` : `Falha de conexão: ${err.message || 'verifique sua internet'}`);

  return {
    status,
    code: (err.code as string) || undefined,
    message: msg,
    details: data,
    url: err.config?.url,
    method: err.config?.method,
  };
}

let notifyLock = false; // evita spam de toasts em rajada
function notifyOnce(error: ApiError) {
  if (notifyLock) return;
  notifyLock = true;
  notificarErro(error.message);
  setTimeout(() => (notifyLock = false), 800);
}

/** ==============================
 * Interceptor de Request
 * - Injeta Authorization
 * - Garante X-XSRF-TOKEN em mutações
 * ============================== */
api.interceptors.request.use(async (config) => {
  if (accessToken && !config.headers?.Authorization) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${accessToken}`;
  }

  if (isMutating(config.method)) {
    if (!csrfToken) await fetchCsrfToken(); // primeira mutação busca o token
    if (csrfToken) {
      config.headers = config.headers ?? {};
      (config.headers as any)['X-XSRF-TOKEN'] = csrfToken;
    }
  }

  return config;
});

/** ==============================
 * Interceptor de Response
 *  - 401: tenta refresh (exceto /auth/refresh|/auth/login|/csrf) e repete 1x
 *  - 403 mutações: refaz /csrf e repete 1x
 *  - Demais: normaliza e notifica
 * ============================== */
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as (InternalAxiosRequestConfig & {
      _retry?: boolean;
      _csrfRetry?: boolean;
    });
    const url = (original?.url || '') as string;
    const isAuthRoute = url.includes('/auth/refresh') || url.includes('/auth/login') || url.includes('/csrf');

    // 401 -> tentar refresh (uma vez)
    if (status === 401 && !original?._retry && !isAuthRoute) {
      original._retry = true;
      try {
        const access = await refreshAccessToken();
        if (!access) {
          setAccessToken(undefined);
          const parsed = normalizeAxiosError(error);
          notifyOnce(parsed);
          return Promise.reject(parsed);
        }
        return api.request(original);
      } catch {
        setAccessToken(undefined);
        const parsed = normalizeAxiosError(error);
        notifyOnce(parsed);
        return Promise.reject(parsed);
      }
    }

    // 403 em mutação -> tentar renovar CSRF e repetir uma vez
    if (status === 403 && isMutating(original?.method) && !original?._csrfRetry) {
      original._csrfRetry = true;
      await fetchCsrfToken();
      if (csrfToken) {
        original.headers = original.headers ?? {};
        (original.headers as any)['X-XSRF-TOKEN'] = csrfToken;
      }
      return api.request(original);
    }

    // Qualquer outro erro -> normaliza e notifica
    const parsed = normalizeAxiosError(error);
    notifyOnce(parsed);
    return Promise.reject(parsed);
  }
);

/** ==============================
 * Helpers públicos
 * ============================== */

export async function hydrateAccessToken() {
  try {
    const access = await refreshAccessToken();
    if (!access) setAccessToken(undefined);
  } catch {
    setAccessToken(undefined);
  }
}

export async function primeCsrfCookie() {
  await fetchCsrfToken();
}

const RT_KEY = 'rt';

export function getRefreshToken(): string | null {
  return localStorage.getItem(RT_KEY);
}
export function setRefreshToken(t?: string) {
  if (t && t.length) localStorage.setItem(RT_KEY, t);
  else localStorage.removeItem(RT_KEY);
}

export async function serverLogout() {
  setAccessToken(undefined);
  setRefreshToken(undefined);
}
