import { BrowserModule } from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule, Http} from '@angular/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import {RouterModule} from '@angular/router';
import {CupListComponent} from './cups/cup-list.component';
import {CupCreateComponent} from './cups/cup-create.component';
import {CupEditComponent} from './cups/cup-edit.component';
import {RankMethodPipe} from './common/pipes/rank-method.pipe';
import {CupFormComponent} from './cups/cup-form.component';
import {CupScheduleComponent} from './cups/cup-schedule.component';
import {CupService} from './cups/cup.service';
import {TournamentService} from './tournaments/tournament.service';
import {ToastService} from './common/services/toast.service';
import {FormService} from './common/services/form.service';
import {JumperListComponent} from './jumpers/jumper-list.component';
import {JumperService} from './jumpers/jumper.service';
import {JumperListRowComponent} from './jumpers/jumper-list-row.component';
import {FlagDirective} from './common/directives/flag.directive';
import {PagerComponent} from './common/components/pager.component';
import {TournamentListComponent} from './tournaments/tournament-list.component';
import {JumperMergeModalComponent} from './jumpers/jumper-merge-modal.component';
import {JumperDetailsComponent} from './jumpers/jumper-details.component';
import {JumperSearchboxComponent} from './jumpers/jumper-searchbox.component';
import {AuthGuard} from './common/services/auth-guard.service';
import {AuthService} from './common/services/auth.service';
import {LoginComponent} from './login/login.component';
import {StorageService} from './common/services/storage.service';
import {LoginWidgetComponent} from './navbar/login-widget.component';
import {AuthenticatedHttpService} from './common/services/authenticated-http.service';
import {LogoutComponent} from './login/logout.component';

@NgModule({
  declarations: [
    // App
    AppComponent,

    // Directives
    FlagDirective,

    // Components
    PagerComponent,

    // Navbar
    NavbarComponent,
    LoginWidgetComponent,

    // Login
    LoginComponent,

    // Cups
    CupListComponent,
    CupCreateComponent,
    CupEditComponent,
    CupFormComponent,
    CupScheduleComponent,

    // Jumpers
    JumperListComponent,
    JumperListRowComponent,
    JumperMergeModalComponent,
    JumperDetailsComponent,
    JumperSearchboxComponent,

    // Tournaments
    TournamentListComponent,

    // Pipes
    RankMethodPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot([
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
    ])
  ],
  providers: [
    { provide: Http, useClass: AuthenticatedHttpService },

    // Cross-feature services
    ToastService,
    FormService,
    StorageService,
    AuthService,
    AuthGuard,

    // Cups
    CupService,

    // Tournaments
    TournamentService,

    // Jumpers
    JumperService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
