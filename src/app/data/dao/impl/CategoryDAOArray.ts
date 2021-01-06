import {CategoryDAO} from '../interface/CategoryDAO';
import {Category} from '../../../model/interfaces';
import {Observable} from 'rxjs';

export class CategoryDAOArray implements CategoryDAO {

  add(category: Category): Observable<Category> {
    return undefined;
  }

  delete(id: number): Observable<Category> {
    return undefined;
  }

  get(id: number): Observable<Category> {
    return undefined;
  }

  getAll(): Observable<Category[]> {
    return undefined;
  }

  search(title: string): Observable<Category[]> {
    return undefined;
  }

  update(T): Observable<Category> {
    return undefined;
  }

}
