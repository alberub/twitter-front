import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { TweetCardComponent } from './components/tweet-card/tweet-card.component';
import { NewComponent } from './components/new/new.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalProfileComponent } from './components/modal-profile/modal-profile.component';
import { PipeModule } from '@core/pipes/pipe.module';
import { ModalEditComponent } from './components/modal-edit/modal-edit.component';
import { SearchComponent } from './components/search/search.component';
import { HoverModalComponent } from './components/hover-modal/hover-modal.component';
import { ModalNewComponent } from './components/modal-new/modal-new.component';
import { ModalReplyComponent } from './components/modal-reply/modal-reply.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModalComponent } from './components/emoji-modal/emoji-modal.component';
import { FollowsComponent } from './components/follows/follows.component';
import { BackComponent } from './components/back/back.component';
import { AlertComponent } from './components/alert/alert.component';
import { ImageTweetComponent } from './components/image-tweet/image-tweet.component';
import { MenuMobilComponent } from './components/menu-mobil/menu-mobil.component';
import { SidebarMobileComponent } from './components/sidebar-mobile/sidebar-mobile.component';
import { ShareMenuMobileComponent } from './components/share-menu-mobile/share-menu-mobile.component';
import { ModalTweetCardComponent } from './components/modal-tweet-card/modal-tweet-card.component';
import { WithoutImageDirective } from '@core/directives/without-image.directive';
import { ModalSmallComponent } from './components/modal-small/modal-small.component';

@NgModule({
  declarations: [
    SidebarComponent,
    TweetCardComponent,
    NewComponent,
    ModalProfileComponent,
    ModalEditComponent,
    SearchComponent,
    HoverModalComponent,
    ModalNewComponent,
    ModalReplyComponent,
    EmojiModalComponent,
    FollowsComponent,
    BackComponent,
    AlertComponent,
    ImageTweetComponent,
    MenuMobilComponent,
    SidebarMobileComponent,
    ShareMenuMobileComponent,
    ModalTweetCardComponent,
    WithoutImageDirective,
    ModalSmallComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PipeModule,
    PickerModule
  ],
  exports:[
    SidebarComponent,
    TweetCardComponent,
    NewComponent,
    ModalProfileComponent,
    ModalEditComponent,
    SearchComponent,
    HoverModalComponent,
    ModalNewComponent,
    ModalReplyComponent,
    ReactiveFormsModule,
    EmojiModalComponent,
    FollowsComponent,
    BackComponent,
    AlertComponent,
    ImageTweetComponent,
    MenuMobilComponent,
    SidebarMobileComponent,
    ShareMenuMobileComponent,
    ModalTweetCardComponent,
    ModalSmallComponent
  ]
})
export class SharedModule { }
