import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CupService} from './cup.service';
import {CupResponseModel, CupRequestModel} from './cup-models';
import {TournamentService} from '../tournaments/tournament.service';
import {TournamentTypeWithCountResponseModel} from '../tournaments/tournament-models';
import {ToastService} from '../common/services/toast.service';
import {CupFormComponent} from './cup-form.component';

@Component({
  imports: [
    CupFormComponent
  ],
  template: `
    @if (cup) {
      <div>
        <h3>
          {{ cup.name }}
          <span class="float-sm-end">
            <button type="button" class="btn btn-outline-danger" (click)="deleteCup()">Delete</button>
          </span>
        </h3>
        <dsjt-cup-form
          [cup]="cup"
          [types]="types"
          (save)="onSave($event)">
        </dsjt-cup-form>
      </div>
    }
  `
})
export class CupEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cupService = inject(CupService);
  private tournamentService = inject(TournamentService);
  private toastService = inject(ToastService);

  cup: CupResponseModel;
  types: TournamentTypeWithCountResponseModel[];

  ngOnInit() {
    this.loadTypes();

    this.route.paramMap.subscribe(params => {
      this.loadCup(+params.get('id'));
    });
  }

  onSave(cup: CupRequestModel) {
    this.cupService
      .updateCup(this.cup.id, cup)
      .subscribe(() => {
        this.toastService.success('Cup saved');
        const id = this.cup.id;
        this.cup = null;
        this.loadCup(id);
      });
  }

  deleteCup() {
    if (confirm('Really delete this cup?')) {
      this.cupService
        .deleteCup(this.cup.id)
        .subscribe(() => {
          this.toastService.success('Cup deleted');
          void this.router.navigate(['../']);
        });
    }
  }

  private loadCup(id: number) {
    this.cupService
      .getCup(id)
      .subscribe(cup => {
        this.cup = cup;
      });
  }

  private loadTypes() {
    this.tournamentService
      .getTournamentTypes()
      .subscribe(types => this.types = types);
  }
}
