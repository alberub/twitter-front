import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tweet } from '@core/models/tweet.model';
import { User } from '@core/models/usuario.model';
import { TweetService } from '@shared/services/tweet.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.css']
})
export class LikesComponent implements OnDestroy, OnInit {

  public data: Tweet[] = [];
  private subs$: Subscription [] = [];
  public noLikes: boolean = false;
  public activeSpinner: boolean = true;
  public myProfile: boolean = false;
  public profileUser: User;

  constructor( private tweetService: TweetService,
               private userService: UserService ) {

                 this.profileUser = userService.userById;
                 this.myProfile = userService.sameUser;
                 this.getData();
               
  }
  
  ngOnInit(): void {
    this.subs$.push( this.tweetService.eraseFromData$
      .subscribe( ( tweet ): any => {
        const elem = this.data.findIndex( e => e._id === tweet._id );
        if ( elem !== -1 ) {
          this.data.splice( elem, 1 );
          if ( this.data.length === 0 ) {
            this.noLikes = true;
          }
          return this.data;
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.tweetService.dataInfo$.next('');
    this.subs$.forEach( u => u.unsubscribe() );
  }

  getData(){

    this.subs$.push(this.tweetService.dataInfo$
      .subscribe( resp => {
      if (resp === '') {
        return;
      }      
      this.activeSpinner = true;      
      const clear = setTimeout(() => {
        this.activeSpinner = false;
        if ( resp.length > 0 ) {
          this.data = resp;
          this.noLikes = false;
        } else if ( resp.length <= 0) {
          this.noLikes = true;
        } 
        clearTimeout( clear );
      }, 400);    
    })!
    )
  }

}
