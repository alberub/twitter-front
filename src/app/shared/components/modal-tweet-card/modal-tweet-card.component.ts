import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Tweet } from '@core/models/tweet.model';
import { User } from '@core/models/usuario.model';
import { ModalService } from '@shared/services/modal.service';
import { TweetService } from '@shared/services/tweet.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-tweet-card',
  templateUrl: './modal-tweet-card.component.html',
  styleUrls: ['./modal-tweet-card.component.css']
})
export class ModalTweetCardComponent implements OnInit, OnDestroy, AfterViewInit {

  public tweet !: Tweet;  
  public sub$: Subscription[] = [];
  public inMyBookmarks: boolean = false;
  public amIaFollower !: boolean;
  private user: User;

  constructor( public modalService: ModalService, 
               private tweetService: TweetService,
               private userService: UserService ) { this.user = userService.user }

  @Input() clienteX: number = 0;
  @Input() clienteY: number = 0;

  get uid(): string{
    return this.user.uid;
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.sub$.push(this.tweetService.tweetForModalTweetCard$.subscribe( resp => {            
      this.tweet = resp;      
        if ( resp ) {                      
          this.tweet.userId.followers?.forEach( findFollower => {                    
            if ( findFollower === this.uid ) {
              this.amIaFollower = true;
            } else{
              this.amIaFollower = false;
            }
          })
        } 
      })
    );          
  }

  get clientX(){    
    return `${ this.clienteX }px`
  }

  get clientY(){    
    return `${ this.clienteY }px`
  }

  closeModal(){
    this.modalService.closeModalForTweetCard();
  }

  click(){
    this.modalService.closeModalForTweetCard();
    this.modalService.closeModalForTweetCardShare();
  }

  copyLinkTweet(){
    var copyText = window.location.href;
    var copyDataTweet = this.tweet.userId.firstName + '/status/' + this.tweet._id;
    navigator.clipboard.writeText( copyText + copyDataTweet );
    this.modalService.closeModalForTweetCardShare();
    this.tweetService.labelText$.next( 'Copied to clipboard' );        
  }

  actionForBookmark( id: string ){
    this.modalService.closeModalForTweetCardShare();
    this.tweetService.actionForBookmark( id )
      .subscribe( ({ msg }) => {
        this.tweetService.labelText$.next( msg );
      })
  }

  deleteTweet( tweet: Tweet ){
    const { uid } = this.user;
    if (tweet.userId._id !==  uid) {
      return;
    }
    this.modalService.closeModalForTweetCard();
    this.tweetService.tweetForModalTweetCard$.next( tweet );
    this.modalService.openModalDelete();
  }

  actionForFollow( tweet: Tweet ){

    const { _id } = tweet.userId;    
    this.userService.newFollow( _id! )
      .subscribe( ({ ok, msg, usuarioAseguirActualizado, miUsuarioActualizado }) => {        
        this.user.followers = miUsuarioActualizado.followers;
        this.user.followings = miUsuarioActualizado.followings;
        this.tweet.userId.followers = usuarioAseguirActualizado.followers;
        this.tweetService.labelText$.next( msg );
        if( ok === false ){ this.amIaFollower = false } else { this.amIaFollower = true };
      })

    this.modalService.closeModalForTweetCard();

  }

  ngOnDestroy(): void {
    this.sub$.forEach( u => u.unsubscribe());
  }

}
