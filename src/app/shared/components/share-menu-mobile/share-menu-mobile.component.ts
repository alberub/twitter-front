import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '@shared/services/modal.service';
import { SocketService } from '@shared/services/socket.service';
import { TweetService } from '@shared/services/tweet.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-share-menu-mobile',
  templateUrl: './share-menu-mobile.component.html',
  styleUrls: ['./share-menu-mobile.component.css']
})
export class ShareMenuMobileComponent implements OnInit, OnDestroy {

  private subs$: Subscription[] = [];

  constructor( public modalService: ModalService,              
               private tweetService: TweetService ) { }

  ngOnDestroy(): void {    
  }

  ngOnInit(): void {
  }

  closeModalShareMobile(){

    this.modalService.closeModalShareMobile();
    this.tweetService.tweetToObtainData$.next('');
    this.subs$.forEach( u => u.unsubscribe());

  }

  actionForBookmark(){
    
    this.subs$.push( this.tweetService.tweetToObtainData$.subscribe( tweet => {
      this.tweetService.actionForBookmark( tweet._id )
      .subscribe( ({ msg }) => {
        this.tweetService.labelText$.next( msg );
        this.closeModalShareMobile();
      })
    })
    )
  }

}
