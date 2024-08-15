export interface IMessage {
    id: string,
    body: string,
    sender_id: string,
    viewed_at?: string,
    created_at: string,
}

export interface IMarkMessageAsSeen {
    id: string
}

export interface ISaveMessage {
    body: string,
    attachment_code: number,
    chat_id: string
}