import {Injectable} from '@angular/core';
import {TestData} from '../data/TestData';
import {Category, Task} from '../model/interfaces';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {
  taskSubject = new BehaviorSubject<Task[]>(TestData.tasks);
  categorySubject = new BehaviorSubject<Category[]>(TestData.categories);

  constructor() {
  }

/*  getCategories(): Category[] {
    return TestData.categories;
  }*/

  fillTasks(): void {
    this.taskSubject.next(TestData.tasks);
  }

  fillTasksBy(category: Category): void {
    const tasks = TestData.tasks.filter(t => t.category === category);
    this.taskSubject.next(tasks);
  }
}
