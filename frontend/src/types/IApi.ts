export interface IResponse {
    status: boolean,
    message?: string,
    token?: string
}

export interface IApiError {
    detail: string
}