import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from '@core/guards/auth-guard.guard';
import { DashboardPageComponent } from '@modules/dashboard/pages/dashboard/dashboard.component';

const routes: Routes = [

  { path:'auth',
    loadChildren: () => import('./modules/auth/auth.module').then( m => m.AuthModule)
  },
  {
    path:'',
    component: DashboardPageComponent,
    canLoad:[ AuthGuardGuard ],
    canActivate:[ AuthGuardGuard ],
    loadChildren:() => import('@modules/dashboard/dashboard.module').then( m => m.DashboardModule)
  }
]

@NgModule({
  imports: [ RouterModule.forRoot( routes, { scrollPositionRestoration:'enabled' })],
  exports:[RouterModule]
})
export class AppRoutingModule { }
