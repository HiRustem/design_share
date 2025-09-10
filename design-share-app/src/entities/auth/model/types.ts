export interface IAuthDto {
  email: string;
  password: string;
}

export interface IRegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface IAuthResponse {
  token: string;
  user: IUser;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAuthState {
  token: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
}

export interface IAuthActions {
  setAuth: (token: string, user: IUser) => void;
  logout: () => void;
  updateUser: (user: Partial<IUser>) => void;
}