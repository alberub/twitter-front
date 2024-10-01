import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExploreRoutingModule } from './explore-routing.module';
import { ExplorePageComponent } from './pages/explore-page/explore-page.component';
import { PipeModule } from '@core/pipes/pipe.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    ExplorePageComponent
  ],
  imports: [
    CommonModule,
    ExploreRoutingModule,
    PipeModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ExploreModule { }
