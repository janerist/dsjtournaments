import {Component, inject} from '@angular/core';
import {TournamentResponseModel} from '../../shared/api-responses';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, RouterLink, RouterOutlet} from '@angular/router';
import {environment} from '../../../environments/environment';
import {TournamentService} from './tournament.service';
import {switchMap, tap} from 'rxjs/operators';
import {AsyncPipe, NgClass} from '@angular/common';
import {TournamentHeaderComponent} from '../shared/tournament-header.component';
import {FlagDirective} from '../../shared/directives/flag.directive';
import {CompetitionListComponent} from './competition-list.component';

@Component({
  selector: 'app-tournament',
  imports: [
    AsyncPipe,
    NgClass,
    TournamentHeaderComponent,
    FlagDirective,
    RouterLink,
    RouterOutlet,
    CompetitionListComponent
  ],
  template: `
    @if ($tournament | async; as tournament) {
      <div class="ui two column stackable grid">
        <div [ngClass]="hideCompetitions ? ['sixteen wide column'] : ['twelve wide column']">
          <div class="ui stackable two column grid">
            <div class="eight wide column">
              <div class="ui items">
                <app-tournament-header [tournament]="tournament" class="item"></app-tournament-header>
              </div>
            </div>
            <div class="eight wide column">
              @if (getSelectedCompetition(tournament); as competition) {
                <div class="ui segment center aligned">
                  <i [appFlag]="competition.hillNation"></i>
                  {{ competition.hillName }}
                  @if (competition.fileNumber > 1) {
                    [{{ competition.fileNumber }}]
                  }
                  @if (competition.ko) {
                    (KO)
                  }
                </div>
              }
            </div>
          </div>

          @if (tournament.cups?.length) {
            <div class="ui info message" style="margin-top: 0">
              This tournament is part of
              @for (cup of tournament.cups; track cup.id) {
                <a [routerLink]="['/cups', cup.id]">
                  {{ cup.name }}
                </a>
                @if ($index < tournament.cups.length - 2) {
                  ,
                } @else if ($index === tournament.cups.length - 2) {
                  and
                }
              }
            </div>
          }

          <router-outlet></router-outlet>
        </div>

        <div class="four wide column" [hidden]="hideCompetitions">
          <div class="ui segment">
            @if (tournament.competitions.length) {
              <app-competition-list [competitions]="tournament.competitions"></app-competition-list>
            } @else {
              <p>
                No individual competition stats are uploaded for this tournament.
              </p>
            }
          </div>
        </div>
      </div>
    }
  `,
  providers: [TournamentService]
})
export class TournamentComponent {
  private route = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);
  private tournamentService = inject(TournamentService);

  $tournament = this.route.paramMap
    .pipe(
      switchMap(params => this.httpClient.get<TournamentResponseModel>(`${environment.apiUrl}/tournaments/${params.get('id')}`)),
      tap(tournament => this.tournamentService.tournament = tournament)
    );

  getSelectedCompetition(tournament: TournamentResponseModel) {
    return this.tournamentService.competitionId
      ? tournament.competitions.find(c => c.id === this.tournamentService.competitionId)
      : null;
  }

  get hideCompetitions() {
    return this.tournamentService.hideCompetitions;
  }
}
