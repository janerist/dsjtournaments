import {Component, OnInit} from '@angular/core';
import {FinalResultResponseModel} from '../../../shared/api-responses';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-competition-final-results',
  template: `
    <app-final-results-table
      *ngIf="$finalResults | async, let finalResults"
      [results]="finalResults">
    </app-final-results-table>
  `
})
export class CompetitionFinalResultsComponent implements OnInit {
  $finalResults: Observable<FinalResultResponseModel[]>;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.$finalResults = this.route.parent.params.switchMap(params =>
      this.httpClient.get<FinalResultResponseModel[]>(`${environment.apiUrl}/competitions/${params['cid']}/final`)
    );
  }
}
