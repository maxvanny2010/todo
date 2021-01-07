import {TaskDAO} from '../interface/TaskDAO';
import {Observable, of} from 'rxjs';
import {Category, Priority, Task} from 'src/app/model/interfaces';
import {TestData} from '../../TestData';

export class TaskDAOArray implements TaskDAO {
  getAll(): Observable<Task[]> {
    return of(TestData.tasks);
  }

  get(id: number): Observable<Task | undefined> {
    return of(TestData.tasks.find(t => t.id === id));
  }

  add(task: Task): Observable<Task> {
    return of(task);
  }

  delete(id: number): Observable<Task | undefined> {
    const taskTmp = TestData.tasks.find(t => t.id === id);
    TestData.tasks.splice(TestData.tasks.indexOf(taskTmp as Task), 1);
    return of(taskTmp);
  }

  getCompletedCountInCategory(category: Category): Observable<number> {
    return of(0);
  }

  getTotalCount(): Observable<number> {
    return of(0);
  }

  getTotalCountInCategory(category: Category): Observable<number> {
    return of(0);
  }

  getUncompletedCountInCategory(category: Category): Observable<number> {
    return of(0);
  }

  search(category: Category, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {
    return of(this.searchTodos(category, searchText, status, priority));
  }

  update(task: Task): Observable<Task> {
    const taskTmp = TestData.tasks.find(t => t.id = task.id);
    TestData.tasks.splice(TestData.tasks.indexOf(taskTmp as Task), 1, task);
    return of(task);
  }

  private searchTodos(category: Category, searchText: string, status: boolean, priority: Priority): Task[] {
    let allTasks = TestData.tasks;
    if (category != null) {
      allTasks = allTasks.filter(todo => todo.category === category);
    }
    return allTasks;

  }
}
