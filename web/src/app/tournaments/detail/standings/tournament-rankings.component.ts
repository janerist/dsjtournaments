import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {TournamentRankingsResponseModel} from '../../../shared/api-responses';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {TournamentService} from '../tournament.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-tournament-rankings',
  template: `
    <app-tournament-rankings-table
      *ngIf="$rankings | async, let rankings"
      [competitions]="competitions"
      [rankings]="rankings">
    </app-tournament-rankings-table>
  `
})
export class TournamentRankingsComponent implements OnInit {
  $rankings: Observable<TournamentRankingsResponseModel[]>;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private tournamentService: TournamentService) {
  }

  ngOnInit() {
    this.$rankings = this.route.parent.params
      .pipe(
        switchMap(params => this.httpClient
          .get<TournamentRankingsResponseModel[]>(`${environment.apiUrl}/tournaments/${params['id']}/rankings`))
      );
  }

  get competitions() {
    return this.tournamentService.tournament.competitions;
  }
}
