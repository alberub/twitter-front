import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tweet } from '@core/models/tweet.model';
import { User } from '@core/models/usuario.model';
import { FileUploadService } from '@shared/services/file-upload.service';
import { ModalService } from '@shared/services/modal.service';
import { TweetService } from '@shared/services/tweet.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-reply',
  templateUrl: './modal-reply.component.html',
  styleUrls: ['./modal-reply.component.css']
})
export class ModalReplyComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('textArea') textArea!: ElementRef;

  public user: User;
  public tweetToReply!: Tweet;
  public subs$ !: Subscription;
  public replyForm!: FormGroup;
  private reader: any;
  public imgTemp: any | null;
  private uploadImage !: File

  constructor( public modalService: ModalService,
               private renderer2: Renderer2,
               private tweetService: TweetService,
               private fileUploadService: FileUploadService,
               private userService: UserService ) {
                 this.user = userService.user;
               }

  ngAfterViewInit(): void {

    const focus = document.getElementById('textarea');  
    const clear = setTimeout(() => {
      
      focus?.focus();
      this.setHeightTextArea();

      clearTimeout( clear );
      
    }, 200);

  }

  ngOnDestroy(): void {
    this.tweetService.tweetReply$.next('');
    this.subs$.unsubscribe();
  }

  ngOnInit(): void {

    this.replyForm = new FormGroup({
      message: new FormControl('', [ Validators.required, Validators.minLength(1), Validators.maxLength(280)])
    })

     this.subs$ = this.tweetService.tweetReply$.subscribe( resp => {         
      this.tweetToReply = resp;
    });

  }

  changeImage( file: File ){

    this.uploadImage = file;

    if ( !file ) {
      this.imgTemp = null;
      return;
    }

    this.reader = new FileReader();
    this.reader.readAsDataURL( file );

    this.reader.onloadend = () => {
      this.imgTemp = this.reader.result;
    }

  }

  closeModal(){
    this.modalService.closeModalreply();
  }

  get pageY(){
    const pageHeight = screen.height;
    const calc = this.modalService.modalTop  ;
    return `${calc + pageHeight}px`
  }

  reply(){
    
    const { message } = this.replyForm.value;
    const id = this.tweetToReply._id;

    this.tweetService.replyTweet( { message, id } )
      .subscribe( ({ tweet, tweetOriginalUpdated }) => {

        if ( this.uploadImage ) {
          this.fileUploadService.uploadImages( 'tweets', this.uploadImage, tweet._id )
            .subscribe( (_) => {

              this.imgTemp = null;
              this.modalService.closeModalreply();
              // this.tweetService.tweetReply$.next( tweetOriginalUpdated );
              this.tweetService.tweetReplied$.next( tweetOriginalUpdated );
              this.tweetService.newReply$.next( tweet );

            })
        } else{

          this.modalService.closeModalreply();
          // this.tweetService.tweetReply$.next( tweetOriginalUpdated );
          this.tweetService.tweetReplied$.next( tweetOriginalUpdated );
          this.tweetService.newReply$.next( tweet );

        }

      })

  } 
  
  setHeightTextArea(): void{

    const textHeight = this.textArea?.nativeElement;
    textHeight?.addEventListener("keyup", (evento: any) => {
      textHeight.style.height = '18px';
      const setHeight = evento.target.scrollHeight;      
      this.renderer2.setStyle( textHeight, 'height' , `${ setHeight }px` );
      
    })

  }

  removeImgTemp(){

    this.imgTemp = null;

  }

}
