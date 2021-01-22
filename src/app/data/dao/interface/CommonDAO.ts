import {Observable} from 'rxjs';

export interface CommonDAO<T> {
  findAll(): Observable<T[]>;

  findById(id: number): Observable<T>;

  update(object: T): Observable<T>;

  delete(id: number): Observable<T>;

  add(object: T): Observable<T>;

}
