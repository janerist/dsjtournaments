import { Routes } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ShellComponent} from './shell/shell.component';
import {CupListComponent} from './cups/cup-list.component';
import {CupCreateComponent} from './cups/cup-create.component';
import {CupEditComponent} from './cups/cup-edit.component';
import {JumperListComponent} from './jumpers/jumper-list.component';
import {TournamentListComponent} from './tournaments/tournament-list.component';
import {authGuard} from './common/services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'a',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'a',
    component: ShellComponent,
    canActivate: [authGuard],
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
