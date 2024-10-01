import { Tweet } from "@core/models/tweet.model";
import { User } from "@core/models/usuario.model";

export interface Notification{
    reaction: string;
    tweet: Tweet;
    tweetOwner: string;
    userId: User;
    viewed: boolean;
    _id: string;
}