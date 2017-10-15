import {Component, OnInit} from '@angular/core';
import {QualificationResultResponseModel} from '../../../shared/api-responses';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-competition-qual-results',
  template: `
    <app-qualification-results-table
      *ngIf="$qualResults | async, let qualResults"
      [results]="qualResults">      
    </app-qualification-results-table>
  `
})
export class CompetitionQualResultsComponent implements OnInit {
  $qualResults: Observable<QualificationResultResponseModel[]>;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {
  }

  ngOnInit() {
    this.$qualResults = this.route.parent.params.switchMap(params =>
      this.httpClient.get<QualificationResultResponseModel[]>(`${environment.apiUrl}/competitions/${params['cid']}/qual`)
    );
  }
}
