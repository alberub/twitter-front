import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ActivatedRoute
} from '@angular/router';
import { Tweet } from '@core/models/tweet.model';
import { TweetService } from '@shared/services/tweet.service';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResolverResolver implements Resolve<any> {

  public id!: string;
  public idt!:string;

  constructor( private tweetService: TweetService,
               private router: Router,
               private activatedRoute: ActivatedRoute ){
    this.activatedRoute.params.subscribe( ({ id, idt }) => {
      this.id = id;
      this.idt = idt;
    })
}

  resolve(){

    return this.tweetService.getTweetForId( this.id, this.idt );

  }
    
}
