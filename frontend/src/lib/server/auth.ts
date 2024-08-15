"use server"

import { SignInData, SignUpData } from "@/lib/schemas/authSchema"
import { signIn, signUp } from "@/lib/requests"
import { cookies } from "next/headers";
import { IUser } from "@/types/IUser";
import { redirect } from "next/navigation";


export const handleSignIn = async (data: SignInData) => {
    const response = await signIn(data);

    if(response.data) {
        cookies().set({
            name: process.env.NEXT_PUBLIC_AUTH_KEY as string,
            value: response.data.token!,
            httpOnly: true,
            maxAge: 86400 * 7 //7 days
        })
    }

    return response;
}

export const handleSignUp = async (data: SignUpData) => await signUp(data);

export const handleGetUser = async () => {
    const authCookie = cookies().get(process.env.NEXT_PUBLIC_AUTH_KEY as string)?.value;

    const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/user', {
        headers: {
            Authorization: `Bearer ${authCookie}`
        }
    });

    const userData = await response.json();

    if(userData) return userData as IUser;
    return null;
}

export const handleSignOut = () => {
    cookies().delete(process.env.NEXT_PUBLIC_AUTH_KEY as string);
    redirect('/auth/signIn');
}