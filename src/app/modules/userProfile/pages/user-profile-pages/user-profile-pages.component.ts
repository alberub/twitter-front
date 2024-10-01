import { Location } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Tweet } from '@core/models/tweet.model';
import { User } from '@core/models/usuario.model';
import { ModalService } from '@shared/services/modal.service';
import { NewsService } from '@shared/services/news.service';
import { TweetService } from '@shared/services/tweet.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile-pages',
  templateUrl: './user-profile-pages.component.html',
  styleUrls: ['./user-profile-pages.component.css']
})
export class UserProfilePagesComponent implements OnInit, OnDestroy, AfterViewInit {

  public user!: User;
  public myUser: User;
  public data: Tweet[] = [];
  private userId: string = '';
  public title: string = '';
  public isFollow: boolean = false;
  public textAction: string = 'following';
  public hide: boolean = false;
  public tituloSubs$: Subscription[] = [];
  public lookFollows: boolean = false;
  public myTitle: string = 'tweets';
  public notificationsState: boolean = false;

  public mainMenu: { defaultOptions: Array<any> } = { defaultOptions: [] }

  constructor( private activatedRoute: ActivatedRoute,
               private userService: UserService,
               private tweetService: TweetService,
               private router: Router,
               private location: Location,
               public newService: NewsService,
               public modalService: ModalService ) {
    
    this.myUser = userService.user;
    this.tituloSubs$.push(this.activatedRoute.params.subscribe( ({ id }) => {          
      if ( id === this.userService.user.username ) {
        this.router.navigateByUrl('/profile')
      }
      this.userId = id;
      this.tituloSubs$.push(this.getRoute());
    })
    )

  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.tituloSubs$.forEach( u => {
      u.unsubscribe();
    })
  }

  ngOnInit(): void {

    this.mainMenu.defaultOptions = [
      {
        name: 'Tweets',
        router:['/',this.userId ]
      },
      {
        name:'Tweets & replies',
        router:['with_replies']
      },
      {
        name:'Media',
        router:['media']
      },
      {
        name:'Likes',
        router:['likes']
      }
    ]
  }

  changeNotificationState(){
    this.notificationsState === true ? this.notificationsState = false : this.notificationsState = true;
  }

  getRoute(){

    return this.router.events
      .pipe(
        filter<any>( event => event instanceof ActivationEnd ),
        filter( ( event: ActivationEnd ) => event.snapshot.firstChild === null ),
        map( (event: ActivationEnd ) => event.snapshot.data )
      ).subscribe( ({  titulo }) => {                
        this.title = titulo;    
        this.getDataProfile( titulo , this.userId );                
      })

  }

  getDataProfile( tipo: 'tweets' | 'media' | 'likes' | 'with_replies' | 'followers' | 'followings', username: string ){
        
    this.userService.getDataProfile( tipo, username )
    .subscribe( ({ profileUser, follows, getData  }) => {
      this.user = profileUser;
      this.data = getData;      
      this.tweetService.dataInfo$.next( getData );
      this.tweetService.followsInfo$.next( follows );
      this.iFollow();
      this.documentTitle( this.user, tipo );
    });    

  }

  documentTitle( user: User, tipo: string  ){
    switch (tipo) {
      case 'tweets':
        document.title = `${ user.firstName } (@${ user.username })/ Twitter`        
        break;
        
      case 'with_replies':
        document.title = `Tweets with replies by ${ user.firstName } (@${ user.username })/ Twitter`        
        break;

      case 'media':
        document.title = `Media Tweets by ${ user.firstName } (@${ user.username })/ Twitter`        
        break;

      case 'likes':
        document.title = `Tweets liked by ${ user.firstName } (@${ user.username })/ Twitter`        
        break;

      case 'followings':
        document.title = `People followed by ${ user.firstName } (@${ user.username })/ Twitter`        
        break;
        
      case 'followers':
        document.title = `People following by ${ user.firstName } (@${ user.username })/ Twitter`        
        break;       
        
    }    
  }

  iFollow(){

    const { uid } = this.user;
    const { followings } = this.myUser; 
    const follows = JSON.stringify( followings);

    if( follows.includes( uid ) ){
      this.isFollow = true;
    } else {      
      this.isFollow = false;
    }

  }

  unFollow(){
      this.textAction = 'unfollow';
  }

  follow(){
    this.textAction = 'following';
  }

  newFollow( user: User ){

    const { uid } = user;
    this.userService.newFollow( uid )
      .subscribe( (resp: any) => {        
        
        const { ok, miUsuarioActualizado, usuarioAseguirActualizado } = resp;
        this.myUser = miUsuarioActualizado;        
        this.user.followers = usuarioAseguirActualizado.followers;
        this.isFollow = true;
      })

  }

  deleteFollow( user: User ){
    const { uid } = user;
    this.userService.newFollow( uid )
      .subscribe( (resp: any) => {        

        const { ok, miUsuarioActualizado, usuarioAseguirActualizado } = resp;
        this.myUser = miUsuarioActualizado;
        this.user.followers = usuarioAseguirActualizado.followers;
        this.isFollow = false;
        this.modalService.closeModalSmall();
      })
  }

  openModal(){
    this.hide = true;
    this.modalService.openModalSmall();
  }

  back(){
    this.location.back();
  }

  sectionFollows( value: boolean ){
    this.lookFollows = value;
  }

  sectionFollowsClose(){
    this.lookFollows = false;
    this.location.back();      
  }

}















  // getUserById( id: string ){
    
  //   this.userService.getUserById( id )
  //   .subscribe( resp => {
  //     this.user =  resp;
  //     const { followers } = resp;
  //     const { uid } = this.myUser;
  //     const id = JSON.stringify(uid);     
  //     const f = JSON.stringify( followers );
      
  //     if (f.includes( id ) === true ) {
  //       this.isFollow = true;
  //     } else{
  //       this.isFollow = false;
  //     }

  //     })

  // }
