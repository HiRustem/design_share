import { baseApi } from '@/shared/api';

const getProfile = (token: string | null) =>
  baseApi.get('/user', { Authorization: `Bearer ${token}` });

const profileService = {
  getProfile,
};

export default profileService;
