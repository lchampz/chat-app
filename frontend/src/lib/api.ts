"use server";

import { IApiError, IResponse } from "@/types/IApi";
import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";

type Props = {
  endpoint: string;
  method?: "GET" | "POST" | "DELETE";
  data?: object;
  withAuth?: boolean;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/";

export const api = async <TypeResponse>({
  endpoint,
  method = "GET",
  data,
  withAuth = true,
}: Props) => {
  const instance = axios.create({ baseURL: BASE_URL });

  if (withAuth) {
    const session = cookies().get(process.env.NEXT_PUBLIC_AUTH_KEY as string);

    if (session?.value) {
      instance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${session.value}`;
    }
  }

  try {
    const request = await instance<TypeResponse>(endpoint, {
      method,
      params: method == "GET" && data,
      data: method != "GET" && data,
    });

    return { data: request.data };
  } catch (error) {
    const e = error as AxiosError<IApiError>;

    return {
      error: {
        message: e.response?.data.detail ?? "Ocorreu um erro inesperado.",
      },
    };
  }
};
