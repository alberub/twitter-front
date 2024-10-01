import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@core/models/usuario.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Register } from '@core/interfaces/register-interface';


const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // public user !: User;
  // public userChange: BehaviorSubject<any> = new BehaviorSubject( undefined );
  public errorMessage$: Subject<string> = new Subject<string>();

  constructor( private http: HttpClient ) { }

  login( data:{ email: string, password: string }){
    return this.http.post<{ msg: string, ok: boolean, token: string }>(`${ url }/login`, data);
  }

  availableValidator( validate: string, tipo: string ){
    return this.http.get<{ ok: boolean }>( `${ url }/users/${ validate }/${ tipo }`)
  }

  createUser( formData: Register ){
    return this.http.post( `${ url }/users`, formData );
  }

}
