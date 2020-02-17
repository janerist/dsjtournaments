import {Component} from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <h4>Contact</h4>
    <p>
      For ideas, suggestions or bug reports please open an issue at the
      <i class="github icon"></i>
      <a href="https://github.com/janerist/dsjtournaments">GitHub</a>
      repository. You can also e-mail the <a [href]="'mailto:' + email">author</a> directly.
    </p>
  `
})
export class AboutComponent {
  email = 'janerist@fastmail.com';
}
