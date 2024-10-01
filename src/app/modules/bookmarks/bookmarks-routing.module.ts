import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookmarksPagesComponent } from './pages/bookmarks-pages/bookmarks-pages.component';

const routes: Routes = [
  {
    path:'',
    component: BookmarksPagesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookmarksRoutingModule { }
