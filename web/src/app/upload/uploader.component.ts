import {Component} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {UploadOutput, UploadInput, UploadFile, humanizeBytes} from 'ngx-uploader';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
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
        this.files.push(output.file);
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
  isSuccess = (file: UploadFile) => file.response && file.response.data;
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
      url: `${environment.uploadUrl}/upload`,
      method: 'POST'
    });
  }
}
