import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tweet } from '@core/models/tweet.model';
import { TweetService } from '@shared/services/tweet.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.css']
})
export class TweetsComponent implements OnDestroy, AfterViewInit {

  public data: Tweet[] = [];
  private dataSubs$: Subscription[]= [];
  public activeSpinner: boolean = false;

  constructor( private tweetService: TweetService ) {
  }
  
  ngAfterViewInit(): void {
    this.getData();
    this.dataSubs$.push( this.tweetService.newTweet$.subscribe( tweet => {
      this.data.unshift( tweet );      
    }))
  }

  ngOnDestroy(): void {
    this.tweetService.dataInfo$.next('');    
    this.dataSubs$.forEach( u => {
      u.unsubscribe();
    })
  }

  getData(){
    
    this.dataSubs$.push(this.tweetService.dataInfo$.subscribe( resp => {
      
      if ( resp === '') {
        return;
      }      
      this.activeSpinner = true;
      const clear = setTimeout(() => {      
        if ( resp.length > 0 ) {
          this.data = resp;
        }        
        this.activeSpinner = false;
        clearTimeout( clear );

      }, 400);
     })
    )

  }

}
