import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TournamentsComponent } from './tournaments/list/tournaments.component';
import { TournamentComponent } from './tournaments/detail/tournament.component';
import { TournamentStandingsComponent } from './tournaments/detail/standings/tournament-standings.component';
import { FinalStandingsComponent } from './tournaments/detail/standings/final-standings.component';
import { TournamentRankingsComponent } from './tournaments/detail/standings/tournament-rankings.component';
import { CompetitionComponent } from './tournaments/detail/competition/competition.component';
import { CompetitionFinalResultsComponent } from './tournaments/detail/competition/competition-final-results.component';
import { CompetitionQualResultsComponent } from './tournaments/detail/competition/competition-qual-results.component';
import { JumpersComponent } from './jumpers/list/jumpers.component';
import { JumperComponent } from './jumpers/detail/jumper.component';
import { JumperActivityComponent } from './jumpers/detail/jumper-activity.component';
import { JumperStatsComponent } from './jumpers/detail/jumper-stats.component';
import { ResultsComponent } from './results/results.component';
import { CupsComponent } from './cups/list/cups.component';
import { CupComponent } from './cups/detail/cup.component';
import { CupStandingsComponent } from './cups/detail/cup-standings.component';
import { CupStandingsTextComponent } from './cups/detail/cup-standings-text.component';
import { CupRankingsComponent } from './cups/detail/cup-rankings.component';
import { UploadComponent } from './upload/upload.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './util/page-not-found.component';

const routes: Routes = [
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
    {path: 'results', component: ResultsComponent},
    {path: 'cups', component: CupsComponent},
    {path: 'cups/:id', component: CupComponent, children: [
      {path: '', redirectTo: 'standings', pathMatch: 'full'},
      {path: 'standings', component: CupStandingsComponent},
      {path: 'text', component: CupStandingsTextComponent},
      {path: 'rankings', component: CupRankingsComponent},
    ]},
    {path: 'upload', component: UploadComponent},
    {path: 'about', component: AboutComponent},
    {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
