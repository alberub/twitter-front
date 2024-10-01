import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { TweetsComponent } from './profile-page/tweets/tweets.component';
import { TweetsRepliesComponent } from './profile-page/tweets-replies/tweets-replies.component';
import { MediaComponent } from './profile-page/media/media.component';
import { LikesComponent } from './profile-page/likes/likes.component';
import { FollowingsComponent } from './profile-page/followings/followings.component';
import { FollowersComponent } from './profile-page/followers/followers.component';
import { PipeModule } from '@core/pipes/pipe.module';
import { SharedModule } from '@shared/shared.module';
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
  imports: [RouterModule.forChild(childRoutes), 
            PipeModule,
            SharedModule,
            CommonModule],

  exports: [RouterModule],
  
  declarations: [
  ]
})
export class ChildProfileRoutingModule {}
