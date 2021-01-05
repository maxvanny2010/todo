import {Injectable} from '@angular/core';
import {TestData} from '../data/TestData';
import {Category, Task} from '../model/interfaces';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {
  taskSubject = new Subject<Task[]>();

   categorySubject = new Subject<Category[]>();

  constructor() {
  }

  getCategories(): Category[] {
     return TestData.categories;
  }

  fillTasks(): void {
    this.taskSubject.next(TestData.tasks);
  }

  fillTasksBy(category: Category): void {
    const tasks = TestData.tasks.filter(t => t.category === category);
    this.taskSubject.next(tasks);
  }
}
