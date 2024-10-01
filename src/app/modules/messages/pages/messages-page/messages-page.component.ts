import { Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Chat } from '@core/interfaces/chat-interface';
import { User } from '@core/models/usuario.model';
import { ChatService } from '@shared/services/chat.service';
import { ModalService } from '@shared/services/modal.service';
import { SearchService } from '@shared/services/search.service';
import { SocketService } from '@shared/services/socket.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-messages-page',
  templateUrl: './messages-page.component.html',
  styleUrls: ['./messages-page.component.css']
})
export class MessagesPageComponent implements OnInit, AfterViewInit, OnDestroy {

  public dataForm!: FormGroup;
  public messageForm !: FormGroup;

  public users: User[] = [];
  public user: User;
  public messages: any[] = [];
  public conversations: any[] = [];
  public chatSelected: any;
  public conversationMessage: any[] = [];
  public searchChat: boolean = true;
  public clearform: boolean = false;
  public resultsFound: boolean = false;
  public getResult: string = 'all';
  public found: any[] = [];
  public currentConversation: number = 0;
  public conversationInfo: boolean = false;
  public results: boolean = false;
  public foundResults: User[] = [];
  private subs$: Subscription[] = [];
  public selectedNew: boolean = false;
  public badges: User[] = [];
  public noSelection: boolean = true;
  public activeSpinner: boolean = true;
  private activeModalOptions: any;
  private path: string = '';
  public isNewMessage: boolean = false;
  public seenMessage: boolean = false;
  public conversationId: number = 0;
  public unreadChats: Chat[] = [];

  @ViewChild('txtTermino') txtTermino !: ElementRef;
  @ViewChild('messageArea') messageArea !: ElementRef;

  constructor( private socketService: SocketService,
               public modalService: ModalService,
               private cdr: ChangeDetectorRef,
               private location: Location,
               private chatService: ChatService,
               private searchService: SearchService,
               private userService: UserService ) {

               this.user = userService.user;
               this.getChats();               

              }

  get uid(): string{
    return this.user.uid || '';
  }

  ngOnDestroy(): void {

    this.path = '';
  
    // this.chatService.chat$.next('');
    this.socketService.chat$.next('');

    this.subs$.forEach( u => {
      u.unsubscribe();
    });

    window.removeEventListener('click', close );

    this.modalService.closeSidebarMobile();

    this.chatService.isTheMessagePath$.next( false );

  }
  
  ngAfterViewInit(): void {
    this.subs$.push(this.dataForm.get('term')?.valueChanges
    .subscribe( term => {
      if( term.trim().length === 0 && this.badges.length === 0 ){
        this.results = false;
        this.selectedNew = false;
        return;
      } else if( term.trim().length > 0 ) {
        this.results = true;
        this.searchUsers( term );
      }
    })!
    )
    this.subs$.push( this.chatService.counterMessages$.subscribe( resp => {
      this.unreadChats = resp;              
    })
    );  
    
  }

