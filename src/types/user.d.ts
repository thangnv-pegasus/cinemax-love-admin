export interface IUser {
  id: number,
  name: string,
  email: string,
  role: number,
}

export interface IUserInfo extends IUser{
  created_at: string | any;
  updated_at: string | any;
  deleted_at: string | any;
}