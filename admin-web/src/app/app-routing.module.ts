import {AuthGuard} from './common/services/auth-guard.service';
import {LoginComponent} from './login/login.component';
import {CupListComponent} from './cups/cup-list.component';
import {CupCreateComponent} from './cups/cup-create.component';
import {CupEditComponent} from './cups/cup-edit.component';
import {JumperListComponent} from './jumpers/jumper-list.component';
import {TournamentListComponent} from './tournaments/tournament-list.component';
import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

const routes: Routes = [
  { path: '', redirectTo: 'cups', pathMatch: 'full', canActivate: [AuthGuard]},

  // Login
  { path: 'login', component: LoginComponent},

  // Cups
  { path: 'cups', component: CupListComponent, canActivate: [AuthGuard]},
  { path: 'cups/create', component: CupCreateComponent, canActivate: [AuthGuard]},
  { path: 'cups/:id', component: CupEditComponent, canActivate: [AuthGuard]},

  // Jumpers
  { path: 'jumpers', component: JumperListComponent, canActivate: [AuthGuard]},

  // Tournaments
  { path: 'tournaments', component: TournamentListComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
