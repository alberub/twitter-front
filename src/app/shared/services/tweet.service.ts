import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tweet } from '@core/models/tweet.model';
import { User } from '@core/models/usuario.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  private user: User;
  public dataInfo$: BehaviorSubject<any> = new BehaviorSubject('');
  public followsInfo$: Subject<any> = new Subject();
  public newTweet$: Subject<any> = new Subject();
  public newReply$: Subject<any> = new Subject();
  public eraseFromData$: Subject<any> = new Subject();
  public tweetReply$: BehaviorSubject<any> = new BehaviorSubject('');
  public tweetReplied$: BehaviorSubject<any> = new BehaviorSubject('');
  public tweetForModalTweetCard$: BehaviorSubject<any> = new BehaviorSubject('');
  public labelText$: BehaviorSubject<string> = new BehaviorSubject('');
  public tweetImageFloat$: Subject<any> = new Subject<any>();
  public tweetToObtainData$: BehaviorSubject<any> = new BehaviorSubject<any>('');

  constructor( private http: HttpClient,
               private userService: UserService ) {
                 this.user = userService.user;
               }

  get uid(){
    return this.user.uid || '';
  }

  newTweet( message: string, 
            option1?:{'choice':string, 'vote': number }, 
            option2?:{'choice2':string, 'vote': number }, 
            poll?: boolean,
            expire?: number ){

    return this.http.post<{ ok: boolean, tweet: Tweet, msg: string }>( `${ url }/tweets`, { message, option1, option2, poll, expire })
      .pipe(
        map( (resp: any) => {

          const { _id, 
                  message, 
                  userId, 
                  createdAt, 
                  img, 
                  reply,
                  replyTo, 
                  liked, 
                  replies, 
                  likes, 
                  retweets,
                  poll,
                  option1,
                  option2,                  
                  expire } = resp.tweet;

          const newPost = new Tweet( _id, 
                                     message, 
                                     userId, 
                                     createdAt, 
                                     img, 
                                     reply,
                                     replyTo, 
                                     liked, 
                                     replies, 
                                     likes, 
                                     retweets,
                                     poll,
                                     option1,
                                     option2,                                     
                                     expire );

          return{
            ok: resp.ok,
            msg: resp.msg,
            newPost
          };

        })
      )

  }

  getNews( followings: any ){
    
    return this.http.post<{ msg: string, tweets: Tweet[] }>(`${ url }/tweets/getTweet`, { users: followings })
      .pipe(
        map( resp => {

          const getAllTweets = resp.tweets.map( tweet => new Tweet( tweet._id, 
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

          return {
            mensaje: resp.msg,
            getAllTweets
          }

        })
        
      )
      

  }

  likeTweet( id: string ){

    return this.http.put( `${ url }/tweets`, { id });

  }

  deleteTweet( id: string ){
    return this.http.delete<{ msg: string }>( `${ url }/tweets/${ id }`)
  }

  getTweetForId( id: string, idt: string ){
    
    return this.http.get<{ ok: boolean, tweet: Tweet }>( `${ url }/tweets/${ id }/status/${ idt }` )
           .pipe(
             map( resp => resp.tweet)
           )
  
  }

  replyTweet( data:{ message: string, id: string } ){

    return this.http.post<{ ok: boolean, tweet: Tweet, tweetOriginalUpdated: Tweet }>( `${ url }/tweets/reply`, data)
      .pipe(
        map( resp => {     

            var { _id, message, userId, createdAt, img, reply, replyTo, liked, replies, likes, retweets, poll, option1, option2, expire } = resp.tweet;

            const tweet = new Tweet( _id, message, userId, createdAt, img, reply, replyTo, liked, replies, likes, retweets, poll, option1, option2, expire);

            var { _id, message, userId, createdAt, img, reply, replyTo, liked, replies, likes, retweets, poll, option1, option2, expire } = resp.tweetOriginalUpdated;

            const tweetOriginalUpdated = new Tweet( _id, message, userId, createdAt, img, reply, replyTo, liked, replies, likes, retweets, poll, option1, option2, expire);

            return{            
              tweet,
              tweetOriginalUpdated             
            };

        })
      )

  }

  getReplies( tweets: any ){

    return this.http.post<{ msg: string, tweets: Tweet[]}>(`${ url }/tweets/getReplies`, { getReplies: tweets })
      .pipe(
        map( resp => {

          const getAllReplies = resp.tweets.map( tweet => new Tweet( tweet._id, 
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
                                                                     tweet.expire))

          return{
            mensaje: resp.msg,
            getAllReplies
          }

        })
      )

  }

  putRetweet( id: string ){

    return this.http.put<{ ok: boolean, dataUpdated: any, tweetUpdated: Tweet }>( `${ url }/tweets/retweet/${ id }`, '')

  }

  votePoll( id: string, userVote: string, option: string ){

    return this.http.put<{ ok: boolean, tweet: Tweet }>( `${ url }/tweets/poll`, { id, userVote, option });

  }

  getBookmarks(){

    return this.http.get<{ ok: boolean, bookmarks: Tweet[] }>( `${ url }/tweets/bookmark` )
      .pipe(
        map( resp => {

          const bookmarks = resp.bookmarks.map( tweet => new Tweet ( tweet._id,
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

          return{
            bookmarks
          }

        })
      )

  }

  actionForBookmark( id: string ){

    return this.http.post<{ ok: boolean, msg: string }>( `${ url }/tweets/bookmark/${ id }`, '');

  }

}
