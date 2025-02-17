import {Component, inject} from '@angular/core';
import {FinalResultResponseModel} from '../../../shared/api-responses';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {switchMap} from 'rxjs/operators';
import {FinalResultsTableComponent} from '../../shared/final-results-table.component';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-competition-final-results',
  imports: [
    FinalResultsTableComponent,
    AsyncPipe
  ],
  template: `
    @if ($finalResults | async; as finalResults) {
      <app-final-results-table [results]="finalResults"></app-final-results-table>
    }
  `
})
export class CompetitionFinalResultsComponent {
  private route = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);

  $finalResults = this.route.parent!.paramMap
    .pipe(
      switchMap(params => this.httpClient
        .get<FinalResultResponseModel[]>(`${environment.apiUrl}/competitions/${params.get('cid')}/final`))
    );
}
