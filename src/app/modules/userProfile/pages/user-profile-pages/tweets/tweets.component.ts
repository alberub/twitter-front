import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tweet } from '@core/models/tweet.model';
import { TweetService } from '@shared/services/tweet.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.css']
})
export class TweetsComponent implements OnInit, OnDestroy {

  public data: Tweet[] = [];
  private dataSubs$: Subscription[]= [];
  public activeSpinner: boolean = false;

  constructor( private tweetService: TweetService ) {
  }

  ngOnDestroy(): void {
    this.tweetService.dataInfo$.next('');
    this.dataSubs$.forEach( u => {
      u.unsubscribe();
    })
  }

  ngOnInit(): void {

      this.dataSubs$.push(this.tweetService.dataInfo$.subscribe( resp => {

        if (resp === '') {
          return;
        }
        this.activeSpinner = true;

        const clear = setTimeout(() => {
          if( resp.length > 0){
            this.data = resp;                             
          }

          this.activeSpinner = false;
          clearTimeout( clear );
        }, 400);

       })
      )
  }

}
