import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notification } from '@core/interfaces/notification-interface';
import { User } from '@core/models/usuario.model';
import { ChatService } from '@shared/services/chat.service';
import { ModalService } from '@shared/services/modal.service';
import { SocketService } from '@shared/services/socket.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy, AfterViewInit {

public user!: User
public counterMessages: number[] = [];
public counterNotifications: number = 0;
private subs$: Subscription[] = [];
private removeClick: any;

mainMenu: { defaultOptions: Array<any>, accessLink: Array<any>
} = { defaultOptions: [], accessLink: [] }

mainMenuMobile: { defaultOptions: Array<any>, accessLink: Array<any>
} = { defaultOptions: [], accessLink: [] }

constructor( private userService: UserService,
             private socketService: SocketService,
             private chatService: ChatService,
             private router: Router,
             public modalService: ModalService ) { 
  this.user = userService.user;
}

ngAfterViewInit(): void {
  this.removeClick = ( event: any ) => {        
    if ( event.target.id === 'modalcard' ) {         
      this.modalService.closeModalOut();
    }  
  }
  const dash = document.getElementById('dashboardMain');
  dash?.addEventListener('click', this.removeClick );
}

ngOnDestroy(): void {
  this.modalService.closeModalOut();
  this.subs$.forEach( u => u.unsubscribe());
  window.removeEventListener('click', this.removeClick );    
}

ngOnInit(): void {

  this.subs$.push( this.chatService.counterMessages$.subscribe( resp => {                 
    this.counterMessages = resp;    
  }));

  this.subs$.push( this.userService.newNotification$.subscribe( resp => {              
    this.counterNotifications = resp;
  }));

  this.mainMenu.defaultOptions = [
    {
      name:'Home',
      icon:'bx bx-home-circle',
      icon__active:'bx bxs-home-circle',
      router:['/']
    },
    {
      name:'Explore',
      icon:'bi bi-hash',
      icon__active:'fa-solid fa-hashtag',
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
    },
    {
      name:'Bookmarks',
      icon:'fa-regular fa-bookmark',
      icon__active:'fa-solid fa-bookmark',
      router:['/', 'bookmarks']
    },
    {
      name:'Lists',
      icon:'bi bi-list',
      icon__active:'fa-solid fa-bars-staggered',
      router:['/', 'lists']
    },
    {
      name:'Profile',
      icon:'fa-regular fa-user',
      icon__active:'fa-solid fa-user',
      router:['/', 'profile']
    },
    {
      name:'More',
      icon:'bi-three-dots',
      icon__active:'',
      // router:['/', 'favorites']        
    }
  ]

}

openModalnew(){
  this.modalService.openModalNew();
}

logout(){
  localStorage.removeItem('token');
  this.router.navigateByUrl('/auth/login');
}

openModalOut(){  
  this.modalService.openModalOut();
}

sayHi(){
}

}
