import { baseApi } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/config/api';
import { 
  IProject, 
  ICreateProjectDto, 
  IUpdateProjectDto, 
  IProjectListResponse,
  IProjectWithWatermark 
} from '../model/types';

const getProjects = (page = 1, limit = 10) =>
  baseApi.get<IProjectListResponse>(`${API_ENDPOINTS.PROJECTS.LIST}?page=${page}&limit=${limit}`);

const getProject = (id: string) =>
  baseApi.get<IProject>(API_ENDPOINTS.PROJECTS.GET(id));

const createProject = (dto: ICreateProjectDto) => {
  const formData = new FormData();
  formData.append('name', dto.name);
  formData.append('file', dto.file);

  return baseApi.post<IProject>('/projects/upload', formData, {
    'Content-Type': 'multipart/form-data',
  });
};

const updateProject = (id: string, dto: IUpdateProjectDto) =>
  baseApi.patch<IProject>(API_ENDPOINTS.PROJECTS.UPDATE(id), dto);

const deleteProject = (id: string) =>
  baseApi.delete(API_ENDPOINTS.PROJECTS.DELETE(id));

const processProject = (id: string, watermarkConfig?: any) =>
  baseApi.post<IProject>(API_ENDPOINTS.PROJECTS.PROCESS(id), { watermarkConfig });

const getProjectBySlug = (slug: string) =>
  baseApi.get<IProjectWithWatermark>(`/projects/slug/${slug}`);

const projectService = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  processProject,
  getProjectBySlug,
};

export default projectService;