import { Component, OnInit } from '@angular/core';
import { Tweet } from '@core/models/tweet.model';
import { ModalService } from '@shared/services/modal.service';
import { TweetService } from '@shared/services/tweet.service';
import { Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-modal-small',
  templateUrl: './modal-small.component.html',
  styleUrls: ['./modal-small.component.css']
})
export class ModalSmallComponent implements OnInit {

  private tweetDeleted$ !: Subscription;
  private tweetToDelete !: Tweet;

  constructor( public modalService: ModalService,
               private tweetService: TweetService ) { }

  ngOnInit(): void {
  }

  deleteTweet(){
    this.tweetDeleted$ = this.tweetService.tweetForModalTweetCard$.pipe( tap( tweet => {
      this.tweetToDelete = tweet;
      }))
      .pipe(      
      switchMap( tweet => this.tweetService.deleteTweet( tweet._id )                 
                 .pipe(
                   tap( ({ msg }) => this.tweetService.labelText$.next( msg )),
                   switchMap(() => this.tweetService.dataInfo$)
                  ))
                  ).subscribe(( resp: Tweet[]): Tweet[] => {                                        
                    this.modalService.closeModalDelete();
                    this.tweetDeleted$.unsubscribe();
                    const find = resp.findIndex( e => e._id === this.tweetToDelete._id );
                    if ( find !== -1 ) {
                      resp.splice( find, 1 );            
                    }                                                       
                    return resp;
                  })    
  }

}
