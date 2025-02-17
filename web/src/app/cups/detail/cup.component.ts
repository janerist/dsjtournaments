import {Component, inject} from '@angular/core';
import {CupResponseModel} from '../../shared/api-responses';
import {ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {CupService} from './cup.service';
import {switchMap, tap} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {CupHeaderComponent} from './cup-header.component';
import {CupScheduleComponent} from './cup-schedule.component';

@Component({
  selector: 'app-cup',
  imports: [
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CupHeaderComponent,
    CupScheduleComponent
  ],
  providers: [CupService],
  template: `
    @if (cup$ | async; as cup) {
      <div class="ui two column stackable grid">
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
    }
  `
})
export class CupComponent {
  private route = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);
  private cupService = inject(CupService);

  cup$ = this.route.paramMap.pipe(
      switchMap(params => this.httpClient.get<CupResponseModel>(`${environment.apiUrl}/cups/${params.get('id')}`)),
      tap(cup => this.cupService.cup = cup)
    );
}
