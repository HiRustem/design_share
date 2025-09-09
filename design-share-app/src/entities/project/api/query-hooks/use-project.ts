import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import projectService from '../service';
import { IProject } from '../../model/types';

const useProject = (
  id: string,
  options?: Omit<UseQueryOptions<IProject, Error>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: ['projects', 'detail', id],
    queryFn: () => projectService.getProject(id),
    enabled: !!id,
    ...options,
  });

export default useProject;