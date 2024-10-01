import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@core/models/usuario.model';
import { ModalService } from '@shared/services/modal.service';
import { SocketService } from '@shared/services/socket.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-sidebar-mobile',
  templateUrl: './sidebar-mobile.component.html',
  styleUrls: ['./sidebar-mobile.component.css']
})
export class SidebarMobileComponent implements OnInit {

  public user: User;

  constructor( public modalService: ModalService,
               private router: Router,              
               private userService: UserService ) {
                 this.user = this.userService.user;
               }

  ngOnInit(): void {
  }

  actionSidebarMobile(){

    this.modalService.modalSidebarMobile === true ? this.modalService.openSidebarMobile()
                                                  : this.modalService.closeSidebarMobile();
  }

  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth/login');
  }

}
