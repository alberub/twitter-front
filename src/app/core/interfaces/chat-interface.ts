import { User } from "@core/models/usuario.model";
import { Message } from "./messages-interface";

export interface Chat{
    
    members: User[],
    messages: Message[],
    readed: boolean,
    _id: number

}