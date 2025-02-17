import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  styles: [`
    .item.no-left-padding {
      padding-left: 0;
    }
  `],
  template: `
    <div class="ui fixed inverted menu">
      <div class="ui container">
        <div class="header no-left-padding item">
          <a routerLink="/">Deluxe Ski Jump Online Tournaments Database</a>
        </div>
        <a class="item" routerLink="/tournaments" routerLinkActive="active">Tournaments</a>
        <a class="item" routerLink="/jumpers" routerLinkActive="active">Jumpers</a>
        <a class="item" routerLink="/cups" routerLinkActive="active">Cups &amp; Tours</a>
        <a class="item" routerLink="/results" routerLinkActive="active">Results</a>
        <a class="item" routerLink="/upload" routerLinkActive="active">Upload</a>
        <div class="right menu">
          <a class="item" routerLink="/about" routerLinkActive="active">About</a>
        </div>
      </div>
    </div>
  `
})
export class HeaderComponent {
}
