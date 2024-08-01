interface INewChat {
    sender: string,
    receiver: string
}

interface ISaveMessage {
    body: string,
    attachment_code: number,
    chat_id: string,
    sender_id: string
}