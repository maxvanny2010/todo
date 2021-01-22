import {Observable} from 'rxjs';
import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Priority} from '../../../model/Priority';
import {PriorityDAO} from '../interface/PriorityDAO';
import {PrioritySearchValues} from '../search/SearchObjects';
import {CommonService} from './CommonService';

export const PRIORITY_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class PriorityService extends CommonService<Priority> implements PriorityDAO {

  constructor(@Inject(PRIORITY_URL_TOKEN) private baseUrl: string,
              public http: HttpClient) {
    super(baseUrl, http);
  }

  findPriorities(prioritySearchValues: PrioritySearchValues): Observable<Priority[]> {
    return this.http.post<Priority[]>(this.baseUrl + '/search', prioritySearchValues);
  }
}
