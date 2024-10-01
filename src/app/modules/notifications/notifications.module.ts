import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotifPageComponent } from './pages/notifications/notif-page/notif-page.component';
import { PipeModule } from '@core/pipes/pipe.module';


@NgModule({
  declarations: [
    NotifPageComponent
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    PipeModule
  ]
})
export class NotificationsModule { }
