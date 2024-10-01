import { Component, OnInit } from '@angular/core';
import { TweetService } from '@shared/services/tweet.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {

  constructor( public tweetService: TweetService ) { }

  ngOnInit(): void {
  }

}
