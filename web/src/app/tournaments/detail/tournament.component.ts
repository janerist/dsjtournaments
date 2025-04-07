import {Component, effect, inject, input} from '@angular/core';
import { RouterLink, RouterOutlet} from '@angular/router';
import {TournamentService} from './tournament.service';
import {NgClass} from '@angular/common';
import {TournamentHeaderComponent} from '../shared/tournament-header.component';
import {FlagDirective} from '../../shared/directives/flag.directive';
import {CompetitionListComponent} from './competition-list.component';
import {httpResource} from '@angular/common/http';
import {TournamentResponseModel} from '../../shared/api-responses';

@Component({
  selector: 'app-tournament',
  imports: [
    NgClass,
    TournamentHeaderComponent,
    FlagDirective,
    RouterLink,
    RouterOutlet,
    CompetitionListComponent
  ],
  template: `
    @if (tournamentService.tournament(); as tournament) {
      <div class="ui two column stackable grid">
        <div [ngClass]="tournamentService.hideCompetitions() ? ['sixteen wide column'] : ['twelve wide column']">
          <div class="ui stackable two column grid">
            <div class="eight wide column">
              <div class="ui items">
                <app-tournament-header [tournament]="tournament" class="item"></app-tournament-header>
              </div>
            </div>
            <div class="eight wide column">
              @if (tournamentService.selectedCompetition(); as competition) {
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

        <div class="four wide column" [hidden]="tournamentService.hideCompetitions()">
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
  id = input.required();
  tournamentService = inject(TournamentService);

  constructor() {
    const tournamentResource = httpResource<TournamentResponseModel>(() => `/tournaments/${this.id()}`);
    effect(() => {
      if (tournamentResource.hasValue()) {
        this.tournamentService.setTournament(tournamentResource.value());
      }
    });
  }
}
