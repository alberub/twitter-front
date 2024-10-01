import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Tweet } from '@core/models/tweet.model';
import { User } from '@core/models/usuario.model';
import { ModalService } from '@shared/services/modal.service';
import { NewsService } from '@shared/services/news.service';
import { SearchService } from '@shared/services/search.service';
import { SocketService } from '@shared/services/socket.service';
import { TweetService } from '@shared/services/tweet.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild('textArea') text!: ElementRef;
  @ViewChild('modalHoverInHomeComponent') modalHoverInHomeComponent!: ElementRef;

  @HostListener('window:scroll', [ '$event' ])
  closeModalEmoji(){
    this.modalService.closeModalEmoji();
  }
  
  public imFollowing: boolean = false;
  public privacity: boolean = false;
  public activeSpinner: boolean = false;
  public suggested: boolean = false;
  public suggestedUser !:User;
  public tweetForm !: FormGroup;
  public user: User;
  public news: Tweet[] = [];
  public imgTemp: any;
  public arr !: Array<any>;
  public uploadImage !: File;
  public searchForm!: FormGroup;
  public usersFound: User[] = [];
  public foundResult: boolean = true;
  public userForModal!: User;
  public modal: boolean = false;
  public newS: any[] = [];
  public newT: any[] = [];
  public haveCharacter: boolean = false;
  public character: string = '';
  private subs$: Subscription[] = [];  
  private removeMouseOver: any;
  private removeMouseLeave: any;
  private removeKeyDown: any;
  private removeKeyUp: any;
  
  constructor( private renderer2: Renderer2,
               private tweetService: TweetService,
               public modalService: ModalService,
               private searchService: SearchService,
               public newsService: NewsService,
               private router: Router,
               private socketService: SocketService,
               private userService: UserService ) {
                 this.user = userService.user;                      
               }

  ngOnDestroy(): void {    
    this.modalService.closeModalHover();
    this.modalService.closeModalSearch();
    this.modalService.closeSidebarMobile();
    this.subs$.forEach( s => {
      s.unsubscribe();
    })

    window.removeEventListener('click', close );

    window.removeEventListener('mouseover', this.removeMouseOver);
    window.removeEventListener('mouseleave', this.removeMouseLeave);
    window.removeEventListener('keydown', this.removeKeyDown);
    window.removeEventListener('keyup', this.removeKeyUp);

  }

  ngOnInit(): void {

    this.stateForm();

    this.searchForm = new FormGroup({
      term: new FormControl('', [ Validators.minLength(1) ,Validators.required ])
    })
    
    this.tweetForm = new FormGroup({
      tweet: new FormControl('', [ Validators.minLength(1),Validators.required ])
    });
      
    this.getNews();

    this.subs$.push(this.tweetService.newTweet$.pipe( delay( 250 ))
      .subscribe( tweet => {
        this.news.unshift( tweet );  
      })
    );

      
  }
    
  ngAfterViewInit(): void {

    this.search();
    
    this.news.find( (e: any) => {
      if ( e.likes?.includes( this.user.uid ) ) {
        this.news.forEach( e => e.liked === true )
      }
    });

    window.addEventListener('click', function(close){

      var input1 = this.document.getElementById('input1');
      var input = this.document.getElementById('modalSearch');
      if ( close.target !== input && close.target !== input1 ) {
        input?.classList.add('modal__hidden');
      }

    })

    this.removeMouseOver = () => {
      this.modalService.modalHoverActive$.next( true );  
    }

    const modalHoverHome = document.getElementById('modalHoverInHomeComponent');
    modalHoverHome!.addEventListener( 'mouseover', this.removeMouseOver);

    this.removeMouseLeave = () => {
      this.modalService.modalHoverActive$.next( false );
      this.modalService.closeModalHover();  
    }

    modalHoverHome!.addEventListener( 'mouseleave' , this.removeMouseLeave);

    this.imFollow();

  }

  stateForm(){

    this.removeKeyDown = ( event: any ) => {
      if ( event.code === 'Escape') {
        this.modalService.closeModalSearch();
      }
    }

    window.addEventListener("keydown", this.removeKeyDown);

  }

  increaseHeightTextArea(): void{

    this.removeKeyUp = ( evento: any) => {
      const setHeight = evento.target.scrollHeight;
      this.renderer2.setStyle( textHeight, "height" , `${ setHeight }px` );
    }
    const textHeight = this.text?.nativeElement;
    textHeight?.addEventListener("keyup", this.removeKeyUp)

  }

  getNews(){

    this.activeSpinner = true;
    const { followings } = this.user;  
    
    this.tweetService.getNews( followings )
      .pipe(
        delay( 1000 ),
      )
      .subscribe( resp => {        
        const filtro = resp.getAllTweets.filter( e => e.reply !== true)
        this.news = filtro;        
        this.activeSpinner = false;
      })
  }

  openModal(){
    var input = document.getElementById('modalSearch');
    input?.classList.remove('modal__hidden')
    this.modalService.openModalSearch();
  }

  search(){

    this.subs$.push(this.searchForm.get('term')?.valueChanges
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

  cleanForm(){
    this.haveCharacter = false;
    this.searchForm.reset();
    this.modalService.closeModalSearch();
  }

  actionSidebarMobile(){
    this.modalService.modalSidebarMobile === true ? this.modalService.openSidebarMobile()
                                                  : this.modalService.closeSidebarMobile();
  }

  follow(){
    this.userService.newFollow('62c3c55cadbd3e1330730a44')
    .subscribe( ({ miUsuarioActualizado }) => {      
      this.userService.user.followings = miUsuarioActualizado.followings;      
      this.router.navigateByUrl('/home').then( () => {
        this.router.navigate(['/']);        
      })      
    })
  }

  imFollow(){
    this.userService.user.followings?.find( follow => {
      if( follow === '62c3c55cadbd3e1330730a44' ){
        this.imFollowing = true;
      } else {
        this.imFollowing = false;
      }
    })
  }

  return(){
    this.suggested = false;
  }

  getMyUserInfo(){
    this.suggested = true;
    this.userService.getUserById('alberto')
      .subscribe( resp => {
        this.suggestedUser = resp;             
      })
  }

}

