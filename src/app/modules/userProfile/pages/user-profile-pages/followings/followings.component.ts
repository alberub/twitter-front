import { Component, OnInit } from '@angular/core';
import { TweetService } from '@shared/services/tweet.service';

@Component({
  selector: 'app-followings',
  templateUrl: './followings.component.html',
  styleUrls: ['./followings.component.css']
})
export class FollowingsComponent implements OnInit {

  constructor( public tweetService: TweetService ) { }

  ngOnInit(): void {
  }

}