  ngOnInit(): void {  

    this.chatService.isTheMessagePath$.next( true );

    this.path = this.location.path();
    
    this.dataForm = new FormGroup({
      term: new FormControl('', [ Validators.required, Validators.minLength(1)])
    })

    this.messageForm = new FormGroup({
      message: new FormControl('', [Validators.required, Validators.minLength(1)] ),
    })
  
    // this.socketService.socket.on('connect', () => {      
    // })

    // this.socketService.socket.on('disconnect', () => {
    // });

    // this.socketService.socket.on('recibir-mensajes', ( payload ) => {
    //   this.messages = payload;
    // })

    // this.socketService.socket.on('usuarios-activos', ( payload ) => {         
    // });

    this.socketService.socket.on('myself', ( payload ) => {
        
      const { de, message, chatId, msg } = payload;

      this.conversations.find( conversation => {
        if( conversation._id === chatId ){
          conversation.messages.push({  _id: msg._id, from: de, message: message });
        }    
      });

      if ( this.chatSelected._id === chatId ) {
        this.conversationMessage.unshift({ from:de, message: message, _id: msg._id })  
      }

    })

    // Mensaje privado ==============================================================================
    
    this.socketService.socket.on('mensaje-privado', ( payload ) => {    
                  
      const { de, message, chatId, msg } = payload;

      // Al llegar un mensaje privado, este no cuenta con fecha de creacion
      // es por esto que no muestra la hora del posteo ( PIPE ) fix =====****

      if( this.path === '/messages'){                                                    
        this.conversations.find( conversation => {
          if( conversation._id === chatId ){
            conversation.messages.push({  _id: msg._id, 
                                          from: de, 
                                          message: message, 
                                          readed: false });
          }          
        });         
        // ===================================
        if( this.chatSelected.members[0]._id === de ){
          this.conversationMessage.unshift({ from: de, message: message, _id: msg._id, readed: true });
          this.conversations.forEach( conversation => {
            if ( conversation._id === this.chatSelected._id ) {
              conversation.messages[ conversation.messages.length -1 ].readed = true;
              const messageId = conversation.messages[ conversation.messages.length -1 ]._id;
              this.markMessageAsRead( conversation._id.toString() , messageId );
            }
          });
          const timer = setTimeout(() => {            
            const element = this.unreadChats.findIndex( conversation => conversation === chatId );                    
            if ( element !== -1 ) {
              this.unreadChats.splice( element, 1 );          
              this.chatService.counterMessages$.next( this.unreadChats );
            }
            clearTimeout( timer );
          }, 100);
        }     
      } 
    });


    // =======================================
    this.subs$.push(this.socketService.chat$.subscribe( resp => {
      this.chatSelected = resp;
    })
    );

  }

  sendMessage(){
    let uid = '';
    let chatId = '';    
    const { message } = this.messageForm.value;
    this.socketService.chat$.subscribe( resp => {
      chatId = resp._id;
      uid = resp.members[0]._id;
    })     
    if ( message.length > 0 ) {      
      this.socketService.socket.emit('enviar-mensaje', { uid, message, chatId });
      this.messageForm.reset();
    }

  }

  getChats(){
    
    const clear = setTimeout(() => {  
      this.chatService.getConversations()
      .subscribe( (resp: any) => {
        this.conversations = resp.chats;
        this.activeSpinner = false;
        this.unreadMessages();
        clearTimeout( clear );
      });
    }, 1000);

  }

  setChat( chat: any ){

    const m = chat.messages[ chat.messages.length -1 ];
    chat.messages.forEach( (message: any) => {
      if ( message._id === m._id  ) {
        message.readed = true;
      }
    });
 
    const element = this.unreadChats.findIndex( conversation => conversation === chat._id )
    if ( element !== -1 ) {
      this.unreadChats.splice( element, 1 );
      this.chatService.counterMessages$.next( this.unreadChats );
    }

    this.socketService.chat$.next( chat );
    this.getMessages( chat._id, chat.messages );
    this.currentConversation = chat._id;
    this.conversationInfo = false;
    const messageId = chat.messages[ chat.messages.length -1]._id;
    this.markMessageAsRead( chat._id, messageId );

    this.conversations.find( conversation => {      
      if ( conversation._id === chat._id ) {
        conversation.readed === true;
      }      
    });
    
    const removeClassHidden = document.getElementById('idForChatResponsive');
    removeClassHidden?.classList.remove('hidden');

  }

  getMessages( id: string, messages: any[] ){

    this.chatService.getMessages( id, messages )
      .subscribe( ({ messages }) => {
        this.conversationMessage = messages;         
      })
  }

  search(){

    this.searchChat = false;

  }

  searchBack(){
    this.searchChat = true;
    this.resultsFound = false;
    this.found = [];
  }

  clearForm(){
    
    this.txtTermino.nativeElement.value = '';
    this.clearform = false;
    this.resultsFound = false;
    this.found = [];

  }
  
  buscar( termino: string ){

    if( termino.length === 0){
      this.clearform = false;
      this.resultsFound = false;
      this.getResult = 'all';
      this.found = [];
      return;
    } else if( termino.length > 0){
      this.resultsFound = true;
      this.clearform = true
    }
    this.conversations.find( e => {
      if ( e.members[0].username === termino  ) {
        // const { members } = e;
        this.found = e.members;
      }
    })

  }

