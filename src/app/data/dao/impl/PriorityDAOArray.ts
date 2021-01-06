import {Observable} from 'rxjs';
import {Category, Priority} from '../../../model/interfaces';
import {PriorityDAO} from '../interface/PriorityDAO';

export class PriorityDAOArray implements PriorityDAO {
  add(priority: Priority): Observable<Category> | undefined {
    return undefined;
  }

  delete(id: number): Observable<Category> | undefined {
    return undefined;
  }

  get(id: number): Observable<Category> | undefined {
    return undefined;
  }

  getAll(): Observable<Category[]> | undefined {
    return undefined;
  }

  update(priority: Priority): Observable<Priority> {
    return undefined;
  }

}
