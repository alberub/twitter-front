import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@core/models/usuario.model';
import { FileUploadService } from '@shared/services/file-upload.service';
import { ModalService } from '@shared/services/modal.service';
import { UserService } from '@shared/services/user.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.component.html',
  styleUrls: ['./modal-profile.component.css']
})
export class ModalProfileComponent implements OnInit {

  public modalForm !: FormGroup;
  public user !: User
  public uploadImage !: File;
  public uploadImagePort !: File;
  public imgTemp!: any;
  public imgTempPort!: any;
  public reader: any;

  constructor( private fileUploadService:FileUploadService,
               public modalService: ModalService,
               private userService: UserService ) {
    this.user =  userService.user;
  }

  ngOnInit(): void {

    this.modalForm = new FormGroup({
      firstName: new FormControl( this.user.firstName , Validators.required ),
      bio: new FormControl( this.user.bio, Validators.required ),
      location: new FormControl( this.user.location, Validators.required ),
      website: new FormControl( this.user.website, Validators.required )
    });

  }

  updateProfile(){

    this.userService.updateProfile( this.modalForm.value )
      .subscribe( resp => {
        this.user.firstName = resp.user.firstName;
        this.user.bio = resp.user.bio;
        this.user.location = resp.user.location;
        this.user.website = resp.user.website;
        this.userService.updateProfile$.next( resp.user );
        this.modalService.closeModal();
      })

  }

  changeImg( file: File ){

    this.uploadImage = file;

    if( !file ){
      this.imgTemp = null;
      return
    }

    this.reader = new FileReader();
    this.reader.readAsDataURL( file );

    this.reader.onloadend = () => {
      this.imgTemp = this.reader.result;
    }

  }

  changeImgPort( file: File ){

    this.uploadImagePort = file;

    if( !file ){
      this.imgTempPort = null;
      return
    }

    this.reader = new FileReader();
    this.reader.readAsDataURL( file );

    this.reader.onloadend = () => {
      this.imgTempPort = this.reader.result;
    }

  }

  closeImg(){
    this.imgTemp = null;
    this.reader = '';
  }


  closeModal(){
    this.modalService.closeModal();
  }

  updateImage(){

    // Mejora multicast RXJS

    if ( this.uploadImage && this.uploadImagePort ) {
      this.fileUploadService.uploadImages( "users", this.uploadImage, this.user.uid )
      .subscribe( ({ nombreArchivo }) => {
        this.user.img = nombreArchivo;
          this.fileUploadService.uploadImages( "usersP", this.uploadImagePort, this.user.uid )
          .subscribe( ({ nombreArchivo }) => {
          this.user.imgPort = nombreArchivo;
          this.modalService.closeModal();
        })
      }) 
    } else if ( this.uploadImage ) {
        
      this.fileUploadService.uploadImages( "users", this.uploadImage, this.user.uid )
      .subscribe( ({ nombreArchivo }) => {
        this.user.img = nombreArchivo;
        this.modalService.closeModal();
      })

    } else if ( this.uploadImagePort ) {
      
      this.fileUploadService.uploadImages( "usersP", this.uploadImagePort, this.user.uid )
      .subscribe( ({ nombreArchivo }) => {
        this.user.imgPort = nombreArchivo;
        this.modalService.closeModal();
      }) 

    }
    
  }

}
