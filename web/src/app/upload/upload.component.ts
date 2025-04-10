import { Component } from '@angular/core';
import {UploaderComponent} from './uploader.component';

@Component({
  selector: 'app-upload',
  imports: [
    UploaderComponent
  ],
  template: `
    <div class="ui stackable two column grid">
      <div class="ten wide column">
        <p>
          Upload tournament stats exported from the game!
          You can upload the qualification results and final results from each hill, and the final standings after all
          hills.
        </p>

        <p>
          Click or drop files into the box below. The upload will start immediately.
          Consult the sidebar if you are not sure where on your computer the files are located.
        </p>

        <app-uploader></app-uploader>
      </div>

      <div class="six wide column">
        <div class="ui segment">
          <h3 class="ui header">
            Where to find the stats files on your computer:
          </h3>
          <dl>
            <dt><strong>DSJ3 version 1.6</strong></dt>
            <dd>&lt;Game Folder&gt;\\User Files\\Stats</dd>

            <dt><strong>DSJ3 version 1.7+ or DSJ4</strong></dt>
            <dd>&lt;My Documents Folder&gt;\\Deluxe Ski Jump\\Stats</dd>
          </dl>
        </div>
      </div>
    </div>
  `
})
export class UploadComponent {
}
