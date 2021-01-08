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

  search(category: Category | undefined, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {
    return of(this.searchTasks(category, searchText, status, priority));
  }

  update(task: Task): Observable<Task> {
    const taskTmp = TestData.tasks.find(t => t.id = task.id);
    TestData.tasks.splice(TestData.tasks.indexOf(taskTmp as Task), 1, task);
    return of(task);
  }

  private searchTasks(category: Category | undefined, searchText: string, status: boolean, priority: Priority): Task[] {
    let allTasks = TestData.tasks;
    if (status != null) {
      allTasks = allTasks.filter(task => task.completed === status);
    }
    if (category != null || category !== undefined) {
      allTasks = allTasks.filter(task => task.category === category);
    }
    if (priority != null) {
      allTasks = allTasks.filter(task => task.priority === priority);
    }
    if (searchText != null || searchText !== '') {
      allTasks = allTasks.filter(task => task.title.toUpperCase().includes(searchText.toUpperCase()));
    }
    return allTasks;
  }
}
