import {Injectable} from '@angular/core';
import {TestData} from '../data/TestData';
import {Category, Task} from '../model/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {

  constructor() {
  }

  getCategories(): Category[] {
    return TestData.categories;
  }

  getTasks(): Task[] {
    return TestData.tasks;
  }

  getTasksBy(category: Category): Task[] {
    return TestData.tasks.filter(t => t.category === category);
  }
}
