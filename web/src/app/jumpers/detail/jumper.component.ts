import {Component, input} from '@angular/core';
import {JumperResponseModel} from '../../shared/api-responses';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {httpResource} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {FlagDirective} from '../../shared/directives/flag.directive';
import {GravatarDirective} from '../../shared/directives/gravatar.directive';

@Component({
  selector: 'app-jumper',
  imports: [
    RouterOutlet,
    RouterLink,
    FlagDirective,
    RouterLinkActive,
    GravatarDirective
  ],
  template: `
    @if (jumperResource.value(); as jumper) {
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
  id = input<number>();
  jumperResource = httpResource<JumperResponseModel>(() => `${environment.apiUrl}/jumpers/${this.id()}`)
}
