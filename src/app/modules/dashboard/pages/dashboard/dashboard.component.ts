import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivationEnd, ActivationStart, Router } from '@angular/router';
import { Chat } from '@core/interfaces/chat-interface';
import { ChatService } from '@shared/services/chat.service';
import { ModalService } from '@shared/services/modal.service';
import { SocketService } from '@shared/services/socket.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';
import { delay, filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']  
})
export class DashboardPageComponent implements OnInit, AfterViewInit , OnDestroy {

  @ViewChild('dash') dash: ElementRef = new ElementRef('');

  private removeKeyDown: any;
  private subs$: Subscription[] = [];
  private uid: string;
  private removeClick: any;
  private removeClickShare: any;
  private title: string = '';  
  public isTheMessagePath: boolean = false;
  public hasNewMessages: number[] = [];
  public hasNewMesagesForTitle: string = '';
  public notificationsCounter: number = 0;  
  public clienteX: number = 0;
  public clienteY: number = 0;

  constructor( public  modalService: ModalService,
               private router: Router,                            
               private chatService: ChatService,
               private userService: UserService,
               private route: ActivatedRoute,
               private socketService: SocketService ) {
                this.uid = userService.user.uid;  
                this.subs$.push( this.documentTitle().subscribe() );                                                                                
               }

  ngAfterViewInit(): void { 

    this.closeModalForTweetCard();
    this.closeModalForTweetCardShare();    
    this.chatService.counterMessages$.next( this.hasNewMessages );

    this.socketService.socket.on('new-reaction', () => {
      this.pendingNotificationCounter(); 
      this.userService.newNotification$.next( this.notificationsCounter += 1 );           
    });
      
    this.socketService.socket.on('mensaje-privado', ( payload ) => {                        
      
      const { chatId, de, message, msg  } = payload
      if ( !this.hasNewMessages.includes( chatId )) {
        this.hasNewMessages.push( chatId );
        this.chatService.counterMessages$.next( this.hasNewMessages );        
      }    
    });

    this.documentTitulo();

  }

  ngOnDestroy(): void {
    
    window.removeEventListener('click', this.removeClick);
    window.removeEventListener('click', this.removeClickShare);
    window.removeEventListener( 'keydown', this.removeKeyDown );
    this.subs$.forEach( u => u.unsubscribe() );
    this.socketService.socket.disconnect();

  }

  ngOnInit(): void {       
    
    this.getConversations();
    
    this.pendingNotificationCounter();        
    
    this.removeKeyDown = ( event: any) => {
      if (event.code === 'Escape') {
        this.modalService.closeModalNew();
        this.modalService.closeModalEmoji();
      }
    }

    window.addEventListener("keydown", this.removeKeyDown);

    this.subs$.push(this.chatService.isTheMessagePath$.subscribe( resp => {      
      this.isTheMessagePath = resp;
    })
    );        

  }

  getHeight(){
    const height = this.dash.nativeElement.getBoundingClientRect().top;
    this.modalService.setHeightForImageTweet( height );
  } 

  getConversations(){
    
    this.chatService.getConversations()
      .subscribe( (resp: any) => {        
        resp.chats.forEach( ( chat:Chat ) => {
          if( chat.messages[ chat.messages.length -1 ].readed === false && 
            chat.messages[ chat.messages.length -1 ].from !== this.uid ){              
            this.hasNewMessages.push( chat._id );                   
          }
          this.getLength();
        })                                  
      });
  }

  pendingNotificationCounter(){
    this.userService.getPendingNotifications()
      .subscribe( ({ notifications }) => {     
        this.notificationsCounter = notifications.length;   
        this.userService.newNotification$.next( notifications.length );           
      })
  }
  
  closeModalForTweetCard(){
    const modalShowCondition = window.innerHeight * 0.6;
    this.removeClick = ( event : any ) => {
      this.clienteX = event.clientX - 224;
      if ( event.clientY > modalShowCondition ) {
        this.clienteY = event.clientY - 260;
      } else{
        this.clienteY = event.clientY;
      }  
      if ( event.target.id === 'mymodal' ) {
        this.modalService.closeModalForTweetCard();      
      }
    }
    window.addEventListener( 'click', this.removeClick )
  }

  closeModalForTweetCardShare(){
    const modalShowCondition = window.innerHeight * 0.6;
    this.removeClickShare = ( event : any ) => {
      this.clienteX = event.clientX - 224;
      if ( event.clientY > modalShowCondition ) {
        this.clienteY = event.clientY - 210;
      } else{
        this.clienteY = event.clientY;
      }  
      if ( event.target.id === 'myModalShare' ) {                
        this.modalService.closeModalForTweetCardShare();      
      }
    }
    window.addEventListener('click', this.removeClickShare );
  }

  documentTitle(){           
    return this.router.events
    .pipe(
      filter<any>( event => event instanceof ActivationEnd ),
      filter( (event: ActivationEnd) => event.snapshot.firstChild === null ),
      map( ( event: ActivationEnd ) => event.snapshot.data ),
      tap( ({ title }) => {   
        this.title = title;   
        this.documentTitulo();                           
    })
    )  
  }  

  documentTitulo(){
    document.title = `${ this.hasNewMesagesForTitle } ${ this.title } / Twitter`;
  }

  getLength(){    
    this.subs$.push(this.chatService.counterMessages$.pipe( delay(300) ).subscribe( resp => {
      if (resp.length > 0) {                                   
          this.hasNewMesagesForTitle = `(${ resp.length })`;
          this.documentTitulo();
      } else{
        this.hasNewMesagesForTitle = ''
        this.documentTitulo();        
      }        
    }))
  }

  history( url: string ){
    // Aqui se deben agregar las paginas al historial
  }

}


// const modalShowCondition = window.innerHeight * 0.6;
    // const dashboardMain = document.getElementById('dashboardMain');
    // dashboardMain?.addEventListener( 'mouseup', ( event ) => {                  
    //     this.clienteX = event.clientX - 300;
    //     if ( event.clientY > modalShowCondition ) {
    //       this.clienteY = event.pageY -280 ;
    //     } else{
    //       this.clienteY = event.pageY;
    //     }                
    //     this.modalService.closeModalForTweetCard();     
    // })


//   const modalShowCondition = window.innerHeight * 0.6;
  //   const dashboardMain = document.getElementById('dashboardMain');
  //   dashboardMain?.addEventListener( 'mouseup', ( event ) => {      
  //       this.clienteX = event.clientX - 200;
  //       if ( event.clientY > modalShowCondition ) {
  //         this.clienteY = event.pageY -210 ;
  //       } else{
  //         this.clienteY = event.pageY;
  //       }                
  //       this.modalService.closeModalForTweetCardShare();     
  //   })