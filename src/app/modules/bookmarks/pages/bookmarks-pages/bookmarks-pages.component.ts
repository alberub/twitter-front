import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Tweet } from '@core/models/tweet.model';
import { User } from '@core/models/usuario.model';
import { NewsService } from '@shared/services/news.service';
import { TweetService } from '@shared/services/tweet.service';
import { UserService } from '@shared/services/user.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-bookmarks-pages',
  templateUrl: './bookmarks-pages.component.html',
  styleUrls: ['./bookmarks-pages.component.css']
})
export class BookmarksPagesComponent implements OnInit, OnDestroy {

  public user: User;
  public activeSpinner: boolean = true;
  private subs$ !: Subscription;
  public bookmarksExists: boolean = true;
  public bookmarks: Tweet[] = [];

  @Input() tweet: Tweet = {
    reply: false,
    replies: [],
    likes: [],
    retweets: [],
    liked: false,
    createdAt: '',
    _id: '',
    userId: {
              uid: '',
              _id: '',
              firstName:'',
              lastName: '',
              username: '',
              email:'',
              createdAt:'',
              imagenUrl:'',
              img:'',
              imagenPortada:''
            },
    message: '',
    img:'',
    imagenUser:'',
    imgTweet:'',
    name:'',
    poll: false,
    option1: { choice: '', vote: 0, userVotes: [] },
    option2: { choice2: '', vote: 0, userVotes: [] },
    expire: 0
  }

  constructor( private tweetService: TweetService, 
               public newService: NewsService,
               private userService: UserService ) {
                this.user = userService.user;
               }

  ngOnDestroy(): void {
    this.subs$.unsubscribe();
  }

  ngOnInit(): void {
    this.getBookmarks();
  }

  getBookmarks(){
    const time = timer(1000);
    this.subs$ = time.pipe(
                  switchMap(() => this.tweetService.getBookmarks())
                 )
                 .subscribe( ({ bookmarks }) => {
                  this.bookmarks = bookmarks;
                  this.activeSpinner = false;
                  if ( bookmarks.length === 0 ) {                                                 
                    this.bookmarksExists = false;                                                 
                  }
                 })
  }

}
