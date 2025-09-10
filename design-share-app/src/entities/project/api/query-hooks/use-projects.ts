import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import projectService from '../service';
import { IProjectListResponse } from '../../model/types';

const useProjects = (
  page = 1,
  limit = 10,
  options?: Omit<UseQueryOptions<IProjectListResponse, Error>, 'queryKey' | 'queryFn'>,
) =>
  useQuery({
    queryKey: ['projects', 'list', page, limit],
    queryFn: () => projectService.getProjects(page, limit),
    ...options,
  });

export default useProjects;