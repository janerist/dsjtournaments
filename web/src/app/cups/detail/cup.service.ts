import {Injectable} from '@angular/core';
import {CupResponseModel} from '../../shared/api-responses';

@Injectable()
export class CupService {
  cup?: CupResponseModel;
}
