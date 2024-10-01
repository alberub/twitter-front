import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListsRoutingModule } from './lists-routing.module';
import { ListsPageComponent } from './pages/lists-page/lists-page.component';


@NgModule({
  declarations: [
    ListsPageComponent
  ],
  imports: [
    CommonModule,
    ListsRoutingModule
  ]
})
export class ListsModule { }
