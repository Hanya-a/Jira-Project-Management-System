import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { clearAuthTokens, getAuthTokens, setAuthTokens } from './authTokens';
import { API_ENDPOINTS } from './endpoints';

interface RefreshResponse {
  access: string;
  refresh?: string;
}

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Creates the Axios instance used by the web application.
 * Create it once and reuse it for every API request.
 */
export function createApiClient(baseURL: string): AxiosInstance {
  const apiClient = axios.create({ baseURL });
  const refreshClient = axios.create({ baseURL });

  // Add the access token to every request.
  apiClient.interceptors.request.use((config) => {
    const storedTokens = sessionStorage.getItem('jira-auth-tokens');
    console.log('SESSION STORAGE IN API CLIENT:', storedTokens);
    if (storedTokens) {
      const tokens = JSON.parse(storedTokens);
      config.headers.set(
        'Authorization',
        `Bearer ${tokens.accessToken}`
      );
    }
    return config;
  });
  // If the access token expires, refresh it and retry the request once.
  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const request = error.config as RetryRequestConfig | undefined;
      const currentTokens = getAuthTokens();

      if (
        error.response?.status !== 401 ||
        !request ||
        request._retry ||
        !currentTokens
      ) {
        return Promise.reject(error);
      }

      request._retry = true;

      try {
        const response = await refreshClient.post<RefreshResponse>(
          API_ENDPOINTS.AUTH.REFRESH,
          {
            refresh: currentTokens.refreshToken,
          }
        );

        const nextTokens = {
          accessToken: response.data.access,
          refreshToken: response.data.refresh ?? currentTokens.refreshToken,
        };

        setAuthTokens(nextTokens);

        request.headers.set(
          'Authorization',
          `Bearer ${nextTokens.accessToken}`
        );

        return apiClient(request);
      } catch (refreshError) {
        clearAuthTokens();
        return Promise.reject(refreshError);
      }
    }
  );

  return apiClient;
}

/**
 * Axios instance used throughout the web application.
 */
export const apiClient = createApiClient('http://127.0.0.1:8000');