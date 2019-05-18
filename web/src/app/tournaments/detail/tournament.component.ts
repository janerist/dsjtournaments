import {Component, OnInit} from '@angular/core';
import {TournamentResponseModel} from '../../shared/api-responses';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';
import {TournamentService} from './tournament.service';
import {switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-tournament',
  template: `
    <div class="ui two column stackable grid" *ngIf="$tournament | async, let tournament">
      <div [ngClass]="{twelve: !hideCompetitions, sixteen: hideCompetitions, wide: true, column: true}">
        <div class="ui stackable two column grid">
          <div class="eight wide column">
            <div class="ui items">
              <app-tournament-header [tournament]="tournament" class="item"></app-tournament-header>
            </div>
          </div>
          <div class="eight wide column">
            <div class="ui segment center aligned" *ngIf="getSelectedCompetition(tournament), let competition">
              <i [appFlag]="competition.hillNation"></i>
              {{competition.hillName}}
              <span *ngIf="competition.fileNumber > 1">[{{competition.fileNumber}}]</span>
              <span *ngIf="competition.ko">(KO)</span>
            </div>
          </div>
        </div>

        <div *ngIf="tournament.cups?.length" class="ui info message" style="margin-top: 0">
          This tournament is part of
          <ng-container *ngFor="let cup of tournament.cups, let i = index">
            <a [routerLink]="['/cups', cup.id]">
              {{cup.name}}
            </a><span *ngIf="i < tournament.cups.length - 2">, </span><span *ngIf="i === tournament.cups.length - 2"> and </span>
          </ng-container>
        </div>

        <router-outlet></router-outlet>
      </div>

      <div class="four wide column" [hidden]="hideCompetitions">
        <div class="ui segment">
          <app-competition-list
            *ngIf="tournament.competitions.length"
            [competitions]="tournament.competitions">
          </app-competition-list>

          <p *ngIf="!tournament.competitions.length">
            No individual competition stats are uploaded for this tournament.
          </p>
        </div>
      </div>
    </div>
  `,
  providers: [TournamentService]
})
export class TournamentComponent implements OnInit {
  $tournament: Observable<TournamentResponseModel>;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private tournamentService: TournamentService) {
  }

  ngOnInit() {
    this.$tournament = this.route.paramMap
      .pipe(
        switchMap(params => this.httpClient.get<TournamentResponseModel>(`${environment.apiUrl}/tournaments/${params.get('id')}`)),
        tap(tournament => this.tournamentService.tournament = tournament)
      );
  }

  getSelectedCompetition(tournament: TournamentResponseModel) {
    return this.tournamentService.competitionId
      ? tournament.competitions.find(c => c.id === this.tournamentService.competitionId)
      : null;
  }

  get hideCompetitions() {
    return this.tournamentService.hideCompetitions;
  }
}
