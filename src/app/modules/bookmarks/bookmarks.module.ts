import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookmarksRoutingModule } from './bookmarks-routing.module';
import { BookmarksPagesComponent } from './pages/bookmarks-pages/bookmarks-pages.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    BookmarksPagesComponent
  ],
  imports: [
    CommonModule,
    BookmarksRoutingModule,
    SharedModule
  ]
})
export class BookmarksModule { }
