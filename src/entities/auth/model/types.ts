export interface IAuthDto {
  email: string;
  password: string;
}

export type IRegisterDto = { name?: string } & IAuthDto;

export interface IAuthResponse {
  token: string;
}
