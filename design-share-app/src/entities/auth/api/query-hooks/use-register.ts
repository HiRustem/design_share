import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import authService from '../service';
import { IRegisterDto, IAuthResponse } from '../../model/types';

const useRegister = (
  options?: Omit<UseMutationOptions<IAuthResponse, Error, IRegisterDto>, 'mutationFn' | 'mutationKey'>,
) =>
  useMutation({
    mutationFn: (data) => authService.register(data),
    mutationKey: ['auth', 'register'],
    ...options,
  });

export default useRegister;