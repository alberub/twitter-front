import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Tweet } from '@core/models/tweet.model';
import { User } from '@core/models/usuario.model';
import { ModalService } from '@shared/services/modal.service';
import { SocketService } from '@shared/services/socket.service';
import { TweetService } from '@shared/services/tweet.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tweet-card',
  templateUrl: './tweet-card.component.html',
  styleUrls: ['./tweet-card.component.css']
})
export class TweetCardComponent implements OnInit, OnDestroy, AfterViewInit {

  public user!: User;
  public retweeted:boolean = false;
  private subs$: Subscription[] = [];
  public percent: number = 0;
  public percent2: number = 0;
  public total: number = 0;
  public isMyPoll: boolean = false;
  public isMySelection: string = '';
  public voted: boolean = false;
  private result: number = 0;
  public pollExpired: boolean = false;
  public tweetExpire: any;
  private isModalHoverShow: boolean = true;
  private removeScroll: any;
  public cord: number | undefined;
  private interval: any;

  @ViewChild('isPoll') progressBar: ElementRef = new ElementRef('');

  @Input() tweet: Tweet = {
    reply: false,
    replyTo: '',
    replies: [],
    likes: [],
    retweets: [],
    liked: false,
    createdAt: '',
    _id: '',
    userId: {
              uid: '',
              firstName:'',
              lastName: '',
              username: '',
              email:'',
              createdAt:'',
              imagenUrl:'',
              img: '',
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

  constructor( private tweetService: TweetService,
               private socketService: SocketService,
               public modalService: ModalService,               
               private userService: UserService ) {

               this.user = userService.user;                                      

              }

  ngAfterViewInit(): void {
    // this.removeScroll = () => {
    //   if( this.tweetExpire !== 'Final results' && 
    //     this.progressBar.nativeElement.getBoundingClientRect().top > 0 &&
    //     this.progressBar.nativeElement.getBoundingClientRect().top < window.innerHeight ) {                            
    //       const timer = window.setInterval( () => {            
    //         this.expirationDate()            
    //       }, 1000 * 30 )                    
    //       if ( this.tweetExpire === 'Final results') {
    //         clearInterval( timer );          
    //       }          
    //     }
    // }
    // if ( this.tweet.poll ) {
    //   window.addEventListener( 'scroll', this.removeScroll)        
    // }
    // const options = {
      // root: document.querySelector('body'),
    //   rootMargin: '0px 0px 0px 0px',
    //   threshold: 1,
    // }
    // function callback( entries: any, observer: any ){    
    // }
    

    const observer = new IntersectionObserver( entries  => {
      let timeForInterval;

      if ( this.result > 1 ) {              
        timeForInterval = 30000;
      } else if (this.result <= 1) {              
        timeForInterval = 5000;
      }
     
      const entrie = entries[0];
      if ( entrie.isIntersecting ) {
        this.interval = setInterval(() => {
          if ( entrie.isIntersecting === true && this.tweetExpire !== 'Final results' ) {            
            this.expirationDate();                      
          }
        }, timeForInterval )
      } else if( entrie.isIntersecting === false ){        
        clearInterval( this.interval );
      }
    });

    if ( this.tweet.poll && this.tweetExpire !== 'Final results' ) {         
      observer.observe( this.progressBar.nativeElement );
    }
    // ==================================
    this.subs$.push(this.modalService.modalHoverActive$.subscribe( modalValue => {
      this.isModalHoverShow = modalValue;
      })
    )
    // ==================================

    this.subs$.push( this.tweetService.tweetReplied$
      .subscribe( resp => {
             
        if ( this.tweet._id === resp._id ) {  
          this.tweet.replies = resp.replies;
        }
      })
    )

  }

  ngOnInit(): void {

    this.iLikeIt();

    this.hasMyRetweet();
    
    if ( this.tweet.poll ) {
      this.expirationDate();

      this.myPoll();
    
      this.afterVote();
      
      this.calculatePercent();
    }


    this.createdDate();
  
    this.subs$.push(this.tweetService.tweetReplied$.subscribe( resp => {
      if ( resp._id === this.tweet._id ) {
        this.tweet.replies = resp.replies;
      }
    })
    )

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

  ngOnDestroy(): void {

    this.subs$.forEach( u => u.unsubscribe());
    window.removeEventListener( 'scroll', this.removeScroll );

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

  iLikeIt(){
    const likes = this.tweet.likes;
    likes?.find( mylike => {
      if ( mylike === this.uid ) {
        this.tweet.liked = true;
      }
    })
  }

  hasMyRetweet(){
    this.tweet.retweets?.find( retweet => {
      if ( retweet === this.uid ) {
        this.retweeted = true;
      } else{
        this.retweeted = false;
      }
    })
  }

  calculateMinutes( date1: Date, date2: Date ){

    let difference = ( date2.getTime() - date1.getTime()) / 1000;
    difference /= 60;
    return Math.abs(Math.round(difference));

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

  createdDate(){

    const fecha = this.tweet.createdAt;
    const fecha2 = new Date( fecha );
    
    const actual = Date.now();
    const a = new Date( actual )
    
    const result = this.calculateMinutes( fecha2, a);
    
    if ( result < 1) {
      this.tweet.createdAt = `now`;
    }

    else if (result < 60) {
      this.tweet.createdAt = `${result}m`;
    }

    else if( result >= 60 && result <= 1440 ){
      let r = result / 60;
      const sustraction = Math.trunc(r); 
      this.tweet.createdAt = `${ sustraction }h`
    }

    else if( result >= 1440 ){

      this.tweet.createdAt = fecha;
      const midate = new Date( this.tweet.createdAt );
      
      const toTime = midate.getTime();
      const exactHour = new Date( toTime + 21600000);
      
      const arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const getMonth = exactHour.getMonth();

      const day = exactHour.getDate();
      const month = arr[ getMonth ];
      
      this.tweet.createdAt = `${ month } ${ day }`;

    }

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

  likeTweet( _id: string ){    
    if (this.tweet.liked === false) {
      this.notifyReaction('liked', this.tweet);          
    }  
    this.tweetService.likeTweet( _id )
      .subscribe( (resp: any) => {
        this.tweet.likes = resp.tweet.likes;
        this.tweet.liked = resp.liked;        
        if ( resp.liked === false ) { this.tweetService.eraseFromData$.next( resp.tweet )};        
    })    
  }

  retweet( id: string ){
    if ( this.retweeted === true) {
        this.retweeted = false;        
    } else if( this.retweeted === false) {
      this.retweeted = true;
      this.notifyReaction('Retweeted', this.tweet );
    }
    this.tweetService.putRetweet( id )
      .subscribe( ({ tweetUpdated }) => {
        this.tweet.retweets = tweetUpdated.retweets;        
      })
  }

  showModal( username: string ){

    const clear = setTimeout(() => {
        this.userService.getUserModalHover( username )
        .subscribe( user => {        
        this.userService.userForModal$.next( user );
        this.modalService.openModalHover();
        clearTimeout( clear);
        })
      
    }, 50);
    
  }

  hideModal(){

      this.cord = 0;

      const clearTime = setTimeout(() => {
        if ( !this.isModalHoverShow ) {
          this.modalService.closeModalHover();
          clearTimeout( clearTime );
        } else {
          return;
        }
      }, 200); 
  
  }

  handlePosition( event: MouseEvent ): void{

    var y = event.y;
    var pagey = event.pageY;
    const x = event.pageX;
    const w = window.innerHeight;    

    if (  y  < ( w * 0.6 ) ) {
      this.modalService.setModalTop( pagey );
    } else{
      pagey = pagey - 300;
      this.modalService.setModalTop( pagey );
    }
    
    this.modalService.setModalLeft( x );

  }

  openModalReply( tweet: Tweet ){

    this.tweetService.tweetReply$.next( tweet );
    this.modalService.openModalReply();

  }

  historial( id: string, idt: string, tweet: Tweet ){
    var href = window.location.href;
    this.tweetService.tweetImageFloat$.next( tweet );
    window.history.pushState('photo' , '' , `${ href }${ id }/status/${ idt }/photo/1`);
    const clear = setTimeout(() => {
      this.modalService.openModalImageTweet();
      clearTimeout( clear );
    }, 200);

  }

  openModalShareMobil( tweet: Tweet ){
    this.tweetService.tweetToObtainData$.next( tweet );
    this.modalService.openModalShareMobile();
  }

  actionForModalTweetCard( tweet: Tweet ){    
    this.tweetService.tweetForModalTweetCard$.next( tweet );    
    this.modalService.openModalForTweetCard();
  }  

  actionForModalTweetCardShare( tweet: Tweet ){
    this.tweetService.tweetForModalTweetCard$.next( tweet );    
    this.modalService.openModalForTweetCardShare();
  }

  notifyReaction( reaction: string, tweet: Tweet ){      
    const user = this.userService.user.uid;    
    const tweetOwner = this.tweet.userId;
    if (user !==  tweetOwner._id ) {          
      this.socketService.socket.emit('my-reaction', { user, tweetOwner, reaction , tweet })      
    }    
  }

}

