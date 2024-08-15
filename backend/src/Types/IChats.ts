import { Chats } from "@prisma/client"

export interface INewChat {
    sender: string,
    receiver: string
}

export interface ISaveMessage {
    body: string,
    attachment_code: number,
    chat_id: string,
    sender_id: string
}

export interface IChat {
    chats: Chats[],
    unseen_count: number
}