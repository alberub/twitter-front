import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { AuthService } from '@modules/auth/pages/services/auth.service';
import { UserService } from '@shared/services/user.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor( private userService: UserService, private authService: AuthService ) { }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    

    const headers = new HttpHeaders({
      'x-token': this.token
    })
    
    const reqClone = req.clone({
      headers
    })

    return next.handle( reqClone ).pipe(
      catchError( err => {
        this.authService.errorMessage$.next( err.error.incorrectMessage ); 
        return this.errorHandler( err)
      })
    )

  }

  errorHandler( err: HttpErrorResponse ){       
    return throwError('Interceptor error handler');
  }

}
