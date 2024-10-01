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
export class LikesComponent implements OnInit, OnDestroy {

  public noLikes: boolean = false;
  public profileUser !: User;
  public data: Tweet[] = [];
  public activeSpinner: boolean = false;
  private subs$ !: Subscription;

  constructor( private userService: UserService,
               private tweetService: TweetService ) { }

  ngOnDestroy(): void {
    this.tweetService.dataInfo$.next('');
    this.subs$.unsubscribe();
  }

  ngOnInit(): void {
    this.profileUser = this.userService.userById;

    this.subs$ = this.tweetService.dataInfo$.subscribe( resp => {

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

      
    })

  }

}
