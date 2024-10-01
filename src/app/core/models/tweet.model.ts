import { environment } from "src/environments/environment";
import { User } from "./usuario.model";

const url = environment.url;

interface _userTweet{
    _id: string;
    name: string;
    username: string;
    img: string;
}

export class Tweet{

    constructor(
        public _id: string,
        public message: string,
        public userId: User,
        public createdAt: string | number,
        public img?: string,
        public reply?: boolean,
        public replyTo?: string,
        public liked?: boolean,
        public replies?: [],
        public likes?: [],
        public retweets?: [],
        public poll?: boolean,
        public option1?: {'choice': string, vote: number, userVotes: string[]},
        public option2?: {'choice2': string, vote: number, userVotes: string[]},
        public expire?: number | string ,

    ){}

    get imagenUser(){
        if ( this.userId && this.userId.img ) {            
            return this.userId.img;
        } else {
            return `${ url }/upload/users/no`;
        }
    }

    get imgTweet(){
        if ( this.img ) {
            return this.img;
        } else {
            return;
        }
        
    }

    get name(){
        return this.userId.firstName;
    }

}