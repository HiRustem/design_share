import { baseApi } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/config/api';
import { IUser, IUpdateUserDto, IUserProfile } from '../model/types';

const getProfile = () =>
  baseApi.get<IUserProfile>(API_ENDPOINTS.USER.PROFILE);

const updateProfile = (dto: IUpdateUserDto) =>
  baseApi.patch<IUser>(API_ENDPOINTS.USER.UPDATE_PROFILE, dto);

const deleteAccount = () =>
  baseApi.delete(API_ENDPOINTS.USER.DELETE_ACCOUNT);

const userService = {
  getProfile,
  updateProfile,
  deleteAccount,
};

export default userService;