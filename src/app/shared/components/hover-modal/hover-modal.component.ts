import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { User } from '@core/models/usuario.model';
import { ModalService } from '@shared/services/modal.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-hover-modal',
  templateUrl: './hover-modal.component.html',
  styleUrls: ['./hover-modal.component.css']
})
export class HoverModalComponent implements OnInit, AfterViewInit {

  public myUser: User;
  public IamAFollower: boolean = false;
  public followHover: string = 'Following';
  public itsMe: boolean = false;

  @ViewChild('modalHoverModalHover') modalHoverModalHover: ElementRef = new ElementRef('');

  @Input() userModal: User =
  {
    uid:'',
    firstName:'',
    lastName:'',
    username:'',
    email:'',
    createdAt:'',
    password:'',
    bio:'',
    followers:[],
    followings: [],
    img:'',
    imgPort:'',
    privacity:'',
    imagenUrl:'',
    imagenPortada:''
  };

  constructor( public modalService:ModalService,
               private userService: UserService ) {  
               this.myUser = userService.user;
}

ngAfterViewInit(): void {

  this.getUserForModal();
  
}

ngOnInit(): void {
  this.amIFollower();
}

get modalY(){
  return `${20 + this.modalService.modalTop }px`
}

get modalX(){
  return `${ this.modalService.modalLeft - 100 }px`
}

getUserForModal(){
  this.userService.userForModal$    
    .subscribe( user => {
      this.userModal = user;      
    })    
}

amIFollower(){

  const { uid } = this.userModal;
  const { followings } = this.myUser; 
  const follows = JSON.stringify( followings);

  if( follows.includes( uid ) ){
    this.IamAFollower = true;
  } else {      
    this.IamAFollower = false;
  }
  
}

newFollow( user: User ){

  const { uid } = user;
  this.userService.newFollow( uid )
    .subscribe( (resp: any) => {        
      
      const { ok, miUsuarioActualizado, usuarioAseguirActualizado } = resp;
      this.myUser = miUsuarioActualizado;
      this.userModal.followers = usuarioAseguirActualizado.followers;
      this.IamAFollower = true;

    })

}

deleteFollowing( user: User ){

  const { uid } = user;
  this.userService.newFollow( uid )
    .subscribe( (resp: any) => {        
      
      const { ok, miUsuarioActualizado, usuarioAseguirActualizado } = resp;
      this.myUser = miUsuarioActualizado;
      this.userModal.followers = usuarioAseguirActualizado.followers;
      this.IamAFollower = false;
      
    })

}

overFollowing( text: string ){
  this.followHover = text;
}

}
