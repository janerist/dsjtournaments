import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {TournamentRankingsResponseModel} from '../../../shared/api-responses';
import {environment} from '../../../../environments/environment';
import {TournamentService} from '../tournament.service';
import {switchMap} from 'rxjs/operators';
import {TournamentRankingsTableComponent} from '../../shared/tournament-rankings-table.component';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-tournament-rankings',
  imports: [
    TournamentRankingsTableComponent,
    AsyncPipe
  ],
  template: `
    @if ($rankings | async; as rankings) {
      <app-tournament-rankings-table
        [competitions]="competitions"
        [rankings]="rankings">
      </app-tournament-rankings-table>
    }
  `
})
export class TournamentRankingsComponent {
  private route = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);
  private tournamentService = inject(TournamentService);

  $rankings = this.route.parent!.paramMap
    .pipe(
      switchMap(params => this.httpClient
        .get<TournamentRankingsResponseModel[]>(`${environment.apiUrl}/tournaments/${params.get('id')}/rankings`))
    );

  get competitions() {
    return this.tournamentService.tournament?.competitions;
  }
}
