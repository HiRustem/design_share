import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import projectService from '../service';
import { ICreateProjectDto, IProject } from '../../model/types';

const useCreateProject = (
  options?: Omit<UseMutationOptions<IProject, Error, ICreateProjectDto>, 'mutationFn' | 'mutationKey'>,
) =>
  useMutation({
    mutationFn: (data) => projectService.createProject(data),
    mutationKey: ['projects', 'create'],
    ...options,
  });

export default useCreateProject;