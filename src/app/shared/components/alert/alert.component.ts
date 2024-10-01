import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TweetService } from '@shared/services/tweet.service';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {

  @Input() message: string = '';
  public hidden: boolean = true;
  private subs$: Subscription[] =  [];
  
  constructor( private tweetService: TweetService ) {
    this.subs$.push(tweetService.labelText$.subscribe( text => { 
      this.message = text;
      this.detectedMessage( text );
    })
    )
  }
  
  ngOnInit(): void {
    if ( this.message.trim().length > 0 ) {
      this.detectedMessage( this.message );
    }
  }

  detectedMessage( text: string ){
    const time = timer( 6000 );
    if ( text.trim().length > 0) {
      this.hidden = false;
      this.subs$.push(time.subscribe( () => {
        this.hidden = true;
      })
      )      
    }
  }

  ngOnDestroy(): void {     
    this.hidden = true;
    this.subs$.forEach( u => u.unsubscribe() );
  }

}

// Direct message sent.View
