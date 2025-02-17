import {Component} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {UploadOutput, UploadInput, UploadFile, humanizeBytes, NgxUploaderModule} from 'ngx-uploader';
import {environment} from '../../environments/environment';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-uploader',
  styles: `
    .uploader {
      border: dotted 3px lightgray;
      display: flex;
      height: 300px;
    }

    .uploader label {
      cursor: pointer;
      flex: 2;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .uploader label input {
      display: none;
    }

    .uploader.is-drop-over {
      border: dotted 3px black;
    }
  `,
  imports: [
    NgxUploaderModule,
    NgClass
  ],
  template: `
    @if (!clearUploader) {
      <div [hidden]="files.length > 0"
           class="uploader"
           ngFileDrop
           (uploadOutput)="onUploadOutput($event)"
           [uploadInput]="uploadInput"
           [ngClass]="{ 'is-drop-over': dragOver }">

        <label>
          <h1 class="ui icon header">
            <i class="cloud upload alternate icon"></i>
            <div class="content">
              Click or drop files here to upload
            </div>
          </h1>
          <input type="file"
                 ngFileSelect
                 (uploadOutput)="onUploadOutput($event)"
                 [uploadInput]="uploadInput"
                 multiple>
        </label>
      </div>
    }

    @if (files.length) {
      <div>
        <div class="ui active label">
          @if (completedCount === files.length) {
            <i class="check icon"></i>
          }
          @if (completedCount < files.length) {
            <i class="notched circle loading icon"></i>
          }
          Completed
          <div class="detail">
            {{ completedCount }} / {{ files.length }}
          </div>
        </div>

        <div class="ui green label">
          Success
          <div class="detail">
            {{ successCount }}
          </div>
        </div>

        <div class="ui yellow label">
          Skipped
          <div class="detail">
            {{ skippedCount }}
          </div>
        </div>

        <div class="ui red label">
          Failed
          <div class="detail">
            {{ failedCount }}
          </div>
        </div>

        @if (completedCount === files.length) {
          <button class="ui right floated secondary mini basic button"
                  (click)="reset()">
            Upload more files
          </button>
        }
      </div>

      <table class="ui table">
        @for (file of files; track file.id) {
          <tr [class.positive]="isSuccess(file)"
              [class.error]="isError(file)"
              [class.disabled]="isInvalid(file)">
            <td>
              <strong>{{ file.name }}</strong><br/>
              {{ file.response?.message || file.response?.data?.message }}
              @if (!file.response) {
                <i class="notched circle loading icon"></i>
              }

            </td>
            <td>{{ humanizeBytes(file.size) }}</td>
          </tr>
        }
      </table>
    }
  `
})
export class UploaderComponent {
  clearUploader = false;
  uploadInput = new EventEmitter<UploadInput>();
  dragOver = false;
  files: UploadFile[] = [];

  humanizeBytes = humanizeBytes;

  private invalidMessages = [
    /too big/,
    /allowed/,
    /already exist/,
    /unknown/,
    /not supported/,
    /Rejected/
  ];

  onUploadOutput(output: UploadOutput) {
    this.dragOver = output.type === 'dragOver';

    switch (output.type) {
      case 'allAddedToQueue':
        this.startUpload();
        break;
      case 'addedToQueue':
        if (output.file) {
          this.files.push(output.file);
        }
        break;
    }
  }

  reset() {
    this.files = [];
    this.clearUploader = true;
    setTimeout(() => {
      this.clearUploader = false;
      this.uploadInput = new EventEmitter<UploadInput>();
    }, 0);
  }

  isInvalid = (file: UploadFile) => file.response && this.invalidMessages.some(m => m.test(file.response.message));
  isSuccess = (file: UploadFile) => file.response && file.responseStatus === 200;
  isError = (file: UploadFile) => file.response && !this.isInvalid(file) && !this.isSuccess(file);

  get completedCount(): number {
    return this.files.filter(f => f.response).length;
  }

  get successCount(): number {
    return this.files.filter(this.isSuccess).length;
  }

  get failedCount(): number {
    return this.files.filter(this.isError).length;
  }

  get skippedCount(): number {
    return this.files.filter(this.isInvalid).length;
  }

  private startUpload() {
    this.uploadInput.emit({
      type: 'uploadAll',
      url: `${environment.apiUrl}/upload`,
      method: 'POST'
    });
  }
}
