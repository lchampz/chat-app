import { NewChatData } from "@/lib/schemas/chatSchema";
import { SignInData, SignUpData } from "@/lib/schemas/authSchema";
import { IResponse } from "@/types/IApi";
import { api } from "./api";
import { ISaveMessage } from "@/types/IMessage";

export const signIn = async (data: SignInData) => {
  return await api<IResponse>({
    endpoint: "signIn",
    method: "POST",
    withAuth: false,
    data,
  });
};

export const signUp = async (data: SignUpData) => {
  return await api<IResponse>({
    endpoint: "signUp",
    method: "POST",
    withAuth: false,
    data,
  });
};

export const getChats = async () => await api<IResponse>({ endpoint: "chats" });
export const createChat = async (data: NewChatData) => await api<IResponse>({ endpoint: "chat/create", method: "POST", data });
export const deleteChat = async (chatId: string) => await api<IResponse>({endpoint: `chat/delete/${chatId}`, method: "DELETE"});
export const getChatMessage = async (chatId: string) => await api<IResponse>({endpoint: `chat/${chatId}`});
export const createChatMessage = async (data: ISaveMessage) => await api<IResponse>({endpoint: `message/save`, method: "POST", data})