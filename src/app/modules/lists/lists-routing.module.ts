import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListsPageComponent } from './pages/lists-page/lists-page.component';

const routes: Routes = [
  {
    path:'',
    component: ListsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListsRoutingModule { }
