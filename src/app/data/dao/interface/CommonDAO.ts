import {Observable} from 'rxjs';
import {Category} from '../../../model/interfaces';

export interface CommonDAO<T> {
  getAll(): Observable<Category[]> | undefined;

  get(id: number): Observable<Category> | undefined;

  update(object: T): Observable<T>;

  delete(id: number): Observable<Category> | undefined;

  add(object: T): Observable<Category> | undefined;

}
