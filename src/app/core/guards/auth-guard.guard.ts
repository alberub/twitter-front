import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { NewsService } from '@shared/services/news.service';
import { SocketService } from '@shared/services/socket.service';
import { UserService } from '@shared/services/user.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate, CanLoad {

  constructor( private router: Router,
               private newsService: NewsService,               
               private userService: UserService ){}

  canLoad( route: Route, segments: UrlSegment[] ){
    return this.userService.tokenValidate()
                 .pipe(
                   tap( estaAutenticado => {
                     if ( !estaAutenticado ) {              
                      this.router.navigateByUrl('/auth/login');
                     }                     
                   })
                 )
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
    
      return this.userService.tokenValidate()
                 .pipe(
                   tap( estaAutenticado => {
                     if ( !estaAutenticado ) {              
                      this.router.navigateByUrl('/auth/login');
                     } 
                     else {                       
                      this.newsService.newScience().subscribe( (resp: any) => {                                                                                                             
                        this.newsService.newScienceResult = resp.articles;                                            
                      });
                       this.newsService.newTechnology().subscribe( (resp: any) => {                        
                        this.newsService.newTechnologyResult = resp.articles;
                      });
                     }
                   })
                 )

  }
  
}
