import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import authService from '../service';
import { IAuthDto, IAuthResponse } from '../../model/types';

const useLogin = (
  options?: Omit<UseMutationOptions<IAuthResponse, Error, IAuthDto>, 'mutationFn' | 'mutationKey'>,
) =>
  useMutation({
    mutationFn: (data) => authService.login(data),
    mutationKey: ['auth', 'login'],
    ...options,
  });

export default useLogin;