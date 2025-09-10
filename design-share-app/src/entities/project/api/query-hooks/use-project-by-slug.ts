import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import projectService from '../service';
import { IProjectWithWatermark } from '../../model/types';

const useProjectBySlug = (
  slug: string,
  options?: Omit<UseQueryOptions<IProjectWithWatermark, Error>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: ['projects', 'slug', slug],
    queryFn: () => projectService.getProjectBySlug(slug),
    enabled: !!slug,
    ...options,
  });

export default useProjectBySlug;