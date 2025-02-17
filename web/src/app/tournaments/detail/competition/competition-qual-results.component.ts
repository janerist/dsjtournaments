import {Component, inject} from '@angular/core';
import {QualificationResultResponseModel} from '../../../shared/api-responses';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {switchMap} from 'rxjs/operators';
import {QualificationResultsTableComponent} from '../../shared/qualification-results-table.component';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-competition-qual-results',
  imports: [
    QualificationResultsTableComponent,
    AsyncPipe
  ],
  template: `
    @if ($qualResults | async; as qualResults) {
      <app-qualification-results-table [results]="qualResults"></app-qualification-results-table>
    }
  `
})
export class CompetitionQualResultsComponent {
  private route = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);
  $qualResults = this.route.parent!.paramMap
    .pipe(
      switchMap(params =>
        this.httpClient.get<QualificationResultResponseModel[]>(`${environment.apiUrl}/competitions/${params.get('cid')}/qual`)
      )
    );
}
