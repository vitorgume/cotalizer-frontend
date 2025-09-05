// api.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Cliente padrão para a API
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  // Estes dois não atrapalham, mas *não* serão suficientes em cross-site
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

// Cliente “limpo” para o refresh, evitando interceptors em loop
const refreshApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

/** ===== Access Token ===== */
let accessToken: string | null = null;

export function setAccessToken(token?: string) {
  accessToken = token ?? null;
  if (accessToken) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

/** ===== CSRF Token (em memória) ===== */
let csrfToken: string | null = null;
let csrfPromise: Promise<string | null> | null = null;

async function fetchCsrfToken(): Promise<string | null> {
  if (!csrfPromise) {
    csrfPromise = api
      .get('/csrf') // backend deve retornar { token, headerName, parameterName }
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

/** ===== Helpers ===== */
function isMutating(method?: string) {
  const m = (method || '').toLowerCase();
  return m === 'post' || m === 'put' || m === 'patch' || m === 'delete';
}

/** ===== Refresh de Access Token (única promise) ===== */
let refreshPromise: Promise<string | undefined> | null = null;

async function refreshAccessToken(): Promise<string | undefined> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const r = await refreshApi.post('/auth/refresh'); // CSRF ignorado no backend
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

/** ===== Interceptor de Request =====
 * - Injeta Authorization
 * - Garante header X-XSRF-TOKEN em mutações (buscando /csrf se necessário)
 */
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

/** ===== Interceptor de Response =====
 * 401: tenta refresh (exceto em /auth/refresh|/auth/login|/csrf)
 * 403 em mutação: refaz /csrf e repete 1 vez
 */
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as (InternalAxiosRequestConfig & {
      _retry?: boolean;
      _csrfRetry?: boolean;
    });
    const url = (original?.url || '') as string;
    const isAuthRoute =
      url.includes('/auth/refresh') ||
      url.includes('/auth/login') ||
      url.includes('/csrf');

    if (status === 401 && !original?._retry && !isAuthRoute) {
      original._retry = true;
      try {
        const access = await refreshAccessToken();
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

    if (status === 403 && isMutating(original?.method) && !original?._csrfRetry) {
      original._csrfRetry = true;
      await fetchCsrfToken();
      if (csrfToken) {
        original.headers = original.headers ?? {};
        (original.headers as any)['X-XSRF-TOKEN'] = csrfToken;
      }
      return api.request(original);
    }

    return Promise.reject(error);
  }
);

/** ===== Boot helpers =====
 * Chame isso no início da app (ex.: useEffect no App) para tentar já hidratar o AT.
 * Se quiser, pode chamar também fetchCsrfToken() uma vez para “aquecer” o CSRF.
 */
export async function hydrateAccessToken() {
  try {
    const access = await refreshAccessToken();
    if (!access) setAccessToken(undefined);
  } catch {
    setAccessToken(undefined);
  }
}

// Opcional: aquecer o CSRF logo no boot
export async function primeCsrfCookie() {
  await fetchCsrfToken();
}