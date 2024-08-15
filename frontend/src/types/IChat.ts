import { IMessage } from "./IMessage";
import { IUser } from "./IUser";

export interface IChat {
    id: string,
    last_message?: IMessage,
    unseen?: number,
    user: IUser,
    viewed_at?: string,
    created_at: string
}
