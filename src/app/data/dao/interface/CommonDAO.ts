import {Observable} from 'rxjs';
import {Category} from '../../../model/interfaces';

export interface CommonDAO<T> {
  getAll(): Observable<Category[]>;

  get(id: number): Observable<T | undefined>;

  update(object: T): Observable<T>;

  delete(id: number): Observable<T>;

  add(object: T): Observable<T>;

}
