import {Injectable} from '@angular/core';
import {Category, Priority, Task} from '../model/interfaces';
import {Observable} from 'rxjs';
import {TaskDAOArray} from '../data/dao/impl/TaskDAOArray';
import {CategoryDAOArray} from '../data/dao/impl/CategoryDAOArray';
import {PriorityDAOArray} from '../data/dao/impl/PriorityDAOArray';

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {
  private taskDaoArray = new TaskDAOArray();
  private categoryDaoArray = new CategoryDAOArray();
  private priorityDaoArray = new PriorityDAOArray();

  constructor() {
  }

  getAllTasks(): Observable<Task[]> {
    return this.taskDaoArray.getAll();
  }

  getAllCategories(): Observable<Category[]> {
    return this.categoryDaoArray.getAll();
  }

  getAllPriorities(): Observable<Priority[]> {
    return this.priorityDaoArray.getAll();
  }

  updateTask(task: Task): Observable<Task> {
    return this.taskDaoArray.update(task);
  }

  searchTasks(category: Category | undefined, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {
    return this.taskDaoArray.search(category, searchText, status, priority);
  }

  deleteTask(id: number): Observable<Task | undefined> {
    return this.taskDaoArray.delete(id);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.categoryDaoArray.update(category);
  }

  deleteCategory(category: Category): Observable<Category> {
    return this.categoryDaoArray.delete(category.id);
  }

  addTask(task: Task): Observable<Task> {
    return this.taskDaoArray.add(task);
  }

  addCategory(title: string): Observable<Category> {
    return this.categoryDaoArray.add({id: 0, title});
  }

  searchCategories(title: string): Observable<Category[]> {
    return this.categoryDaoArray.search(title);
  }

  getCompletedCountInCategory(category: Category | undefined): Observable<number> {
    return this.taskDaoArray.getCompletedCountInCategory(category);
  }

  getUnCompletedTotalCount(): Observable<number> {
    return this.taskDaoArray.getUncompletedCountInCategory(undefined);
  }

  getUnCompletedCountInCategory(category: Category | undefined): Observable<number> {
    return this.taskDaoArray.getUncompletedCountInCategory(category);
  }

  getTotalCountInCategory(category: Category | undefined): Observable<number> {
    return this.taskDaoArray.getTotalCountInCategory(category);
  }
}
