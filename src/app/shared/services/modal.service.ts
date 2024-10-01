import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private _modalTop: number = 0;
  private _modalLeft: number = 0;
  private _modalImageTweetHeight: number = 0;
  private _modalProfile: boolean = true;
  private _modalProfileEdit: boolean = false;
  private _modalSmall: boolean = true;
  private _modalSearch: boolean = true;
  private _modalHover: boolean = true;
  private _modalNew: boolean = true;
  private _modalReply: boolean = true;
  private _modalDelete: boolean = false;
  private _modalEmoji: boolean = true;
  private _modalNewChat: boolean = true;
  private _modalChatOptions: boolean = true;
  private _modalFullScreen: boolean = false;
  private _modalImageTweet: boolean = true;
  private _modalSidebarMobile: boolean = true;
  private _shareModal: boolean = false;
  private _modalForTweetCard: boolean = false;
  private _modalForTweetCardShare: boolean = false;
  private _modalOut: boolean = false;

  public modalHoverActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>( false );

  constructor() {}

  get modalProfile(): boolean{
    return this._modalProfile;
  }

  get modalProfileEdit(): boolean{
    return this._modalProfileEdit;
  }

  get modalSmall(): boolean{
    return this._modalSmall;
  }

  get modalSearch(): boolean{
    return this._modalSearch;
  }

  get modalHover(): boolean{
    return this._modalHover;
  }

  get modalTop(){
    return this._modalTop;
  }

  get modalLeft(){
    return this._modalLeft;
  }

  get modalNew(): boolean{
    return this._modalNew;
  }

  get modalReply():boolean{
    return this._modalReply;
  }

  get modalDelete(){
    return this._modalDelete;
  }

  get modalEmoji(){
    return this._modalEmoji;
  }

  get modalNewChat(){
    return this._modalNewChat;
  }

  get modalChatOptions(){
    return this._modalChatOptions;
  }

  get modalFullScreen(): boolean {
    return this._modalFullScreen;
  }

  get modalImageTweet(){
    return this._modalImageTweet;
  }

  get modalImageTweetHeight(){
    return this._modalImageTweetHeight;
  }

  get modalSidebarMobile(){
    return this._modalSidebarMobile;
  }

  get shareModal(){
    return this._shareModal;
  }

  get modalForTweetCard(){
    return this._modalForTweetCard;
  }

  get modalForTweetCardShare(){
    return this._modalForTweetCardShare;
  }

  get modalOut(){
    return this._modalOut;
  }

  openModal(){
    this._modalProfile = false;
    const body = document.getElementById('body-pd');
    body?.classList.toggle('over');    
  }

  closeModal(){
    this._modalProfile = true;
    const body = document.getElementById('body-pd');
    body?.classList.toggle('over'); 
  }

  openModalEdit(){
    this._modalProfileEdit = false;
  }

  closeModalEdit(){
    this._modalProfileEdit = true;
  }

  openModalSmall(){
    this._modalSmall = false;
  }

  closeModalSmall(){
    this._modalSmall = true;
  }

  openModalSearch(){
    this._modalSearch = false;
  }

  closeModalSearch(){
    this._modalSearch = true;
  }

  openModalHover(){
    this._modalHover = false;
  }

  closeModalHover(){
    const sto = setTimeout(() => {
      this._modalHover = true;
      clearTimeout( sto );
    }, 500);

  }

  setModalTop( pageY: number ){
    this._modalTop = pageY;
  }

  setModalLeft( pageX: number ){
    this._modalLeft = pageX;
  }

  openModalNew(){
    this._modalNew = false;
    const body = document.getElementById('body-pd');
    body?.classList.add('over');
  }

  closeModalNew(){
    this._modalNew = true;
    const body = document.getElementById('body-pd');
    body?.classList.remove('over');
  }

  openModalReply(){
    this._modalReply = false;
    const body = document.getElementById('body-pd');
    body?.classList.toggle('over');
  }
  
  closeModalreply(){
    this._modalReply = true;
    const body = document.getElementById('body-pd');
    body?.classList.toggle('over');
  }

  openModalDelete(){
    this._modalDelete = true;
  }

  closeModalDelete(){
    this._modalDelete = false;
  }

  openModalEmoji(){
    this._modalEmoji = false;
  }

  closeModalEmoji(){
    this._modalEmoji = true;
  }

  openModalNewChat(){
    this._modalNewChat = false;
    const body = document.getElementById('body-pd');
    body?.classList.add('over'); 
  }

  closeModalNewChat(){
    this._modalNewChat = true;
    const body = document.getElementById('body-pd');
    body?.classList.remove('over');
  }

  openModalChatOptions(){
    this._modalChatOptions = false;
  }

  closeModalChatOptions(){
    this._modalChatOptions = true;
  }

  openModalFullScreen(){
    this._modalFullScreen = true;
    const body = document.getElementById('body-pd');
    body?.classList.toggle('over'); 
  }
  
  closeModalFullScreen(){
    this._modalFullScreen = false;
    const body = document.getElementById('body-pd');
    body?.classList.toggle('over'); 
  }

  openModalImageTweet(){
    this._modalImageTweet = false;
    const body = document.getElementById('body-pd');
    body?.classList.add('over'); 
  }

  closeModalImageTweet(){
    this._modalImageTweet = true;
    const body = document.getElementById('body-pd');
    body?.classList.remove('over'); 
  }

  setHeightForImageTweet( height: number ){

    this._modalImageTweetHeight = height;

  }

  openSidebarMobile(){
    this._modalSidebarMobile = false;
    const body = document.getElementById('body-pd');
    body?.classList.add('over');
  }
  
  closeSidebarMobile(){
    this._modalSidebarMobile = true;
    const body = document.getElementById('body-pd');
    body?.classList.remove('over');
  }

  openModalShareMobile(){
    this._shareModal = true;
    const body = document.getElementById('body-pd');
    body?.classList.add('over');
  }

  closeModalShareMobile(){
    this._shareModal = false;
    const body = document.getElementById('body-pd');
    body?.classList.remove('over');
  }

  openModalForTweetCard(){
    this._modalForTweetCard = true;    
  }

  closeModalForTweetCard(){
    this._modalForTweetCard = false;
  }

  openModalForTweetCardShare(){
    this._modalForTweetCardShare = true;    
  }

  closeModalForTweetCardShare(){
    this._modalForTweetCardShare = false;
  }

  openModalOut(){
    const timer = setTimeout(() => {      
      this._modalOut = true;      
      clearTimeout( timer );
    }, 100);
  }

  closeModalOut(){
    this._modalOut = false;    
  }

}
