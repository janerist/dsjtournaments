import {Injectable} from '@angular/core';
import {ApiBaseService} from '../common/services/api-base.service';
import {Http, URLSearchParams} from '@angular/http';
import {environment} from '../../environments/environment';
import {JumperResponseModel, JumperUpdateModel, JumperMergeRequestModel} from './jumper-models';
import {Observable} from 'rxjs/Observable';
import {PagedResponse} from '../common/models';

@Injectable()
export class JumperService extends ApiBaseService {

  constructor(http: Http) {
    super(http);
  }

  getJumpers(q: string, page: number, pageSize: number, sort?: string): Observable<PagedResponse<JumperResponseModel>> {
    const params = new URLSearchParams();
    if (q) {
      params.append('q', q);
    }
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    if (sort) {
      params.append('sort', sort);
    }

    return this.http
      .get(`${environment.apiUrl}/jumpers`, {search: params})
      .map(this.extractData)
      .catch(this.handleError);
  }

  updateJumper(id: number, model: JumperUpdateModel): Observable<JumperResponseModel> {
    return this.http
      .put(`${environment.apiUrl}/jumpers/${id}`, model)
      .map(this.extractData)
      .catch(this.handleError);
  }

  mergeJumpers(model: JumperMergeRequestModel): Observable<JumperResponseModel> {
    return this.http
      .post(`${environment.apiUrl}/jumpers/merge`, model)
      .map(this.extractData)
      .catch(this.handleError);
  }
}
