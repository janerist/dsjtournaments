import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CupResponseModel} from '../../shared/api-responses';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {CupService} from './cup.service';
import {switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-cup',
  template: `
    <div *ngIf="cup$ | async, let cup" class="ui two column stackable grid">
      <div class="twelve wide column">
        <app-cup-header [cup]="cup"></app-cup-header>
        <div style="margin-top: 1rem;">
          <div class="ui secondary pointing menu">
            <a routerLink="standings" routerLinkActive="active" class="item">Standings</a>
            <a routerLink="text" routerLinkActive="active" class="item">Standings (text only)</a>
            <a routerLink="rankings" routerLinkActive="active" class="item">Per-tournament rankings</a>
          </div>
          <router-outlet></router-outlet>
        </div>
      </div>
      <div class="four wide column">
        <div class="ui segment">
          <app-cup-schedule [dates]="cup.dates"></app-cup-schedule>
        </div>
      </div>
    </div>
  `,
  providers: [CupService]
})
export class CupComponent implements OnInit {
  cup$: Observable<CupResponseModel>;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private cupService: CupService
  ) {
  }

  ngOnInit() {
    this.cup$ = this.route.params
      .pipe(
        switchMap(params => this.httpClient.get<CupResponseModel>(`${environment.apiUrl}/cups/${params['id']}`)),
        tap(cup => this.cupService.cup = cup)
      );
  }
}
