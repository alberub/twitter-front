import { Component, OnDestroy } from '@angular/core';
import { SocketService } from '@shared/services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  constructor( private socketService: SocketService ){}

  ngOnDestroy(): void {
    this.socketService.chat$.unsubscribe();    
  }
  
}
