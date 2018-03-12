import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {NgUploaderModule} from 'ngx-uploader';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {RouterModule, Routes} from '@angular/router';
import {UploadComponent} from './upload/upload.component';
import {CupListComponent} from './cups/list/cup-list.component';
import {TournamentListComponent} from './tournaments/list/tournament-list.component';
import {JumpersComponent} from './jumpers/list/jumpers.component';
import {PageNotFoundComponent} from './util/page-not-found.component';
import {UploaderComponent} from './upload/uploader.component';
import {PaginationComponent} from './shared/components/pagination.component';
import {TournamentsComponent} from './tournaments/list/tournaments.component';
import {TournamentSortComponent} from './tournaments/list/tournament-sort.component';
import {TournamentMonthSelectComponent} from './tournaments/list/tournament-month-select.component';
import {TournamentTypesComponent} from './tournaments/list/tournament-types.component';
import {FlagDirective} from './shared/directives/flag.directive';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {DataInterceptor} from './shared/http/data-interceptor';
import {TournamentComponent} from './tournaments/detail/tournament.component';
import {QualificationResultsTableComponent} from './tournaments/shared/qualification-results-table.component';
import {FinalResultsTableComponent} from './tournaments/shared/final-results-table.component';
import {CompetitionListComponent} from './tournaments/detail/competition-list.component';
import {FinalStandingsTableComponent} from './tournaments/shared/final-standings-table.component';
import {TournamentHeaderComponent} from './tournaments/shared/tournament-header.component';
import {CompetitionComponent} from './tournaments/detail/competition/competition.component';
import {JumperSearchComponent} from './jumpers/list/jumper-search.component';
import {JumperSortComponent} from './jumpers/list/jumper-sort.component';
import {JumperListComponent} from './jumpers/list/jumper-list.component';
import {TournamentRankingsTableComponent} from './tournaments/shared/tournament-rankings-table.component';
import {DragScrollModule} from 'ngx-drag-scroll';
import {JumperComponent} from './jumpers/detail/jumper.component';
import {JumperFormComponent} from './jumpers/detail/jumper-form.component';
import {JumperActivityComponent} from './jumpers/detail/jumper-activity.component';
import {JumperStatsComponent} from './jumpers/detail/jumper-stats.component';
import {JumperStatsTableComponent} from './jumpers/detail/jumper-stats-table.component';
import {CupsComponent} from './cups/list/cups.component';
import {RankMethodPipe} from './shared/pipes/rank-method.pipe';
import {DatePipe, DatetimePipe} from './shared/pipes/date.pipe';
import {CupSeasonsComponent} from './cups/list/cup-seasons.component';
import {CupComponent} from './cups/detail/cup.component';
import {CupHeaderComponent} from './cups/detail/cup-header.component';
import {CupScheduleComponent} from './cups/detail/cup-schedule.component';
import {CupStandingsComponent} from './cups/detail/cup-standings.component';
import {CupStandingsTableComponent} from './cups/detail/cup-standings-table.component';
import {CupRankingsComponent} from './cups/detail/cup-rankings.component';
import {CupStandingsTextComponent} from './cups/detail/cup-standings-text.component';
import {CupStandingsTableTextComponent} from './cups/detail/cup-standings-table-text.component';
import {CupRankingsTableComponent} from './cups/detail/cup-rankings-table.component';
import {GlobalErrorHandler} from './util/global-error-handler';
import {GravatarDirective} from './shared/directives/gravatar.directive';
import {FinalStandingsComponent} from './tournaments/detail/standings/final-standings.component';
import {TournamentRankingsComponent} from './tournaments/detail/standings/tournament-rankings.component';
import {TournamentStandingsComponent} from './tournaments/detail/standings/tournament-standings.component';
import {CompetitionFinalResultsComponent} from './tournaments/detail/competition/competition-final-results.component';
import {CompetitionQualResultsComponent} from './tournaments/detail/competition/competition-qual-results.component';

const appRoutes: Routes = [
  {path: '', redirectTo: 'tournaments', pathMatch: 'full'},
  {path: 'tournaments', component: TournamentsComponent},
  {path: 'tournaments/:id', component: TournamentComponent, children: [
    {path: '', component: TournamentStandingsComponent, children: [
      {path: '', redirectTo: 'finalstandings', pathMatch: 'full'},
      {path: 'finalstandings', component: FinalStandingsComponent},
      {path: 'rankings', component: TournamentRankingsComponent, data: {hideCompetitions: true}}
    ]},
    {path: 'competitions/:cid', component: CompetitionComponent, children: [
      {path: '', redirectTo: 'final', pathMatch: 'full'},
      {path: 'final', component: CompetitionFinalResultsComponent},
      {path: 'qual', component: CompetitionQualResultsComponent}
  ]}
  ]},
  {path: 'jumpers', component: JumpersComponent},
  {path: 'jumpers/:id', component: JumperComponent, children: [
    {path: '', redirectTo: 'activity', pathMatch: 'full'},
    {path: 'activity', component: JumperActivityComponent},
    {path: 'stats', component: JumperStatsComponent}
  ]},
  {path: 'cups', component: CupsComponent},
  {path: 'cups/:id', component: CupComponent, children: [
    {path: '', redirectTo: 'standings', pathMatch: 'full'},
    {path: 'standings', component: CupStandingsComponent},
    {path: 'text', component: CupStandingsTextComponent},
    {path: 'rankings', component: CupRankingsComponent},
  ]},
  {path: 'upload', component: UploadComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  declarations: [
    // App
    AppComponent,
    HeaderComponent,
    PageNotFoundComponent,
    FlagDirective,
    GravatarDirective,
    RankMethodPipe,
    DatePipe,
    DatetimePipe,

    // Common
    PaginationComponent,

    // Upload
    UploaderComponent,
    UploadComponent,

    // Tournaments
    // -- Tournaments -- List
    TournamentsComponent,
    TournamentListComponent,
    TournamentSortComponent,
    TournamentMonthSelectComponent,
    TournamentTypesComponent,

    // -- Tournaments -- Detail
    TournamentComponent,
    CompetitionListComponent,

    // -- Tournaments -- Detail -- Standings
    TournamentStandingsComponent,
    FinalStandingsComponent,
    TournamentRankingsComponent,

    // -- Tournaments -- Detail -- Competition
    CompetitionComponent,
    CompetitionFinalResultsComponent,
    CompetitionQualResultsComponent,

    // -- Shared
    TournamentHeaderComponent,
    FinalStandingsTableComponent,
    TournamentRankingsTableComponent,
    FinalResultsTableComponent,
    QualificationResultsTableComponent,

    // Jumpers
    JumpersComponent,
    JumperSearchComponent,
    JumperSortComponent,
    JumperListComponent,
    JumperComponent,
    JumperStatsComponent,
    JumperStatsTableComponent,
    JumperActivityComponent,
    JumperFormComponent,

    // Cups
    CupsComponent,
    CupListComponent,
    CupSeasonsComponent,
    CupComponent,
    CupHeaderComponent,
    CupScheduleComponent,
    CupStandingsComponent,
    CupStandingsTableComponent,
    CupStandingsTextComponent,
    CupRankingsComponent,
    CupStandingsTableTextComponent,
    CupRankingsTableComponent,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserModule,
    NgUploaderModule,
    HttpClientModule,
    DragScrollModule,
  ],
  providers: [
    // App
    { provide: HTTP_INTERCEPTORS, useClass: DataInterceptor, multi: true},
    { provide: ErrorHandler, useClass: GlobalErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
