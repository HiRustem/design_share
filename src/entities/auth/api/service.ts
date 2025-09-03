import { authApi } from '@/shared/api';
import { IAuthDto, IAuthResponse, IRegisterDto } from '../model/types';

const login = (dto: IAuthDto) => authApi.post<IAuthResponse, IAuthDto>('/auth/login', dto);

const register = (dto: IRegisterDto) =>
  authApi.post<IAuthResponse, IRegisterDto>('/auth/register', dto);

const authService = {
  login,
  register,
};

export default authService;
