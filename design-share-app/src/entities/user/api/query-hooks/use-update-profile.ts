import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import userService from '../service';
import { IUpdateUserDto, IUser } from '../../model/types';

const useUpdateProfile = (
  options?: Omit<UseMutationOptions<IUser, Error, IUpdateUserDto>, 'mutationFn' | 'mutationKey'>,
) =>
  useMutation({
    mutationFn: (data) => userService.updateProfile(data),
    mutationKey: ['user', 'update-profile'],
    ...options,
  });

export default useUpdateProfile;