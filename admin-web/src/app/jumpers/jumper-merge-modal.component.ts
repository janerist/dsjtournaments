import {Component, Input, ElementRef, OnInit, EventEmitter, Output} from '@angular/core';
import {JumperResponseModel, JumperMergeRequestModel} from './jumper-models';

@Component({
  selector: 'dsjt-jumper-merge-modal',
  templateUrl: './jumper-merge-modal.component.html'
})
export class JumperMergeModalComponent implements OnInit {
  _show = false;

  get show() {
    return this._show;
  }
  @Input('show')
  set show(value) {
    this._show = value;
    if (this.modalEl) {
      if (value) {
        this.modalEl.modal('show');
      } else {
        this.modalEl.modal('hide');
        this.destinationJumper = null;
        this.isMerging = false;
      }
    }
  }

  @Input() sourceJumpers: JumperResponseModel[];
  @Input() destinationJumper: JumperResponseModel;

  @Output() modalClosed = new EventEmitter<boolean>();
  @Output() mergeConfirmed = new EventEmitter<JumperMergeRequestModel>();

  modalEl: JQuery;

  isMerging = false;

  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    this.modalEl = $('.modal', this.el.nativeElement);
    this.modalEl.modal({
      show: this._show,
      backdrop: 'static',
      keyboard: true
    });
  }

  onMergeClicked() {
    const message = `Are you ABSOLUTELY sure you want to merge 
the results of ${this.sourceJumpers.map(j => j.name).join(', ')}
into ${this.destinationJumper.name}? This operation cannot be undone.`;

    if (confirm(message)) {
      this.isMerging = true;
      this.mergeConfirmed.emit({
        destinationJumperId: this.destinationJumper.id,
        sourceJumperIds: this.sourceJumpers.map(j => j.id)
      });
    }
  }
}
