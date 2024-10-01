import { Component, Input, OnInit } from '@angular/core';
import { ChatService } from '@shared/services/chat.service';
import { ModalService } from '@shared/services/modal.service';
import { SocketService } from '@shared/services/socket.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu-mobil',
  templateUrl: './menu-mobil.component.html',
  styleUrls: ['./menu-mobil.component.css']
})
export class MenuMobilComponent implements OnInit {

  public counterMessages: number[] = [];
  public counterNotifications: number = 0;
  private subs$: Subscription[] = [];

  @Input() isRouteMessage: boolean = false;

  mainMenuMobile: { defaultOptions: Array<any>, accessLink: Array<any>
  } = { defaultOptions: [], accessLink: [] }

  constructor( private modalService: ModalService, 
               private socketService: SocketService,
               private chatService: ChatService,
               private userService: UserService
               ) {}

  ngOnInit(): void {    

    this.mainMenuMobile.defaultOptions = [
      {
        name:'Home',
        icon:'bx bx-home-circle',
        icon__active:'bx bxs-home-circle',
        router:['/']
      },
      {
        name:'Explore',
        icon:'bi bi-search',
        icon__active:'fa-solid fa-magnifying-glass',
        router:['/', 'explore']
      },
      {
        name:'Notifications',
        icon:'fa-regular fa-bell',
        icon__active:'fa-solid fa-bell',
        router:['/', 'notifications']
      },
      {
        name:'Messages',
        icon:'fa-regular fa-envelope',
        icon__active:'fa-solid fa-envelope',
        router:['/', 'messages']
      }
    ];

    this.subs$.push( this.chatService.counterMessages$.subscribe( resp => {                 
      this.counterMessages = resp;    
    }));
  
    this.subs$.push( this.userService.newNotification$.subscribe( resp => {      
      this.counterNotifications = resp;
    }));

  }

  openModalNew(){
    this.modalService.openModalNew();
  }

  openModalNewMessage(){
    this.modalService.openModalNewChat();
  }

}
