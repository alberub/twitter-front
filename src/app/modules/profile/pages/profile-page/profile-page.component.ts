import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Tweet } from '@core/models/tweet.model';
import { User } from '@core/models/usuario.model';
import { ModalService } from '@shared/services/modal.service';
import { NewsService } from '@shared/services/news.service';
import { TweetService } from '@shared/services/tweet.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchService } from '@shared/services/search.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit, OnDestroy, AfterViewInit {

  public userFollow !: User;
  public user: User;
  public myTitle: string = 'tweets';
  public textAction: string = 'following';
  public tweetDeleted$ !: Subscription;
  public hide: boolean = false;
  public lookFollows: boolean = false;
  public isFollow: boolean = false;
  public showModal = this.modalService.openModalEdit;
  private tweetToDelete !: Tweet;
  public data: Tweet[] = [];
  public tituloSubs$: Subscription[] = [];
  private _heightForImageFullScreen: number = 0;
  public mainMenu: { defaultOptions: Array<any> } = { defaultOptions: [] };
  public searchForm!: FormGroup;
  public usersFound: User[] = [];
  public foundResult: boolean = true; 
  public found: User[] = [];

  @ViewChild('fullscreenImage') fullscreenImage: ElementRef = new ElementRef('');

  constructor( public modalService: ModalService,
               private location: Location,
               private router: Router,
               private tweetService: TweetService,
               public newService: NewsService,
               private searchService: SearchService,
               private userService: UserService ) {             
                 this.user = this.userService.user;                                 
                 this.tituloSubs$.push(this.getRoutes());                 
  }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return{
      headers:{
        'x-token': this.token
      }
    }
  }

  get getHeight(){
    return `${ this._heightForImageFullScreen }px`;
  }

  ngAfterViewInit(): void {       
    this.documentTitle( this.userService.user );
    window.addEventListener('click', function(close){
      var input1 = this.document.getElementById('inputProfile');
      var input = this.document.getElementById('modalSearchProfile');
      if ( close.target !== input && close.target !== input1 ) {
        input?.classList.add('modal__hidden');
      }

    })
    this.search();    
  }

  ngOnDestroy(): void {
    window.removeEventListener('click', close );
    this.tweetService.dataInfo$.next('');
    this.tituloSubs$.forEach( u => {
      u.unsubscribe();
    })
  }

  ngOnInit(): void {    

    this.mainMenu.defaultOptions = [
      {
        name: 'Tweets',
        router:['/profile']
      },
      {
        name:'Tweets & replies',
        router:['/profile/with_replies']
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

    this.searchForm = new FormGroup({
      term: new FormControl('', [ Validators.minLength(1) ,Validators.required ])
    })

  }

  getRoutes(){

    return this.router.events
      .pipe(
        filter<any>( event => event instanceof ActivationEnd ),
        filter( (event: ActivationEnd) => event.snapshot.firstChild === null ),
        map( (event: ActivationEnd) => event.snapshot.data )
      ).subscribe( ({ titulo }) => {
        this.myTitle = titulo;                
        if ( titulo !== undefined ) {    
            this.getDataProfile( titulo, this.user.username );
        }        
      })

  }

  getDataProfile( tipo: 'tweets' | 'media' | 'likes' | 'with_replies' | 'followers' | 'followings', username: string ){

    this.userService.getDataProfile( tipo , username )
      .subscribe( ({ getData, follows, profileUser }) => {
        this.tweetService.dataInfo$.next( getData );
        this.data = getData;
        this.documentoTitulo( this.user, tipo )              
        if ( follows ) {
          this.tweetService.followsInfo$.next( follows );
        }      
      })
  }

  documentTitle( user: User ){    
    document.title = `${ user.firstName } (@${ user.username })/ Twitter`
  }

  documentoTitulo( user: User, tipo: string  ){    
    
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

  openModal(){
    this.modalService.openModal();

    const clear = setTimeout(() => {

      const form = document.getElementById('miName');
      form?.focus();

      clearTimeout( clear );

    }, 250);

  }

  openModalDelete(){
    this.hide = true;
    this.modalService.openModalDelete();
  }  

  sectionFollows(){
    this.lookFollows = true;
  }

  sectionFollowsClose(){
    this.lookFollows = false;
    this.router.navigate([ 'profile' ])
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
        this.user = miUsuarioActualizado;
        // this.user.followers = usuarioAseguirActualizado.followers;
        this.isFollow = true;
      })

  }

  deleteFollow( user: User ){
      
    const { uid } = user;
    this.userService.newFollow( uid )
      .subscribe( (resp: any) => {        

        const { ok, miUsuarioActualizado, usuarioAseguirActualizado } = resp;
        this.user = miUsuarioActualizado;
        // this.user.followers = usuarioAseguirActualizado.followers;
        this.isFollow = false;
        this.modalService.closeModalSmall();

      })

  }

  back(){
    this.location.back();
  }

  showImageFullScreen(){

    const f = this.fullscreenImage.nativeElement.getBoundingClientRect().top;
    const w = window.innerHeight;    
    this._heightForImageFullScreen = w - ( f );
    this.modalService.openModalFullScreen();

  }

  closeModalFull(){
    this.modalService.closeModalFullScreen();
  }

  openModalSearch(){
    var input = document.getElementById('modalSearchProfile');
    input?.classList.remove('modal__hidden')
    this.modalService.openModalSearch();
  }

  search(){

    this.tituloSubs$.push(this.searchForm.get('term')?.valueChanges
    .pipe(debounceTime(500))
    .subscribe( resp => {
        if ( resp.length > 0 ) {
          this.foundResult = false;
          this.searchService.findUsers( resp )
          .subscribe( (resp :any) => {
              this.foundResult = false;
              this.usersFound = resp.users;              
                                                  
          })
        } else {
          this.foundResult = true;
          this.usersFound = [];
        }
    })!
    );
    
  }
  
}
