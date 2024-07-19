export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar: string;
  last_login?: Date;
  last_access?: Date;
}

export interface ISignIn {
  email: string;
  password: string;
}

export interface ISanitizeUser {
    name: string;
    email: string;
    avatar: string;
    last_login?: Date | null;
    last_access?: Date | null;
  }