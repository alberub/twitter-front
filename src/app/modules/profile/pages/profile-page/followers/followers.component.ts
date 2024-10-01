import { Component, OnDestroy, OnInit } from '@angular/core';
import { TweetService } from '@shared/services/tweet.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit, OnDestroy {
  
  constructor( public tweetService: TweetService ) { }

  ngOnDestroy(): void {
    this.tweetService.followsInfo$.next('');
    this.tweetService.dataInfo$.next('');
  }

  ngOnInit(): void {    
  }

}
