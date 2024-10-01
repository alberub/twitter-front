import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from '@core/interfaces/notification-interface';
import { Tweet } from '@core/models/tweet.model';
import { User } from '@core/models/usuario.model';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  public user!: User;
  public userById!: User;
  public sameUser: boolean = false;
  public userForModal$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public updateProfile$: Subject<any> = new Subject<any>(); 
  public newNotification$: Subject<number> = new Subject<number>();

  constructor( private http: HttpClient ) {
    
  }

  tokenValidate(): Observable<boolean>{

    return this.http.get(`${ url }/login/renew` )
      .pipe(
        map( (resp: any ) => {
 
          const { uid, 
                  firstName, 
                  lastName, 
                  username, 
                  email, 
                  createdAt, 
                  bio, 
                  password, 
                  img, 
                  imgPort, 
                  followers, 
                  followings, 
                  privacity, 
                  _id, 
                  location, 
                  website } = resp.usuario;

          this.user = new User( uid, firstName, lastName, username, email, createdAt, bio, '', img, imgPort, followers, followings, privacity, _id, location, 
                              );          

          localStorage.setItem('token', resp.token);

          return true;

        }), catchError( err => of( false ))
      )

  }

  getUserById( id: string ){
    return this.http.get( `${ url }/users/${ id }` )
      .pipe(
        map( (resp: any)  => { 
          
          const { uid, 
                  firstName, 
                  lastName, 
                  username, 
                  email, 
                  createdAt, 
                  bio, 
                  password, 
                  img, 
                  imgPort, 
                  followers, 
                  followings, 
                  privacity, 
                  _id, 
                  location, 
                  website } = resp;
          
          const userById = new User( uid, 
                firstName, 
                lastName, 
                username, 
                email, 
                createdAt, 
                bio, 
                '', 
                img, 
                imgPort, 
                followers, 
                followings, 
                privacity, 
                _id, 
                location, 
                website );

          return userById;

        })
      )

  }

  getUserModalHover( id: string ){

    return this.http.get( `${ url }/users/${ id }`)
      .pipe(
        map( (resp: any)  => { 
                    
          const { uid, 
                  firstName, 
                  lastName, 
                  username, 
                  email, 
                  createdAt, 
                  bio, 
                  password, 
                  img, 
                  imgPort, 
                  followers, 
                  followings, 
                  privacity, 
                  _id, 
                  location, 
                  website } = resp;
          
          const userById = new User( uid, 
                                     firstName, 
                                     lastName, 
                                     username, 
                                     email, 
                                     createdAt, 
                                     bio, 
                                     '', 
                                     img, 
                                     imgPort, 
                                     followers, 
                                     followings, 
                                     privacity, 
                                     _id, 
                                     location, 
                                     website );

          return userById


        })
      )

  }

  getDataProfile( tipo:'tweets' | 'likes' | 'with_replies' | 'media' | 'followers' | 'followings' , username: string  ){    
    
    return this.http.get<{ ok: boolean, resultado: Tweet[], users: User[], user: User }>( `${ url }/tweets/${ username }/${ tipo }?desde=0`)
           .pipe(
             map( resp => {          
              const getData = resp.resultado.map( tweet => new Tweet( tweet._id, 
                                                                      tweet.message, 
                                                                      tweet.userId, 
                                                                      tweet.createdAt, 
                                                                      tweet.img, 
                                                                      tweet.reply,
                                                                      tweet.replyTo, 
                                                                      tweet.liked, 
                                                                      tweet.replies, 
                                                                      tweet.likes, 
                                                                      tweet.retweets,
                                                                      tweet.poll,
                                                                      tweet.option1,
                                                                      tweet.option2,                                                                      
                                                                      tweet.expire ));

              const follows = resp.users.map( user => new User( user.uid, 
                                                                user.firstName, 
                                                                user.lastName, 
                                                                user.username, 
                                                                user.email, 
                                                                user.createdAt, 
                                                                user.bio, 
                                                                user.password, 
                                                                user.img, 
                                                                user.imgPort, 
                                                                user.followers, 
                                                                user.followings, 
                                                                user.privacity, 
                                                                user._id, 
                                                                user.location, 
                                                                user.website ))
                                                
              const { uid,
                      firstName,
                      lastName,
                      username,
                      email,
                      createdAt,
                      bio,
                      password,
                      img,
                      imgPort,
                      followers,
                      followings,
                      privacity,
                      _id,
                      location,
                      website } = resp.user;

              const profileUser = new User( uid, 
                                            firstName, 
                                            lastName, 
                                            username, 
                                            email, 
                                            createdAt, 
                                            bio, 
                                            '', 
                                            img, 
                                            imgPort, 
                                            followers, 
                                            followings, 
                                            privacity, 
                                            _id, 
                                            location, 
                                            website )
              
              this.userById = profileUser;
          
              return{
                msg: resp.ok,
                getData,
                follows,
                profileUser
              }

             })
           )
  }

  newFollow( id: string ){    
    return this.http.post<{ ok: boolean, miUsuarioActualizado: User, msg: string, usuarioAseguirActualizado: User}>( `${ url }/followings/${ id }`, '' );
  }

  updateProfile( user: User ){

    return this.http.put<{ ok: boolean, user: User}>(`${ url }/users/${ this.user.uid}`, user );

  }

  actionForSubscriber( id: string ){

    return this.http.put( `${ url }/subscribers/${ id }`,'')

  }

  getNotifications( id: string ){
    return this.http.post<{ ok: boolean, notif: Notification[] }>( `${ url }/users/notifications`, { id } );
  }

  getPendingNotifications(){
    return this.http.get<{ ok: boolean, notifications: Notification[] }>( `${ url }/users/profile/pending/notifications`);
  }

  seenNotifications( id: string ){
    return this.http.put( `${ url }/users/notif/update`, { id } );
  }

}
