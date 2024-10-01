import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tweet } from '@core/models/tweet.model';
import { User } from '@core/models/usuario.model';
import { FileUploadService } from '@shared/services/file-upload.service';
import { ModalService } from '@shared/services/modal.service';
import { TweetService } from '@shared/services/tweet.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-image-tweet',
  templateUrl: './image-tweet.component.html',
  styleUrls: ['./image-tweet.component.css']
})
export class ImageTweetComponent implements OnInit, OnDestroy, AfterViewInit {

private subs$: Subscription[] = [];
public clickInReplyArea: boolean = false;
public replyForm !: FormGroup;
public retweeted: boolean = false;
public replies: Tweet[] = [];
public imgTemp: any | null;
private uploadImage !: File
public reader: any;
public user !: User;

@ViewChild('textArea2') text2!: ElementRef;

@Input() tweet: Tweet = {
  reply: false,
  replies: [],
  likes: [],
  retweets: [],
  liked: false,
  createdAt: '',
  _id: '',
  userId: {
            uid: '',
            _id: '',
            firstName:'',
            lastName: '',
            username: '',
            email:'',
            createdAt:'',
            imagenUrl:'',
            img:'',
            imagenPortada:''
          },
  message: '',
  img:'',
  imagenUser:'',
  imgTweet:'',
  name:'',
  poll: false,
  option1: { choice: '', vote: 0, userVotes: [] },
  option2: { choice2: '', vote: 0, userVotes: [] },
  expire: 0
}

constructor( public modalService: ModalService,
              private tweetService: TweetService,
              private userService: UserService,
              private router: Router,
              private fileUploadService: FileUploadService,
              private renderer2: Renderer2,               
              private location: Location ) {
                this.user = userService.user;
              }

get getHeight(){
  const add = - (this.modalService.modalImageTweetHeight);
  
  return `${ add }px`;
}

ngAfterViewInit(): void {
}

ngOnInit(): void {

  this.subs$.push( this.tweetService.newReply$
    .subscribe( resp => {
      this.replies.unshift( resp );
    })
  )

  this.subs$.push(this.tweetService.tweetImageFloat$
    .subscribe( tweet => {
      this.getTweetById( tweet.userId.uid ,tweet._id )
    })
  )

  this.replyForm = new FormGroup({
    message: new FormControl('', [ Validators.required, Validators.minLength( 1 ) ] )
  })

}

  // TODO: switchMap

getTweetById( id: string, idt: string ){

  this.tweetService.getTweetForId( id, idt )
    .subscribe( tweet => {
      this.tweet = tweet
      this.isRetweet();
      this.tweetService.getReplies( tweet.replies )
        .subscribe( resp => {
          this.replies = resp.getAllReplies;
        })        
    })

}

closeModal(){
  this.modalService.closeModalImageTweet();
  this.location.back();      
  this.clickInReplyArea = false;
}

goProfile( route: string ){
  this.router.navigateByUrl( route );
  this.location.replaceState( this.tweet.userId.username );
  this.modalService.closeModalImageTweet();
  this.clickInReplyArea = false;
}

createReply(){

  const { message } = this.replyForm.value;
  const id = this.tweet._id;
  this.tweetService.replyTweet( { message, id } ) 
    .subscribe( ({ tweet, tweetOriginalUpdated }) => {       
      
      if ( this.uploadImage ) {          

        this.fileUploadService.uploadImages('tweets', this.uploadImage, tweet._id )
        .subscribe( ({ nombreArchivo }) => {

          tweet.img = nombreArchivo;
          this.tweetService.newReply$.next( tweet );
          this.tweetService.tweetReplied$.next( tweetOriginalUpdated );
        });
      } else{          
        this.tweetService.newReply$.next( tweet );
        this.tweetService.tweetReplied$.next( tweetOriginalUpdated );
      }        
        this.clickInReplyArea = false;
        this.replyForm.reset();
    })

}

change(): void{

  const textHeight = this.text2?.nativeElement;
  textHeight?.addEventListener("keyup", (evento: any) => {
  textHeight.style.height = '18px';
  const setHeight = evento.target.scrollHeight;      
  this.renderer2.setStyle( textHeight, 'height' , `${ setHeight }px` );
})

}

clearImgTemp(){
  this.imgTemp = null;
}

reply(){
  
  this.clickInReplyArea = true;
  this.change();

  const clear = setTimeout(() => {
    
    const focus = document.getElementById('setFocus');
    focus?.focus();
    clearTimeout( clear );

  }, 200);

}

changeImg( file: File ){
  this.uploadImage = file;

  if( !file ){
    this.imgTemp = null;
    return;
  }

  this.reader = new FileReader();
  this.reader.readAsDataURL( file );

  this.reader.onloadend = () => {
    this.imgTemp = this.reader.result;
  }

}

likeTweet( _id: string ){

  this.tweetService.likeTweet( _id )
    .subscribe( (resp: any) => {
      this.tweet.likes = resp.tweet.likes;
      this.tweet.liked = resp.liked;
    })

}

isRetweet(){
  this.tweet.retweets?.find( e => {
    if ( e === this.user.uid ) {
      this.retweeted = true;
    } else{
      this.retweeted = false;
    }
  })
}

retweet( id: string ){

  if ( this.retweeted === true) {
      this.retweeted = false
  } else if( this.retweeted === false) {
    this.retweeted = true;
  }

  this.tweetService.putRetweet( id )
    .subscribe( ({ tweetUpdated }) => {
      this.tweet.retweets = tweetUpdated.retweets;
    })

}

ngOnDestroy(): void {
  this.subs$.forEach( u => u.unsubscribe() );
  this.modalService.closeModalImageTweet();
}

}
