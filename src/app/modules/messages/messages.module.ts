import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesPageComponent } from './pages/messages-page/messages-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from '@core/pipes/pipe.module';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    MessagesPageComponent
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    ReactiveFormsModule,
    PipeModule,
    SharedModule
  ]
})
export class MessagesModule { }
