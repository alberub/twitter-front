import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { User } from '@core/models/usuario.model';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-follows',
  templateUrl: './follows.component.html',
  styleUrls: ['./follows.component.css']
})
export class FollowsComponent implements OnInit, AfterViewInit {
  public iAmFollow: boolean = false;

  @Input() user: User = {
    uid:'',
    firstName:'',
    lastName:'',
    username:'',
    email:'',
    createdAt:'',
    bio:'',
    img:'',
    imgPort:'',
    followers: [],
    followings: [],
    privacity:'',
    _id:'',
    location:'',
    website:'',
    imagenUrl:'',
    imagenPortada:''
  }

  constructor( private userService: UserService) { }

  ngAfterViewInit(): void {
    // this.userService.user.followers?.find( user => {            
    //   if (user === this.user.uid ) {                
    //     this.iAmFollow = true;
    //   } else{
    //     this.iAmFollow = false
    //   }
    // });
    // this.userService.user.followings?.find( user => {
    //   if (user === this.user.uid ) {
    //     this.iAmFollow = true;
    //   } else{
    //     this.iAmFollow = false;
    //   }
    // })
  }

  ngOnInit(): void {    
  }

  actionToFollow(){
    this.userService.newFollow( this.user.uid )
      .subscribe( ({ ok }) => {
        if (ok === true ) {
          this.iAmFollow = true;
        } else {
          this.iAmFollow = false;
        }
      })
  }

}
