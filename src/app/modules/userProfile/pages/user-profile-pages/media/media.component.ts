import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tweet } from '@core/models/tweet.model';
import { User } from '@core/models/usuario.model';
import { TweetService } from '@shared/services/tweet.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit, OnDestroy, AfterViewInit {

  public data: Tweet[] = [];
  private sub$: Subscription [] = [];
  public noLikes: boolean = false;
  public activeSpinner: boolean = true;
  public myProfile: boolean = false;
  public profileUser !: User;

  constructor( private tweetService: TweetService, 
               private userService: UserService, 
               private activatedRoute: ActivatedRoute ) {
    this.profileUser = userService.userById;
    this.myProfile = userService.sameUser;    
  }  

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit(): void {    
  }

  filterTweetMedia( resp: Tweet[] ){
    resp.filter( tweet => {            
      if(tweet.img){
        this.data.push( tweet );
      } 
      const clear = setTimeout(() => {
      if ( this.data.length <= 0 ) {  
        this.noLikes = true;
      }
        clearTimeout( clear );
      }, 400); 
    })        
  }

  getData(){

    this.sub$.push(this.tweetService.dataInfo$
      .subscribe( resp => {
      if (resp === '') {
        return;
      }      
      this.activeSpinner = true;               
      this.activeSpinner = false;
        if ( resp.length > 0 ) {
          this.filterTweetMedia( resp );     
          this.noLikes = false;
        }
    })!
    )
  }

  ngOnDestroy(): void {
    this.tweetService.dataInfo$.next('');
    this.sub$.forEach( u => u.unsubscribe() );
  }

}
