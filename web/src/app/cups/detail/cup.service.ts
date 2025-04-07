import {Injectable, signal, Signal} from '@angular/core';
import {CupResponseModel} from '../../shared/api-responses';
import {httpResource, HttpResourceRef} from '@angular/common/http';

@Injectable()
export class CupService {
  private resource: HttpResourceRef<CupResponseModel | undefined> | undefined;
  cup = signal<CupResponseModel | undefined>(undefined);

  init(id: Signal<number>) {
    this.resource = httpResource<CupResponseModel>(() => `/cups/${id()}`);
    this.cup = this.resource.value;
  }
}
