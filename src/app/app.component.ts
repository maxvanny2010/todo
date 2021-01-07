import {Component, OnInit} from '@angular/core';
import {Category, Priority, Task} from './model/interfaces';
import {DataHandlerService} from './services/data-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'todo';
  tasks: Task[] = [];
  categories: Category[] = [];
  selectedCategoryInApp: Category | undefined;

  constructor(private dataHandler: DataHandlerService) {
  }

  ngOnInit(): void {
    this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);
    this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
  }

  onSelectCategory(category: Category | undefined): void {
    this.selectedCategoryInApp = category;
    this.dataHandler.searchTasks(
      this.selectedCategoryInApp, '', false, {} as Priority)
      .subscribe((tasks) => this.tasks = tasks);
  }

  onUpdateTask(task: Task): void {
    this.dataHandler.updateTask(task).subscribe(() => {
      this.dataHandler.searchTasks(
        this.selectedCategoryInApp as Category, '',
        false, {} as Priority).subscribe(tasks => this.tasks = tasks);
    });
  }

  onDeleteTask(task: Task): void {
    this.dataHandler.deleteTask(task.id).subscribe(() => {
      this.dataHandler.searchTasks(
        this.selectedCategoryInApp as Category, '',
        false, {} as Priority).subscribe(tasks => this.tasks = tasks);
    });
  }

  onUpdateCategory(category: Category): void {
    this.dataHandler.updateCategory(category)
      .subscribe(() => {
        this.onSelectCategory(this.selectedCategoryInApp);
      });
  }

  onDeleteCategory(category: Category): void {
    this.dataHandler.deleteCategory(category)
      .subscribe(() => {
        this.selectedCategoryInApp = undefined;
        this.onSelectCategory(this.selectedCategoryInApp);
      });
  }
}
