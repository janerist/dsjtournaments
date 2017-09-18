import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-competition',
  template: `
    <div class="ui secondary pointing menu">
      <div class="item" [class.active]="resultType === 'final'">
        <a routerLink="../final">Competition Final Results</a>
      </div>
      <div class="item" [class.active]="resultType === 'qual'">
        <a routerLink="../qual">Qualification results</a>
      </div>
    </div>
    <div *ngIf="results | async, let r">
      <app-final-results-table 
        *ngIf="resultType === 'final' && !isLoading"
        [results]="r">        
      </app-final-results-table>
      <app-qualification-results-table
        *ngIf="resultType === 'qual' && !isLoading"
        [results]="r">
      </app-qualification-results-table>

      <div class="ui centered inline loader" [class.active]="isLoading"></div>
    </div>    
  `
})
export class CompetitionComponent implements OnInit {
  resultType: string;
  results: Observable<Object[]>;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {

  }

  ngOnInit() {
    this.results = this.route.params.switchMap(params => {
      const id = this.route.parent.snapshot.params['id'];
      const cid = params['cid'];
      this.resultType = params['results'];
      this.isLoading = true;

      return this.httpClient
        .get(`${environment.apiUrl}/tournaments/${id}/competitions/${cid}/${this.resultType}`)
    })
    .do(() => this.isLoading = false);
  }
}