  setStyle( selector: 'all'| 'people'| 'groups'| 'msgs' ){

    switch (selector) {
      case 'all':
        this.getResult = 'all'
        break;

      case 'people':
        this.getResult = 'people'
        break;

      case 'groups':
        this.getResult = 'groups';
        break;

      case 'msgs':
        this.getResult = 'msgs';
        break;
    
      default:
        return;
    }

  }

  userInfo( value: boolean ){
    
    this.conversationInfo = value;

  }

  newChat(){
    this.modalService.openModalNewChat();
    const clear = setTimeout(() => {
      const setFocus = document.getElementById('focus');
        setFocus?.focus();
      clearTimeout( clear );
    }, 200);

  }

  closeModalNewChat(){

    this.modalService.closeModalNewChat();
    this.badges.pop();

  }

  searchUsers( term: string ){

    this.searchService.findUsers( term )
      .subscribe( ( resp: any ) => {      
        const element = resp.users.findIndex( (u: any) => u.uid === this.user.uid );      
        if (element !== -1 ) {          
          resp.users.splice( element, 1 );        
          }
        this.foundResults = resp.users;        
      })

  }

  pushBadge( user: User){

    this.badges.push( user );
    this.selectedNew = true;
    this.results = false;
    this.dataForm.setValue({ term: ''});
     if ( this.badges.length > 0 ) {
      this.noSelection = false;

     }
    
  }

  removeBadge( badge: User ){

    const element = this.badges.findIndex( e => e.uid === badge.uid );
    if ( element !== -1 ) {
      this.badges.splice( element, 1 );
    }
    if (this.badges.length <= 0 ) {
      this.selectedNew = false;
      this.results = false;
      this.noSelection = true;
    }

  }

  createChat(){

    const id = this.badges[0].uid;
    this.chatService.newChat( id )
      .subscribe( (resp: any )  => {                              
        if ( resp.ok === false ) {                                        
          this.closeModalNewChat();
          this.conversations.push( resp.chat );           
          this.selectedNew = false;
          this.setChat( resp.chat );
        }
        
        else if( resp.ok === true ){                      
          this.closeModalNewChat();
          this.selectedNew = false;
          const deleteUser = resp.chat.members.findIndex( ( f: any ) => f._id === this.user.uid )
          if ( deleteUser !== -1 ) {          
            resp.chat.members.splice( deleteUser, 1 );      
            this.setChat( resp.chat );          
          }          
        }

      })

  }

  optionsModal(){

    this.modalService.openModalChatOptions();

    const clear = setTimeout(() => {
      this.closeOptionsModal();
      clearTimeout( clear );
    }, 400);

  }

  closeOptionsModal(){

    this.activeModalOptions = ( e: MouseEvent ) => {
      const modalID = document.getElementById('MCOption');
      if ( e.target !== modalID ) {
        this.modalService.closeModalChatOptions();                
      }
    }

    window.addEventListener('click', this.activeModalOptions );
    
  }

  actionForChatResponsive(){

    const closeChat = document.getElementById('idForChatResponsive');
    const clear = setTimeout(() => {
      closeChat!.classList.add('hidden');
      this.socketService.chat$.next('');
      clearTimeout( clear );
    }, 200);

  }

  actionSidebarMobile(){
    this.modalService.modalSidebarMobile === true ? this.modalService.openSidebarMobile()
                                                  : this.modalService.closeSidebarMobile();
  }

  markMessageAsRead( chatId: string, messageId: string ){

    this.chatService.markMessageAsRead( chatId, messageId )
      .subscribe( ({ ok, updatedChat, updatedMsg }) => {
        this.conversations.find( conversation => {
          if ( conversation._id === updatedChat._id ) {
            conversation.readed === true;
          }
        })
        
      })

  }

  markChatAsUnread( chatId: string ){
    this.chatService.markChatAsUnread( chatId )
      .subscribe();
  }

  unreadMessages(){

    this.conversations.forEach( conversation => {
      if ( conversation.messages[ conversation.messages.length -1 ].readed === false ) {
        conversation.readed = false;
      }
      return conversation;
    })

  }

}

