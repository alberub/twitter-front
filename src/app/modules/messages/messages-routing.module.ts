import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagesPageComponent } from './pages/messages-page/messages-page.component';

const routes: Routes = [
  {
    path:'',
    component: MessagesPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessagesRoutingModule { }

// {
  //   path:'message',
  //   redirectTo:':room',
  //   pathMatch: 'full',
  //   component: MessagesPageComponent
  // }
// {path: 'users', redirectTo: 'users/', pathMatch: 'full'},
    // {path: 'users/:userId', component: UserComponent}