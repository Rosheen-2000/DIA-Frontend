import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './passport/login/login.component';
import {PassportComponent} from '../layout/passport/passport.component';
import {RegisterComponent} from './passport/register/register.component';
import {DefaultComponent} from '../layout/default/default.component';
import {EditorComponent} from '../layout/editor/editor.component';
import {DocumentComponent} from './document/document.component';
import {SpaceComponent} from './space/space.component';
import {TrashComponent} from './trash/trash.component';
import {DesktopComponent} from './desktop/desktop.component';
import {FolderComponent} from './folder/folder.component';
import {OwnComponent} from "./dashboard/own/own.component";
import {FavoritesComponent} from "./dashboard/favorites/favorites.component";
import {UsedComponent} from "./dashboard/used/used.component";
import {FeedbackComponent} from "./feedback/feedback.component";
import { UnsaveGuard } from '../core/guards/unsave.guard'
import { UserspaceComponent } from './userspace/userspace.component'

const routes: Routes = [
  {
    path: 'passport', component: PassportComponent, children: [
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent}
    ]
  },
  {
    path: '', component: DefaultComponent, children: [
      {path: 'dashboard', children: [
          {path: 'own', component: OwnComponent},
          {path: 'favorites', component: FavoritesComponent},
          {path: 'used', component: UsedComponent},
          {path: '**', redirectTo: 'own'},
        ]},
      {path: 'trash', component: TrashComponent},
      {path: 'space/:id', component: SpaceComponent},
      {path: 'desktop', component: DesktopComponent},
      {path: 'folder/:id', component: FolderComponent},
      {path: 'feedback', component: FeedbackComponent},
      {path: 'userspace', component: UserspaceComponent},
      {path: '', redirectTo: '/dashboard/own', pathMatch: 'full'},
    ]
  },
  {
    path: 'docs', component: EditorComponent, children: [
      {path: ':id', component: DocumentComponent, canDeactivate: [UnsaveGuard]}
    ]
  },
  {
    path: '**', redirectTo: '/dashboard/own'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RoutesRoutingModule {
}
