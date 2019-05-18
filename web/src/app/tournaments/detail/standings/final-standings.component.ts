import {Component, OnInit} from '@angular/core';
import {FinalStandingResponseModel} from '../../../shared/api-responses';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-final-standings',
  template: `
    <app-final-standings-table
      *ngIf="$finalStandings | async, let results"
      [results]="results">
    </app-final-standings-table>
  `
})
export class FinalStandingsComponent implements OnInit {
  $finalStandings: Observable<FinalStandingResponseModel[]>;

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.$finalStandings = this.route.parent.paramMap
      .pipe(
        switchMap(params => this.httpClient
          .get<FinalStandingResponseModel[]>(`${environment.apiUrl}/tournaments/${params.get('id')}/finalstandings`))
      );
  }
}
