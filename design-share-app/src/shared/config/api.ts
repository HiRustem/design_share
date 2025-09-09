export const API_BASE_URL =
  typeof window === 'undefined' 
    ? process.env.BACKEND_URL! 
    : process.env.NEXT_PUBLIC_BACKEND_URL!;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    DELETE_ACCOUNT: '/user/account',
  },
  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects',
    GET: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
    UPLOAD: '/projects/upload',
    PROCESS: (id: string) => `/projects/${id}/process`,
  },
} as const;