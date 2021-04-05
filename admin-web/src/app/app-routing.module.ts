import {AuthGuard} from './common/services/auth-guard.service';
import {CupListComponent} from './cups/cup-list.component';
import {CupCreateComponent} from './cups/cup-create.component';
import {CupEditComponent} from './cups/cup-edit.component';
import {JumperListComponent} from './jumpers/jumper-list.component';
import {TournamentListComponent} from './tournaments/tournament-list.component';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {AuthCallbackComponent} from './auth-callback/auth-callback.component';
import {ShellComponent} from './shell/shell.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'a',
    pathMatch: 'full'
  },

  {
    path: 'auth-callback',
    component: AuthCallbackComponent
  },

  {
    path: 'a',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'cups', pathMatch: 'full'},

      // Cups
      {path: 'cups', component: CupListComponent},
      {path: 'cups/create', component: CupCreateComponent},
      {path: 'cups/:id', component: CupEditComponent},

      // Jumpers
      {path: 'jumpers', component: JumperListComponent},

      // Tournaments
      {path: 'tournaments', component: TournamentListComponent},
    ]
  },

  {
    path: '**',
    redirectTo: 'a'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
