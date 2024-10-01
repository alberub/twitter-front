import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfilePagesComponent } from './pages/user-profile-pages/user-profile-pages.component';
import { SharedModule } from '@shared/shared.module';
import { TweetsComponent } from './pages/user-profile-pages/tweets/tweets.component';
import { LikesComponent } from './pages/user-profile-pages/likes/likes.component';
import { MediaComponent } from './pages/user-profile-pages/media/media.component';
import { TweetsRepliesComponent } from './pages/user-profile-pages/tweets-replies/tweets-replies.component';
import { FollowingsComponent } from './pages/user-profile-pages/followings/followings.component';
import { FollowersComponent } from './pages/user-profile-pages/followers/followers.component';
import { RouterModule } from '@angular/router';
import { WithoutImageDirective } from '@core/directives/without-image.directive';

@NgModule({
  declarations: [
    UserProfilePagesComponent,
    TweetsComponent,
    LikesComponent,
    MediaComponent,
    TweetsRepliesComponent,
    FollowingsComponent,
    FollowersComponent    
  ],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
    SharedModule,
    RouterModule
  ]
})
export class UserProfileModule { }
