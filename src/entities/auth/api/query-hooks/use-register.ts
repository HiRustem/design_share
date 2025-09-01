import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import authService from '../service';
import { IAuthResponse, IRegisterDto } from '../../model/types';

const useRegister = (
  options?: Omit<
    UseMutationOptions<IAuthResponse, Error, IRegisterDto>,
    'mutationFn' | 'mutationKey'
  >,
) =>
  useMutation({
    mutationFn: (data) => authService.register(data),
    mutationKey: ['register'],
    ...options,
  });

export default useRegister;
