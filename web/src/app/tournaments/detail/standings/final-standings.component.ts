import {Component, OnInit} from '@angular/core';
import {FinalStandingResponseModel} from '../../../shared/api-responses';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';

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
    this.$finalStandings = this.route.parent.params.switchMap(params =>
      this.httpClient.get<FinalStandingResponseModel[]>(`${environment.apiUrl}/tournaments/${params['id']}/finalstandings`));
  }
}
