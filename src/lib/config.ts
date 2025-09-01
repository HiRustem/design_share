export const API_BASE_URL =
  typeof window === 'undefined' ? process.env.BACKEND_URL! : process.env.NEXT_PUBLIC_BACKEND_URL!;
