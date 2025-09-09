import { baseApi } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/config/api';
import { IAuthDto, IAuthResponse, IRegisterDto } from '../model/types';

const login = (dto: IAuthDto) => 
  baseApi.post<IAuthResponse, IAuthDto>(API_ENDPOINTS.AUTH.LOGIN, dto);

const register = (dto: IRegisterDto) =>
  baseApi.post<IAuthResponse, IRegisterDto>(API_ENDPOINTS.AUTH.REGISTER, dto);

const logout = () =>
  baseApi.post<void>(API_ENDPOINTS.AUTH.LOGOUT);

const refreshToken = () =>
  baseApi.post<IAuthResponse>(API_ENDPOINTS.AUTH.REFRESH);

const authService = {
  login,
  register,
  logout,
  refreshToken,
};

export default authService;