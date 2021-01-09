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
    if (task.id == null || task.id === 0) {
      task.id = this.getLastIdTask();
    }
    TestData.tasks.push(task);
    return of(task);
  }

  delete(id: number): Observable<Task | undefined> {
    const taskTmp = TestData.tasks.find(t => t.id === id);
    TestData.tasks.splice(TestData.tasks.indexOf(taskTmp as Task), 1);
    return of(taskTmp);
  }

  getTotalCount(): Observable<number> {
    const args = TestData.tasks.length;
    return of(args);
  }

  getTotalCountInCategory(category: Category | undefined): Observable<number> {
    const args = this.searchTasks(category, '', undefined, undefined).length;
    return of(args);
  }

  getCompletedCountInCategory(category: Category | undefined): Observable<number> {
    const args = this.searchTasks(category, '', true, undefined).length;
    return of(args);
  }

  getUncompletedCountInCategory(category: Category | undefined): Observable<number> {
    const args = this.searchTasks(category, '', false, undefined).length;
    return of(args);
  }

  search(category: Category | undefined, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {
    return of(this.searchTasks(category, searchText, status, priority));
  }

  update(task: Task): Observable<Task> {
    const taskTmp = TestData.tasks.find(t => t.id === task.id);
    TestData.tasks.splice(TestData.tasks.indexOf(taskTmp as Task), 1, task);
    return of(task);
  }

  private searchTasks(category: Category | undefined, searchText: string,
                      status: boolean | undefined, priority: Priority | undefined): Task[] {
    let allTasks = TestData.tasks;

    if (status != null || status !== undefined) {
      allTasks = allTasks.filter(task => task.completed === status);
    }

    if (category != null || category !== undefined) {
      allTasks = allTasks.filter(task => task.category === category);
    }

    if (priority != null || priority !== undefined) {
      allTasks = allTasks.filter(task => task.priority === priority);
    }
    if (searchText != null || searchText !== '') {
      allTasks = allTasks.filter(task => task.title.toUpperCase().includes(searchText.toUpperCase()));
    }
    return allTasks;
  }

  private getLastIdTask = (): number => Math.max.apply(Math, TestData.tasks.map(task => task.id)) + 1;
}
