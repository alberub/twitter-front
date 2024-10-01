import { User } from "@core/models/usuario.model"

export interface Message{
    message: string,
    from: string,
    createdAt?: Date,
    readed?: boolean,
    _id: string
}