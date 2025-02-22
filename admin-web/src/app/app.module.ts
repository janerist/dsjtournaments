import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, inject, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
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
import {LoginWidgetComponent} from './navbar/login-widget.component';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpErrorResponse} from '@angular/common/http';
import {AuthInterceptor} from './common/http/auth-interceptor';
import {AppRoutingModule} from './app-routing.module';
import { ShellComponent } from './shell/shell.component';
import { LoginComponent } from './login/login.component';

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

    ShellComponent,
      LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory:  (authService: AuthService) => async () => {
        await authService.loadUser();
      },
      multi: true,
      deps: [AuthService]
    },

    // Cross-feature services
    ToastService,
    FormService,
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
