import {TaskDAO} from '../interface/TaskDAO';
import {Observable} from 'rxjs';
import {Category, Priority, Task} from 'src/app/model/interfaces';

export class TaskDAOArray implements TaskDAO {
  add(task: Task): Observable<Category> | undefined {
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

  getCompletedCountInCategory(category: Category): Observable<number> {
    return undefined;
  }

  getTotalCount(): Observable<number> {
    return undefined;
  }

  getTotalCountInCategory(category: Category): Observable<number> {
    return undefined;
  }

  getUncompletedCountInCategory(category: Category): Observable<number> {
    return undefined;
  }

  search(category: Category, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {
    return undefined;
  }

  update(task: Task): Observable<Task> {
    return undefined;
  }

}
