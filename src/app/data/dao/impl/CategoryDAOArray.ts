import {CategoryDAO} from '../interface/CategoryDAO';
import {Category} from '../../../model/interfaces';
import {Observable, of} from 'rxjs';
import {TestData} from '../../TestData';

export class CategoryDAOArray implements CategoryDAO {

  add(category: Category): Observable<Category> {
    if (category.id === null || category.id === 0) {
      category.id = this.getLastCategory();
    }
    TestData.categories.push(category);
    return of(category);
  }

  private getLastCategory = (): number => Math.max.apply(Math, TestData.categories.map(c => c.id)) + 1;

  delete(id: number): Observable<Category> {
    TestData.tasks.forEach(task => {
      if (task.category && task.category.id === id) {
        task.category = undefined;
      }
    });
    const tmpCategory = TestData.categories.find(t => t.id === id);
    TestData.categories.splice(TestData.categories.indexOf(tmpCategory as Category), 1);
    return of(tmpCategory as Category);
  }

  get(id: number): Observable<Category> {
    return of({} as Category);
  }

  getAll(): Observable<Category[]> {
    return of(TestData.categories);
  }

  search(title: string): Observable<Category[]> {
    const categories = TestData.categories.filter(
      category => category.title.toUpperCase().includes(title.toUpperCase()))
      .sort((c1, c2) => c1.title.localeCompare(c2.title));
    return of(categories);
  }

  update(category: Category): Observable<Category> {
    const tmpCategory = TestData.categories.find(c => c.id === category.id);
    TestData.categories.splice(TestData.categories.indexOf(tmpCategory as Category), 1, category);
    return of(tmpCategory as Category);
  }

}
