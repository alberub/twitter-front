import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn:'platform'
})
export class SocketService {

  public chat$: BehaviorSubject<any> = new BehaviorSubject<any>( undefined );

  constructor() {}
  
  // http://localhost:3000
  // https://backend-server-twitter.herokuapp.com/
  // https://twitter-backend-server.herokuapp.com/

  socket = io('https://twitter-backend-server.herokuapp.com/',{
    autoConnect: true,
    withCredentials: true,
    'extraHeaders':{
      'x-token': localStorage.getItem('token') || ''
    }
  });

}
