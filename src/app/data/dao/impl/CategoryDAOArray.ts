import {CategoryDAO} from '../interface/CategoryDAO';
import {Category} from '../../../model/interfaces';
import {Observable, of} from 'rxjs';
import {TestData} from '../../TestData';

export class CategoryDAOArray implements CategoryDAO {

  add(category: Category): Observable<Category> {
    return of(category);
  }

  delete(id: number): Observable<Category> {
    return of({} as Category);
  }

  get(id: number): Observable<Category> {
    return of({} as Category);
  }

  getAll(): Observable<Category[]> {
    return of(TestData.categories);
  }

  search(title: string): Observable<Category[]> {
    return of([]);
  }

  update(category: Category): Observable<Category> {
    return of({} as Category);
  }

}
