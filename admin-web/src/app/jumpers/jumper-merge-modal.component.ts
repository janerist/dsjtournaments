import {Component, Input, ElementRef, OnInit, EventEmitter, Output, inject} from '@angular/core';
import {JumperResponseModel, JumperMergeRequestModel} from './jumper-models';
import {JumperDetailsComponent} from './jumper-details.component';
import {JumperSearchboxComponent} from './jumper-searchbox.component';

@Component({
  selector: 'dsjt-jumper-merge-modal',
  imports: [
    JumperDetailsComponent,
    JumperSearchboxComponent
  ],
  template: `
    <div class="modal modal-lg fade" tabindex="-1" #modal>
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fa fa-compress"></i>
              Merge jumpers
            </h5>
            <button type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Cancel"
                    (click)="modalClosed.emit(true)">
            </button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-12">
                  <p>
                    Select source and destination jumpers. You can select many source jumpers, but only
                    one destination jumper. When you click 'Merge' the results from all source jumpers
                    will be merged into the destination jumper and the source jumpers will be
                    <span style="color: red;">DELETED</span>.
                  </p>
                </div>
              </div>

              @if (!isMerging) {
                <div class="row">
                  <div class="col-md-5">
                    <dsjt-jumper-searchbox
                      [parent]="modal"
                      [placeholder]="'Add source jumper'"
                      [ignore]="sourceJumpers.concat(destinationJumper)"
                      (selectJumper)="sourceJumpers.push($event)">
                    </dsjt-jumper-searchbox>
                  </div>

                  <div class="col-md-2"></div>

                  <div class="col-md-5 ml-auto">
                    <dsjt-jumper-searchbox
                      [parent]="modal"
                      [placeholder]="'Select destination jumper'"
                      [ignore]="sourceJumpers.concat(destinationJumper)"
                      (selectJumper)="destinationJumper = $event">
                    </dsjt-jumper-searchbox>
                  </div>
                </div>
              }

              <div class="row mt-2">
                <div class="col-md-5 align-self-center">
                  @if (!sourceJumpers.length) {
                    <p class="text-danger">
                      No source jumpers selected.
                    </p>
                  } @else {
                    @for (model of sourceJumpers; track model.id) {
                      <div class="mb-2">
                        <dsjt-jumper-details
                          [model]="model"
                          (dismissClicked)="sourceJumpers.splice(sourceJumpers.indexOf($event), 1)">
                        </dsjt-jumper-details>
                      </div>
                    }
                  }
                </div>
                <div class="col-md-2 align-self-center text-center">
                  <i class="fa fa-arrow-right"></i>
                </div>
                <div class="col-md-5 align-self-center">
                  @if (!destinationJumper) {
                    <p class="text-danger">
                      No destination jumper selected.
                    </p>
                  } @else {
                    <div class="mb-2">
                      <dsjt-jumper-details
                        [model]="destinationJumper"
                        (dismissClicked)="destinationJumper = null">
                      </dsjt-jumper-details>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            @if (isMerging) {
              <div class="text-center">
                <i class="fa fa-spin fa-spinner"></i>
                Merging...
              </div>
            } @else {
              <button type="button" class="btn btn-link" data-dismiss="modal" (click)="modalClosed.emit(true)">
                Cancel
              </button>
              <button type="button"
                      class="btn btn-primary"
                      [disabled]="!sourceJumpers.length || !destinationJumper"
                      (click)="onMergeClicked()">
                Merge!
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class JumperMergeModalComponent implements OnInit {
  private el = inject(ElementRef);

  pShow = false;

  get show() {
    return this.pShow;
  }
  @Input('show')
  set show(value) {
    this.pShow = value;
    if (this.modalEl) {
      if (value) {
        (this.modalEl as any).modal('show');
      } else {
        (this.modalEl as any).modal('hide');
        this.destinationJumper = null;
        this.isMerging = false;
      }
    }
  }

  @Input() sourceJumpers: JumperResponseModel[] = [];
  @Input() destinationJumper: JumperResponseModel;

  @Output() modalClosed = new EventEmitter<boolean>();
  @Output() mergeConfirmed = new EventEmitter<JumperMergeRequestModel>();

  modalEl: JQuery;

  isMerging = false;

  ngOnInit() {
    this.modalEl = $('.modal', this.el.nativeElement);
    (this.modalEl as any).modal({
      show: this.pShow,
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
