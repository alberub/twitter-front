import { Component, OnDestroy, OnInit } from '@angular/core';
import { TweetService } from '@shared/services/tweet.service';

@Component({
  selector: 'app-followings',
  templateUrl: './followings.component.html',
  styleUrls: ['./followings.component.css']
})
export class FollowingsComponent implements OnInit, OnDestroy {

  constructor( public tweetService: TweetService ) {}

  ngOnDestroy(): void {
    this.tweetService.followsInfo$.next('');
    this.tweetService.dataInfo$.next('');
  }

  ngOnInit(): void {      
  }

}
