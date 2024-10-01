import { environment } from "src/environments/environment";

const url = environment.url;

export class User{
    constructor(

        public uid: string,
        public firstName: string,
        public lastName: string,
        public username: string,
        public email: string,
        public createdAt: string,
        public bio?: string,
        public password?: string,
        public img?: string,
        public imgPort?: string,
        public followers?: [],
        public followings?: [],
        public privacity?: string,
        public _id?: string,
        public location?: string,
        public website?: string
    ){}

    get imagenUrl(): string{
        if ( !this.img ) {
            return `${ url }/upload/users/no`
        } else {
            // return `${ url }/upload/users/${ this.img }`;
            return this.img;
        }
    }

    get imagenPortada(): string{
            // return `${ url }/upload/usersP/${ this.imgPort }`
        if ( !this.imgPort ) {
            return `${ url }/upload/users/no`
        } else {
            // return `${ url }/upload/users/${ this.img }`;
            return this.imgPort;
        }
    }
}