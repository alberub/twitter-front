import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TweetRoutingModule } from './tweet-routing.module';
import { TweetComponent } from './pages/tweet-page/tweet/tweet.component';
import { SharedModule } from '@shared/shared.module';
import { PipeModule } from '@core/pipes/pipe.module';


@NgModule({
  declarations: [
    TweetComponent
  ],
  imports: [
    CommonModule,
    TweetRoutingModule,
    SharedModule,
    PipeModule
  ]
})
export class TweetModule { }
