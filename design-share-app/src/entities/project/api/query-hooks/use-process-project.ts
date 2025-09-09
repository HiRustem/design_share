import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import projectService from '../service';
import { IProject, IWatermarkConfig } from '../../model/types';

interface ProcessProjectDto {
  id: string;
  watermarkConfig?: IWatermarkConfig;
}

const useProcessProject = (
  options?: Omit<UseMutationOptions<IProject, Error, ProcessProjectDto>, 'mutationFn' | 'mutationKey'>,
) =>
  useMutation({
    mutationFn: ({ id, watermarkConfig }) => projectService.processProject(id, watermarkConfig),
    mutationKey: ['projects', 'process'],
    ...options,
  });

export default useProcessProject;