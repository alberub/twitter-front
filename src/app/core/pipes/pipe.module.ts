import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen.pipe';
import { LastMessagePipe } from './last-message.pipe';
import { FilterPipe } from './filter.pipe';
import { DatePipe } from './date.pipe';
import { ImagePipe } from './image.pipe';



@NgModule({
  declarations: [
    ImagenPipe,
    LastMessagePipe,
    FilterPipe,
    DatePipe,
    ImagePipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ImagenPipe,
    LastMessagePipe,
    FilterPipe,
    DatePipe,
    ImagePipe
  ]
})
export class PipeModule { }
