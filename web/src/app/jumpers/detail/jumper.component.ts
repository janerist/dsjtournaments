import {Component, OnInit} from '@angular/core';
import {JumperResponseModel} from '../../shared/api-responses';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-jumper',
  template: `
    <ng-container *ngIf="jumper$ | async, let jumper">
      <h2 class="ui header">
        <i class="circular user icon"></i>
        <div class="content">
          {{jumper.name}}
          <div class="sub header">
            <i [appFlag]="jumper.nation"></i>{{jumper.nation}}
            | Hill records:
            <a class="item" href="http://www.mediamond.fi/dsj4/personalhillrecords/?name={{jumper.name}}&version=1.0.0">DSJ4</a>
            <a class="item" href="http://www.mediamond.fi/dsj3/personalhillrecords/?name={{jumper.name}}&version=1.6">DSJ3</a>
          </div>
        </div>
      </h2>

      <div class="ui secondary pointing menu">
        <a class="item" routerLink="activity" routerLinkActive="active">Activity</a>
        <a class="item" routerLink="stats" routerLinkActive="active">Stats</a>        
      </div>
      <router-outlet></router-outlet>
    </ng-container>
  `
})
export class JumperComponent implements OnInit {
  jumper$: Observable<JumperResponseModel>;

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.jumper$ = this.route.params.switchMap(params => {
      return this.httpClient.get<JumperResponseModel>(`${environment.apiUrl}/jumpers/${params['id']}`);
    });
  }
}
