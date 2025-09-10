export type ProjectStatus = 'processing' | 'ready' | 'error';

export interface IProject {
  id: string;
  name: string;
  status: ProjectStatus;
  slug: string;
  originalFileName: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  viewUrl?: string;
  downloadUrl?: string;
}

export interface ICreateProjectDto {
  name: string;
  file: File;
}

export interface IUpdateProjectDto {
  name?: string;
}

export interface IProjectListResponse {
  projects: IProject[];
  total: number;
  page: number;
  limit: number;
}

export interface IWatermarkConfig {
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  angle: number;
  position: {
    x: number;
    y: number;
  };
  pattern: 'single' | 'diagonal' | 'grid' | 'center';
}

export interface IProjectWithWatermark extends IProject {
  watermarkConfig?: IWatermarkConfig;
}