import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './pages/dashboard/dashboard.component';
import { SharedModule } from '@shared/shared.module';
import { SocketService } from '@shared/services/socket.service';

@NgModule({
  declarations: [
    DashboardPageComponent    
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ],
  providers:[{
    provide: SocketService
  }]
})
export class DashboardModule { }
