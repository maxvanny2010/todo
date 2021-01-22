import {Observable} from 'rxjs';
import {Inject, Injectable, InjectionToken} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Task} from '../../../model/Task';
import {TaskDAO} from '../interface/TaskDAO';
import {TaskSearchValues} from '../search/SearchObjects';
import {CommonService} from './CommonService';

export const TASK_URL_TOKEN = new InjectionToken<string>('url');

@Injectable({
  providedIn: 'root'
})
export class TaskService extends CommonService<Task> implements TaskDAO {


  constructor(@Inject(TASK_URL_TOKEN) private baseUrl: string,
              public http: HttpClient) {
    super(baseUrl, http);
  }

  findTasks(taskSearchValues: TaskSearchValues): Observable<Task[]> {
    return this.http.post<Task[]>(this.baseUrl + '/search', taskSearchValues);
  }

}
