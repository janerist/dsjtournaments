import {Component, inject} from '@angular/core';
import {JumperResponseModel} from '../../shared/api-responses';
import {ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {switchMap} from 'rxjs/operators';
import {FlagDirective} from '../../shared/directives/flag.directive';
import {AsyncPipe} from '@angular/common';
import {GravatarDirective} from '../../shared/directives/gravatar.directive';

@Component({
  selector: 'app-jumper',
  imports: [
    RouterOutlet,
    RouterLink,
    FlagDirective,
    RouterLinkActive,
    AsyncPipe,
    GravatarDirective
  ],
  template: `
    @if (jumper$ | async; as jumper) {
      <h2 class="ui header">
        @if (jumper.gravatarHash) {
          <img [appGravatar]="jumper.gravatarHash" alt="gravatar">
        } @else {
          <i class="circular user icon"></i>
        }

        <div class="content">
          {{ jumper.name }}
          <div class="sub header">
            <i [appFlag]="jumper.nation"></i>{{ jumper.nation }}
            | Hill records:
            <a class="item"
               href="https://www.mediamond.fi/dsj4/personalhillrecords/?name={{jumper.name}}&version=1.0.0">DSJ4</a>&nbsp;
            <a class="item" href="https://www.mediamond.fi/dsj3/personalhillrecords/?name={{jumper.name}}&version=1.6">DSJ3</a>
          </div>
        </div>
      </h2>

      <div class="ui secondary pointing menu">
        <a class="item" routerLink="activity" routerLinkActive="active">Activity</a>
        <a class="item" routerLink="stats" routerLinkActive="active">Stats</a>
      </div>
      <router-outlet></router-outlet>
    }
  `
})
export class JumperComponent {
  private route = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);

  jumper$ = this.route.paramMap.pipe(
    switchMap(params => this.httpClient.get<JumperResponseModel>(`${environment.apiUrl}/jumpers/${params.get('id')}`))
  );
}
