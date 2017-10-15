import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {CupResponseModel, CupRequestModel} from './cup-models';
import {PagedResponse} from '../common/models';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CupService {

  constructor(private httpClient: HttpClient) {
  }

  getCups(): Observable<PagedResponse<CupResponseModel>> {
    return this.httpClient
      .get(`${environment.apiUrl}/cups?pageSize=1000`)
  }

  getCup(id: number): Observable<CupResponseModel> {
    return this.httpClient
      .get(`${environment.apiUrl}/cups/${id}`);
  }

  createCup(cup: CupRequestModel): Observable<CupResponseModel> {
    return this.httpClient
      .post(`${environment.apiUrl}/cups`, cup);
  }

  updateCup(id: number, cup: CupRequestModel): Observable<CupResponseModel> {
    return this.httpClient
      .put(`${environment.apiUrl}/cups/${id}`, cup);
  }

  deleteCup(id: number): Observable<any> {
    return this.httpClient
      .delete(`${environment.apiUrl}/cups/${id}`);
  }
}
