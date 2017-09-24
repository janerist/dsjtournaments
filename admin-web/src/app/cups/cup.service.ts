import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {CupResponseModel, CupRequestModel} from './cup-models';
import {ApiBaseService} from '../common/services/api-base.service';
import {Http} from '@angular/http';
import {PagedResponse} from '../common/models';

@Injectable()
export class CupService extends ApiBaseService {

  constructor(http: Http) {
    super(http);
  }

  getCups(): Observable<PagedResponse<CupResponseModel>> {
    return this.http
      .get(`${environment.apiUrl}/cups?pageSize=1000`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getCup(id: number): Observable<CupResponseModel> {
    return this.http
      .get(`${environment.apiUrl}/cups/${id}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  createCup(cup: CupRequestModel): Observable<CupResponseModel> {
    return this.http
      .post(`${environment.apiUrl}/cups`, cup)
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateCup(id: number, cup: CupRequestModel): Observable<CupResponseModel> {
    return this.http
      .put(`${environment.apiUrl}/cups/${id}`, cup)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteCup(id: number): Observable<any> {
    return this.http
      .delete(`${environment.apiUrl}/cups/${id}`)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
