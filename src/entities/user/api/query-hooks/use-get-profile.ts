import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import profileService from '../service';

interface IUseGetProfile {
  token: string | null;
  options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>;
}

const useGetProfile = ({ token, options }: IUseGetProfile) =>
  useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(token),
    ...options,
  });

export default useGetProfile;
