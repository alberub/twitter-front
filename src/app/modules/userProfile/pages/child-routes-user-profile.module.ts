import { NgModule } from '@angular/core';

import { TweetsComponent } from './user-profile-pages/tweets/tweets.component';
import { LikesComponent } from './user-profile-pages/likes/likes.component';
import { MediaComponent } from './user-profile-pages/media/media.component';
import { TweetsRepliesComponent } from './user-profile-pages/tweets-replies/tweets-replies.component';
import { FollowersComponent } from './user-profile-pages/followers/followers.component';
import { FollowingsComponent } from './user-profile-pages/followings/followings.component';

import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

const childRoutes: Routes = [
  
  { path:'', component: TweetsComponent, data: { titulo:'tweets' } },
  { path:'with_replies', component: TweetsRepliesComponent, data: { titulo:'with_replies' } },
  { path:'media', component: MediaComponent, data: { titulo:'media' } },
  { path:'likes', component: LikesComponent, data: { titulo:'likes' } },
  { path:'followers', component: FollowersComponent, data: { titulo:'followers' } },
  { path:'followings', component: FollowingsComponent, data: { titulo:'followings' } }
  
];

@NgModule({
  imports: [RouterModule.forChild( childRoutes ),
            CommonModule],
  exports: [ RouterModule ]
})
export class ChildRoutesUserProfileModule { }
