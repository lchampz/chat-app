import { IChat } from "@/types/IChat";
import { IMessage } from "@/types/IMessage";
import { create } from "zustand";

export type ChatState = {
  showNewChat: boolean;
  chats: IChat[] | null;
  chat: IChat | null;
  chatMessages: IMessage[] | null;
  loading: boolean;
  showChatList: boolean;
};

export type ChatAction = {
  setShowNewChat: (show: boolean) => void;
  setShowChatList: (show: boolean) => void;
  setChat: (chat: IChat | null) => void;
  setChatMessages: (messages: IMessage[] | null) => void;
  setChats: (chats: IChat[] | null) => void;
  setLoading: (loading: boolean) => void;
};

export type ChatStore = ChatState & ChatAction;

export const useChatStore = create<ChatStore>((set, get) => ({
  showNewChat: false,
  chats: null,
  chat: null,
  chatMessages: null,
  loading: false,
  showChatList: false,

  setShowNewChat: (show) => set({ showNewChat: show }),
  setShowChatList: (show) => set({ showChatList: show }),
  setChat: (chat) =>
    chat?.id != get().chat?.id && set({ chat, chatMessages: null }),
  setChatMessages: (msgs) => set({ chatMessages: msgs }),
  setChats: (chats) => set({ chats: chats }),
  setLoading: (loading) => set({ loading }),
}));
