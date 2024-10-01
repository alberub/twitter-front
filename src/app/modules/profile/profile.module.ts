import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { TweetsComponent } from './pages/profile-page/tweets/tweets.component';
import { SharedModule } from '@shared/shared.module';
import { LikesComponent } from './pages/profile-page/likes/likes.component';
import { TweetsRepliesComponent } from './pages/profile-page/tweets-replies/tweets-replies.component';
import { MediaComponent } from './pages/profile-page/media/media.component';
import { PipeModule } from '@core/pipes/pipe.module';
import { FollowersComponent } from './pages/profile-page/followers/followers.component';
import { FollowingsComponent } from './pages/profile-page/followings/followings.component';

@NgModule({
  declarations: [
    ProfilePageComponent,
    TweetsComponent,
    LikesComponent,
    TweetsRepliesComponent,
    MediaComponent,
    FollowersComponent,
    FollowingsComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    PipeModule
  ]
})
export class ProfileModule { }
