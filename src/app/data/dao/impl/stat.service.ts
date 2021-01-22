import {Observable} from 'rxjs';
import {Inject, Injectable, InjectionToken} from '@angular/core';
import {Stat} from '../../../model/Stat';
import {StatDAO} from '../interface/StatDAO';
import {HttpClient} from '@angular/common/http';
import {CommonService} from './CommonService';

export const STAT_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class StatService extends CommonService<Stat> implements StatDAO {

  constructor(@Inject(STAT_URL_TOKEN) private baseURl: string,
              public http: HttpClient) {
    super(baseURl, http);
  }

  getOverallStat(): Observable<Stat> {
    return this.http.get<Stat>(this.baseURl);
  }
}
