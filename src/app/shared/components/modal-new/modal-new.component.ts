import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Tweet } from '@core/models/tweet.model';
import { User } from '@core/models/usuario.model';
import { FileUploadService } from '@shared/services/file-upload.service';
import { ModalService } from '@shared/services/modal.service';
import { TweetService } from '@shared/services/tweet.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-new',
  templateUrl: './modal-new.component.html',
  styleUrls: ['./modal-new.component.css']
})
export class ModalNewComponent implements OnInit {

  @ViewChild('textArea') text?: ElementRef;
  @ViewChild('post') post?: ElementRef;

  public privacity: boolean = false;
  public resize: boolean = false;
  public normalTweet: boolean = true;
  public isSelected: boolean = false;
  private poll: boolean = false;
  public showCharactersCount: boolean = false;
  public showCharactersCount2: boolean = false;
  public loading: boolean = false;
  public tweetForm !: FormGroup;
  public newPost!: Tweet;
  public news: Tweet[] = [];
  public minutes: Array<number> = [];
  public hours: Array<number> = [];
  private subs$: Subscription[] = [];
  private uploadImage !: File | null;
  public imgTemp: any;
  private reader: any;
  public formChoice: number = 0;
  public formChoice2: number = 0;  
  private expirePoll: number = 0;
  public day: number = 1;
  public hour: number = 0;
  public minute: number = 0;
  public countChar: number = 0;
  public countChar2: number = 0;
  public getHeight: number = 0;
  private msg: string = ''

  // @Input('areaHeight') areaHeight: any = 0;
  @Input() usuario: User;
  @ViewChild('textArea') textAreaModal!: ElementRef;

  constructor( private renderer2: Renderer2,
               private tweetService: TweetService,
               public modalService: ModalService,
               private fileUploadService: FileUploadService, 
               private userService: UserService ) {
                 this.usuario = userService.user;
               }

ngOnDestroy(): void {
  this.subs$.forEach( s => {
    s.unsubscribe();
  });   
}

ngOnInit(): void {
  // this.areaHeight = `min-height: ${ this.areaHeight }px;` 
  this.tweetForm = new FormGroup({
    tweet:   new FormControl('', [ Validators.minLength(0),Validators.required ]),
    option1: new FormControl('',[ Validators.minLength(1), Validators.maxLength( 25 )] ),
    option2: new FormControl('', [ Validators.minLength(1), Validators.maxLength(25)] ),
    days:    new FormControl( 1, Validators.minLength(1)),
    hours:   new FormControl( 0, Validators.minLength(1)),
    minutes: new FormControl( 0, Validators.minLength(1))
  });
  this.forTime();
  this.setExpirePoll();
}

ngAfterViewInit(): void {

  this.setHeightTextArea();

  this.news.find( (e: any) => {
    if ( e.likes?.includes( this.usuario.uid ) ) {
      this.news.forEach( e => e.liked === true )
    }
  });

  this.stateForm();

  this.subs$.push(this.tweetForm.get('option1')?.valueChanges.subscribe( resp => {
    if( resp.length >= 0 ){
      this.countChar = resp.length;
    }
  })!
  )

  this.subs$.push(this.tweetForm.get('option2')?.valueChanges.subscribe( resp => {
    if( resp.length >= 0){        
      this.countChar2 = resp.length;
    }
  })!
  )

}

get height(){
  return `${150 + this.getHeight }px`
}

setExpirePoll(){
  this.subs$.push(this.tweetForm.get('days')?.valueChanges.subscribe( resp => {
    this.day = resp;
  })!
  );
  this.subs$.push(this.tweetForm.get('hours')?.valueChanges.subscribe( resp => {
    this.hour = resp;
  })!
  );
  this.subs$.push(this.tweetForm.get('minutes')?.valueChanges.subscribe( resp => {
    this.minute = resp;
  })!
  );

}

pollExpires( days: number, hours: number, minutes: number ): number{
  // 1 day    = 24horas * 60minutes * 60seconds * 1000 -> 1440minutes
  // 1 hour   = 60minutes * 60seconds * 1000 -> 3600seconds
  // 1 minute = 60 seconds * 1000
  const day    = ( days * 24 * 3600 * 1000);
  const hour   = ( hours * 3600 * 1000);
  const minute = ( minutes * 60 *1000)
  const date = day + hour + minute;
  const datenow = Date.now() + date;
  return this.expirePoll = datenow;

}

changeImg( file: File ){
  
  if (file) {    
    this.uploadImage = file;
  }

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

closeImg(){
  this.imgTemp = null;
  this.reader = '';
  this.uploadImage = null;
}

setHeightTextArea(): void{

  const textHeight = this.text?.nativeElement;
  textHeight?.addEventListener("keyup", (evento: any) => {
    textHeight.style.height = '98px';
    const setHeight = evento.target.scrollHeight;      
    this.renderer2.setStyle( textHeight, 'height' , `${ setHeight }px` );
    this.getHeight = setHeight;  
  })

}

stateForm(){

  const clic = document.querySelector('textarea');
  clic?.addEventListener('click', () => {
    this.privacity = true;
  })

  addEventListener("keydown", ( event ) => {
    if (event.code === 'Escape') {
      this.privacity = false;
    }
  });

}

newTweet(){

  this.loading = true;
  const { tweet, option1, option2 } = this.tweetForm.value;
  if ( option1?.length > 0 ) {
    this.poll = true;
    this.pollExpires( this.day, this.hour, this.minute );
  }
  this.tweetService.newTweet( tweet, 
                              { 'choice': option1, 'vote': 0 }, 
                              { 'choice2': option2, 'vote': 0},
                                this.poll,
                                this.expirePoll )
    .subscribe( ({ newPost, msg }) => {      
      this.newPost = newPost;
      this.msg = msg;
      if ( this.newPost && this.uploadImage ) {                 
          this.fileUploadService.uploadImages( 'tweets' , this.uploadImage!, newPost._id )
          .subscribe( ({ nombreArchivo }) => {
            this.newPost.img = nombreArchivo;
            this.imgTemp = null;
            this.uploadImage = null;      
        });  
      }
      this.tweetService.newTweet$.next( this.newPost );
      this.tweetForm.reset();
      this.text!.nativeElement.style.height = '30px';
      this.privacity = false;             
      this.normalTweet = true;        
    });
    const timer = setTimeout(() => {
      this.loading = false;
      this.tweetService.labelText$.next( this.msg );
      this.modalService.closeModalNew();
      clearTimeout( timer )
    }, 1000);
}

createPoll(){
  this.normalTweet = false;
}

showCount( id: string ){

  if ( id === 'input1') {
    this.showCharactersCount = true;
    this.showCharactersCount2 = false;
  } else{
    this.showCharactersCount = false;
    this.showCharactersCount2 = true;
  }

}

forTime(){
  for (let index = 0; index < 60; index++) {
    this.minutes.push( index );
  }
  for (let index = 0; index < 24; index++) { 
    this.hours.push( index );
  }
}

openModalEmoji(){

  this.modalService.openModalEmoji();

}

addEmoji( selected: any ){
  
  const input = this.textAreaModal.nativeElement;
  input.focus();
  const emoji = selected.emoji.native;

  if (document.execCommand) {
    
    var event = new Event('input');
    document.execCommand('insertText', false, emoji );
    return;

  }

  const [ start, end ] = [ input.selectionStart, input.selectionend ];
  input.setRangeText( emoji, start, end, 'end' );  

}

removePoll(){
  this.normalTweet = true;
}
                            

closeModal(){
  this.modalService.closeModalNew();
}

}
