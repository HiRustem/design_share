export interface IUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateUserDto {
  name?: string;
  email?: string;
}

export interface IUserProfile extends IUser {
  projectsCount: number;
  totalStorageUsed: number;
}