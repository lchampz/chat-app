import { getChats } from "@/lib/requests";
import { useAuthStore } from "@/stores/authStore";
import { useChatStore } from "@/stores/chatStore";
import { IChat, IUpdateChatEvent } from "@/types/IChat";
import { useEffect, useState } from "react";
import { socket } from "../Providers";

type Props = {
  variant?: "mobile" | "desktop";
};

export const LeftSide = ({ variant = "desktop" }: Props) => {
  const {
    chat: currentChat,
    chats,
    setChats,
    setChat,
    setShowNewChat,
  } = useChatStore();
  const { user } = useAuthStore();

  const [queryInput, setQueryInput] = useState("");
  const [chatsFiltered, setChatsFiltered] = useState<IChat[]>([]);

  const handleGetChats = async () => {
    const response = await getChats();

    if (response.data) {
      setChats(response.data.chats);
    }
  };

  const handleFilterChats = () => {
    if (!chats) return;

    setChatsFiltered(
      chats.filter((chat) =>
        chat.user.name.toLowerCase().includes(queryInput.toLowerCase())
      )
    );
  };

  useEffect(() => {
    handleFilterChats();
  }, []);

  useEffect(() => {
    if (!queryInput && chats) setChatsFiltered(chats);
  }, [chats]);

  useEffect(() => {
    const handleUpdateChat = (data: IUpdateChatEvent) => {
        if(user && data.query.users.includes(user.id)) handleGetChats();
    }

    socket.on("update_chat", handleUpdateChat);

    return () => {
        socket.off("update_chat", handleUpdateChat);
    }
  }, [currentChat])
};
