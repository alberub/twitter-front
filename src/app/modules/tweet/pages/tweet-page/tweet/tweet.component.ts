import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tweet } from '@core/models/tweet.model';
import { User } from '@core/models/usuario.model';
import { FileUploadService } from '@shared/services/file-upload.service';
import { ModalService } from '@shared/services/modal.service';
import { NewsService } from '@shared/services/news.service';
import { SocketService } from '@shared/services/socket.service';
import { TweetService } from '@shared/services/tweet.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('textArea2') text2!: ElementRef;

  public replyForm !: FormGroup;
  public replies: Tweet[] = [];
  public percent: number = 0;
  public percent2: number = 0;
  public total: number = 0;

  public isMyPoll: boolean = false;
  public isMySelection: string = '';
  public voted: boolean = false;
  private result: number = 0;
  public pollExpired: boolean = false;
  public tweetExpire: any;
  private subs$: Subscription[] = [];

  public user: User;
  public clickInReplyArea: boolean = false;
  public loading: boolean = true;
  public retweeted: boolean = false;
  public reader: any;
  private uploadImage !: File | null;
  public imgTemp: any | null;

  public value = {
    '=0':'',
    '=1':'1 Like',
    'other':'# Likes'
  }

  public valueRetweet = {
    '=0':'',
    '=1':'1 Retweet',
    'other':'# Retweets'
  }

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

  constructor( private activatedRoute: ActivatedRoute,
               private tweetService: TweetService,
               private fileUploadService: FileUploadService,              
               private renderer2: Renderer2,
               private router: Router,               
               private socketService: SocketService, 
               private userService: UserService,
               private location: Location,
               public newService: NewsService,
               public modalService: ModalService ) {
                this.user = userService.user;
                this.activatedRoute.params.subscribe( ({ id , idt }) => {                      
                  this.loading = false;
                  this.getTweetForId( id, idt );
                });

               }

  ngOnDestroy(): void {
    this.subs$.forEach( u => u.unsubscribe());
  }

  get uid(): string{
    return this.user.uid || '';
  }

  get getPercent(){
    return `${ this.percent }%`
  }
  
  get getPercent2(){
    return `${ this.percent2 }%`
  }

  ngAfterViewInit(): void {

    this.change();
  
    this.tweet.retweets?.find( e => {
      if ( e === this.uid ) {
        this.retweeted = true;
      } else{
        this.retweeted = false;
      }
    })
  
    // Socket event que se debe escuchar desde el inicio que se carga la tweet card
  
    if ( this.tweet.poll ) {
      
      this.socketService.socket.on('new-vote', ( payload ) => {      
  
        const { option, voto, tweet, uid } = payload;
  
        if ( this.tweet._id === tweet && option === 'option1' ) {
          this.tweet.option1!.vote += 1;
          this.calculatePercent();
        } 
  
        else if( this.tweet._id === tweet && option === 'option2' ){
          this.tweet.option2!.vote += 1;
          this.calculatePercent();
        }
        
      })
  
    }
  }

  ngOnInit(){       

    this.subs$.push(this.tweetService.newReply$.subscribe( tweet => {
      this.replies.unshift( tweet );
    })
    )

    this.replyForm = new FormGroup({

      message: new FormControl('', [ Validators.minLength( 1 ) ,Validators.required ] )

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

  createReply(){
    const { message } = this.replyForm.value;
    const id = this.tweet._id;
    var reply: Tweet;

    if ( this.uploadImage ) {
      this.tweetService.replyTweet({ message, id })
      .pipe(
      tap( ({ tweet }) => reply = tweet ),
      switchMap( ({ tweet }) => this.fileUploadService.uploadImages('tweets', this.uploadImage!, tweet._id ))
    ).subscribe(({ nombreArchivo }) => {
      reply.img = nombreArchivo;          
      this.tweetService.newReply$.next( reply );
    })
    }
    else{
      this.tweetService.replyTweet({ message, id })
        .subscribe(({ tweet }) => {
          this.tweetService.newReply$.next( tweet );
        })
    }
    this.clickInReplyArea = false;
    this.imgTemp = null;
    this.replyForm.reset();
  }

  getTweetForId( id: string, idt: string ){
    this.tweetService.getTweetForId( id, idt ).pipe(      
      tap(( tweet ) => {
        this.tweet = tweet;  
        this.documentTitle( tweet );                  
        if ( this.tweet.poll ) {
          this.expirationDate();
          this.myPoll();      
          this.afterVote();        
          this.calculatePercent();  
        }              
        this.hasMyRetweet();  
      }),
      switchMap( tweet => this.tweetService.getReplies( tweet.replies )),      
    ).subscribe( resp => {
      this.replies = resp.getAllReplies;
    })
  }

  hasMyRetweet(){
    this.tweet.retweets?.find( retweet => {
      if ( retweet === this.user.uid ) {
        this.retweeted = true;
      } else{
        this.retweeted = false;
      }
    }); 
  }

  likeTweet( _id: string ){

    this.tweetService.likeTweet( _id )
      .subscribe( (resp: any) => {
        this.tweet.likes = resp.tweet.likes;
        this.tweet.liked = resp.liked;
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

  calculatePercent(){
    
    if( this.tweet.option1?.choice !== undefined ){
      const vote = this.tweet.option1!.vote;
      const vote2 = this.tweet.option2!.vote;
      const total = vote + vote2;
      this.total = total;
      this.percent = Math.round((vote / total) * 100) || 0;
      this.percent2 = Math.round((vote2 / total) * 100) || 0; 
    }
  
  }

  votePoll( id: string, userVote: string, option: string ){

    if ( userVote === this.tweet.userId._id ) {
      return;
    }
  
    if ( !option ) {
      return;
    }
  
    const uid = this.tweet.userId._id;
  
    this.tweetService.votePoll( id, userVote, option )
      .subscribe( ( {tweet} ) => {      
        
        if ( tweet !== undefined && option === 'option1' ) {
  
          this.socketService.socket.emit('user-vote', { id, userVote, option, uid } );
  
          this.total += 1;
          this.voted = true;
          this.tweet.option1!.vote = tweet.option1!.vote;
          this.isMySelection = 'option1';
          this.calculatePercent();
          
        } else if( tweet !== undefined && option === 'option2' ){
  
          this.socketService.socket.emit('user-vote', { id, userVote, option, uid } );
  
          this.total += 1;
          this.voted = true;
          this.tweet.option2!.vote = tweet.option2!.vote;
          this.isMySelection = 'option2';
          this.calculatePercent();
        }
      })
  }

  calculateMinutes( date1: Date, date2: Date ){

    let difference = ( date2.getTime() - date1.getTime()) / 1000;
    difference /= 60;
    return Math.abs(Math.round(difference));
  
  }

  expirationDate() {

    const expireDate  = this.tweet.expire!;
    const currentDate = Date.now();
    
    const date = new Date( expireDate );
    const date2 = new Date( currentDate );
  
    this.result = this.calculateMinutes( date, date2 );
  
    if ( expireDate <= currentDate ) {
    
      this.tweetExpire = 'Final results';
      this.pollExpired = true;
  
    }
  
    else if ( expireDate > currentDate && this.result < 60 ) {
      
      this.tweetExpire = `${this.result} minutes left`;
  
    }
  
    else if( expireDate > currentDate && this.result > 59 && this.result < 1440 ){
  
        let r = this.result / 60;
        const sustraction = Math.trunc(r); 
        this.tweetExpire = `${ sustraction } hours left`;
      
    }
  
    else if( expireDate > currentDate && this.result >= 1440 && this.result <= 2879 ){
  
      const r = this.result / 1440;
      const sustraction = Math.trunc( r );
      this.tweetExpire = `${ sustraction } day left`;
  
    }
  
    else if( expireDate > currentDate && this.result >= 2880 ){
  
      const r = this.result / 1440;
      const sustraction = Math.trunc( r );
      this.tweetExpire = `${ sustraction } days left`;
  
    }
  
  }

  myPoll(){
    if ( this.uid === this.tweet.userId._id ) {
      this.isMyPoll = true;
    }
  }
  
  afterVote(){
  
    if ( this.tweet.option1?.userVotes.includes( this.uid ) ) {
      this.isMySelection = 'option1';
      this.voted = true;
    } else if( this.tweet.option2?.userVotes.includes( this.uid ) ){
      this.voted = true;
      this.isMySelection = 'option2';
    }
  
  }

  back(){
    this.location.back();
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

  openModalReply( tweet: Tweet ){
    this.tweetService.tweetReply$.next( tweet );
    this.modalService.openModalReply();
  }

  documentTitle( tweet: Tweet ){
    document.title = `${ tweet.userId.firstName } on Twitter: "${ tweet.message }"`
  }

  actionForModalTweetCard( tweet: Tweet ){    
    this.tweetService.tweetForModalTweetCard$.next( tweet );    
    this.modalService.openModalForTweetCard();
  }

  actionForModalTweetCardShare( tweet: Tweet ){
    this.tweetService.tweetForModalTweetCard$.next( tweet );    
    this.modalService.openModalForTweetCardShare();
  }

}
