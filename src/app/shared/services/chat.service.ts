import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '@core/interfaces/chat-interface';
import { Message } from '@core/interfaces/messages-interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public counterMessages$: BehaviorSubject<any> = new BehaviorSubject<any>('');
  public isTheMessagePath$: Subject<boolean> = new Subject<boolean>();
  // public chat$: BehaviorSubject<any> = new BehaviorSubject<any>( undefined );

  constructor( private http: HttpClient,
               private userService: UserService ) { }

  get uid(): string{
    return this.userService.user.uid || '';
  }

  getConversations(){

    return this.http.get( `${ url }/chats/getChats`)

  }

  getMessages( id: string, messages: any ){

    return this.http.post<{ ok: boolean, messages: any[]}>( `${ url }/chats/getMessages/${ id }`,{ getMessages: messages });

  }

  newChat( id: string){

    return this.http.post<{ ok: boolean, chat: any }>( `${ url }/chats/newChat`, { id })
      .pipe(
        tap( resp => {
          return resp
        }), catchError( err => {
          return err;
        }
        )
      )
  }

  markMessageAsRead( chatId: string, messageId: string ){

    return this.http.put<{ ok: boolean, updatedChat: Chat, updatedMsg: Message }>( `${ url }/chats/updateChat/${ chatId }/${ messageId }`,'');

  }

  markChatAsUnread( chatId: string ){

    return this.http.put( `${ url }/chats/unreadChat/${ chatId }`, '');

  }

}
