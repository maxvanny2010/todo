import {Observable, of} from 'rxjs';
import {Priority} from '../../../model/interfaces';
import {PriorityDAO} from '../interface/PriorityDAO';
import {TestData} from '../../TestData';

export class PriorityDAOArray implements PriorityDAO {
  add(priority: Priority): Observable<Priority> {
    return of(priority);
  }

  delete(id: number): Observable<Priority | undefined> {
    return of({} as Priority);
  }

  get(id: number): Observable<Priority | undefined> {
    return of({} as Priority);
  }

  getAll(): Observable<Priority[]> {
    return of(TestData.priorities);
  }

  update(priority: Priority): Observable<Priority> {
    return of(priority);
  }

}
