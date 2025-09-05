import { API_BASE_URL } from '@/lib/config';
import { processEnv } from '@next/env';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiConfig {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  handleResponse?: <T>(response: Response) => Promise<T>;
  handleError?: (error: unknown) => never;
}

interface ApiError<TError = any> extends Error {
  status?: number;
  data?: TError;
}

function createApi(config: ApiConfig) {
  async function request<TResponse, TBody = unknown, TError = any>(
    method: HttpMethod,
    path: string,
    body?: TBody,
    headers?: Record<string, string>,
    signal?: AbortSignal,
  ): Promise<TResponse> {
    try {
      const response = await fetch(`${config.baseUrl}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...config.defaultHeaders,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal,
      });

      if (!response.ok) {
        let errorData: TError | undefined;
        try {
          errorData = await response.json();
        } catch {}

        const error: ApiError<TError> = new Error(
          `API Error: ${response.status} ${response.statusText}`,
        );
        error.status = response.status;
        error.data = errorData;

        if (config.handleError) config.handleError(error);
        throw error;
      }

      if (config.handleResponse) {
        return config.handleResponse<TResponse>(response);
      }

      return (await response.json()) as TResponse;
    } catch (err) {
      if (config.handleError) config.handleError(err);
      throw err;
    }
  }

  return {
    get: <TResponse, TError = any>(
      path: string,
      headers?: Record<string, string>,
      signal?: AbortSignal,
    ) => request<TResponse, void, TError>('GET', path, undefined, headers, signal),

    post: <TResponse, TBody = unknown, TError = any>(
      path: string,
      body: TBody,
      headers?: Record<string, string>,
      signal?: AbortSignal,
    ) => request<TResponse, TBody, TError>('POST', path, body, headers, signal),

    put: <TResponse, TBody = unknown, TError = any>(
      path: string,
      body: TBody,
      headers?: Record<string, string>,
      signal?: AbortSignal,
    ) => request<TResponse, TBody, TError>('PUT', path, body, headers, signal),

    patch: <TResponse, TBody = unknown, TError = any>(
      path: string,
      body: TBody,
      headers?: Record<string, string>,
      signal?: AbortSignal,
    ) => request<TResponse, TBody, TError>('PATCH', path, body, headers, signal),

    delete: <TResponse = void, TError = any>(
      path: string,
      headers?: Record<string, string>,
      signal?: AbortSignal,
    ) => request<TResponse, void, TError>('DELETE', path, undefined, headers, signal),
  };
}

export const baseApi = createApi({
  baseUrl: API_BASE_URL,
  defaultHeaders: { 'Content-Type': 'application/json' },
});
