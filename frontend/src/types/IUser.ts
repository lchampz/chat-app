export interface IUser {
    name: string;
    email: string;
    avatar: string;
    last_login?: string;
    last_access?: string;
}

export interface ISignIn {
    email: string,
    password: string,
}

export interface ISignUp {
    email: string,
    name: string,
    password: string,
    avatar: string
}
