import { Component, OnDestroy, OnInit } from '@angular/core';
import { Notification } from '@core/interfaces/notification-interface';
import { NewsService } from '@shared/services/news.service';
import { SocketService } from '@shared/services/socket.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-notif-page',
  templateUrl: './notif-page.component.html',
  styleUrls: ['./notif-page.component.css']
})
export class NotifPageComponent implements OnInit, OnDestroy {

  public showAll: boolean = true;
  public title: 'all' | 'mentions';
  public notifications: Notification[] = [];
  public activeSpinner: boolean =  true;  

  constructor( public newService: NewsService, 
               private userService: UserService, 
               private socketService: SocketService ) {

    this.title = 'all';

  }  

  get uid(): string{
    return this.userService.user.uid || '';
  }

  ngOnInit(): void {    

    this.getNotifications( this.uid );

    this.updateNotification( this.uid );

    this.userService.newNotification$.next(0);        

  }

  getNotifications( id: string ){
    this.activeSpinner = true;
    const timer = setTimeout(() => {      
      this.userService.getNotifications( id )
      .subscribe( ({ notif }) => {
        this.notifications = notif;
        this.notifications.reverse();        
        this.activeSpinner = false; 
        clearTimeout( timer );       
      })
    }, 300);
  }

  updateNotification( id: string ){
    this.userService.seenNotifications( id )
      .subscribe();
  }

  toggleSections( section: string ){

    if( section === 'all' ){
      this.title = 'all'
      this.showAll = true;
    } else {
      this.title = 'mentions'
      this.showAll = false;
    }

  }

  ngOnDestroy(): void {
    this.userService.newNotification$.next(0);
  }

}
