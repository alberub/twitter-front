import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfilePagesComponent } from './pages/user-profile-pages/user-profile-pages.component';

const routes: Routes = [
  {
    path:'',
    component: UserProfilePagesComponent,
    loadChildren: () => import('@modules/userProfile/pages/child-routes-user-profile.module')
    .then( m => m.ChildRoutesUserProfileModule )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
