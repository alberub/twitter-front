import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    data: { title: 'Home' },
    loadChildren:() => import('@modules/home/home.module').then( m => m.HomeModule)
  },
  {
    path:'explore',
    data: { title: 'Explore' },
    loadChildren:() => import('@modules/explore/explore.module').then( m => m.ExploreModule)
  },
  {
    path:'notifications',
    data: { title: 'Notifications' },
    loadChildren:() => import('@modules/notifications/notifications.module').then( m => m.NotificationsModule)
  },
  {
    path:'messages',
    data: { title: 'Messages' },
    loadChildren:() => import('@modules/messages/messages.module').then( m => m.MessagesModule)
  },
  {
    path:'bookmarks',
    data: { title: 'Bookmarks' },
    loadChildren:() => import('@modules/bookmarks/bookmarks.module').then( m => m.BookmarksModule)
  },
  {
    path:'lists',
    data: { title: 'Lists' },
    loadChildren:() => import('@modules/lists/lists.module').then( m => m.ListsModule)
  },
  {
    path: 'profile',    
    loadChildren:() => import('@modules/profile/profile.module').then( m => m.ProfileModule)
  },
  {
    path:':id',
    loadChildren:() => import('@modules/userProfile/user-profile.module').then( m => m.UserProfileModule)
  },
  {
    path:':id/status/:idt',
    loadChildren:() => import('@modules/tweet/tweet.module').then( m => m.TweetModule)
  },
  {
    path:'**',
    redirectTo:''
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
