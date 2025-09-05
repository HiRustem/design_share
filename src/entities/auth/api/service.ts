import { baseApi } from '@/shared/api';
import { IAuthDto, IAuthResponse, IRegisterDto } from '../model/types';

const login = (dto: IAuthDto) => baseApi.post<IAuthResponse, IAuthDto>('/auth/login', dto);

const register = (dto: IRegisterDto) =>
  baseApi.post<IAuthResponse, IRegisterDto>('/auth/register', dto);

const authService = {
  login,
  register,
};

export default authService;
