import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import userService from '../service';
import { IUserProfile } from '../../model/types';

const useProfile = (
  options?: Omit<UseQueryOptions<IUserProfile, Error>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => userService.getProfile(),
    ...options,
  });

export default useProfile;