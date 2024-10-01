import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@core/models/usuario.model';
import { ModalService } from '@shared/services/modal.service';
import { NewsService } from '@shared/services/news.service';
import { SearchService } from '@shared/services/search.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-explore-page',
  templateUrl: './explore-page.component.html',
  styleUrls: ['./explore-page.component.css']
})
export class ExplorePageComponent implements OnInit, OnDestroy {

  public user: User;
  public searchForm !: FormGroup;
  public title: string = 'for you';
  public searching: boolean = false;
  public usersFound: User[] = [];
  private sub$: Subscription[] = [];

  constructor( public newsService: NewsService, 
               private userService: UserService,
               public modalService: ModalService,
               private searchService: SearchService ) {
    this.user = userService.user;
  }

  ngOnDestroy(): void {
    this.sub$.forEach( u => u.unsubscribe());
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      term: new FormControl('', [ Validators.required,Validators.minLength(1) ])
    });
    this.searchUser();
  }

  setTitle( set: string ){
    this.title = set;
  }

  search(){
    this.searching === true ? this.searching = false : this.searching = true;
    const timer = setTimeout(() => {
      const setFocus = document.getElementById('searchUserMobile');
      setFocus?.focus();
      clearTimeout( timer );
    }, 200);
  }

  searchUser(){
    this.sub$.push( this.searchForm.get('term')?.valueChanges
    .pipe( debounceTime( 500 ))
    .subscribe( term => {
      if( term.trim().length > 0 ){
        this.searchService.findUsers( term )
        .subscribe( (resp: any) => {
          this.usersFound = resp.users;        
      })
      } else{ this.usersFound = [] }
    })!
    )    
  }

  actionSidebarMobile(){
    this.modalService.modalSidebarMobile === true ? this.modalService.openSidebarMobile()
                                                  : this.modalService.closeSidebarMobile();
  }

}
