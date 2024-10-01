import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotifPageComponent } from './pages/notifications/notif-page/notif-page.component';

const routes: Routes = [
  {
    path:'',
    component: NotifPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
