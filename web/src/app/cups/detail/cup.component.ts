import {Component, inject, input} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {CupService} from './cup.service';
import {CupHeaderComponent} from './cup-header.component';
import {CupScheduleComponent} from './cup-schedule.component';

@Component({
  selector: 'app-cup',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CupHeaderComponent,
    CupScheduleComponent
  ],
  providers: [CupService],
  template: `
    @if (cupService.cup(); as cup) {
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
  id = input.required<number>();
  cupService = inject(CupService);

  constructor() {
    this.cupService.init(this.id);
  }
}
