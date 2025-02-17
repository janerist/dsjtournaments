import {Component, inject} from '@angular/core';
import {FinalStandingResponseModel} from '../../../shared/api-responses';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {switchMap} from 'rxjs/operators';
import {FinalStandingsTableComponent} from '../../shared/final-standings-table.component';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-final-standings',
  imports: [
    FinalStandingsTableComponent,
    AsyncPipe
  ],
  template: `
    @if ($finalStandings | async; as results) {
      <app-final-standings-table [results]="results"></app-final-standings-table>
    }
  `
})
export class FinalStandingsComponent {
  private route = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);

  $finalStandings = this.route.parent!.paramMap
    .pipe(
      switchMap(params => this.httpClient
        .get<FinalStandingResponseModel[]>(`${environment.apiUrl}/tournaments/${params.get('id')}/finalstandings`))
    );
}
